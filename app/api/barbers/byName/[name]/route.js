// app/api/barbers/byName/[name]/route.js
import { NextResponse } from "next/server";
import { getBarberByName } from "@/lib/services/barberService";

// GET barber by name
export async function GET(request, { params }) {
  try {
    const { name } = params;

    const foundBarber = await getBarberByName(name);
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