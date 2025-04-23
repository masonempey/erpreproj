// /lib/services/barberService.js
import { pool } from "@/lib/database";

// Get all barbers
export const getAllBarbers = async () => {
  try {
    const result = await pool.query(
      "SELECT * FROM public.barbers ORDER BY id ASC"
    );
    return result.rows;
  } catch (err) {
    throw new Error(`Failed to fetch barbers: ${err.message}`);
  }
};

// Get a barber by barber_id
export const getBarberById = async (barberId) => {
  try {
    if (typeof barberId !== "string" || !barberId) {
      throw new Error("barberId must be a non-empty string");
    }

    const result = await pool.query(
      "SELECT * FROM public.barbers WHERE barber_id = $1",
      [barberId]
    );
    return result.rows[0] || null;
  } catch (err) {
    throw new Error(`Failed to fetch barber by barber_id: ${err.message}`);
  }
};

// Get a barber by name
export const getBarberByName = async (name) => {
  try {
    if (typeof name !== "string" || !name) {
      throw new Error("name must be a non-empty string");
    }

    const result = await pool.query(
      "SELECT * FROM public.barbers WHERE name ILIKE $1",
      [name]
    );
    return result.rows[0] || null;
  } catch (err) {
    throw new Error(`Failed to fetch barber by name: ${err.message}`);
  }
};

// Create a new barber
export const createBarber = async (barberId, name, email) => {
  try {
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

    const result = await pool.query(
      "INSERT INTO public.barbers(barber_id, name, email) VALUES($1, $2, $3) RETURNING *",
      [barberId, name, email]
    );
    return result.rows[0];
  } catch (err) {
    throw new Error(`Failed to create barber: ${err.message}`);
  }
};

// Update an existing barber by id
export const updateBarber = async (id, barberId, name, email) => {
  try {
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

    const result = await pool.query(
      "UPDATE public.barbers SET barber_id = $1, name = $2, email = $3 WHERE id = $4 RETURNING *",
      [barberId, name, email, id]
    );
    return result.rows[0] || null;
  } catch (err) {
    throw new Error(`Failed to update barber: ${err.message}`);
  }
};

// Update an existing barber by barber_id
export const updateBarberByBarberId = async (barberId, name, email) => {
  try {
    if (typeof barberId !== "string" || !barberId) {
      throw new Error("barberId must be a non-empty string");
    }
    if (!name && !email) {
      throw new Error(
        "At least one field (name or email) is required to update"
      );
    }

    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;

    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(", ");
    const values = [barberId, ...Object.values(updates)];

    const result = await pool.query(
      `UPDATE public.barbers SET ${setClause} WHERE barber_id = $1 RETURNING *`,
      values
    );
    return result.rows[0] || null;
  } catch (err) {
    throw new Error(`Failed to update barber by barber_id: ${err.message}`);
  }
};

