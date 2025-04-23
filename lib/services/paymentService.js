// lib/services/paymentService.js
import { pool } from "@/lib/database";

/**
 * Record a new payment in Postgres
 * @param {{paymentId:string, paymentMethod:string, amount:number, paymentStatus:string, appointmentId:number}} args
 */
export async function recordPayment({
  paymentId,
  paymentMethod,
  amount,
  paymentStatus,
  appointmentId,
}) {
  await pool.query(
    `INSERT INTO payments
      (payment_id, payment_method, amount, payment_status, appointment_id)
     VALUES ($1, $2, $3, $4, $5)`,
    [paymentId, paymentMethod, amount, paymentStatus, appointmentId]
  );
}

/** Fetch the payment record for a given appointment */
export async function getPaymentByAppointmentId(appointmentId) {
  const { rows } = await pool.query(
    `SELECT * FROM payments WHERE appointment_id = $1`,
    [appointmentId]
  );
  return rows[0];
}

/** Update status (e.g. “requires_action”, “succeeded”, “canceled”, “no_show_charged”) */
export async function updatePaymentStatus(paymentId, newStatus) {
  await pool.query(
    `UPDATE payments SET payment_status = $1 WHERE payment_id = $2`,
    [newStatus, paymentId]
  );
}
