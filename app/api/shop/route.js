// app/api/shop/route.js
import { getShopInfo } from "@/lib/services/shopService";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const shopInfo = await getShopInfo();
    return NextResponse.json(shopInfo);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
