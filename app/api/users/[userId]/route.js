// app/api/users/[userId]/route.js
import { NextResponse } from "next/server";
import { getUserById } from "@/lib/services/userService";

// get user by ID
export async function GET(request, { params }) {
  try {
    const { userId } = params;

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await getUserById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: `Failed to fetch user: ${error.message}` },
      { status: 500 }
    );
  }
}
