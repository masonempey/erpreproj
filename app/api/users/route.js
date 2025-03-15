// app/api/users/route.js
import { NextResponse } from "next/server";

// GET all users
export async function GET() {
  try {
    await connectDB();
    const users = await User.find();
    return NextResponse.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    return NextResponse.json(
      { message: "Error Fetching Users", error: err.message },
      { status: 500 }
    );
  }
}

// POST - check if user exists (validate)
export async function POST(request) {
  try {
    await connectDB();
    const { uid } = await request.json();
    const user = await User.findOne({ userId: uid });
    return NextResponse.json({ exists: !!user });
  } catch (error) {
    console.error("Error checking user:", error);
    return NextResponse.json(
      { message: "Error checking user", error: error.message },
      { status: 500 }
    );
  }
}
