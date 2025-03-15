// app/api/services/[serviceId]/route.js
import { NextResponse } from "next/server";
import { deleteService, updateService } from "@/lib/services/serviceService";

// DELETE service by id
export async function DELETE(request, { params }) {
  try {
    const { serviceId } = params;
    const id = Number(serviceId); // Convert to number to match database id type

    const deletedService = await deleteService(id);

    if (deletedService) {
      return NextResponse.json({ message: "Service Deleted" });
    } else {
      return NextResponse.json(
        {
          message: `Cannot delete service, no service found by id of ${serviceId}`,
        },
        { status: 404 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      { message: "Error deleting service", error: err.message },
      { status: 500 }
    );
  }
}

// UPDATE service by id
export async function PUT(request, { params }) {
  try {
    const { serviceId } = params;
    const id = Number(serviceId); // Convert to number to match database id type
    const { serviceName, description, price } = await request.json();

    // Checks for at least one field in the body
    if (!serviceName && !description && !price) {
      return NextResponse.json(
        { message: "At least one field is required to update" },
        { status: 400 }
      );
    }

    const updatedService = await updateService(id, serviceName, description, price);

    if (updatedService) {
      return NextResponse.json({
        message: "Service Updated",
        service: updatedService,
      });
    } else {
      return NextResponse.json(
        {
          message: `Cannot update service, no service found by id of ${serviceId}`,
        },
        { status: 404 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      { message: "Error updating service", error: err.message },
      { status: 500 }
    );
  }
}