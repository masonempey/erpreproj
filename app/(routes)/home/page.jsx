"use client";

import React, { useEffect, useState, useRef } from "react";
import Navbar from "../../components/Client/Misc/navBar";
import landingStyles from "../../styles/Landing.module.css";
import reviewStyles from "../../styles/Reviews.module.css";
import aboutStyles from "../../styles/About.module.css";
import newsletterStyles from "../../styles/Newsletter.module.css";
import BookingPopUp from "../../components/Client/Booking/Booking";
import {
  Button,
  Typography,
  Box,
  Container,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CustomerReviewCard from "../../components/customerReviewCard";
import NewsLetter from "./homeScreens/newsLetter";
import AboutText from "../../components/Client/About/AboutText";
import AboutImages from "../../components/Client/About/AboutImages";
import AboutMap from "../../components/Client/About/AboutMap";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const cardsWrapperRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch("/api/reviews");
        if (res.status !== 200) throw new Error("Bad response");
        const { reviews = [] } = await res.json();
        setReviews(
          reviews.map((r) => ({
            author_name: r.author_name || "Anonymous",
            profile_photo_url: r.profile_photo_url || "",
            text: r.review,
            numsReviews: 0,
            rating: r.rating || 5,
            relative_time_description: calculateRelativeTime(r.review_date),
          }))
        );
      } catch (err) {
        console.error(err);
      }
    }
    fetchReviews();
  }, []);

  const calculateRelativeTime = (dateString) => {
    const date = new Date(dateString),
      now = new Date(),
      diff = Math.floor((now - date) / 1000);
    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "week", seconds: 604800 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
    ];
    for (const i of intervals) {
      const cnt = Math.floor(diff / i.seconds);
      if (cnt >= 1) return `${cnt} ${i.label}${cnt > 1 ? "s" : ""} ago`;
    }
    return "just now";
  };

  const scrollReviews = (dir) => {
    if (!cardsWrapperRef.current) return;
    const w = isMobile
      ? cardsWrapperRef.current.offsetWidth
      : 330;
    cardsWrapperRef.current.scrollBy({
      left: dir === "left" ? -w : w,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Navbar onBookNow={() => setIsOpen(true)} />

      <main
        className={landingStyles.main}
        style={{ paddingTop: "64px" }}
      >
        <header className={landingStyles.header}>
          <div className={landingStyles.headerOverlay}>
            <Container
              maxWidth="lg"
              sx={{
                display: "flex",
                flexDirection: "column",
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
                    lineHeight: 1.1,
                    mb: 0,
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
                id="book-now-button"
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
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.25)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0px 6px 15px rgba(0,0,0,0.3)",
                  },
                }}
              >
                Book Now
              </Button>
            </Container>
          </div>
        </header>

        <BookingPopUp
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        >
          <h2>Book Appointment</h2>
        </BookingPopUp>

        <section
          id="reviews"
          className={`${landingStyles.section} ${reviewStyles.reviews}`}
        >
          <div className={reviewStyles.reviewHeader}>
            <h2>Customer Reviews</h2>
            <p>What Our Clients Say</p>
          </div>
          <hr />

          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: { xs: "95%", md: "1400px" },
              px: { xs: 1, md: 4 },
            }}
          >
            {!isMobile && (
              <IconButton
                sx={{
                  position: "absolute",
                  left: { xs: -10, sm: -5, md: 0 },
                  top: "50%",
                  transform: "translateY(-50%)",
                  bgcolor: "rgba(53,40,31,0.05)",
                  "&:hover": { bgcolor: "rgba(53,40,31,0.1)" },
                  zIndex: 2,
                  display: { xs: "none", sm: "flex" },
                }}
                onClick={() => scrollReviews("left")}
              >
                <ArrowBackIosNewIcon sx={{ color: "#35281f" }} />
              </IconButton>
            )}

            <div
              ref={cardsWrapperRef}
              className={reviewStyles.cardsWrapper}
              style={{
                scrollSnapType: isMobile ? "x mandatory" : "none",
                padding: isMobile ? "20px 10px" : "20px 40px",
              }}
            >
              {reviews.length > 0 ? (
                reviews.map((r) => (
                  <CustomerReviewCard
                    key={r.author_name}
                    cusName={r.author_name}
                    image={r.profile_photo_url}
                    review={r.text}
                    numsReviews={r.numsReviews}
                    stars={r.rating}
                    time={r.relative_time_description}
                  />
                ))
              ) : (
                <p className={reviewStyles.loadingText}>
                  Loading reviews...
                </p>
              )}
            </div>

            {!isMobile && (
              <IconButton
                sx={{
                  position: "absolute",
                  right: { xs: -10, sm: -5, md: 0 },
                  top: "50%",
                  transform: "translateY(-50%)",
                  bgcolor: "rgba(53,40,31,0.05)",
                  "&:hover": { bgcolor: "rgba(53,40,31,0.1)" },
                  zIndex: 2,
                  display: { xs: "none", sm: "flex" },
                }}
                onClick={() => scrollReviews("right")}
              >
                <ArrowForwardIosIcon sx={{ color: "#35281f" }} />
              </IconButton>
            )}
          </Box>
        </section>

        <section
          id="about"
          className={`${landingStyles.section} ${aboutStyles.about}`}
        >
          <div className={aboutStyles.aboutContainer}>
            <AboutText />
            <AboutImages />
            <AboutMap />
          </div>
        </section>

        <section
          id="newsletter"
          className={`${landingStyles.section} ${newsletterStyles.newsletter}`}
        >
          <NewsLetter />
        </section>
      </main>
    </>
  );
}
