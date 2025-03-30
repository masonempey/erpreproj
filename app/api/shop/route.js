/**
 * Consolidated API for all shop operations.
 * This file handles fetching and updating shop information and hours.
 */

import {
  getShopInfo,
  updateShopInfo,
  updateShopHours,
} from "@/lib/services/shopService";
import { NextResponse } from "next/server";

/**
 * GET request handler with query parameters for different operations:
 * /api/shop - get all shop information (default)
 * /api/shop?action=hours - get shop hours specifically
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    // Default action - get all shop info
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

/**
 * POST request handler for updating shop data:
 * Action types:
 * - updateInfo: updates shop basic information
 * - updateHours: updates shop operating hours
 */
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

/**
 * Get shop information
 */
async function getShopInfoHandler() {
  const shopInfo = await getShopInfo();
  return NextResponse.json(shopInfo);
}

/**
 * Get shop hours specifically
 */
async function getShopHoursHandler() {
  const shopInfo = await getShopInfo();

  // Extract only hours-related fields
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

/**
 * Update shop information
 */
async function updateShopInfoHandler(data) {
  const result = await updateShopInfo(data);
  return NextResponse.json({ success: true, updated: result }, { status: 200 });
}

/**
 * Update shop hours
 */
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

  const result = await updateShopHours(data);
  return NextResponse.json({ success: true, updated: result }, { status: 200 });
}
