// app/api/shop/route.js
import { getShopInfo, updateShopInfo, updateShopHours } from "@/lib/services/shopService";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const shopInfo = await getShopInfo();
    return NextResponse.json(shopInfo);
  } catch (error) {
    console.error('Error fetching shop info:', error);
    return NextResponse.json(
      { error: "Failed to fetch shop information" },
      { status: 500 }
    );
  }
}

// Update shop information
export async function PUT(request) {
  try {
    const body = await request.json();
    if (!body) {
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 }
      );
    }

    const result = await updateShopInfo(body);
    return NextResponse.json(
      { success: true, updated: result },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating shop info:', error);
    return NextResponse.json(
      { error: error.message || "Failed to update shop information" },
      { status: 500 }
    );
  }
}

// Update shop hours
export async function POST(request) {
  try {
    const body = await request.json();
    if (!body) {
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 }
      );
    }

    // Validate required fields
    const requiredFields = [
      'monday_open', 'monday_close',
      'tuesday_open', 'tuesday_close',
      // Add all other required day fields
    ];
    
    const missingFields = requiredFields.filter(field => !body[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    const result = await updateShopHours(body);
    return NextResponse.json(
      { success: true, updated: result },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating shop hours:', error);
    return NextResponse.json(
      { error: error.message || "Failed to update shop hours" },
      { status: 500 }
    );
  }
}