// Delete a barber by id
export const deleteBarber = async (id) => {
  try {
    if (!Number.isInteger(id)) {
      throw new Error("id must be an integer");
    }

    const result = await pool.query(
      "DELETE FROM public.barbers WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0] || null;
  } catch (err) {
    throw new Error(`Failed to delete barber: ${err.message}`);
  }
};

// Delete a barber by barber_id
export const deleteBarberByBarberId = async (barberId) => {
  try {
    if (typeof barberId !== "string" || !barberId) {
      throw new Error("barberId must be a non-empty string");
    }

    const result = await pool.query(
      "DELETE FROM public.barbers WHERE barber_id = $1 RETURNING *",
      [barberId]
    );
    return result.rows[0] || null;
  } catch (err) {
    throw new Error(`Failed to delete barber by barber_id: ${err.message}`);
  }
};

// Get services offered by a specific barber
export const getServicesByBarberId = async (barberId) => {
  const client = await pool.connect();
  try {
    if (typeof barberId !== "string" || !barberId) {
      throw new Error("barberId must be a non-empty string");
    }

    const query = {
      text: `
        SELECT s.* 
        FROM services s
        JOIN barber_services bs ON s.id = bs.service_id
        WHERE bs.barber_id = $1
        ORDER BY s.id ASC
      `,
      values: [barberId],
    };

    const result = await client.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error fetching barber services:", error);
    throw new Error(`Failed to fetch services for barber: ${error.message}`);
  } finally {
    client.release();
  }
};

// Get appointments for a barber by date
export const getAppointmentsForBarberByDate = async (barberId, date) => {
  const client = await pool.connect();
  try {
    const formattedDate = date.toISOString().split("T")[0];

    const query = {
      text: `
        SELECT a.*, 
               s.duration_minutes as service_duration,
               s.service_name
        FROM appointments a
        LEFT JOIN services s ON a.service_id = s.id
        WHERE a.barber_id = $1 
        AND DATE(a.date) = $2
        ORDER BY a.date ASC
      `,
      values: [barberId, formattedDate],
    };

    const result = await client.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error fetching appointments for barber:", error);
    throw error;
  } finally {
    client.release();
  }
};

// Get all appointments
export const getAllAppointments = async () => {
  const client = await pool.connect();
  try {
    const query = {
      text: "SELECT * FROM appointments",
    };

    const result = await client.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error fetching all appointments:", error);
    throw new Error(`Failed to fetch appointments: ${error.message}`);
  } finally {
    client.release();
  }
};

// Get barber hours by barber_id
export const getBarberHours = async (barberId) => {
  try {
    if (typeof barberId !== "string" || !barberId) {
      throw new Error("barberId must be a non-empty string");
    }

    const result = await pool.query(
      `SELECT 
        "Monday_Start", "Monday_End",
        "Tuesday_Start", "Tuesday_End",
        "Wednesday_Start", "Wednesday_End",
        "Thursday_Start", "Thursday_End",
        "Friday_Start", "Friday_End",
        "Saturday_Start", "Saturday_End",
        "Sunday_Start", "Sunday_End"
      FROM public.barbers
      WHERE barber_id = $1`,
      [barberId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (err) {
    throw new Error(`Failed to fetch barber hours: ${err.message}`);
  }
};

// Update barber hours by barber_id
export const updateBarberHours = async (barberId, hoursData) => {
  try {
    if (typeof barberId !== "string" || !barberId) {
      throw new Error("barberId must be a non-empty string");
    }

    const requiredFields = [
      "Monday_Start", "Monday_End",
      "Tuesday_Start", "Tuesday_End",
      "Wednesday_Start", "Wednesday_End",
      "Thursday_Start", "Thursday_End",
      "Friday_Start", "Friday_End",
      "Saturday_Start", "Saturday_End",
      "Sunday_Start", "Sunday_End",
    ];

    for (const field of requiredFields) {
      if (!hoursData[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
      if (!/^\d{2}:\d{2}:\d{2}$/.test(hoursData[field])) {
        throw new Error(`Invalid time format for ${field}: ${hoursData[field]}`);
      }
    }

    const query = `
      UPDATE public.barbers
      SET 
        "Monday_Start" = $2, "Monday_End" = $3,
        "Tuesday_Start" = $4, "Tuesday_End" = $5,
        "Wednesday_Start" = $6, "Wednesday_End" = $7,
        "Thursday_Start" = $8, "Thursday_End" = $9,
        "Friday_Start" = $10, "Friday_End" = $11,
        "Saturday_Start" = $12, "Saturday_End" = $13,
        "Sunday_Start" = $14, "Sunday_End" = $15
      WHERE barber_id = $1
      RETURNING 
        "Monday_Start", "Monday_End",
        "Tuesday_Start", "Tuesday_End",
        "Wednesday_Start", "Wednesday_End",
        "Thursday_Start", "Thursday_End",
        "Friday_Start", "Friday_End",
        "Saturday_Start", "Saturday_End",
        "Sunday_Start", "Sunday_End"
    `;

    const values = [
      barberId,
      hoursData["Monday_Start"], hoursData["Monday_End"],
      hoursData["Tuesday_Start"], hoursData["Tuesday_End"],
      hoursData["Wednesday_Start"], hoursData["Wednesday_End"],
      hoursData["Thursday_Start"], hoursData["Thursday_End"],
      hoursData["Friday_Start"], hoursData["Friday_End"],
      hoursData["Saturday_Start"], hoursData["Saturday_End"],
      hoursData["Sunday_Start"], hoursData["Sunday_End"],
    ];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (err) {
    throw new Error(`Failed to update barber hours: ${err.message}`);
  }
};