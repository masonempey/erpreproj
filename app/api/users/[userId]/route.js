// app/api/users/[userId]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/database/mongodb";
import User from "@/lib/database/models/userModel";

// GET user by userId
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { userId } = params;
    const userFound = await User.findOne({ userId: userId });

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

// DELETE user by ID
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { userId } = params;
    const userFound = await User.findByIdAndDelete(userId);

    if (userFound) {
      return NextResponse.json({
        message: "User deleted successfully",
        user: userFound,
      });
    } else {
      return NextResponse.json(
        { message: `User with id ${userId} not found` },
        { status: 404 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      { message: "Error deleting user", error: err.message },
      { status: 500 }
    );
  }
}
