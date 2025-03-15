// /lib/services/serviceService.js
import { pool } from "@/lib/database";

// Get all services
export const getAllServices = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT * FROM public.services ORDER BY id ASC"
    );
    return result.rows;
  } catch (err) {
    throw new Error(`Failed to fetch services: ${err.message}`);
  } finally {
    client.release();
  }
};

// Create a new service
export const createService = async (serviceName, description, price) => {
  const client = await pool.connect();
  try {
    // Validate input types match the schema
    if (typeof serviceName !== "string" || serviceName.length > 100) {
      throw new Error("serviceName must be a string up to 100 characters");
    }
    if (typeof description !== "string") {
      throw new Error("description must be a string");
    }
    if (typeof price !== "number" || isNaN(price)) {
      throw new Error("price must be a valid number");
    }

    const query = {
      text: "INSERT INTO public.services(service_name, description, price) VALUES($1, $2, $3) RETURNING *",
      values: [serviceName, description, price],
    };

    const result = await client.query(query);
    return result.rows[0];
  } catch (err) {
    throw new Error(`Failed to create service: ${err.message}`);
  } finally {
    client.release();
  }
};

// Update an existing service
export const updateService = async (id, serviceName, description, price) => {
  const client = await pool.connect();
  try {
    // Validate input types match the schema
    if (!Number.isInteger(id)) {
      throw new Error("id must be an integer");
    }
    if (typeof serviceName !== "string" || serviceName.length > 100) {
      throw new Error("serviceName must be a string up to 100 characters");
    }
    if (typeof description !== "string") {
      throw new Error("description must be a string");
    }
    if (typeof price !== "number" || isNaN(price)) {
      throw new Error("price must be a valid number");
    }

    const query = {
      text: "UPDATE public.services SET service_name = $1, description = $2, price = $3 WHERE id = $4 RETURNING *",
      values: [serviceName, description, price, id],
    };

    const result = await client.query(query);
    return result.rows[0] || null; // Return null if no rows updated
  } catch (err) {
    throw new Error(`Failed to update service: ${err.message}`);
  } finally {
    client.release();
  }
};

// Delete a service
export const deleteService = async (id) => {
  const client = await pool.connect();
  try {
    if (!Number.isInteger(id)) {
      throw new Error("id must be an integer");
    }

    const query = {
      text: "DELETE FROM public.services WHERE id = $1 RETURNING *",
      values: [id],
    };

    const result = await client.query(query);
    return result.rows[0] || null; // Return null if no rows deleted
  } catch (err) {
    throw new Error(`Failed to delete service: ${err.message}`);
  } finally {
    client.release();
  }
};
