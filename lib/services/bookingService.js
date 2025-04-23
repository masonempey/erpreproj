import { pool } from "@/lib/database";

/** Create a new appointment **/
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
    // guest validations...
    const barberCheck = await client.query(
      "SELECT id FROM public.barbers WHERE barber_id = $1",
      [barberId]
    );
    if (!barberCheck.rows[0]) throw new Error("Barber not found");

    if (userId) {
      const userCheck = await client.query(
        "SELECT id FROM public.users WHERE user_id = $1",
        [userId]
      );
      if (!userCheck.rows[0]) throw new Error("User not found");
    }

    const res = await client.query(
      `
      INSERT INTO public.appointments(
        date, user_id, service_id, barber_id,
        guest_name, guest_email, guest_phone,
        guest_address, service_duration
      ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *
    `,
      [
        date,
        userId || null,
        serviceId,
        barberId,
        guestName || null,
        guestEmail || null,
        guestPhone || null,
        guestAddress || null,
        serviceDuration,
      ]
    );
    return res.rows[0];
  } catch (err) {
    throw new Error(`Failed to create appointment: ${err.message}`);
  } finally {
    client.release();
  }
};

/** Fetch all appointments **/
export const getAllAppointments = async () => {
  const client = await pool.connect();
  try {
    const res = await client.query(
      "SELECT * FROM public.appointments ORDER BY date ASC"
    );
    return res.rows;
  } catch (err) {
    throw new Error(`Failed to fetch appointments: ${err.message}`);
  } finally {
    client.release();
  }
};

/** By userId **/
export const getAppointmentsByUserId = async (userId) => {
  if (typeof userId !== "string" || !userId.trim()) {
    throw new Error("userId must be a non-empty string");
  }
  const client = await pool.connect();
  try {
    const res = await client.query(
      `SELECT a.id, a.date, a.status, a.notes, a.created_at,
              b.name AS barber_name, b.barber_id,
              s.id AS service_id, s.service_name, s.price,
              s.duration_minutes, s.description AS service_description
       FROM appointments a
       LEFT JOIN barbers b ON a.barber_id = b.barber_id
       LEFT JOIN services s ON a.service_id = s.id
       WHERE a.user_id = $1
       ORDER BY a.date ASC`,
      [userId]
    );
    return res.rows;
  } finally {
    client.release();
  }
};

/** By barber on one day **/
export const getAppointmentsFromBarberOnOneDay = async (barberId, date) => {
  if (typeof barberId !== "string" || !barberId.trim()) {
    throw new Error("barberId must be a non-empty string");
  }
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("date must be a valid Date object");
  }
  const client = await pool.connect();
  try {
    const res = await client.query(
      `SELECT a.id, a.date, a.status, a.notes, a.created_at,
              a.guest_name, a.guest_email, a.guest_phone,
              a.guest_address, a.service_duration,
              b.name AS barber_name, b.barber_id,
              s.id AS service_id, s.service_name, s.price,
              s.duration_minutes, s.description AS service_description
       FROM appointments a
       LEFT JOIN barbers b ON a.barber_id = b.barber_id
       LEFT JOIN services s ON a.service_id = s.id
       WHERE a.barber_id = $1 AND DATE(a.date) = DATE($2)
       ORDER BY a.date ASC`,
      [barberId, date]
    );
    return res.rows;
  } finally {
    client.release();
  }
};

/** By date (all barbers) **/
export const getAllAppointmentsByDate = async (date) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("date must be a valid Date object");
  }
  const client = await pool.connect();
  try {
    const d = date.toISOString().split("T")[0];
    const res = await client.query(
      `SELECT a.id, a.date, a.status, a.notes, a.created_at,
              a.guest_name, a.guest_email, a.guest_phone,
              a.guest_address, a.service_duration,
              b.name AS barber_name, b.barber_id,
              s.id AS service_id, s.service_name, s.price,
              s.duration_minutes, s.description AS service_description
       FROM appointments a
       LEFT JOIN barbers b ON a.barber_id = b.barber_id
       LEFT JOIN services s ON a.service_id = s.id
       WHERE DATE(a.date) = $1
       ORDER BY b.name ASC, a.date ASC`,
      [d]
    );
    return res.rows;
  } finally {
    client.release();
  }
};

/** Single appointment **/
export async function getAppointmentById(id) {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(
      `SELECT * FROM appointments WHERE id = $1`,
      [id]
    );
    return rows[0];
  } finally {
    client.release();
  }
}

/** Cancel **/
export async function cancelAppointmentInDb(id) {
  const client = await pool.connect();
  try {
    await client.query(
      `UPDATE appointments SET status = 'cancelled' WHERE id = $1`,
      [id]
    );
  } finally {
    client.release();
  }
}

/** No-show **/
export async function markNoShowInDb(id) {
  const client = await pool.connect();
  try {
    await client.query(
      `UPDATE appointments SET status = 'no_show' WHERE id = $1`,
      [id]
    );
  } finally {
    client.release();
  }
}
