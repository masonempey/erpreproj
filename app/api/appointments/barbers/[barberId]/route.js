// app/api/appointments/barbers/[barberId]/route.js
import { NextResponse } from "next/server";
import { getBarberById } from "@/lib/services/barberService";
import { getAppointmentsFromBarber } from "@/lib/services/bookingService";
export async function GET(request, { params }) {
  try {
    const { barberId } = params;
    console.log(`Fetching appointments for barber ID: ${barberId}`);

    const appointments = await getAppointmentsFromBarber(barberId);
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
