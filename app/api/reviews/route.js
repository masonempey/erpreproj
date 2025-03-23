// app/api/reviews/route.js

// Import NextResponse for creating HTTP responses in Next.js API routes
import { NextResponse } from "next/server";

// Import the review service functions to fetch, save, and retrieve reviews
import { fetchReviewsFromGoogle, saveReviews, getAllReviews } from "@/lib/services/reviewsService";

// GET handler for the /api/reviews endpoint
// Fetches reviews from Google Places, saves them to the database, and returns all reviews
// 'async' keyword allows the use of 'await' for asynchronous operations like API calls and database queries
export async function GET() {
  try {
    // Fetch reviews from Google Places API
    // fetchReviewsFromGoogle makes an HTTP request to Google and returns an array of reviews
    const googleResponse = await fetchReviewsFromGoogle();

    // Map the Google Places reviews to the format expected by the database
    // googleResponse.map transforms each review into an object with fields matching the reviews table schema
    const reviewsToSave = googleResponse.map(review => ({
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
  } catch (error) {
    // If an error occurs (e.g., Google API failure, database error), log it and return an error response
    console.error(error.message);
    return NextResponse.json(
      { error: "Failed to fetch or save reviews", details: error.message },
      { status: 500 } // 500 Internal Server Error
    );
  }
}