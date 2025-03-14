// // app/api/reviews/route.js
// import { NextResponse } from "next/server";
// import axios from "axios";

// // GET reviews from Google Places API
// export async function GET() {
//   try {
//     const PLACE_ID = process.env.PLACE_ID;
//     const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

//     if (!PLACE_ID || !GOOGLE_PLACES_API_KEY) {
//       return NextResponse.json(
//         { error: "Missing required environment variables" },
//         { status: 500 }
//       );
//     }

//     const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews&key=${GOOGLE_PLACES_API_KEY}`;
//     const response = await axios.get(url);

//     return NextResponse.json(response.data);
//   } catch (error) {
//     console.error(error.response ? error.response.data : error.message);
//     return NextResponse.json(
//       { error: "Failed to fetch reviews" },
//       { status: 500 }
//     );
//   }
// }
