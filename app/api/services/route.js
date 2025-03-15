// app/api/services/route.js
import { NextResponse } from "next/server";
import { getAllServices, createService, updateService, deleteService } from "@/lib/services/serviceService";

// GET all services
export async function GET() {
  try {
    const services = await getAllServices();
    return NextResponse.json(services);
  } catch (err) {
    console.error("Service error:", err);
    return NextResponse.json(
      { message: "Cannot find services", error: err.message },
      { status: 500 }
    );
  }
}

// POST - create new service
export async function POST(request) {
  try {
    const { serviceName, description, price } = await request.json();

    if (!serviceName || !description || !price) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const savedService = await createService(serviceName, description, price);

    return NextResponse.json(
      {
        message: "Service created",
        service: savedService,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Service error:", err);
    return NextResponse.json(
      { message: "Error creating service", error: err.message },
      { status: 500 }
    );
  }
}

// PUT - update a service
export async function PUT(request) {
  try {
    const { id, serviceName, description, price } = await request.json();

    if (!id || !serviceName || !description || !price) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const updatedService = await updateService(
      Number(id), // Convert to number to match database id type
      serviceName,
      description,
      price
    );

    if (!updatedService) {
      return NextResponse.json(
        { message: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Service updated",
      service: updatedService,
    });
  } catch (err) {
    console.error("Service error:", err);
    return NextResponse.json(
      { message: "Error updating service", error: err.message },
      { status: 500 }
    );
  }
}

// DELETE - delete a service
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Service ID is required" },
        { status: 400 }
      );
    }

    const deletedService = await deleteService(Number(id)); // Convert to number

    if (!deletedService) {
      return NextResponse.json(
        { message: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Service deleted successfully",
    });
  } catch (err) {
    console.error("Service error:", err);
    return NextResponse.json(
      { message: "Error deleting service", error: err.message },
      { status: 500 }
    );
  }
}