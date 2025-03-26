import { getBarberUsers } from "@/lib/services/userService";
import { NextResponse } from "next/server";

// GET all users with barber roles
export async function GET() {
  try {
    const barbers = await getBarberUsers();
    return NextResponse.json(barbers);
  } catch (err) {
    console.error("GET /api/users error:", err);
    return NextResponse.json(
      { error: err.message.includes("barbers") ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}