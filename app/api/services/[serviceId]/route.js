// app/api/services/[serviceId]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/database/mongodb";
import Service from "@/lib/database/models/serviceModel";

// DELETE service by id
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { serviceId } = params;
    const service = await Service.findByIdAndDelete(serviceId);

    if (service) {
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
    await connectDB();
    const { serviceId } = params;
    const { serviceName, description, price } = await request.json();

    // Checks for at least one field in the body
    if (!serviceName && !description && !price) {
      return NextResponse.json(
        { message: "At least one field is required to update" },
        { status: 400 }
      );
    }

    const updatedService = await Service.findByIdAndUpdate(
      serviceId,
      {
        $set: {
          serviceName,
          description,
          price,
        },
      },
      { new: true }
    );

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
