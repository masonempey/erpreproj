import { NextResponse } from "next/server";
import { getAllAppointments } from "@/lib/services/barberService";

// GET - Fetch all appointments
export async function GET() {
  try {
    // Call the service function to retrieve all appointments
    const appointments = await getAllAppointments();

    // Return the appointments as JSON with a 200 status
    return NextResponse.json(appointments, { status: 200 });
  } catch (err) {
    // Log the error for debugging and return a 500 response
    console.error("Error fetching all appointments:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}