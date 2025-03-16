// lib/services/reviewsService.js
import { pool } from "@/lib/database/index";
import axios from "axios";

// Fetch reviews from Google Places API
export async function fetchReviewsFromGoogle() {
  try {
    const PLACE_ID = process.env.PLACE_ID;
    const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

    if (!PLACE_ID || !GOOGLE_PLACES_API_KEY) {
      throw new Error("Missing required environment variables: PLACE_ID or GOOGLE_PLACES_API_KEY");
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews&key=${GOOGLE_PLACES_API_KEY}`;
    const response = await axios.get(url);

    if (response.data.status !== "OK") {
      throw new Error(`Google Places API error: ${response.data.status}`);
    }

    return response.data.result.reviews || [];
  } catch (error) {
    console.error("Error fetching reviews from Google:", error.response ? error.response.data : error.message);
    throw error;
  }
}

// Save a single review to the database
export async function saveReview(reviewData) {
  try {
    const { reviewId, reviewDate, review, userId } = reviewData;

    // Check if the review already exists
    const existingReview = await pool.query(
      `SELECT 1 FROM reviews WHERE review_id = $1`,
      [reviewId]
    );

    if (existingReview.rows.length > 0) {
      return null; // Review already exists, no need to insert
    }

    const result = await pool.query(
      `INSERT INTO reviews (review_id, review_date, review, user_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [reviewId, reviewDate, review, userId]
    );

    return result.rows[0];
  } catch (error) {
    throw new Error("Error saving review: " + error.message);
  }
}

// Save multiple reviews to the database
export async function saveReviews(reviews) {
  try {
    const savedReviews = [];
    for (const review of reviews) {
      const savedReview = await saveReview(review);
      if (savedReview) savedReviews.push(savedReview);
    }
    return savedReviews;
  } catch (error) {
    throw new Error("Error saving reviews: " + error.message);
  }
}