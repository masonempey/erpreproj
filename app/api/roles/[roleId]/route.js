import { NextResponse } from "next/server";
import { getRoleById } from "@/lib/services/userService";

export async function GET(request, { params }) {
  try {
    const { roleId } = params;

    if (!roleId) {
      return NextResponse.json(
        { message: "Role ID is required" },
        { status: 400 }
      );
    }

    const role = await getRoleById(roleId);

    if (!role) {
      return NextResponse.json({ message: "Role not found" }, { status: 404 });
    }

    return NextResponse.json(role);
  } catch (error) {
    console.error("Error fetching role:", error);
    return NextResponse.json(
      { message: `Failed to fetch role: ${error.message}` },
      { status: 500 }
    );
  }
}
