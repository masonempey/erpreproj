// /lib/services/bookingService.js
import { pool } from "@/lib/database";

// Create a new appointment
export const createAppointment = async (
  date,
  userId, // optional
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
        INSERT INTO public.appointments(date, user_id, barber_id, guest_name, guest_email, guest_phone, guest_address)
        VALUES($1, $2, $3, $4, $5, $6, $7)
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

export const getAppointmentsFromBarber = async (barberId) => {
  try {
      // Validate barberId
      if (typeof barberId !== "string" || !barberId) {
          throw new Error("barberId must be a non-empty string");
      }

      // Query the database
      const result = await pool.query(
          "SELECT id, date, guest_name, guest_email, guest_phone, barber_id FROM APPOINTMENTS WHERE barber_id = $1 ORDER BY date ASC",
          [barberId]
      );

      // Return all rows (appointments)
      return result.rows;
  } catch (error) {
      console.error("Error fetching appointments by barber_id:", error);
      throw new Error(`Failed to fetch appointments by barber_id: ${error.message}`);
  }
};
