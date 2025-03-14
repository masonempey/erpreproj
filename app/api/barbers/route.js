// // app/api/barbers/route.js
// import { NextResponse } from "next/server";
// import { v4 as uuidv4 } from "uuid";
// import connectDB from "@/lib/database/mongodb";
// import Barber from "@/lib/database/models/barberModel";

// // GET all barbers
// export async function GET() {
//   try {
//     await connectDB();
//     const barbers = await Barber.find();
//     return NextResponse.json(barbers);
//   } catch (err) {
//     return NextResponse.json(
//       { message: "Cannot find barbers", error: err.message },
//       { status: 500 }
//     );
//   }
// }

// // POST - create new barber
// export async function POST(request) {
//   try {
//     await connectDB();
//     const { name, email } = await request.json();

//     if (!name || !email) {
//       return NextResponse.json(
//         { message: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     const newBarber = new Barber({
//       barberId: uuidv4(),
//       name,
//       email,
//     });

//     const savedBarber = await newBarber.save();
//     return NextResponse.json(
//       {
//         message: "Barber created",
//         barber: savedBarber,
//       },
//       { status: 201 }
//     );
//   } catch (err) {
//     return NextResponse.json(
//       { message: "Error creating barber", error: err.message },
//       { status: 500 }
//     );
//   }
// }
