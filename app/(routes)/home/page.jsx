"use client";

import React, { useEffect, useState } from "react";
import landingStyles from "../../styles/Landing.module.css";
import reviewStyles from "../../styles/Reviews.module.css";
import newsletterStyles from "../../styles/Newsletter.module.css";
import BookingPopUp from "../../components/Booking";
import { Button, Typography, Box, Container } from "@mui/material";
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
          const mappedReviews = (reviewData.reviews || []).map((review) => ({
            author_name: review.user_id || "Anonymous", // Use user_id or "Anonymous"
            profile_photo_url: "", // Not available in DB; set a default
            text: review.review,
            numsReviews: 0, // Not available in DB; set a default
            rating: 5, // Not in DB; set a default or add to schema
            relative_time_description: calculateRelativeTime(
              review.review_date
            ), // Calculate from review_date
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
        <div className={landingStyles.headerOverlay}>
          <Container
            maxWidth="lg"
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box className={landingStyles.logoContainer}>
              <Typography
                variant="h1"
                className={landingStyles.logoText}
                sx={{
                  fontFamily: '"Oleo Script", cursive',
                  fontSize: { xs: "5rem", md: "8rem" },
                  color: "#fafafa",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                  mb: 0,
                  lineHeight: 1.1,
                }}
              >
                erpre
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  fontFamily: '"Oleo Script", cursive',
                  fontSize: { xs: "3rem", md: "5rem" },
                  color: "#fafafa",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                  mb: 4,
                }}
              >
                Barber and Shop
              </Typography>
            </Box>

            <Button
              variant="contained"
              size="large"
              onClick={() => setIsOpen(true)}
              sx={{
                background: "#fafafa",
                color: "#0C0C0C",
                fontFamily: "Lato, sans-serif",
                fontWeight: 800,
                padding: "1rem 2.5rem",
                fontSize: { xs: "1rem", md: "1.25rem" },
                textTransform: "none",
                borderRadius: "4px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
                transition: "all 0.3s ease",
                border: "2px solid transparent",
                "&:hover": {
                  backgroundColor: "#fafafa",
                  color: "#0C0C0C",
                  transform: "translateY(-2px)",
                  boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.3)",
                },
              }}
            >
              Book Now
            </Button>
          </Container>
        </div>
      </header>
      <BookingPopUp isOpen={isOpen} onClose={() => setIsOpen(false)} />
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
