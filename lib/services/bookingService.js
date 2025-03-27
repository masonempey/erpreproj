// /lib/services/bookingService.js
import { pool } from "@/lib/database";

// Create a new appointment
export const createAppointment = async (
  date,
  userId, // optional
  serviceId,
  barberId,
  guestName, // for guest bookings
  guestEmail,
  guestPhone,
  guestAddress
) => {
  const client = await pool.connect();
  try {
    if (!date || isNaN(new Date(date).getTime())) {
      throw new Error("date must be a valid timestamp");
    }

    if (userId && (typeof userId !== "string" || userId.length > 255)) {
      throw new Error(
        "userId must be a string up to 255 characters if provided"
      );
    }

    // Validate optional guest fields
    if (
      guestName &&
      (typeof guestName !== "string" || guestName.length > 255)
    ) {
      throw new Error(
        "guestName must be a string up to 255 characters if provided"
      );
    }
    if (
      guestEmail &&
      (typeof guestEmail !== "string" || guestEmail.length > 255)
    ) {
      throw new Error(
        "guestEmail must be a string up to 255 characters if provided"
      );
    }
    if (
      guestPhone &&
      (typeof guestPhone !== "string" || guestPhone.length > 50)
    ) {
      throw new Error(
        "guestPhone must be a string up to 50 characters if provided"
      );
    }
    if (
      guestAddress &&
      (typeof guestAddress !== "string" || guestAddress.length > 255)
    ) {
      throw new Error(
        "guestAddress must be a string up to 255 characters if provided"
      );
    }

    // Check if barber exists
    const barberCheck = await client.query(
      "SELECT id FROM public.barbers WHERE barber_id = $1",
      [barberId]
    );
    if (!barberCheck.rows[0]) {
      throw new Error("Barber not found");
    }

    // Check if user exists (if userId is provided)
    if (userId) {
      const userCheck = await client.query(
        "SELECT id FROM public.users WHERE user_id = $1",
        [userId]
      );
      if (!userCheck.rows[0]) {
        throw new Error("User not found");
      }
    }

    const query = {
      text: `
        INSERT INTO public.appointments(date, user_id, barber_id, guest_name, guest_email, guest_phone, guest_address, service_id)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `,
      values: [
        date,
        userId || null,
        barberId,
        guestName || null,
        guestEmail || null,
        guestPhone || null,
        guestAddress || null,
        serviceId,
      ],
    };

    const result = await client.query(query);
    return result.rows[0];
  } catch (err) {
    throw new Error(`Failed to create appointment: ${err.message}`);
  } finally {
    client.release();
  }
};

export const getAllAppointments = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT * FROM public.appointments ORDER BY date ASC"
    );
    return result.rows;
  } catch (err) {
    throw new Error(`Failed to fetch appointments: ${err.message}`);
  } finally {
    client.release();
  }
};

export const getAppointmentsByUserId = async (userId) => {
  // Validate input
  if (typeof userId !== "string" || !userId.trim()) {
    throw new Error("userId must be a non-empty string");
  }

  const client = await pool.connect();
  try {
    // Enhanced query to get more useful appointment information
    const result = await client.query(
      `SELECT 
        a.id, 
        a.date, 
        a.status,
        a.notes,
        a.created_at,
        b.name AS barber_name, 
        b.barber_id,
        s.id AS service_id,
        s.service_name,
        s.price,
        s.duration_minutes,
        s.description AS service_description
      FROM appointments a
      LEFT JOIN barbers b ON a.barber_id = b.barber_id
      LEFT JOIN services s ON a.service_id = s.id
      WHERE a.user_id = $1
      ORDER BY a.date ASC`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching appointments by userId:", error);
    throw new Error(`Failed to fetch appointments by userId: ${error.message}`);
  } finally {
    client.release();
  }
};

// Get all appointments for a specific barber on a specific date (YYYY-MM-DD)
// Returns an array of appointments for the specified barber on the specified date
// The appointments are ordered by date in ascending order
// If no appointments are found, an empty array is returned
export const getAppointmentsFromBarberOnOneDay = async (barberId, date) => {
  // Validate inputs
  if (typeof barberId !== "string" || !barberId.trim()) {
    throw new Error("barberId must be a non-empty string");
  }
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("date must be a valid Date object");
  }

  try {
    // Query the database
    // Get all appointments for the specified barber on the specified date
    // The appointments are ordered by date in ascending order
    // The date part of the date field is compared with the date part of the input date
    const result = await pool.query(
      `SELECT *
           FROM APPOINTMENTS 
           WHERE barber_id = $1 AND DATE(date) = DATE($2) 
           ORDER BY date ASC`,
      [barberId, date]
    );

    // Return all rows (appointments)
    // If no appointments are found, an empty array is returned
    return result.rows;
  } catch (error) {
    console.error("Error fetching appointments by barber_id:", error);
    throw new Error(
      `Failed to fetch appointments by barber_id: ${error.message}`
    );
  }
};
