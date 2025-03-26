// app/api/users/route.js
import { NextResponse } from "next/server";
import { getAllUsers, getUserByEmail, updateUserRole } from "@/lib/services/userService";
// GET all users
export async function GET() {
  try {
    const users = await getAllUsers();
    return NextResponse.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    return NextResponse.json(
      { message: "Error Fetching Users", error: err.message },
      { status: 500 }
    );
  }
}

// Check user existence
export async function POST(request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await getUserByEmail(email);
    return NextResponse.json({ 
      exists: true,
      user_id: user.user_id,
      current_role: user.role_id
    });
  } catch (err) {
    if (err.message === "User not found") {
      return NextResponse.json({ exists: false });
    }
    return NextResponse.json(
      { error: "Error checking user" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { email } = await request.json();
    
    // Barber role ID (make sure this matches your database)
    const barberRoleId = 3; 
    
    const updatedUser = await updateUserRole(email, barberRoleId);
    
    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
