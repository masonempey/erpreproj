"use client";

import React, { useEffect, useState } from "react";
import landingStyles from "../../styles/Landing.module.css";
import reviewStyles from "../../styles/Reviews.module.css";
import newsletterStyles from "../../styles/Newsletter.module.css";
import BookingPopUp from "../../components/Booking"; // From Main
import { Button, Typography, Box, Container, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
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
          const mappedReviews = (reviewData.reviews || []).map((review) => ({
            author_name: review.author_name || "Anonymous", // Use the saved author_name from the database
            profile_photo_url: review.profile_photo_url || "", // Use the saved profile picture URL from the database
            text: review.review, // Map the review text
            numsReviews: 0, // Not available in the database; set a default
            rating: review.rating || 5, // Use the saved rating, default to 5 if missing
            relative_time_description: calculateRelativeTime(
              review.review_date
            ), // Calculate relative time from review_date
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
      <BookingPopUp isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2>Book Appointment</h2>
      </BookingPopUp>
      <section
        id="reviews"
        className={`${landingStyles.section} ${reviewStyles.reviews}`}
      >
        <div id="reviewHeader" className={reviewStyles.reviewHeader}>
          <h2>Customer Reviews</h2>
          <p>What Our Clients Say</p>
        </div>

        <hr></hr>

        <Box sx={{ position: "relative", width: "100%", maxWidth: "1400px" }}>
          <IconButton
            sx={{
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "rgba(53, 40, 31, 0.05)",
              "&:hover": { bgcolor: "rgba(53, 40, 31, 0.1)" },
              zIndex: 2,
            }}
            onClick={() => {
              const container = document.getElementById("cardsWrapper");
              container.scrollLeft -= 330;
            }}
          >
            <ArrowBackIosNewIcon sx={{ color: "#35281f" }} />
          </IconButton>

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
              <p>Loading reviews...</p>
            )}
          </div>

          <IconButton
            sx={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "rgba(53, 40, 31, 0.05)",
              "&:hover": { bgcolor: "rgba(53, 40, 31, 0.1)" },
              zIndex: 2,
            }}
            onClick={() => {
              const container = document.getElementById("cardsWrapper");
              container.scrollLeft += 330;
            }}
          >
            <ArrowForwardIosIcon sx={{ color: "#35281f" }} />
          </IconButton>
        </Box>

        <div className={reviewStyles.dots}>
          {[...Array(Math.ceil(reviews.length / 4))].map((_, i) => (
            <div
              key={i}
              className={`${reviewStyles.dot} ${
                i === 0 ? reviewStyles.active : ""
              }`}
              onClick={() => {
                const container = document.getElementById("cardsWrapper");
                container.scrollLeft = i * container.offsetWidth;

                // Update active dot
                document
                  .querySelectorAll(`.${reviewStyles.dot}`)
                  .forEach((dot, index) => {
                    if (index === i) dot.classList.add(reviewStyles.active);
                    else dot.classList.remove(reviewStyles.active);
                  });
              }}
            />
          ))}
        </div>
      </section>
      <section id="newsletter" className={landingStyles.section}>
        <NewsLetter />
      </section>
    </main>
  );
}
