// app/api/barbers/route.js

import { NextResponse } from "next/server";
import {
  getAllBarbers,
  createBarber,
  updateBarber,
  deleteBarber,
} from "../../..//lib/services/barberService";

// GET all barbers
export async function GET() {
  try {
    const barbers = await getAllBarbers();
    return NextResponse.json(barbers);
  } catch (err) {
    console.error("Barber service error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// POST - create a new barber
export async function POST(request) {
  try {
    const { barberId, name, email } = await request.json();
    if (!barberId || !name || !email) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }
    const newBarber = await createBarber(barberId, name, email);
    return NextResponse.json(
      { message: "Barber created", barber: newBarber },
      { status: 201 }
    );
  } catch (err) {
    console.error("Barber service error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// PUT - update a barber
export async function PUT(request) {
  try {
    const { id, barberId, name, email } = await request.json();
    if (!id || !barberId || !name || !email) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }
    const updatedBarber = await updateBarber(id, barberId, name, email);
    if (!updatedBarber) {
      return NextResponse.json(
        { message: "Barber not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      message: "Barber updated",
      barber: updatedBarber,
    });
  } catch (err) {
    console.error("Barber service error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// DELETE - delete a barber
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));
    if (!id) {
      return NextResponse.json(
        { message: "Barber ID is required" },
        { status: 400 }
      );
    }
    const deletedBarber = await deleteBarber(id);
    if (!deletedBarber) {
      return NextResponse.json(
        { message: "Barber not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Barber deleted successfully" });
  } catch (err) {
    console.error("Barber service error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
