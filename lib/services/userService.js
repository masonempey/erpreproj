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

// Create a new user
export const createUser = async (userId, email, roleId, phoneNumber) => {
  const client = await pool.connect();
  try {
    const query = {
      text: "INSERT INTO users (user_id, email, role_id, phone_number) VALUES ($1, $2, $3, $4) RETURNING *",
      values: [userId, email, roleId, phoneNumber],
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
    return result.rows[0] || null;
  } catch (err) {
    throw new Error(`Failed to get role: ${err.message}`);
  } finally {
    client.release();
  }
};

// Get or create default role ID
export const getDefaultRoleId = async () => {
  const client = await pool.connect();
  try {
    const query = {
      text: "SELECT id FROM roles WHERE role_type = 'user' LIMIT 1",
    };

    let result = await client.query(query);
    if (!result.rows[0]) {
      const insertQuery = {
        text: "INSERT INTO roles (role_type) VALUES ('user') RETURNING id",
      };
      result = await client.query(insertQuery);
    }
    return result.rows[0].id;
  } catch (err) {
    throw new Error(`Failed to get default role ID: ${err.message}`);
  } finally {
    client.release();
  }
};

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
