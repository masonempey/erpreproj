// app/api/reviews/route.js
import { NextResponse } from "next/server";
import { fetchReviewsFromGoogle, saveReviews } from "@/lib/services/reviewsService";

// GET reviews from Google Places API and save to database
export async function GET() {
  try {
    // Fetch reviews from Google Places
    const googleResponse = await fetchReviewsFromGoogle();

    // Map Google reviews to our schema
    const reviewsToSave = googleResponse.map(review => ({
      reviewId: review.author_name + "_" + review.time, // Generate a unique reviewId (improve this if needed)
      reviewDate: new Date(review.time * 1000), // Convert UNIX timestamp to Date
      review: review.text || "No review text",
      userId: review.author_name || "anonymous", // Map author_name to userId (adjust as needed)
    }));

    // Save reviews to the database
    const savedReviews = await saveReviews(reviewsToSave);

    // Return the saved reviews (or all fetched reviews if you prefer)
    return NextResponse.json({
      message: "Reviews fetched and saved successfully",
      reviews: savedReviews.length > 0 ? savedReviews : googleResponse,
    });
  } catch (error) {
    console.error(error.message);
    return NextResponse.json(
      { error: "Failed to fetch or save reviews", details: error.message },
      { status: 500 }
    );
  }
}