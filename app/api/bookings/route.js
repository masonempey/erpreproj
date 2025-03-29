/**
 * Consolidated API for all booking (appointment) operations.
 */

import { NextResponse } from "next/server";
import {
  createAppointment,
  getAllAppointments,
  getAppointmentsFromBarberOnOneDay,
  getAppointmentsByUserId,
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

        // Filter by date
        const allApps = await getAllAppointments();
        const dateApps = allApps.filter((app) => {
          const appDate = new Date(app.date).toISOString().split("T")[0];
          return appDate === dateParam;
        });

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
          guestName,
          guestEmail,
          guestPhone,
          guestAddress,
        } = data;

        // Validate required fields
        if (!date || !barberId || !serviceId) {
          return NextResponse.json(
            {
              error: "Date, barberId and serviceId are required",
            },
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
            message: "Appointment created successfully",
            appointment: newAppointment,
          },
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
