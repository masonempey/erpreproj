// /lib/services/userService.js
import { pool } from "@/lib/database";

// Get user by ID
export const getUserById = async (userId) => {
  const client = await pool.connect();
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const query = {
      text: "SELECT * FROM users WHERE user_id = $1",
      values: [userId],
    };

    const result = await client.query(query);
    return result.rows[0] || null;
  } catch (err) {
    throw new Error(`Failed to get user: ${err.message}`);
  } finally {
    client.release();
  }
};

// Get user by email
export const getUserByEmail = async (email) => {
  const client = await pool.connect();
  try {
    if (typeof email !== "string" || !email) {
      throw new Error("Email must be a non-empty string");
    }

    const query = {
      text: "SELECT * FROM users WHERE email = $1",
      values: [email],
    };

    const result = await client.query(query);
    return result.rows[0] || null;
  } catch (err) {
    throw new Error(`Failed to get user by email: ${err.message}`);
  } finally {
    client.release();
  }
};

// Get all users
export const getAllUsers = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM users");
    return result.rows;
  } catch (err) {
    throw new Error(`Failed to fetch users: ${err.message}`);
  } finally {
    client.release();
  }
};

export const createUser = async (userId, email, phoneNumber = '') => {
  const client = await pool.connect();
  try {
    const query = {
      text: `
        INSERT INTO users (
          user_id, 
          email, 
          phone_number
        ) VALUES ($1, $2, $3) 
        RETURNING *
      `,
      values: [userId, email, phoneNumber],
    };

    const result = await client.query(query);
    return result.rows[0];
  } catch (err) {
    throw new Error(`Failed to create user: ${err.message}`);
  } finally {
    client.release();
  }
};
// Get role by ID
export const getRoleById = async (roleId) => {
  const client = await pool.connect();
  try {
    if (!roleId || !Number.isInteger(Number(roleId))) {
      throw new Error("roleId must be a valid integer");
    }

    const query = {
      text: "SELECT * FROM roles WHERE id = $1",
      values: [roleId],
    };

    const result = await client.query(query);
    console.log(result);
    return result.rows[0] || null;
  } catch (err) {
    throw new Error(`Failed to get role: ${err.message}`);
  } finally {
    client.release();
  }
};

export const getRoleIdByUserId = async (userId) => {
  const client = await pool.connect();
  try {
    const query = {
      text: "SELECT role_id from users WHERE user_id = $1",
      values: [userId],
    };

    const result = await client.query(query);
    return result.rows[0]?.role_id || null;
  } catch (err) {
    throw new Error(`Failed to get role ID: ${err.message}`);
  } finally {
    client.release();
  }
};


// Your (alex) updateUser function
export const updateUser = async (userId, userProfile) => {
  const client = await pool.connect();
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const query = {
      text: "UPDATE users SET name = $1, phone_number = $2, address = $3 WHERE user_id = $4 RETURNING *",
      values: [
        userProfile.name,
        userProfile.phone,
        userProfile.address,
        userId,
      ],
    };

    const result = await client.query(query);
    return result.rows[0] || null;
  } catch (err) {
    throw new Error(`Failed to update user: ${err.message}`);
  } finally {
    client.release();
  }
};

// Mason's getBarberUsers function
export const getBarberUsers = async () => {
  const client = await pool.connect();
  try {
    const query = {
      text: `
        SELECT *
        FROM users 
        WHERE role_id = 3
        ORDER BY id
      `
    };
    const result = await client.query(query);
    return result.rows;
  } catch (err) {
    throw new Error(`Failed to get barbers: ${err.message}`);
  } finally {
    client.release();
  }
};

// Mason's updateUserRole function
export const updateUserRole = async (email, roleId) => {
  const client = await pool.connect();
  try {
    // Validate inputs
    if (!email || typeof email !== 'string') {
      throw new Error("Invalid email");
    }
    if (!roleId || !Number.isInteger(Number(roleId))) {
      throw new Error("Invalid role ID");
    }

    await client.query('BEGIN');

    // Verify user exists
    const userCheck = await client.query({
      text: 'SELECT id FROM users WHERE email = $1 FOR UPDATE',
      values: [email]
    });

    if (userCheck.rows.length === 0) {
      throw new Error("User not found");
    }

    const userId = userCheck.rows[0].id;

    // Update role
    const result = await client.query({
      text: `
        UPDATE users 
        SET role_id = $1, 
            updated_at = NOW()
        WHERE id = $2
        RETURNING id, email, role_id, phone_number
      `,
      values: [roleId, userId]
    });

    await client.query('COMMIT');

    if (result.rows.length === 0) {
      throw new Error("Update failed - no rows affected");
    }

    return result.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(`Role update error for email ${email}:`, err);
    throw new Error(`Failed to update role: ${err.message}`);
  } finally {
    client.release();
  }
};