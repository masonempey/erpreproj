import { NextResponse } from "next/server";
import { getAppointmentsForBarberByDate } from "@/lib/services/bookingService";

export async function GET(request, { params }) {
  try {
    const { barberId } = params;
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { message: "Date parameter is required" },
        { status: 400 }
      );
    }

    // Parse the date
    const appointmentDate = new Date(date);
    if (isNaN(appointmentDate.getTime())) {
      return NextResponse.json(
        { message: "Invalid date format" },
        { status: 400 }
      );
    }

    const appointments = await getAppointmentsForBarberByDate(
      barberId,
      appointmentDate
    );
    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching barber appointments:", error);
    return NextResponse.json(
      { message: `Failed to fetch appointments: ${error.message}` },
      { status: 500 }
    );
  }
}
