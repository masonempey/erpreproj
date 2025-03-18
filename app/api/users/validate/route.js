import { NextResponse } from "next/server";
import { getUserById } from "@/lib/services/userService";

export async function POST(request) {
  try {
    // Parse the request body
    const { uid } = await request.json();

    // Validate the UID
    if (!uid) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Check if the user exists
    const user = await getUserById(uid);

    // Return the response
    return NextResponse.json({ exists: !!user });
  } catch (error) {
    console.error("Error checking user:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*", // Allow all origins (or specify your React Native app's URL)
      "Access-Control-Allow-Methods": "POST, OPTIONS", // Allow only POST and OPTIONS
      "Access-Control-Allow-Headers": "Content-Type, Authorization", // Allow necessary headers
    },
  });
}