// app/api/users/[userId]/route.js
import { NextResponse } from "next/server";
import { getUserById } from "@/lib/services/userService";

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
