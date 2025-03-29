/**
 * Consolidated API for all review operations.
 * This file handles fetching, creating, and retrieving review data.
 */

// Import NextResponse for creating HTTP responses in Next.js API routes
import { NextResponse } from "next/server";

// Import the review service functions to fetch, save, and retrieve reviews
import {
  fetchReviewsFromGoogle,
  saveReviews,
  getAllReviews,
} from "@/lib/services/reviewsService";

/**
 * GET request handler with query parameters for different operations:
 * /api/reviews - get all reviews (default: fetches from Google, saves to DB, returns all)
 * /api/reviews?action=google - fetch from Google, save to DB, return all
 * /api/reviews?action=all - just return all reviews without fetching from Google
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    // Default action - fetch from Google, save, and return all reviews
    if (!action) {
      return await fetchGoogleAndAllReviewsHandler();
    }

    switch (action) {
      case "google":
        return await fetchGoogleAndAllReviewsHandler();

      case "all":
        return await getAllReviewsHandler();

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    // If an error occurs (e.g., Google API failure, database error), log it and return an error response
    console.error(error.message);
    return NextResponse.json(
      { error: "Failed to fetch or save reviews", details: error.message },
      { status: 500 } // 500 Internal Server Error
    );
  }
}

// Helper functions

/**
 * Fetch reviews from Google Places, save them to the database, and return all reviews
 * This is the default operation and main functionality of the reviews API
 */
async function fetchGoogleAndAllReviewsHandler() {
  // Fetch reviews from Google Places API
  // fetchReviewsFromGoogle makes an HTTP request to Google and returns an array of reviews
  const googleResponse = await fetchReviewsFromGoogle();

  // Map the Google Places reviews to the format expected by the database
  // googleResponse.map transforms each review into an object with fields matching the reviews table schema
  const reviewsToSave = googleResponse.map((review) => ({
    reviewId: review.author_name + "_" + review.time, // Create a unique reviewId by combining author_name and time
    reviewDate: new Date(review.time * 1000), // Convert UNIX timestamp (seconds) to a JavaScript Date object (milliseconds)
    review: review.text || "No review text", // Use the review text, or a default if none exists
    userId: null, // Set to null since Google reviewers aren't registered users in our system
    rating: review.rating, // Use the rating from Google (e.g., 5 for 5 stars)
    profilePhotoUrl: review.profile_photo_url, // Use the profile picture URL from Google
    authorName: review.author_name, // Add the author's name for the database (e.g., "Celso ervin Luis")
  }));

  // Save the mapped reviews to the database
  // saveReviews loops through each review and calls saveReview to insert or retrieve it
  await saveReviews(reviewsToSave);

  // Fetch all reviews from the database
  // getAllReviews retrieves all reviews in the database, sorted by review_date (newest first)
  const allReviews = await getAllReviews();

  // Return a JSON response with the saved reviews
  // NextResponse.json creates a 200 OK response with the specified JSON body
  return NextResponse.json({
    message: "Reviews fetched and saved successfully",
    reviews: allReviews,
  });
}

/**
 * Retrieve all reviews from the database without fetching from Google
 */
async function getAllReviewsHandler() {
  // Fetch all reviews from the database
  const allReviews = await getAllReviews();

  return NextResponse.json({
    reviews: allReviews,
  });
}
