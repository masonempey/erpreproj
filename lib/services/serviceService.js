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

// Get available services not associated with a barber
export const getAvailableServices = async (barberId) => {
  try {
    if (typeof barberId !== "string" || !barberId) {
      throw new Error("barberId must be a non-empty string");
    }

    const result = await pool.query(
      `
      SELECT s.*
      FROM public.services s
      WHERE s.id NOT IN (
        SELECT bs.service_id
        FROM public.barber_services bs
        WHERE bs.barber_id = $1
      )
      ORDER BY s.id ASC
      `,
      [barberId]
    );
    return result.rows;
  } catch (err) {
    throw new Error(`Failed to fetch available services: ${err.message}`);
  }
};

// Get barber's services
export const getBarberServices = async (barberId) => {
  try {
    if (typeof barberId !== "string" || !barberId) {
      throw new Error("barberId must be a non-empty string");
    }

    const result = await pool.query(
      `
      SELECT bs.*, s.service_name, s.description
      FROM public.barber_services bs
      JOIN public.services s ON bs.service_id = s.id
      WHERE bs.barber_id = $1
      ORDER BY bs.id ASC
      `,
      [barberId]
    );
    return result.rows;
  } catch (err) {
    throw new Error(`Failed to fetch barber services: ${err.message}`);
  }
};

// Get service by ID
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

// Create a new service
export const createService = async (serviceName, description, price, durationMinutes) => {
  try {
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
    if (typeof durationMinutes !== "number" || !Number.isInteger(durationMinutes) || durationMinutes <= 0) {
      throw new Error("durationMinutes must be a positive integer");
    }

    const result = await pool.query(
      "INSERT INTO public.services(service_name, description, price, duration_minutes) VALUES($1, $2, $3, $4) RETURNING *",
      [serviceName.trim(), description.trim(), price, durationMinutes.toString()]
    );
    return result.rows[0];
  } catch (err) {
    throw new Error(`Failed to create service: ${err.message}`);
  }
};

// Update an existing service
export const updateService = async (id, serviceName, description, price, durationMinutes) => {
  try {
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      throw new Error("id must be a positive integer");
    }
    if (serviceName && (typeof serviceName !== "string" || serviceName.length > 100 || !serviceName.trim())) {
      throw new Error("serviceName must be a non-empty string up to 100 characters");
    }
    if (description && (typeof description !== "string" || !description.trim())) {
      throw new Error("description must be a non-empty string");
    }
    if (price !== undefined && (typeof price !== "number" || isNaN(price) || price < 0)) {
      throw new Error("price must be a valid non-negative number");
    }
    if (durationMinutes !== undefined && (typeof durationMinutes !== "number" || !Number.isInteger(durationMinutes) || durationMinutes <= 0)) {
      throw new Error("durationMinutes must be a positive integer");
    }

    const updates = [];
    const values = [id];
    let index = 2;

    if (serviceName) {
      updates.push(`service_name = $${index++}`);
      values.push(serviceName.trim());
    }
    if (description) {
      updates.push(`description = $${index++}`);
      values.push(description.trim());
    }
    if (price !== undefined) {
      updates.push(`price = $${index++}`);
      values.push(price);
    }
    if (durationMinutes !== undefined) {
      updates.push(`duration_minutes = $${index++}`);
      values.push(durationMinutes.toString());
    }

    if (updates.length === 0) {
      throw new Error("At least one field must be provided for update");
    }

    const query = `UPDATE public.services SET ${updates.join(", ")} WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0] || null;
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

    // Note: ON DELETE CASCADE on barber_services.service_id handles dependent records
    const result = await pool.query(
      "DELETE FROM public.services WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0] || null;
  } catch (err) {
    throw new Error(`Failed to delete service: ${err.message}`);
  }
};

// Add a service to a barber
export const addBarberService = async (barberId, serviceId, price, durationMinutes) => {
  try {
    if (typeof barberId !== "string" || !barberId) {
      throw new Error("barberId must be a non-empty string");
    }
    if (!Number.isInteger(Number(serviceId)) || Number(serviceId) <= 0) {
      throw new Error("serviceId must be a positive integer");
    }
    if (typeof price !== "number" || isNaN(price) || price < 0) {
      throw new Error("price must be a valid non-negative number");
    }
    if (typeof durationMinutes !== "number" || !Number.isInteger(durationMinutes) || durationMinutes <= 0) {
      throw new Error("durationMinutes must be a positive integer");
    }

    const result = await pool.query(
      "INSERT INTO public.barber_services(barber_id, service_id, price, duration_minutes) VALUES($1, $2, $3, $4) RETURNING *",
      [barberId, serviceId, price, durationMinutes]
    );
    return result.rows[0];
  } catch (err) {
    throw new Error(`Failed to add barber service: ${err.message}`);
  }
};

// Update a barber's service
export const updateBarberService = async (barberId, serviceId, price, durationMinutes) => {
  try {
    if (typeof barberId !== "string" || !barberId) {
      throw new Error("barberId must be a non-empty string");
    }
    if (!Number.isInteger(Number(serviceId)) || Number(serviceId) <= 0) {
      throw new Error("serviceId must be a positive integer");
    }
    if (price !== undefined && (typeof price !== "number" || isNaN(price) || price < 0)) {
      throw new Error("price must be a valid non-negative number");
    }
    if (durationMinutes !== undefined && (typeof durationMinutes !== "number" || !Number.isInteger(durationMinutes) || durationMinutes <= 0)) {
      throw new Error("durationMinutes must be a positive integer");
    }

    const updates = [];
    const values = [barberId, serviceId];
    let index = 3;

    if (price !== undefined) {
      updates.push(`price = $${index++}`);
      values.push(price);
    }
    if (durationMinutes !== undefined) {
      updates.push(`duration_minutes = $${index++}`);
      values.push(durationMinutes);
    }

    if (updates.length === 0) {
      throw new Error("At least one field (price or duration_minutes) must be provided for update");
    }

    const query = `UPDATE public.barber_services SET ${updates.join(", ")} WHERE barber_id = $1 AND service_id = $2 RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  } catch (err) {
    throw new Error(`Failed to update barber service: ${err.message}`);
  }
};