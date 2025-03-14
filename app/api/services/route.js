// app/api/services/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/database/mongodb";
import Service from "@/lib/database/models/serviceModel";

// GET all services
export async function GET() {
  try {
    await connectDB();
    const services = await Service.find();
    return NextResponse.json(services);
  } catch (err) {
    return NextResponse.json(
      { message: "Cannot find services", error: err.message },
      { status: 500 }
    );
  }
}

// POST - create new service
export async function POST(request) {
  try {
    await connectDB();
    const { serviceName, description, price } = await request.json();

    if (!serviceName || !description || !price) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const newService = new Service({
      serviceName,
      description,
      price,
    });

    const savedService = await newService.save();
    return NextResponse.json(
      {
        message: "Service created",
        service: savedService,
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Error creating service", error: err.message },
      { status: 500 }
    );
  }
}
