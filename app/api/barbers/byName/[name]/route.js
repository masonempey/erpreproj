// app/api/barbers/[name]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/database/mongodb";
import Barber from "@/lib/database/models/barberModel";

// GET barber by name
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { name } = params;

    const foundBarber = await Barber.findOne({ name: name });
    if (foundBarber) {
      return NextResponse.json(foundBarber);
    } else {
      return NextResponse.json(
        { message: "Barber not found" },
        { status: 404 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      { message: "Error finding barber", error: err.message },
      { status: 500 }
    );
  }
}
