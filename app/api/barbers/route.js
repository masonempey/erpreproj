/**
 * Consolidated API for all barber operations.
 * Handles barber information, appointments, services, and hours.
 */

import { NextResponse } from "next/server";
import {
  getAllBarbers,
  getBarberById,
  getBarberByName,
  createBarber,
  updateBarber,
  updateBarberByBarberId,
  deleteBarber,
  deleteBarberByBarberId,
  getAppointmentsForBarberByDate,
  getServicesByBarberId,
  getBarberHours,
  updateBarberHours,
} from "@/lib/services/barberService";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action") || "list";

  try {
    switch (action) {
      case "list":
        const barbers = await getAllBarbers();
        return NextResponse.json(barbers);

      case "byId": {
        const id = searchParams.get("id");
        if (!id) {
          return NextResponse.json(
            { error: "Barber ID is required" },
            { status: 400 }
          );
        }
        const barber = await getBarberById(id);
        if (!barber) {
          return NextResponse.json(
            { error: "Barber not found" },
            { status: 404 }
          );
        }
        return NextResponse.json(barber);
      }

      case "byName": {
        const name = searchParams.get("name");
        if (!name) {
          return NextResponse.json(
            { error: "Name is required" },
            { status: 400 }
          );
        }
        const barber = await getBarberByName(name);
        if (!barber) {
          return NextResponse.json(
            { error: "Barber not found" },
            { status: 404 }
          );
        }
        return NextResponse.json(barber);
      }

      case "services": {
        const barberId = searchParams.get("barberId");
        if (!barberId) {
          return NextResponse.json(
            { error: "Barber ID is required" },
            { status: 400 }
          );
        }
        const services = await getServicesByBarberId(barberId);
        return NextResponse.json(services);
      }

      case "appointments": {
        const barberId = searchParams.get("barberId");
        const date = searchParams.get("date");
        if (!barberId || !date) {
          return NextResponse.json(
            { error: "Barber ID and date are required" },
            { status: 400 }
          );
        }
        const appointments = await getAppointmentsForBarberByDate(barberId, new Date(date));
        return NextResponse.json(appointments);
      }

      case "hours": {
        const barberId = searchParams.get("barberId");
        if (!barberId) {
          return NextResponse.json(
            { error: "Barber ID is required" },
            { status: 400 }
          );
        }
        const hours = await getBarberHours(barberId);
        if (!hours) {
          return NextResponse.json(
            { error: "Barber hours not found" },
            { status: 404 }
          );
        }
        return NextResponse.json(hours);
      }

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("GET /api/barbers error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch barber information" },
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
        const { barberId, name, email } = data;
        if (!barberId || !name || !email) {
          return NextResponse.json(
            { error: "Barber ID, name, and email are required" },
            { status: 400 }
          );
        }
        const newBarber = await createBarber(barberId, name, email);
        return NextResponse.json(
          { message: "Barber created", barber: newBarber },
          { status: 201 }
        );
      }

      case "updateHours": {
        const { barberId, ...hoursData } = data;
        if (!barberId) {
          return NextResponse.json(
            { error: "Barber ID is required" },
            { status: 400 }
          );
        }
        const requiredFields = [
          "Monday_Start", "Monday_End",
          "Tuesday_Start", "Tuesday_End",
          "Wednesday_Start", "Wednesday_End",
          "Thursday_Start", "Thursday_End",
          "Friday_Start", "Friday_End",
          "Saturday_Start", "Saturday_End",
          "Sunday_Start", "Sunday_End",
        ];
        const missingFields = requiredFields.filter((field) => !hoursData[field]);
        if (missingFields.length > 0) {
          return NextResponse.json(
            { error: `Missing required fields: ${missingFields.join(", ")}` },
            { status: 400 }
          );
        }
        const updatedHours = await updateBarberHours(barberId, hoursData);
        if (!updatedHours) {
          return NextResponse.json(
            { error: "Barber not found or update failed" },
            { status: 404 }
          );
        }
        return NextResponse.json(
          { message: "Barber hours updated", hours: updatedHours },
          { status: 200 }
        );
      }

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("POST /api/barbers error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update barber information" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { action = "updateById", ...data } = body;

    switch (action) {
      case "updateById": {
        const { id, barberId, name, email } = data;
        if (!id || !barberId || !name || !email) {
          return NextResponse.json(
            { error: "ID, barber ID, name, and email are required" },
            { status: 400 }
          );
        }
        const updatedBarber = await updateBarber(id, barberId, name, email);
        if (!updatedBarber) {
          return NextResponse.json(
            { error: "Barber not found" },
            { status: 404 }
          );
        }
        return NextResponse.json(
          { message: "Barber updated", barber: updatedBarber },
          { status: 200 }
        );
      }

      case "updateByBarberId": {
        const { barberId, name, email } = data;
        if (!barberId) {
          return NextResponse.json(
            { error: "Barber ID is required" },
            { status: 400 }
          );
        }
        if (!name && !email) {
          return NextResponse.json(
            { error: "At least one field (name or email) is required" },
            { status: 400 }
          );
        }
        const updatedBarber = await updateBarberByBarberId(barberId, name, email);
        if (!updatedBarber) {
          return NextResponse.json(
            { error: "Barber not found" },
            { status: 404 }
          );
        }
        return NextResponse.json(
          { message: "Barber updated", barber: updatedBarber },
          { status: 200 }
        );
      }

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("PUT /api/barbers error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update barber information" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action") || "byId";

  try {
    switch (action) {
      case "byId": {
        const id = searchParams.get("id");
        if (!id) {
          return NextResponse.json(
            { error: "Barber ID is required" },
            { status: 400 }
          );
        }
        const deletedBarber = await deleteBarber(Number(id));
        if (!deletedBarber) {
          return NextResponse.json(
            { error: "Barber not found" },
            { status: 404 }
          );
        }
        return NextResponse.json(
          { message: "Barber deleted" },
          { status: 200 }
        );
      }

      case "byBarberId": {
        const barberId = searchParams.get("barberId");
        if (!barberId) {
          return NextResponse.json(
            { error: "Barber ID is required" },
            { status: 400 }
          );
        }
        const deletedBarber = await deleteBarberByBarberId(barberId);
        if (!deletedBarber) {
          return NextResponse.json(
            { error: "Barber not found" },
            { status: 404 }
          );
        }
        return NextResponse.json(
          { message: "Barber deleted" },
          { status: 200 }
        );
      }

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("DELETE /api/barbers error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete barber" },
      { status: 500 }
    );
  }
}