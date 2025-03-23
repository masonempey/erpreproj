// lib/services/reviewsService.js

// Import the PostgreSQL connection pool from the database module
// The 'pool' is a reusable connection to the database, allowing multiple queries to be executed efficiently
import { pool } from "@/lib/database/index";

// Import axios, a popular library for making HTTP requests (like fetching data from APIs)
import axios from "axios";

// Fetch reviews from the Google Places API
// 'async' keyword makes this function asynchronous, meaning it can perform operations that take time
// and allows the use of 'await' inside the function to pause execution until those operations complete
export async function fetchReviewsFromGoogle() {
  try {
    // Access environment variables for Google Places API
    // process.env provides access to environment variables defined in a .env file
    const PLACE_ID = process.env.PLACE_ID;
    const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

    if (!PLACE_ID || !GOOGLE_PLACES_API_KEY) {
      throw new Error("Missing required environment variables: PLACE_ID or GOOGLE_PLACES_API_KEY");
    }

    // Construct the URL for the Google Places API request
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews&key=${GOOGLE_PLACES_API_KEY}`;

    // Make an HTTP GET request to the Google Places API using axios
    // 'await' pauses the function execution until the HTTP request completes and returns a response
    // axios.get returns a Promise, and 'await' resolves the Promise to get the actual data
    const response = await axios.get(url);

    // Check if the API response status is "OK"
    // If not, throw an error with the status message (e.g., "INVALID_REQUEST")
    if (response.data.status !== "OK") {
      throw new Error(`Google Places API error: ${response.data.status}`);
    }

    // Return the reviews array from the API response
    // || [] to return an empty array if no reviews exist
    return response.data.result.reviews || [];
  } catch (error) {
    console.error("Error fetching reviews from Google:", error.response ? error.response.data : error.message);
    throw error;
  }
}

// Fetch all reviews from the database
// This function is also async because it performs a database query
export async function getAllReviews() {
  try {
    // pool.query sends the SQL query to the database and returns a Promise
    // A promise is an object representing the eventual completion or failure of an asynchronous operation
    // 'await' pauses execution until the query completes and returns the result
    // The query "SELECT * FROM reviews ORDER BY review_date DESC" retrieves all reviews, sorted by date (newest first)
    const result = await pool.query("SELECT * FROM reviews ORDER BY review_date DESC");

    // The result object contains the query results; result.rows is an array of review objects
    // Each review object has properties like id, review_id, review_date, review, user_id, etc.
    return result.rows;
  } catch (error) {
    throw new Error("Error fetching reviews from database: " + error.message);
  }
}

// Save a single review to the database
export async function saveReview(reviewData) {
  try {
    // Destructure the reviewData object to extract individual fields
    // Added authorName to store the Google reviewer's name separately from userId (which is for registered users)
    const { reviewId, reviewDate, review, userId, rating, profilePhotoUrl, authorName } = reviewData;

    // Check if a review with the given reviewId already exists in the database
    // pool.query executes a parameterized SQL query to prevent SQL injection
    // $1 is a placeholder for the reviewId value, passed in the array [reviewId]
    // 'await' waits for the query to complete and return the result
    const existingReview = await pool.query(
      `SELECT * FROM reviews WHERE review_id = $1`, // Fetch the full review if it exists
      [reviewId]
    );

    // If the review already exists (i.e., the query returned at least one row), return the existing review
    // existingReview.rows is an array of matching rows; we return the first one (rows[0])
    if (existingReview.rows.length > 0) {
      return existingReview.rows[0];
    }

    // If the review doesn't exist, insert it into the database
    // Added author_name to the INSERT statement to save the Google reviewer's name
    // $1, $2, ..., $7 are placeholders for the values in the array
    // RETURNING * tells PostgreSQL to return the newly inserted row
    const result = await pool.query(
      `INSERT INTO reviews (review_id, review_date, review, user_id, rating, profile_photo_url, author_name)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [reviewId, reviewDate, review, userId, rating, profilePhotoUrl, authorName]
    );

    // Return the newly inserted review (result.rows[0] contains the inserted row)
    return result.rows[0];
  } catch (error) {
    // If an error occurs (e.g., database constraint violation), throw an error with the message
    throw new Error("Error saving review: " + error.message);
  }
}

// Save multiple reviews to the database
export async function saveReviews(reviews) {
  try {
    // Initialize an array to store the saved reviews
    const savedReviews = [];

    // Loop through each review in the reviews array
    for (const review of reviews) {
      // Call saveReview for each review and wait for it to complete
      // 'await' ensures we don't move to the next review until the current one is saved
      const savedReview = await saveReview(review);
      // If saveReview returns a review (newly saved or existing), add it to the array
      if (savedReview) savedReviews.push(savedReview);
    }

    // Return the array of saved reviews
    return savedReviews;
  } catch (error) {
    // If an error occurs during the loop (e.g., database error), throw an error
    throw new Error("Error saving reviews: " + error.message);
  }
}