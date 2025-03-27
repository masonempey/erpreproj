// app/api/users/[userId]/route.js
import { NextResponse } from "next/server";
import { getUserById, updateUser } from "@/lib/services/userService";

// GET user by userId
export async function GET(request, { params }) {
  try {
    const { userId } = params;
    const userFound = await getUserById(userId);

    if (userFound) {
      return NextResponse.json(userFound);
    } else {
      return NextResponse.json(
        { message: `User with userId ${userId} not found` },
        { status: 404 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      { message: "Error fetching user", error: err.message },
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
