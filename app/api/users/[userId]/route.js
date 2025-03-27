// app/api/users/[userId]/route.js
import { NextResponse } from "next/server";
import { getUserById, updateUser } from "@/lib/services/userService";

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

export async function PATCH(request, { params }) {
  try {
    const { userId } = params;
    const userFound = await getUserById(userId);

    if (userFound) {
      const userData = await request.json();
      console.log("User found:", userFound);
      console.log("Request body (parsed):", userData);

      const updatedUser = await updateUser(userId, userData);
      return NextResponse.json(updatedUser);
    } else {
      return NextResponse.json(
        { message: `User with userId ${userId} not found` },
        { status: 404 }
      );
    }
  } catch (err) {
    console.error("Error updating user:", err);
    return NextResponse.json(
      { message: "Error updating user", error: err.message },
      { status: 500 }
    );
  }
}
