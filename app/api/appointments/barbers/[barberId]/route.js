// app/api/appointments/barbers/[barberId]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/database/mongodb";
import Appointment from "@/lib/database/models/appointmentModel";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { barberId } = params;
    console.log(`Fetching appointments for barber ID: ${barberId}`);

    const appointments = await Appointment.find({ barberId: barberId });
    console.log(`Appointments found: ${appointments.length}`);

    if (appointments.length === 0) {
      return NextResponse.json(
        { message: "No appointments found for this barber" },
        { status: 404 }
      );
    }

    return NextResponse.json(appointments);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    return NextResponse.json(
      {
        error:
          "Error occurred while attempting to find appointments for the barber",
      },
      { status: 500 }
    );
  }
}
