// app/api/appointments/[id]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/database/mongodb";
import Appointment from "@/lib/database/models/appointmentModel";

// GET appointment by ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return NextResponse.json(
        { message: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(appointment);
  } catch (err) {
    console.error("Error fetching appointment:", err);
    return NextResponse.json(
      { error: "Error occurred while fetching appointment" },
      { status: 500 }
    );
  }
}

// DELETE appointment by ID
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    console.log(`Attempting to delete appointment of ID: ${id}`);

    const appointment = await Appointment.findByIdAndDelete(id);

    if (!appointment) {
      return NextResponse.json(
        { message: "No appointment found with this ID" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Appointment Deleted successfully" });
  } catch (err) {
    console.error("Error deleting appointment:", err);
    return NextResponse.json(
      { error: "Error occurred while attempting to delete appointment" },
      { status: 500 }
    );
  }
}

// UPDATE appointment by ID
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const {
      customerName,
      barberName,
      date,
      time,
      userId,
      barberId,
      serviceType,
    } = await request.json();

    // Checks for at least one field in the body
    if (
      !customerName &&
      !barberName &&
      !date &&
      !time &&
      !userId &&
      !barberId &&
      !serviceType
    ) {
      return NextResponse.json(
        { message: "At least one field is required to update" },
        { status: 400 }
      );
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      {
        $set: {
          customerName,
          barberName,
          date,
          time,
          userId,
          barberId,
          serviceType,
        },
      },
      { new: true, useFindAndModify: false }
    );

    if (!updatedAppointment) {
      return NextResponse.json(
        { message: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Appointment updated successfully",
      appointment: updatedAppointment,
    });
  } catch (err) {
    console.error("Error updating appointment:", err);
    return NextResponse.json(
      { error: "Error occurred while updating appointment" },
      { status: 500 }
    );
  }
}
