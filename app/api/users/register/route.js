// app/api/users/register/route.js
import { getUserByEmail, getDefaultRoleId, createUser } from "@/lib/services/userService";
import adminInstance from "@/lib/firebase/admin";

export async function POST(request) {
  try {
    const { email, password, phoneNumber } = await request.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (phoneNumber && !/^\d{10,15}$/.test(phoneNumber)) {
      return new Response(
        JSON.stringify({ message: "Invalid phone number" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    let firebaseUID;
    try {
      const firebaseUser = await adminInstance.auth().createUser({ email, password });
      firebaseUID = firebaseUser.uid;
    } catch (err) {
      console.error("Firebase error:", err);
      return new Response(
        JSON.stringify({ message: "Failed to create Firebase user", error: err.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    
    const roleId = await getDefaultRoleId();
    const newUser = await createUser(
      firebaseUID,
      email,
      roleId,
      phoneNumber || null
    );

    return new Response(
      JSON.stringify({ message: "User created successfully", user: newUser }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error in /register route:", err);
    return new Response(
      JSON.stringify({ message: "Error Creating User", error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
