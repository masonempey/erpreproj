// app/api/users/googleregister/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/database/mongodb";
import User from "@/lib/database/models/userModel";
import Role from "@/lib/database/models/roleModel";

// POST - register Google user
export async function POST(request) {
  try {
    await connectDB();
    const { email, uid, name, phoneNumber } = await request.json();

    if (!email || !uid || !name) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Create new user in MongoDB
    const defaultRole = await Role.findOne({ roleType: "Customer" });
    const newUser = new User({
      userId: uid,
      email,
      name,
      coins: 0,
      lastLogin: new Date(),
      roleId: defaultRole ? defaultRole._id : null,
      phoneNumber: phoneNumber || "",
    });

    await newUser.save();
    return NextResponse.json({
      message: "User successfully registered",
      user: newUser,
    });
  } catch (err) {
    console.error("Error in googleregister route:", err);
    return NextResponse.json(
      { message: "Error Creating User", error: err.message },
      { status: 500 }
    );
  }
}
