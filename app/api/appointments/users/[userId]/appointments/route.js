// // app/api/appointments/users/[userId]/appointments/route.js
// import { NextResponse } from "next/server";

// export async function GET(request, { params }) {
//   try {
//     await connectDB();
//     const { userId } = params;
//     console.log(`Fetching appointments for user ID: ${userId}`);

//     const appointments = await Appointment.find({ userId: userId });
//     console.log(`Appointments found: ${appointments.length}`);

//     if (appointments.length === 0) {
//       return NextResponse.json(
//         { message: "No appointments found for this user" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(appointments);
//   } catch (err) {
//     console.error("Error fetching appointments:", err);
//     return NextResponse.json(
//       {
//         error:
//           "Error occurred while attempting to find appointments for the user",
//       },
//       { status: 500 }
//     );
//   }
// }
