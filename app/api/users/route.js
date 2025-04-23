/**
 * Consolidated API for all user operations.
 * This file replaces multiple separate API endpoints with a single, parameter-driven API.
 */

import { NextResponse } from "next/server";
import {
  getAllUsers,
  getUserByEmail,
  getUserById,
  updateUserRole,
  getDefaultRoleId,
  createUser,
  updateUser,
  getRoleById,
  getRoleIdByUserId,
  getBarberUsers,
} from "@/lib/services/userService";
import adminInstance from "@/lib/firebase/admin";
import { pool } from "@/lib/database";
/**
 * GET request handler with query parameters for different operations:
 * /api/users - get all users
 * /api/users?action=barbers - get all users with barber role
 * /api/users?action=byId&id=user123 - get user by ID
 * /api/users?action=byEmail&email=user@example.com - get user by email
 * /api/users?action=role&userId=user123 - get user's role
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    // Default action - get all users
    if (!action) {
      const users = await getAllUsers();
      return NextResponse.json(users);
    }

    switch (action) {
      case "barbers":
        return await getBarberUsersHandler();

      case "byId": {
        const id = searchParams.get("id");
        if (!id) {
          return NextResponse.json(
            { error: "User ID is required" },
            { status: 400 }
          );
        }
        return await getUserByIdHandler(id);
      }

      case "byEmail": {
        const email = searchParams.get("email");
        if (!email) {
          return NextResponse.json(
            { error: "Email is required" },
            { status: 400 }
          );
        }
        return await getUserByEmailHandler(email);
      }

      case "role": {
        const userId = searchParams.get("userId");
        if (!userId) {
          return NextResponse.json(
            { error: "User ID is required" },
            { status: 400 }
          );
        }
        return await getUserRoleHandler(userId);
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (err) {
    console.error("GET /api/users error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST request handler with different operations based on request body:
 * Action types:
 * - check: Check if user exists by email
 * - register: Register a new user
 * - googleRegister: Register a user with Google credentials
 * - validate: Validate a user by uid
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { action = "check" } = body;

    switch (action) {
      case "check":
        return await checkUserExistsHandler(body);

      case "register":
        return await registerUserHandler(body);

      case "googleRegister":
        return await googleRegisterHandler(body, request);

      case "validate":
        return await validateUserHandler(body);

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (err) {
    console.error("POST /api/users error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT request handler for operations that update user data:
 * - Default (no action): Update user role
 * - updateRole: Update user role
 */
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") || "updateRole";

    switch (action) {
      case "updateRole":
        return await updateUserRoleHandler(await request.json());
      case "makeBarber":
        return await handleMakeBarber(request);
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (err) {
    console.error("PUT /api/users error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// OPTIONS route for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

// Helper functions
async function getBarberUsersHandler() {
  const barbers = await getBarberUsers();
  return NextResponse.json(barbers);
}

async function getUserByIdHandler(id) {
  const user = await getUserById(id);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Return safe user data without sensitive fields
  const { password_hash, reset_token, ...safeUserData } = user;
  return NextResponse.json(safeUserData);
}

async function getUserByEmailHandler(email) {
  const user = await getUserByEmail(decodeURIComponent(email));

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Return safe user data without sensitive fields
  const { password_hash, reset_token, ...safeUserData } = user;
  return NextResponse.json(safeUserData);
}

async function getUserRoleHandler(userId) {
  const roleId = await getRoleIdByUserId(userId);
  if (!roleId) {
    return NextResponse.json({ error: "Role not found" }, { status: 404 });
  }

  const role = await getRoleById(roleId);
  if (!role) {
    return NextResponse.json(
      { error: "Role details not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ role });
}

async function checkUserExistsHandler(body) {
  const { email } = body;

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const user = await getUserByEmail(email);
    return NextResponse.json({
      exists: true,
      user_id: user.user_id,
      current_role: user.role_id,
    });
  } catch (err) {
    if (err.message.includes("not found")) {
      return NextResponse.json({ exists: false });
    }
    throw err;
  }
}

async function registerUserHandler(body) {
  const { email, password, phoneNumber } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  if (phoneNumber && !/^\d{10,15}$/.test(phoneNumber)) {
    return NextResponse.json(
      { error: "Invalid phone number" },
      { status: 400 }
    );
  }

  const existingUser = await getUserByEmail(email).catch(() => null);
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  let firebaseUID;
  try {
    const firebaseUser = await adminInstance
      .auth()
      .createUser({ email, password });
    firebaseUID = firebaseUser.uid;
  } catch (err) {
    console.error("Firebase error:", err);
    return NextResponse.json(
      { error: "Failed to create Firebase user: " + err.message },
      { status: 500 }
    );
  }

  const roleId = await getDefaultRoleId();
  const newUser = await createUser(
    firebaseUID,
    email,
    roleId,
    phoneNumber || null
  );

  return NextResponse.json(
    { message: "User created successfully", user: newUser },
    { status: 201 }
  );
}

async function googleRegisterHandler(body, request) {
  const { email, uid } = body;

  // Verify the token
  const token = request.headers.get("Authorization")?.split("Bearer ")[1];
  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  try {
    // Verify token using Firebase admin
    await adminInstance.auth().verifyIdToken(token);
  } catch (authError) {
    console.error("Token verification failed:", authError);
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }

  if (!email || !uid) {
    return NextResponse.json(
      { error: "Email and UID are required" },
      { status: 400 }
    );
  }

  // Check if user already exists
  const existingUser = await getUserByEmail(email).catch(() => null);
  if (existingUser) {
    return NextResponse.json({
      message: "User already exists",
      user: existingUser,
    });
  }

  // Create new user with default role
  const roleId = await getDefaultRoleId();
  const newUser = await createUser(uid, email, roleId);

  return NextResponse.json(
    {
      message: "User created successfully",
      user: newUser,
    },
    { status: 201 }
  );
}

async function validateUserHandler(body) {
  const { uid } = body;

  // Validate the UID
  if (!uid) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  // Check if the user exists
  const user = await getUserById(uid).catch(() => null);

  // Return the response
  return NextResponse.json({ exists: !!user });
}

async function updateUserRoleHandler(body) {
  const { email } = body;

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  // Barber role ID (make sure this matches your database)
  const barberRoleId = 3;

  const updatedUser = await updateUserRole(email, barberRoleId);

  return NextResponse.json({ user: updatedUser });
}

/**
 * PATCH request handler for updating user attributes:
 * /api/users?id=userId (with request body containing update data)
 * /api/users?id=userId&action=coins (for updating coins)
 */
export async function PATCH(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");
    const action = searchParams.get("action");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const userData = await request.json();

    if (action === "coins") {
      return await updateUserCoinsHandler(userId, userData);
    } else {
      return await updateUserProfileHandler(userId, userData);
    }
  } catch (err) {
    console.error("PATCH /api/users error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
async function handleMakeBarber(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const { name, email } = await request.json();

  // Validate inputs
  if (!userId || !name || !email) {
    return NextResponse.json(
      { error: "User ID, name and email are required" },
      { status: 400 }
    );
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Verify user exists and isn't already a barber
    const userCheck = await client.query(
      'SELECT "IsBarber" FROM users WHERE user_id = $1 FOR UPDATE',
      [userId]
    );

    if (userCheck.rows.length === 0) {
      throw new Error('User not found');
    }

    if (userCheck.rows[0].IsBarber) {
      throw new Error('User is already a barber');
    }

    // 2. Update user to barber status
    await client.query(
      'UPDATE users SET "IsBarber" = true, updated_at = NOW() WHERE user_id = $1',
      [userId]
    );

    // 3. Create barber record with NULL working hours
    const barberResult = await client.query(
      `INSERT INTO barbers (
        barber_id, name, email,
        "Monday_Start", "Monday_End",
        "Tuesday_Start", "Tuesday_End",
        "Wednesday_Start", "Wednesday_End",
        "Thursday_Start", "Thursday_End",
        "Friday_Start", "Friday_End",
        "Saturday_Start", "Saturday_End",
        "Sunday_Start", "Sunday_End"
      ) VALUES (
        $1, $2, $3,
        NULL, NULL,
        NULL, NULL,
        NULL, NULL,
        NULL, NULL,
        NULL, NULL,
        NULL, NULL,
        NULL, NULL
      ) RETURNING *`,
      [userId, name, email] // Only need these 3 parameters
    );

    await client.query('COMMIT');

    return NextResponse.json({
      success: true,
      message: "User successfully made a barber",
      user: { user_id: userId, name, email, IsBarber: true },
      barber: barberResult.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Make barber error:", error);
    
    let status = 500;
    let message = error.message;
    
    if (error.message.includes('already exists')) status = 409;
    else if (error.message.includes('not found')) status = 404;
    else if (error.message.includes('already a barber')) status = 400;

    return NextResponse.json({ error: message }, { status });
  } finally {
    client.release();
  }
}
// Helper functions (add these to your existing helpers)
async function updateUserProfileHandler(userId, userData) {
  const userFound = await getUserById(userId);

  if (!userFound) {
    return NextResponse.json(
      { error: `User with ID ${userId} not found` },
      { status: 404 }
    );
  }

  const updatedUser = await updateUser(userId, userData);
  return NextResponse.json(updatedUser);
}

async function updateUserCoinsHandler(userId, userData) {
  const { coins } = userData;

  // Validate input
  if (typeof coins !== "number" || coins < 0) {
    return NextResponse.json({ error: "Invalid coins value" }, { status: 400 });
  }

  try {
    // Get current user
    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate new coin balance and update
    const currentCoins = user.coins || 0;
    const newCoins = currentCoins - coins; // Subtract coins for spending

    const updatedUser = await updateUser(userId, { coins: newCoins });

    return NextResponse.json({ coins: newCoins });
  } catch (error) {
    console.error("Error updating coins:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
