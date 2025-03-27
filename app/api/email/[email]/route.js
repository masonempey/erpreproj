import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/services/userService";
// GET /api/users/[email] - Get user details
export async function GET(request, { params }) {
    try {
      const { email } = params;
      
      if (!email) {
        return NextResponse.json(
          { error: "Email parameter is required" },
          { status: 400 }
        );
      }
  
      const user = await getUserByEmail(decodeURIComponent(email));
      
      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }
  
      // Return safe user data without sensitive fields
      const { password_hash, reset_token, ...safeUserData } = user;
      return NextResponse.json(safeUserData);
    } catch (error) {
      console.error("Error fetching user:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }