import { NextResponse } from "next/server";
import { getAppointmentsByUserId } from "@/lib/services/bookingService";

export async function GET(request, { params }) {
  try {
    const { userId } = params;

    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { error: "Invalid user ID provided" },
        { status: 400 }
      );
    }

    // Get appointments for this user
    const appointments = await getAppointmentsByUserId(userId);

    // Format dates for easier frontend consumption
    const formattedAppointments = appointments.map((appointment) => ({
      ...appointment,
      formattedDate: new Date(appointment.date).toLocaleString(),
      isPast: new Date(appointment.date) < new Date(),
    }));

    return NextResponse.json(formattedAppointments);
  } catch (error) {
    console.error("Error fetching user appointments:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
