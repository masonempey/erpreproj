// app/api/users/[userId]/coins/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/database/mongodb";
import User from "@/lib/database/models/userModel";

// PATCH - update user coins
export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const { userId } = params;
    const { coins } = await request.json();

    // Validate input
    if (typeof coins !== "number" || coins < 0) {
      return NextResponse.json(
        { error: "Invalid coins value" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findOneAndUpdate(
      { userId: userId },
      { $inc: { coins: coins } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating coins:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
