import {
  getShopInfo,
  updateShopInfo,
  updateShopHours,
} from "@/lib/services/shopService";
import { getAllBarbers, updateBarberHours } from "@/lib/services/barberService"; // Import barber services
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (!action) {
      return await getShopInfoHandler();
    }

    switch (action) {
      case "hours":
        return await getShopHoursHandler();
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("GET /api/shop error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch shop information" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action = "updateInfo", ...data } = body;

    if (!data) {
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 }
      );
    }

    switch (action) {
      case "updateInfo":
        return await updateShopInfoHandler(data);
      case "updateHours":
        return await updateShopHoursHandler(data);
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("POST /api/shop error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update shop information" },
      { status: 500 }
    );
  }
}

// Helper functions

async function getShopInfoHandler() {
  const shopInfo = await getShopInfo();
  return NextResponse.json(shopInfo);
}

async function getShopHoursHandler() {
  const shopInfo = await getShopInfo();
  const hoursFields = [
    "monday_open",
    "monday_close",
    "tuesday_open",
    "tuesday_close",
    "wednesday_open",
    "wednesday_close",
    "thursday_open",
    "thursday_close",
    "friday_open",
    "friday_close",
    "saturday_open",
    "saturday_close",
    "sunday_open",
    "sunday_close",
  ];

  const shopHours = {};
  hoursFields.forEach((field) => {
    if (field in shopInfo) {
      shopHours[field] = shopInfo[field];
    }
  });

  return NextResponse.json(shopHours);
}

async function updateShopInfoHandler(data) {
  const result = await updateShopInfo(data);
  return NextResponse.json({ success: true, updated: result }, { status: 200 });
}

async function updateShopHoursHandler(data) {
  // Validate required fields
  const requiredFields = [
    "monday_open",
    "monday_close",
    "tuesday_open",
    "tuesday_close",
    "wednesday_open",
    "wednesday_close",
    "thursday_open",
    "thursday_close",
    "friday_open",
    "friday_close",
    "saturday_open",
    "saturday_close",
    "sunday_open",
    "sunday_close",
  ];

  const missingFields = requiredFields.filter((field) => !data[field]);
  if (missingFields.length > 0) {
    return NextResponse.json(
      { error: `Missing required fields: ${missingFields.join(", ")}` },
      { status: 400 }
    );
  }

  // Fetch current shop hours to compare
  const currentShopInfo = await getShopInfo();
  const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  // Identify changed hours
  const changedDays = [];
  daysOfWeek.forEach((day) => {
    const openField = `${day}_open`;
    const closeField = `${day}_close`;
    if (
      data[openField] !== currentShopInfo[openField] ||
      data[closeField] !== currentShopInfo[closeField]
    ) {
      changedDays.push(day);
    }
  });

  // Update shop hours
  const result = await updateShopHours(data);

  // If hours changed, adjust barber hours
  if (changedDays.length > 0) {
    const barbers = await getAllBarbers();
    for (const barber of barbers) {
      const updatedHours = {};
      let needsUpdate = false;

      daysOfWeek.forEach((day) => {
        const capitalizedDay = day.charAt(0).toUpperCase() + day.slice(1);
        const barberStartField = `${capitalizedDay}_Start`;
        const barberEndField = `${capitalizedDay}_End`;
        const shopOpenField = `${day}_open`;
        const shopCloseField = `${day}_close`;

        let barberStart = barber[barberStartField]?.slice(0, 5) || "09:00";
        let barberEnd = barber[barberEndField]?.slice(0, 5) || "17:00";
        const shopOpen = data[shopOpenField].slice(0, 5);
        const shopClose = data[shopCloseField].slice(0, 5);

        // Adjust hours if they are outside new shop hours
        if (changedDays.includes(day)) {
          if (barberStart < shopOpen) {
            barberStart = shopOpen;
            needsUpdate = true;
          }
          if (barberEnd > shopClose) {
            barberEnd = shopClose;
            needsUpdate = true;
          }
          // Ensure end is after start
          if (barberStart >= barberEnd) {
            barberEnd = shopClose; // Fallback to shop close
            needsUpdate = true;
          }
        }

        updatedHours[barberStartField] = `${barberStart}:00`;
        updatedHours[barberEndField] = `${barberEnd}:00`;
      });

      if (needsUpdate) {
        await updateBarberHours(barber.barber_id, updatedHours);
      }
    }
  }

  return NextResponse.json(
    {
      success: true,
      updated: result,
      message: changedDays.length > 0 ? "Barber hours adjusted where necessary" : undefined,
    },
    { status: 200 }
  );
}