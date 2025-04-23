/**
 * Consolidated API for all service operations.
 * Handles service creation, updates, deletion, and barber-specific service management.
 */

import { NextResponse } from "next/server";
import {
  getAllServices,
  createService,
  updateService,
  deleteService,
  getServiceById,
  getAvailableServices,
  getBarberServices,
  addBarberService,
  updateBarberService,
} from "@/lib/services/serviceService";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (!action) {
      return await getAllServicesHandler();
    }

    switch (action) {
      case "byId": {
        const id = searchParams.get("id");
        if (!id) {
          return NextResponse.json(
            { error: "Service ID is required" },
            { status: 400 }
          );
        }
        return await getServiceByIdHandler(Number(id));
      }
      case "available": {
        const barberId = searchParams.get("barberId");
        if (!barberId) {
          return NextResponse.json(
            { error: "Barber ID is required" },
            { status: 400 }
          );
        }
        const services = await getAvailableServices(barberId);
        return NextResponse.json(services);
      }
      case "barberServices": {
        const barberId = searchParams.get("barberId");
        if (!barberId) {
          return NextResponse.json(
            { error: "Barber ID is required" },
            { status: 400 }
          );
        }
        const services = await getBarberServices(barberId);
        return NextResponse.json(services);
      }
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("GET /api/services error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action = "create", ...data } = body;

    switch (action) {
      case "create":
        return await createServiceHandler(data);
      case "addBarberService": {
        const { barberId, serviceId, price, durationMinutes } = data;
        if (!barberId || !serviceId || price === undefined || !durationMinutes) {
          return NextResponse.json(
            { error: "Barber ID, service ID, price, and duration are required" },
            { status: 400 }
          );
        }
        const newBarberService = await addBarberService(barberId, serviceId, price, durationMinutes);
        return NextResponse.json(
          { message: "Barber service added", barberService: newBarberService },
          { status: 201 }
        );
      }
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("POST /api/services error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { action = "update", ...data } = body;

    switch (action) {
      case "update":
        return await updateServiceHandler(data);
      case "updateBarberService": {
        const { barberId, serviceId, price, durationMinutes } = data;
        if (!barberId || !serviceId) {
          return NextResponse.json(
            { error: "Barber ID and service ID are required" },
            { status: 400 }
          );
        }
        if (price === undefined && durationMinutes === undefined) {
          return NextResponse.json(
            { error: "At least one field (price or duration) is required" },
            { status: 400 }
          );
        }
        const updatedBarberService = await updateBarberService(barberId, serviceId, price, durationMinutes);
        if (!updatedBarberService) {
          return NextResponse.json(
            { error: "Barber service not found" },
            { status: 404 }
          );
        }
        return NextResponse.json(
          { message: "Barber service updated", barberService: updatedBarberService },
          { status: 200 }
        );
      }
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("PUT /api/services error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "Valid service ID is required" },
        { status: 400 }
      );
    }

    return await deleteServiceHandler(Number(id));
  } catch (error) {
    console.error("DELETE /api/services error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete service" },
      { status: 500 }
    );
  }
}

// Helper functions
async function getAllServicesHandler() {
  const services = await getAllServices();
  return NextResponse.json(services);
}

async function getServiceByIdHandler(id) {
  const service = await getServiceById(id);
  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }
  return NextResponse.json(service);
}

async function createServiceHandler(data) {
  const { serviceName, description, price, durationMinutes } = data;

  if (!serviceName || !description || price === undefined || !durationMinutes) {
    return NextResponse.json(
      { error: "Service name, description, price, and duration are required" },
      { status: 400 }
    );
  }

  const savedService = await createService(
    serviceName,
    description,
    price,
    durationMinutes
  );

  return NextResponse.json(
    {
      message: "Service created",
      service: savedService,
    },
    { status: 201 }
  );
}

async function updateServiceHandler(data) {
  const { id, serviceName, description, price, durationMinutes } = data;

  if (!id || isNaN(Number(id))) {
    return NextResponse.json(
      { error: "Valid service ID is required" },
      { status: 400 }
    );
  }

  if (!serviceName && !description && price === undefined && durationMinutes === undefined) {
    return NextResponse.json(
      { error: "At least one field is required to update" },
      { status: 400 }
    );
  }

  const updatedService = await updateService(
    Number(id),
    serviceName,
    description,
    price,
    durationMinutes
  );

  if (!updatedService) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  return NextResponse.json({
    message: "Service updated",
    service: updatedService,
  });
}

async function deleteServiceHandler(id) {
  const deletedService = await deleteService(id);
  if (!deletedService) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Service deleted successfully" });
}