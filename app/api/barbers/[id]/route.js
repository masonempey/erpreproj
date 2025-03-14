// // app/api/barbers/[barberId]/route.js
// import { NextResponse } from "next/server";
// import connectDB from "@/lib/database/mongodb";
// import Barber from "@/lib/database/models/barberModel";

// // DELETE barber by id
// export async function DELETE(request, { params }) {
//   try {
//     await connectDB();
//     const { barberId } = params;

//     const foundBarber = await Barber.findByIdAndDelete(barberId);
//     if (foundBarber) {
//       return NextResponse.json({ message: "Barber Deleted" });
//     } else {
//       return NextResponse.json(
//         {
//           message: `Cannot delete barber, no barber found by id of ${barberId}`,
//         },
//         { status: 404 }
//       );
//     }
//   } catch (err) {
//     return NextResponse.json(
//       { message: "Error deleting barber", error: err.message },
//       { status: 500 }
//     );
//   }
// }

// // UPDATE barber by id
// export async function PUT(request, { params }) {
//   try {
//     await connectDB();
//     const { barberId } = params;
//     const { name, email } = await request.json();

//     // Checks for name or email in body
//     if (!name && !email) {
//       return NextResponse.json(
//         { message: "At least one field is required to update" },
//         { status: 400 }
//       );
//     }

//     // Updates the barber in mongodb using its id
//     const updatedBarber = await Barber.findByIdAndUpdate(
//       barberId,
//       { $set: { name, email } },
//       { new: true, useFindAndModify: false }
//     );

//     if (!updatedBarber) {
//       return NextResponse.json(
//         { message: "Barber not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       message: "Barber updated successfully",
//       barber: updatedBarber,
//     });
//   } catch (err) {
//     return NextResponse.json(
//       { message: "Error updating barber", error: err.message },
//       { status: 500 }
//     );
//   }
// }
