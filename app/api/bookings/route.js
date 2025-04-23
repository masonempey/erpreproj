/**
 * Consolidated API for all booking (appointment) operations.
 */

import { NextResponse } from "next/server";
import {
  createAppointment,
  getAllAppointments,
  getAppointmentsFromBarberOnOneDay,
  getAppointmentsByUserId,
  getAllAppointmentsByDate,
} from "@/lib/services/bookingService";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action") || "list";

  try {
    switch (action) {
      case "list":
        const appointments = await getAllAppointments();
        return NextResponse.json(appointments);

      case "barber":
        const barberId = searchParams.get("barberId");
        const date = searchParams.get("date");

        if (!barberId || !date) {
          return NextResponse.json(
            {
              error: "Barber ID and date are required",
            },
            { status: 400 }
          );
        }

        const barberApps = await getAppointmentsFromBarberOnOneDay(
          barberId,
          new Date(date)
        );
        return NextResponse.json(barberApps);

      case "user":
        const userId = searchParams.get("userId");

        if (!userId) {
          return NextResponse.json(
            {
              error: "User ID is required",
            },
            { status: 400 }
          );
        }

        const userApps = await getAppointmentsByUserId(userId);
        return NextResponse.json(userApps);

      case "date":
        const dateParam = searchParams.get("date");

        if (!dateParam) {
          return NextResponse.json(
            {
              error: "Date is required",
            },
            { status: 400 }
          );
        }

        const dateApps = await getAllAppointmentsByDate(new Date(dateParam));
        return NextResponse.json(dateApps);

      default:
        return NextResponse.json(
          {
            error: "Invalid action",
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Bookings API error:", error);
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action = "create", ...data } = body;

    switch (action) {
      case "create": {
        const {
          date,
          userId,
          barberId,
          serviceId,
          serviceDuration,
          guestName,
          guestEmail,
          guestPhone,
          guestAddress,
        } = data;

        console.log("API received service duration:", serviceDuration);

        // Validate required fields
        if (!date || !barberId || !serviceId) {
          return NextResponse.json(
            { error: "Date, barber ID, and service ID are required" },
            { status: 400 }
          );
        }

        // Create appointment
        const appointment = await createAppointment(
          date,
          userId,
          serviceId,
          barberId,
          guestName,
          guestEmail,
          guestPhone,
          guestAddress,
          serviceDuration
        );

        return NextResponse.json(
          { message: "Appointment created", appointment },
          { status: 201 }
        );
      }

      default:
        return NextResponse.json(
          {
            error: "Invalid action",
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Bookings API error:", error);
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}