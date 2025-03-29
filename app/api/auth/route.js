/**
 * Consolidated API for all authentication operations.
 * This file handles user registration, login, validation, and role management.
 */

import { NextResponse } from "next/server";
import {
  getUserByEmail,
  getUserById,
  getDefaultRoleId,
  createUser,
  updateUserRole,
  getRoleIdByUserId,
  getRoleById,
} from "@/lib/services/userService";
import adminInstance from "@/lib/firebase/admin";

/**
 * GET request handler for authentication operations
 * /api/auth?action=user&id=userId - Get user data
 * /api/auth?action=role&userId=userId - Get user's role
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") || "user";

    switch (action) {
      case "user": {
        const id = searchParams.get("id");
        if (!id) {
          return NextResponse.json(
            { error: "User ID is required" },
            { status: 400 }
          );
        }
        return await getUserHandler(id);
      }
      case "role": {
        const userId = searchParams.get("userId");
        if (!userId) {
          return NextResponse.json(
            { error: "User ID is required" },
            { status: 400 }
          );
        }
        return await getRoleHandler(userId);
      }
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (err) {
    console.error("Auth API error:", err);
    return NextResponse.json(
      { error: err.message || "Authentication error" },
      { status: 500 }
    );
  }
}

/**
 * POST request handler for authentication operations
 * Action types:
 * - register: Register a new user with email/password
 * - googleAuth: Handle Google authentication
 * - validate: Validate a user token
 * - check: Check if user exists by email
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { action = "check" } = body;

    switch (action) {
      case "register":
        return await registerHandler(body);
      case "googleAuth":
        return await googleAuthHandler(body, request);
      case "validate":
        return await validateHandler(body);
      case "check":
        return await checkUserHandler(body);
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (err) {
    console.error("Auth API error:", err);
    return NextResponse.json(
      { error: err.message || "Authentication error" },
      { status: 500 }
    );
  }
}

/**
 * PUT request handler for updating user roles
 * Action types:
 * - role: Update user role
 */
export async function PUT(request) {
  try {
    const body = await request.json();
    const { action = "role" } = body;

    switch (action) {
      case "role":
        return await updateRoleHandler(body);
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (err) {
    console.error("Auth API error:", err);
    return NextResponse.json(
      { error: err.message || "Authentication error" },
      { status: 500 }
    );
  }
}

// OPTIONS request for CORS support
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

// Helper functions
async function getUserHandler(userId) {
  const user = await getUserById(userId);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Return safe user data without sensitive fields
  const { password_hash, reset_token, ...safeUserData } = user;
  return NextResponse.json(safeUserData);
}

async function getRoleHandler(userId) {
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

async function registerHandler(body) {
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
    const firebaseUser = await adminInstance.auth().createUser({
      email,
      password,
    });
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

async function googleAuthHandler(body, request) {
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

async function validateHandler(body) {
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

async function checkUserHandler(body) {
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

async function updateRoleHandler(body) {
  const { email, roleId } = body;

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  // Default to barber role if not specified
  const role = roleId || 3; // 3 is barber role

  const updatedUser = await updateUserRole(email, role);

  return NextResponse.json({
    message: "Role updated successfully",
    user: updatedUser,
  });
}
