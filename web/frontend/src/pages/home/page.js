import React, { useState } from "react";
import styles from "../../styles/Landing.module.css";
import aboutStyles from "../../styles/About.module.css";
import Booking from "../../components/Booking";
import CustomerReviewCard from "../../components/customerReviewCard";
import reviewStyles from "../../styles/Reviews.module.css";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import AboutScreen from "./homeScreens/about";


export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  // test data for the reviews section
  const testData = [{
    image: "https://cdn.iconscout.com/icon/premium/png-512-thumb/avatar-1810626-1536314.png?f=webp&w=512",
    review: "Amazing service! I will definitely come back.",
    numsReviews: 5
  },
  {
    image: "https://cdn.iconscout.com/icon/premium/png-512-thumb/avatar-1810626-1536314.png?f=webp&w=512",
    review: "Its a great place to get a haircut. The barbers are very friendly and professional.",
    numsReviews: 3
  },
  {
    image: "https://cdn.iconscout.com/icon/premium/png-512-thumb/avatar-1810626-1536314.png?f=webp&w=512",
    review: "Its a great place to get a haircut. The barbers are very friendly and professional.",
    numsReviews: 3
  },
  {
    image: "https://cdn.iconscout.com/icon/premium/png-512-thumb/avatar-1810626-1536314.png?f=webp&w=512",
    review: "Its a great place to get a haircut. The barbers are very friendly and professional.",
    numsReviews: 3
  },
  {
    image: "https://cdn.iconscout.com/icon/premium/png-512-thumb/avatar-1810626-1536314.png?f=webp&w=512",
    review: "If you're looking for a barbershop that truly stands out, this is the place. The barbers here pay incredible attention to detail and really take the time to understand exactly what you're looking for. They listen carefully, offer helpful suggestions, and make sure you're happy with the result. I've been coming here for a few years now and I've never been disappointed. The atmosphere is great, the barbers are friendly and professional, and the prices are very reasonable. I highly recommend this place to anyone looking for a top-notch haircut.",
    numsReviews: 2
  }]

  return (

    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.landing}>
          <header className={styles.header}>
            <img
              src="/images/logo.png"
              alt="Erpre Barber & Shop Logo"
              className={styles.logo}
            />
            <button
              className={styles.bookNowButton}
              onClick={() => setIsOpen(true)}
            >
              Book Now
            </button>
          </header>
        </section>
        <Booking isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <h2>Book Appointment</h2>
          {/* Add the forms */}
        </Booking>
        <section
          id="about"
          className={`${styles.section} ${aboutStyles.about}`}
        >
          <AboutScreen />
        </section>

        <section id="reviews" className={`${styles.section} ${reviewStyles.reviews}`}>
          <div id = "reviewHeader" className={reviewStyles.reviewHeader}>
            <h2>Customer Reviews</h2>
            <p>Rate by you</p>  
          </div>
          
          <hr></hr>
          <div id="cardsWrapper" className={reviewStyles.cardsWrapper}>
              {testData.map((data) => (
                <CustomerReviewCard
                  image={data.image}
                  review={data.review}
                  numsReviews={data.numsReviews}
                />
              ))}
          </div>
          <Stack spacing={2} style={{display: "flex", justifyContent: "center", marginTop: "40px"}}>
            <Pagination count={10} variant="outlined" size="large" />
          </Stack>
          <hr></hr>

        </section>

        <section id="products" className={`${styles.section} ${newsletterStyles.sectionBG}`}>
          <NewsLetter />
        </section>

        <section id="contact" className={styles.section}>
          <h2>Contact Us</h2>
          <p>Form will be added later</p>
        </section>
      </main>
      <footer className={styles.footer}>
        <p>Temporary Footer Content</p>
      </footer>
    </div>
  );
}