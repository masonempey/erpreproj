import { getRoleById, getRoleIdByUserId } from "@/lib/services/userService";
import { NextResponse } from "next/server";

export async function GET(request) {
    const {uid} = await request.json();
    console.log("user id", uid);
    try {
        const roleId = getRoleIdByUserId(uid)
        if (roleId) {
            const role = getRoleById(roleId);
            if(role)
                return NextResponse.json({role})
            else {
                return NextResponse.json({message: "role not found"}, {message: "404 NOT FOUND"})
            }
        } else {
            return NextResponse.json({message: "roleID not found"},{message: "404 NOT FOUND"})
        }
    } catch(error) {
        console.log("Error: " + error)
    }

}