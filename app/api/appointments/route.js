// app/api/appointments/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/database/mongodb";
import Appointment from "@/lib/database/models/appointmentModel";
import User from "@/lib/database/models/userModel";
import Service from "@/lib/database/models/serviceModel";
import { sendConfirmationEmail, sendNewsletter } from "@/lib/services/email";

// GET all appointments
export async function GET() {
  try {
    await connectDB();
    const appointments = await Appointment.find();

    if (!appointments || appointments.length === 0) {
      return NextResponse.json(
        { message: "Could not find any appointments" },
        { status: 400 }
      );
    }

    return NextResponse.json(appointments);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    return NextResponse.json(
      { error: "Error occurred while attempting to find all appointments" },
      { status: 500 }
    );
  }
}

// Create new appointment
export async function POST(request) {
  try {
    await connectDB();
    const {
      customerName,
      email,
      barberName,
      date,
      time,
      userId,
      barberId,
      serviceType,
      guestDetails,
    } = await request.json();

    console.log("Request payload:", {
      customerName,
      email,
      barberName,
      date,
      time,
      userId,
      barberId,
      serviceType,
      guestDetails,
    });

    if (!barberName || !date || !time || !barberId || !serviceType) {
      console.log("Missing required fields");
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const service = await Service.findOne({ serviceName: serviceType });
    if (!service) {
      return NextResponse.json(
        { message: "Service not found" },
        { status: 400 }
      );
    }

    // Combine date and time
    const dateTime = new Date(date);
    const [timeHour, timeMinute] = time.split(/[: ]/);
    let hour = parseInt(timeHour);
    if (time.includes("PM") && hour !== 12) {
      hour += 12;
    } else if (time.includes("AM") && hour === 12) {
      hour = 0;
    }
    dateTime.setUTCHours(hour);
    dateTime.setUTCMinutes(parseInt(timeMinute));

    // Create a new appointment object
    const newAppointment = new Appointment({
      customerName,
      barberName,
      date: dateTime,
      userId,
      barberId,
      services: [service._id],
      guestDetails,
    });

    const appointmentCreated = await newAppointment.save();

    if (userId) {
      try {
        await User.findOneAndUpdate(
          { userId: userId },
          { $push: { appointments: appointmentCreated._id } },
          { new: true, useFindAndModify: false }
        );
      } catch (err) {
        console.error("Error finding user to insert appointment:", err);
      }
    }

    try {
      const confirmationAppointment = {
        customerName: customerName,
        email: email,
        barberName: barberName,
        date: dateTime,
        serviceType: serviceType,
        guestDetails: guestDetails,
      };
      await sendConfirmationEmail(confirmationAppointment);
      const newsLetterData = {
        recipientEmail: email,
        customerName: customerName,
      };
      await sendNewsletter(newsLetterData);
      console.log("Confirmation email sent successfully");
    } catch (emailErr) {
      console.error("Error sending confirmation email:", emailErr);
    }

    return NextResponse.json({
      message: "Appointment created",
      appointment: appointmentCreated,
    });
  } catch (err) {
    console.error("Error creating appointment:", err);
    return NextResponse.json(
      { error: "Error occurred while attempting to create an appointment" },
      { status: 500 }
    );
  }
}
