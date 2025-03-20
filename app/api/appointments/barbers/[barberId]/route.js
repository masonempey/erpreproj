// app/api/appointments/barbers/[barberId]/route.js
import { NextResponse } from "next/server";
import { getBarberById } from "@/lib/services/barberService";
import { getAppointmentsFromBarberOnOneDay } from "@/lib/services/bookingService";

export async function GET(request, { params }) {
    try {
        const { barberId } = params;
        const { searchParams } = new URL(request.url);
        const date = searchParams.get("date");

        // Validate barberId
        if (!barberId || typeof barberId !== "string") {
            return NextResponse.json(
                { error: "barberId must be a non-empty string" },
                { status: 400 }
            );
        }

        // Validate date
        if (!date || isNaN(new Date(date).getTime())) {
            return NextResponse.json(
                { error: "date must be a valid date string" },
                { status: 400 }
            );
        }

        // Check if the barber exists
        const barber = await getBarberById(barberId);
        if (!barber) {
            return NextResponse.json(
                { error: "Barber not found" },
                { status: 404 }
            );
        }

        // Fetch appointments for the barber on the specified date
        const appointments = await getAppointmentsFromBarberOnOneDay(barberId, new Date(date));
        console.log(`Appointments found: ${appointments.length}`);

        if (appointments.length === 0) {
            return NextResponse.json(appointments);
        }

        return NextResponse.json(appointments);
    } catch (err) {
        console.error("Error fetching appointments:", err);
        return NextResponse.json(
            {
                error: "An error occurred while fetching appointments",
                details: err.message,
            },
            { status: 500 }
        );
    }
}