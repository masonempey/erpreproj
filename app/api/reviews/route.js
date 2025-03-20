// app/api/reviews/route.js
import { NextResponse } from "next/server";
import { fetchReviewsFromGoogle, saveReviews, getAllReviews } from "@/lib/services/reviewsService";

// GET reviews from Google Places API, save to database, and return all reviews
export async function GET() {
  try {
    // Fetch reviews from Google Places
    const googleResponse = await fetchReviewsFromGoogle();

    // Map Google reviews to our schema

    // Map transforms each review in googleResponse into a new object with fields matching the database schema
    // googleResponse.map iterates over the array, and for each review, creates an object with reviewId, reviewDate, etc.
    // googleResponse is the array being iterated over.
    const reviewsToSave = googleResponse.map(review => ({
      reviewId: review.author_name + "_" + review.time,
      reviewDate: new Date(review.time * 1000),
      review: review.text || "No review text",
      userId: null,
      rating: review.rating,
      profilePhotoUrl: review.profile_photo_url,
    }));

    // Save reviews to the database
    await saveReviews(reviewsToSave);

    // Fetch all reviews from the database
    const allReviews = await getAllReviews();

    // Return the database reviews
    return NextResponse.json({
      message: "Reviews fetched and saved successfully",
      reviews: allReviews,
    });
  } catch (error) {
    console.error(error.message);
    return NextResponse.json(
      { error: "Failed to fetch or save reviews", details: error.message },
      { status: 500 }
    );
  }
}