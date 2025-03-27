// app/api/barbers/[id]/route.js
import { NextResponse } from "next/server";
import {
  deleteBarberByBarberId,
  updateBarberByBarberId,
} from "@/lib/services/barberService";

// GET barber by barber_id
export async function GET(request, { params }) {
  try {
    const { id: barberId } = params; // Renamed from barberId to id in the route

    if (!barberId || typeof barberId !== "string") {
      return NextResponse.json(
        { error: "Invalid barber ID provided" },
        { status: 400 }
      );
    }

    // Get barber by barberId
    const barber = await getBarberById(barberId);

    if (!barber) {
      return NextResponse.json({ error: "Barber not found" }, { status: 404 });
    }

    return NextResponse.json(barber);
  } catch (error) {
    console.error("Error fetching barber:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE barber by barber_id
export async function DELETE(request, { params }) {
  try {
    const { id: barberId } = params; // Renamed from barberId to id in the route

    const deletedBarber = await deleteBarberByBarberId(barberId);
    if (deletedBarber) {
      return NextResponse.json({ message: "Barber Deleted" });
    } else {
      return NextResponse.json(
        {
          message: `Cannot delete barber, no barber found by id of ${barberId}`,
        },
        { status: 404 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      { message: "Error deleting barber", error: err.message },
      { status: 500 }
    );
  }
}

// UPDATE barber by barber_id
export async function PUT(request, { params }) {
  try {
    const { id: barberId } = params; // Renamed from barberId to id in the route
    const { name, email } = await request.json();

    // Checks for name or email in body
    if (!name && !email) {
      return NextResponse.json(
        { message: "At least one field is required to update" },
        { status: 400 }
      );
    }

    const updatedBarber = await updateBarberByBarberId(barberId, name, email);

    if (!updatedBarber) {
      return NextResponse.json(
        { message: "Barber not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Barber updated successfully",
      barber: updatedBarber,
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Error updating barber", error: err.message },
      { status: 500 }
    );
  }
}
