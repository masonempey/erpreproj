import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  createAppointment,
  getAllAppointments,
  getAppointmentsFromBarberOnOneDay,
  getAppointmentsByUserId,
  getAppointmentById,
  cancelAppointmentInDb,
  markNoShowInDb,
  getAllAppointmentsByDate,
} from "@/lib/services/bookingService";
import {
  recordPayment,
  getPaymentByAppointmentId,
  updatePaymentStatus,
} from "@/lib/services/paymentService";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/** GET handler **/
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action") || "list";

  try {
    switch (action) {
      case "list":
        return NextResponse.json(await getAllAppointments());

      case "barber": {
        const barberId = searchParams.get("barberId");
        const date = searchParams.get("date");
        if (!barberId || !date) {
          return NextResponse.json(
            { error: "Barber ID and date required" },
            { status: 400 }
          );
        }
        return NextResponse.json(
          await getAppointmentsFromBarberOnOneDay(barberId, new Date(date))
        );
      }

      case "user": {
        const userId = searchParams.get("userId");
        if (!userId) {
          return NextResponse.json(
            { error: "User ID required" },
            { status: 400 }
          );
        }
        return NextResponse.json(await getAppointmentsByUserId(userId));
      }

      case "date": {
        const dateParam = searchParams.get("date");
        if (!dateParam) {
          return NextResponse.json(
            { error: "Date is required" },
            { status: 400 }
          );
        }
        const apps = await getAllAppointmentsByDate(new Date(dateParam));
        return NextResponse.json(apps);
      }

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (err) {
    console.error("Bookings API GET error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/** POST handler **/
export async function POST(request) {
  try {
    const body = await request.json();
    const { action = "create", ...data } = body;

    switch (action) {
      case "create": {
        const appt = await createAppointment(
          data.date,
          data.userId,
          data.serviceId,
          data.barberId,
          data.guestName,
          data.guestEmail,
          data.guestPhone,
          data.guestAddress,
          data.serviceDuration
        );

        const pi = await stripe.paymentIntents.retrieve(
          data.paymentIntentId
        );

        await recordPayment({
          paymentId: pi.id,
          paymentMethod: pi.payment_method,
          amount: pi.amount,
          paymentStatus: pi.status,
          appointmentId: appt.id,
        });

        return NextResponse.json({ appointment: appt }, { status: 201 });
      }

      case "cancel": {
        const { appointmentId } = data;
        const appt = await getAppointmentById(appointmentId);
        if (!appt) throw new Error("Appointment not found");

        const now = Date.now();
        const diffHrs =
          (new Date(appt.date).getTime() - now) / 36e5;
        const payment = await getPaymentByAppointmentId(appointmentId);
        if (!payment) throw new Error("No payment on record");

        let refund;
        if (diffHrs >= 24) {
          refund = await stripe.refunds.create({
            payment_intent: payment.payment_id,
          });
        } else {
          const feeCents = 1000;
          refund = await stripe.refunds.create({
            payment_intent: payment.payment_id,
            amount: payment.amount - feeCents,
          });
        }

        await updatePaymentStatus(payment.payment_id, refund.status);
        await cancelAppointmentInDb(appointmentId);

        return NextResponse.json({ refund }, { status: 200 });
      }

      case "no_show": {
        const { appointmentId } = data;
        const payment = await getPaymentByAppointmentId(appointmentId);
        if (!payment) throw new Error("No payment on record");

        await markNoShowInDb(appointmentId);
        await updatePaymentStatus(
          payment.payment_id,
          "no_show_charged"
        );

        return NextResponse.json(
          { message: "No-show recorded, no refund" },
          { status: 200 }
        );
      }

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (err) {
    console.error("Bookings API POST error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
