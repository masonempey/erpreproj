/**
 * Consolidated API for all service operations.
 * This file replaces multiple separate service API endpoints with a single, parameter-driven API.
 */

import { NextResponse } from "next/server";
import {
  getAllServices,
  createService,
  updateService,
  deleteService,
  getServiceById,
} from "@/lib/services/serviceService";

/**
 * GET request handler with query parameters for different operations:
 * /api/services - get all services
 * /api/services?action=byId&id=123 - get service by ID
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    // Default action - get all services
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

/**
 * POST request handler for creating a service
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { action = "create", ...data } = body;

    switch (action) {
      case "create":
        return await createServiceHandler(data);
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("POST /api/services error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create service" },
      { status: 500 }
    );
  }
}

/**
 * PUT request handler for updating a service
 */
export async function PUT(request) {
  try {
    const body = await request.json();
    const { action = "update", ...data } = body;

    switch (action) {
      case "update":
        return await updateServiceHandler(data);
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("PUT /api/services error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update service" },
      { status: 500 }
    );
  }
}

/**
 * DELETE request handler for removing a service
 */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Service ID is required" },
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
  const { serviceName, description, price, duration_minutes } = data;

  if (!serviceName || !description || !price) {
    return NextResponse.json(
      { error: "Service name, description, and price are required" },
      { status: 400 }
    );
  }

  // Ensure duration_minutes is a number
  const duration = parseInt(duration_minutes, 10) || 45;

  const savedService = await createService(
    serviceName,
    description,
    price,
    duration
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
  const { id, serviceName, description, price, duration_minutes } = data;

  if (!id) {
    return NextResponse.json(
      { error: "Service ID is required" },
      { status: 400 }
    );
  }

  if (!serviceName && !description && !price && !duration_minutes) {
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
    duration_minutes
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
