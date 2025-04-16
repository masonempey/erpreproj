/**
 * Consolidated API for all barber operations.
 * This file replaces multiple separate barber API endpoints with a single, parameter-driven API.
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
} from "@/lib/services/barberService";

/**
 * GET request handler with query parameters for different operations:
 * /api/barbers - get all barbers
 * /api/barbers?action=byId&id=barber1 - get barber by ID
 * /api/barbers?action=byName&name=John - get barber by name
 * /api/barbers?action=appointments&barberId=barber1&date=2023-11-01 - get barber appointments by date
 * /api/barbers?action=services&barberId=barber1 - get services offered by barber
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    // Default action - get all barbers
    if (!action) {
      return await getAllBarbersHandler();
    }

    switch (action) {
      case "byId": {
        const id = searchParams.get("id");
        if (!id) {
          return NextResponse.json(
            { error: "Barber ID is required" },
            { status: 400 }
          );
        }
        return await getBarberByIdHandler(id);
      }
      case "byName": {
        const name = searchParams.get("name");
        if (!name) {
          return NextResponse.json(
            { error: "Name is required" },
            { status: 400 }
          );
        }
        return await getBarberByNameHandler(name);
      }
      case "services": {
        const barberId = searchParams.get("barberId");
        if (!barberId) {
          return NextResponse.json(
            { error: "Barber ID is required" },
            { status: 400 }
          );
        }
        return await getBarberServicesHandler(barberId);
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
        return await getBarberAppointmentsHandler(barberId, date);
      }
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("GET /api/barbers error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}

/**
 * POST request handler for creating a barber
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { action = "create", ...data } = body;

    switch (action) {
      case "create":
        return await createBarberHandler(data);
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("POST /api/barbers error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create barber" },
      { status: 500 }
    );
  }
}

/**
 * PUT request handler for updating a barber
 */
export async function PUT(request) {
  try {
    const body = await request.json();
    const { action = "updateById", ...data } = body;

    switch (action) {
      case "updateById":
        return await updateBarberByIdHandler(data);
      case "updateByBarberId":
        return await updateBarberByBarberIdHandler(data);
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("PUT /api/barbers error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update barber" },
      { status: 500 }
    );
  }
}

/**
 * DELETE request handler for removing a barber
 */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") || "byId";

    switch (action) {
      case "byId": {
        const id = Number(searchParams.get("id"));
        if (!id) {
          return NextResponse.json(
            { error: "Barber ID is required" },
            { status: 400 }
          );
        }
        return await deleteBarberByIdHandler(id);
      }
      case "byBarberId": {
        const barberId = searchParams.get("barberId");
        if (!barberId) {
          return NextResponse.json(
            { error: "Barber ID is required" },
            { status: 400 }
          );
        }
        return await deleteBarberByBarberIdHandler(barberId);
      }
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
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

async function getBarberServicesHandler(barberId) {
  try {
    const services = await getServicesByBarberId(barberId);
    return NextResponse.json(services);
  } catch (error) {
    throw new Error(`Failed to fetch barber services: ${error.message}`);
  }
}

// Helper functions
async function getAllBarbersHandler() {
  const barbers = await getAllBarbers();
  return NextResponse.json(barbers);
}

async function getBarberByIdHandler(barberId) {
  const barber = await getBarberById(barberId);

  if (!barber) {
    return NextResponse.json({ error: "Barber not found" }, { status: 404 });
  }

  return NextResponse.json(barber);
}

async function getBarberByNameHandler(name) {
  const barber = await getBarberByName(name);

  if (!barber) {
    return NextResponse.json({ error: "Barber not found" }, { status: 404 });
  }

  return NextResponse.json(barber);
}

async function getBarberAppointmentsHandler(barberId, dateString) {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    const appointments = await getAppointmentsForBarberByDate(barberId, date);
    return NextResponse.json(appointments);
  } catch (error) {
    throw new Error(`Failed to fetch barber appointments: ${error.message}`);
  }
}

async function createBarberHandler(data) {
  const { barberId, name, email } = data;

  if (!barberId || !name || !email) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  const newBarber = await createBarber(barberId, name, email);

  return NextResponse.json(
    { message: "Barber created", barber: newBarber },
    { status: 201 }
  );
}

async function updateBarberByIdHandler(data) {
  const { id, barberId, name, email } = data;

  if (!id || !barberId || !name || !email) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  const updatedBarber = await updateBarber(id, barberId, name, email);

  if (!updatedBarber) {
    return NextResponse.json({ error: "Barber not found" }, { status: 404 });
  }

  return NextResponse.json({
    message: "Barber updated",
    barber: updatedBarber,
  });
}

async function updateBarberByBarberIdHandler(data) {
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
    return NextResponse.json({ error: "Barber not found" }, { status: 404 });
  }

  return NextResponse.json({
    message: "Barber updated successfully",
    barber: updatedBarber,
  });
}

async function deleteBarberByIdHandler(id) {
  const deletedBarber = await deleteBarber(id);

  if (!deletedBarber) {
    return NextResponse.json({ error: "Barber not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Barber deleted successfully" });
}

async function deleteBarberByBarberIdHandler(barberId) {
  const deletedBarber = await deleteBarberByBarberId(barberId);

  if (!deletedBarber) {
    return NextResponse.json({ error: "Barber not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Barber deleted successfully" });
}
