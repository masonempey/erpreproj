import { pool } from "@/lib/database";

// Create a new appointment
export const createAppointment = async (
  date,
  userId,
  serviceId,
  barberId,
  guestName,
  guestEmail,
  guestPhone,
  guestAddress,
  serviceDuration
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
        INSERT INTO public.appointments(
          date, 
          user_id, 
          service_id,
          barber_id, 
          guest_name, 
          guest_email, 
          guest_phone, 
          guest_address,
          service_duration
        )
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `,
      values: [
        date,
        userId || null,
        serviceId,
        barberId,
        guestName || null,
        guestEmail || null,
        guestPhone || null,
        guestAddress || null,
        serviceDuration,
      ],
    };

    console.log("Creating appointment with duration:", serviceDuration);
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
    const result = await pool.query(
      `SELECT 
        a.id, 
        a.date, 
        a.status,
        a.notes,
        a.created_at,
        a.guest_name,
        a.guest_email,
        a.guest_phone,
        a.guest_address,
        a.service_duration,
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
      WHERE a.barber_id = $1 AND DATE(a.date) = DATE($2)
      ORDER BY a.date ASC`,
      [barberId, date]
    );

    return result.rows;
  } catch (error) {
    console.error("Error fetching appointments by barber_id:", error);
    throw new Error(
      `Failed to fetch appointments by barber_id: ${error.message}`
    );
  }
};

// Get all appointments for a specific date (all barbers)
export const getAllAppointmentsByDate = async (date) => {
  // Validate input
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("date must be a valid Date object");
  }

  const client = await pool.connect();
  try {
    const formattedDate = date.toISOString().split("T")[0];
    const result = await client.query(
      `SELECT 
        a.id, 
        a.date, 
        a.status,
        a.notes,
        a.created_at,
        a.guest_name,
        a.guest_email,
        a.guest_phone,
        a.guest_address,
        a.service_duration,
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
      WHERE DATE(a.date) = $1
      ORDER BY b.name ASC, a.date ASC`,
      [formattedDate]
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching appointments by date:", error);
    throw new Error(`Failed to fetch appointments by date: ${error.message}`);
  } finally {
    client.release();
  }
};