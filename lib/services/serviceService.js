// lib/services/serviceService.js
import { pool } from "@/lib/database";

// Get all services
export const getAllServices = async () => {
  try {
    const result = await pool.query(
      "SELECT * FROM public.services ORDER BY id ASC"
    );
    return result.rows;
  } catch (err) {
    throw new Error(`Failed to fetch services: ${err.message}`);
  }
};

// Create a new service
export const createService = async (serviceName, description, price) => {
  try {
    // Validate input types match the schema
    if (
      typeof serviceName !== "string" ||
      serviceName.length > 100 ||
      !serviceName.trim()
    ) {
      throw new Error(
        "serviceName must be a non-empty string up to 100 characters"
      );
    }
    if (typeof description !== "string" || !description.trim()) {
      throw new Error("description must be a non-empty string");
    }
    if (typeof price !== "number" || isNaN(price) || price < 0) {
      throw new Error("price must be a valid non-negative number");
    }

    const result = await pool.query(
      "INSERT INTO public.services(service_name, description, price) VALUES($1, $2, $3) RETURNING *",
      [serviceName.trim(), description.trim(), price]
    );
    return result.rows[0];
  } catch (err) {
    throw new Error(`Failed to create service: ${err.message}`);
  }
};

// Update an existing service
export const updateService = async (id, serviceName, description, price) => {
  try {
    // Validate input types
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      throw new Error("id must be a positive integer");
    }
    if (typeof serviceName !== "string" || serviceName.length > 100) {
      throw new Error("serviceName must be a string up to 100 characters");
    }
    if (typeof description !== "string") {
      throw new Error("description must be a string");
    }
    if (typeof price !== "number" || isNaN(price) || price < 0) {
      throw new Error("price must be a valid non-negative number");
    }

    const result = await pool.query(
      "UPDATE public.services SET service_name = $1, description = $2, price = $3 WHERE id = $4 RETURNING *",
      [serviceName.trim(), description.trim(), price, id]
    );
    return result.rows[0] || null; // Return null if no rows updated
  } catch (err) {
    throw new Error(`Failed to update service: ${err.message}`);
  }
};

// Delete a service
export const deleteService = async (id) => {
  try {
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      throw new Error("id must be a positive integer");
    }

    const result = await pool.query(
      "DELETE FROM public.services WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0] || null; // Return null if no rows deleted
  } catch (err) {
    throw new Error(`Failed to delete service: ${err.message}`);
  }
};

export const getServiceById = async (id) => {
  try {
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      throw new Error("id must be a positive integer");
    }

    const result = await pool.query(
      "SELECT * FROM public.services WHERE id = $1",
      [id]
    );
    return result.rows[0] || null;
  } catch (err) {
    throw new Error(`Failed to fetch service: ${err.message}`);
  }
};
