import React, { useState } from "react";
import styles from "../../styles/Landing.module.css";
import aboutStyles from "../../styles/About.module.css";
import Booking from "../../components/Booking";
import Button from "@mui/material/Button";
import CustomerReviewCard from "../../components/customerReviewCard";
import reviewStyles from "../../styles/Reviews.module.css";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import AboutScreen from "./homeScreens/about";
import newsletterStyles from "../../styles/Products.module.css";
import NewsLetter from "./homeScreens/newsLetter";
import Footer from "../../components/footer";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  // test data for the reviews section
  const testData = [
    {
      cusName: "John Doe",
      image:
        "https://cdn.iconscout.com/icon/premium/png-512-thumb/avatar-1810626-1536314.png?f=webp&w=512",
      review: "Amazing service! I will definitely come back.",
      numsReviews: 5,
      stars: 3
    },
    {
      cusName: "John Brody",
      image:
        "https://cdn.iconscout.com/icon/premium/png-512-thumb/avatar-1810626-1536314.png?f=webp&w=512",
      review: "Amazing service! I will definitely come back.",
      numsReviews: 100,
      stars: 4
    },
    {
      cusName: "Alice Jane",
      image:
        "https://cdn.iconscout.com/icon/premium/png-512-thumb/avatar-1810626-1536314.png?f=webp&w=512",
      review:
        "Its a great place to get a haircut. The barbers are very friendly and professional.",
      numsReviews: 3,
      stars: 1
    },
    {
      cusName: "Karen Mather",
      image:
        "https://cdn.iconscout.com/icon/premium/png-512-thumb/avatar-1810626-1536314.png?f=webp&w=512",
      review:
        "If you're looking for a barbershop that truly stands out, this is the place. The barbers here pay incredible attention to detail and really take the time to understand exactly what you're looking for. They listen carefully, offer helpful suggestions, and make sure you're happy with the result. I've been coming here for a few years now and I've never been disappointed. The atmosphere is great, the barbers are friendly and professional, and the prices are very reasonable. I highly recommend this place to anyone looking for a top-notch haircut.",
      numsReviews: 2,
      stars: 4.5
    },
  ];

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.landing}>
          <header className={styles.header}>
            <div className={styles.logo}>
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
                margin: "3rem",
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
          <main>
            <section
              id="about"
              className={`${styles.section} ${aboutStyles.about}`}
            >
              <AboutScreen />
            </section>

            <section
              id="reviews"
              className={`${styles.section} ${reviewStyles.reviews}`}
            >
              <div id="reviewHeader" className={reviewStyles.reviewHeader}>
                <h2>Customer Reviews</h2>
                <p>Rate by you</p>
              </div>

              <hr></hr>
              <div id="cardsWrapper" className={reviewStyles.cardsWrapper}>
                {testData.map((data) => (
                  <CustomerReviewCard
                    cusName={data.cusName}
                    image={data.image}
                    review={data.review}
                    numsReviews={data.numsReviews}
                    stars={data.stars}
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
                count={10} size="large"/>
              </Stack>
              <hr></hr>
            </section>

            <section className={`${styles.section} ${styles.newsletter}`}>
              <NewsLetter />
            </section>
            <Footer />
          </main>
        </section>
      </main>
    </div>
  );
}
