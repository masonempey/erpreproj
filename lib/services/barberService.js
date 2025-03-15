// /lib/services/barberService.js
import { pool } from "@/lib/database";

// Get all barbers
export const getAllBarbers = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT * FROM public.barbers ORDER BY id ASC"
    );
    return result.rows;
  } catch (err) {
    throw new Error(`Failed to fetch barbers: ${err.message}`);
  } finally {
    client.release();
  }
};

// Create a new barber
export const createBarber = async (barberId, name, email) => {
  const client = await pool.connect();
  try {
    // Validate input types match the schema
    if (typeof barberId !== "string" || barberId.length > 255 || !barberId) {
      throw new Error(
        "barberId must be a non-empty string up to 255 characters"
      );
    }
    if (typeof name !== "string" || name.length > 100 || !name) {
      throw new Error("name must be a non-empty string up to 100 characters");
    }
    if (typeof email !== "string" || email.length > 255 || !email) {
      throw new Error("email must be a non-empty string up to 255 characters");
    }

    const query = {
      text: "INSERT INTO public.barbers(barber_id, name, email) VALUES($1, $2, $3) RETURNING *",
      values: [barberId, name, email],
    };

    const result = await client.query(query);
    return result.rows[0];
  } catch (err) {
    throw new Error(`Failed to create barber: ${err.message}`);
  } finally {
    client.release();
  }
};

// Update an existing barber
export const updateBarber = async (id, barberId, name, email) => {
  const client = await pool.connect();
  try {
    // Validate input types match the schema
    if (!Number.isInteger(id)) {
      throw new Error("id must be an integer");
    }
    if (typeof barberId !== "string" || barberId.length > 255 || !barberId) {
      throw new Error(
        "barberId must be a non-empty string up to 255 characters"
      );
    }
    if (typeof name !== "string" || name.length > 100 || !name) {
      throw new Error("name must be a non-empty string up to 100 characters");
    }
    if (typeof email !== "string" || email.length > 255 || !email) {
      throw new Error("email must be a non-empty string up to 255 characters");
    }

    const query = {
      text: "UPDATE public.barbers SET barber_id = $1, name = $2, email = $3 WHERE id = $4 RETURNING *",
      values: [barberId, name, email, id],
    };

    const result = await client.query(query);
    return result.rows[0] || null; // Return null if no rows updated
  } catch (err) {
    throw new Error(`Failed to update barber: ${err.message}`);
  } finally {
    client.release();
  }
};

// Delete a barber
export const deleteBarber = async (id) => {
  const client = await pool.connect();
  try {
    if (!Number.isInteger(id)) {
      throw new Error("id must be an integer");
    }

    const query = {
      text: "DELETE FROM public.barbers WHERE id = $1 RETURNING *",
      values: [id],
    };

    const result = await client.query(query);
    return result.rows[0] || null; // Return null if no rows deleted
  } catch (err) {
    throw new Error(`Failed to delete barber: ${err.message}`);
  } finally {
    client.release();
  }
};
