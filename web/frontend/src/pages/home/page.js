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
        const response = await fetch("http://localhost:5000/api/reviews");
        if (response.status === 200) {
          const reviewData = await response.json();

          console.log(reviewData);
          setReviews(reviewData.result?.reviews || []);
        } else {
          throw new Error("Network response is disrupted");
        }
      } catch (error) {
        console.error("Error fetching google reviews: ", error);
      }
    };
    fetchReviews();
  }, []);

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
          {reviews.map((data) => (
            <CustomerReviewCard
              key={data.author_name}
              cusName={data.author_name}
              image={data.profile_photo_url}
              review={data.text}
              numsReviews={data.numsReviews}
              stars={data.rating}
              time={data.relative_time_description}
            />
          ))}
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
