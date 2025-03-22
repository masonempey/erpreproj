"use client";

import React, { useEffect, useState } from "react";
import landingStyles from "../../styles/Landing.module.css";
import reviewStyles from "../../styles/Reviews.module.css";
import newsletterStyles from "../../styles/Newsletter.module.css";
import Booking from "../../components/Booking";
import Button from "@mui/material/Button";
import CustomerReviewCard from "../../components/customerReviewCard";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import NewsLetter from "./homeScreens/newsLetter";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/reviews");
        if (response.status === 200) {
          const reviewData = await response.json();
          console.log("Fetched review data:", reviewData);
          // Map database reviews to the format expected by CustomerReviewCard
          // reviewData.reviews contains the reviews fetched from the database
          const mappedReviews = (reviewData.reviews || []).map(review => ({
            author_name: review.author_name || "Anonymous", // Use the saved author_name from the database
            profile_photo_url: review.profile_photo_url || "", // Use the saved profile picture URL from the database
            text: review.review, // Map the review text
            numsReviews: 0, // Not available in the database; set a default
            rating: review.rating || 5, // Use the saved rating, default to 5 if missing
            relative_time_description: calculateRelativeTime(review.review_date), // Calculate relative time from review_date
          }));
          setReviews(mappedReviews);
        } else {
          throw new Error("Network response is disrupted");
        }
      } catch (error) {
        console.error("Error fetching google reviews: ", error);
      }
    };
    fetchReviews();
  }, []);

  // Helper function to calculate relative time (e.g., "3 months ago")
  const calculateRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "week", seconds: 604800 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(diffInSeconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
      }
    }
    return "just now";
  };

  return (
    <main className={landingStyles.main}>
      <header className={landingStyles.header}>
        <div className={landingStyles.logo}>
          <h1>erpre</h1>
          <h1>Barber and Shop</h1>
        </div>
        <Button
          variant="contained"
          onClick={() => setIsOpen(true)}
          sx={{
            backgroundColor: "#FAFAFA",
            color: "#35281f",
            fontFamily: "Lato",
            fontWeight: 800,
            fontStyle: "normal",
            padding: "1rem",
            fontSize: "1.25rem",
            marginBottom: "15rem",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#35281f",
              color: "#FAFAFA",
            },
          }}
        >
          Book Now
        </Button>
      </header>
      <Booking isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2>Book Appointment</h2>
      </Booking>
      <section
        id="reviews"
        className={`${landingStyles.section} ${reviewStyles.reviews}`}
      >
        <div id="reviewHeader" className={reviewStyles.reviewHeader}>
          <h2>Customer Reviews</h2>
          <p>Rate by you</p>
        </div>

        <hr></hr>
        <div id="cardsWrapper" className={reviewStyles.cardsWrapper}>
          {reviews.length > 0 ? (
            reviews.map((data) => (
              <CustomerReviewCard
                key={data.author_name}
                cusName={data.author_name}
                image={data.profile_photo_url}
                review={data.text}
                numsReviews={data.numsReviews}
                stars={data.rating}
                time={data.relative_time_description}
              />
            ))
          ) : (
            <p>No reviews available.</p>
          )}
        </div>
        <Stack
          spacing={2}
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "40px",
          }}
        >
          <Pagination
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#35281f",
                borderColor: "#35281f",
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                backgroundColor: "#35281f",
                color: "white",
                borderColor: "#35281f",
              },
              "& .MuiPaginationItem-root:hover": {
                backgroundColor: "#35281f",
                color: "white",
              },
            }}
            count={10}
            size="large"
          />
        </Stack>
        <hr></hr>
      </section>

      <section
        className={`${landingStyles.section} ${newsletterStyles.newsletter}`}
      >
        <NewsLetter />
      </section>
    </main>
  );
}