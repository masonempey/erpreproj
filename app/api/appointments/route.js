// app/api/bookings/route.js
import { NextResponse } from "next/server";
import { createAppointment } from "@/lib/services/bookingService";

// POST - create a new appointment (book an appointment)
export async function POST(request) {
  try {
    const {
      date,
      userId, // Optional
      barberId,
      serviceId,
      guestName, // Optional
      guestEmail, // Optional
      guestPhone, // Optional
      guestAddress, // Optional
    } = await request.json();

    if (!date) {
      return NextResponse.json(
        { message: "Date is required" },
        { status: 400 }
      );
    }
    if (!barberId) {
      return NextResponse.json(
        { message: "Barber ID is required" },
        { status: 400 }
      );
    }

    const newAppointment = await createAppointment(
      date,
      userId,
      serviceId,
      barberId,
      guestName,
      guestEmail,
      guestPhone,
      guestAddress
    );

    return NextResponse.json(
      {
        message: "Appointment booked successfully",
        appointment: newAppointment,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Booking service error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
