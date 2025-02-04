import React from "react";
import { useState } from "react";
import styles from "../../styles/Landing.module.css";
import aboutStyles from "../../styles/About.module.css";
import Booking from "../../components/Booking";
import Button from "@mui/material/Button";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className={styles.landing}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <h1>erpre</h1>
          <h1>Barber & Shop</h1>
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
        //add the forms
      </Booking>
      <main>
        <section
          id="about"
          className={`${styles.section} ${aboutStyles.about}`}
        >
          <h1 className={aboutStyles.title}>Erpre</h1>
          <p className={aboutStyles.description}>
            means friend in Filipino. Erpre is more than just a haircut, it's a
            lifestyle.
          </p>
          <div className={aboutStyles.cardsWrapper}>
            <img
              src="/images/about_card_1.png"
              alt="About Card 1"
              className={aboutStyles.cardImage}
            />
            <img
              src="/images/about_card_2.png"
              alt="About Card 2"
              className={aboutStyles.cardImage}
            />
            <img />
          </div>
        </section>

        <section id="reviews" className={styles.section}>
          <h2>Customer Reviews</h2>
          <p>Review card</p>
        </section>

        <section id="products" className={styles.section}>
          <h2>Product Newsletter</h2>
          <p>Text here</p>
        </section>

        <section id="contact" className={styles.section}>
          <h2>Contact Us</h2>
          <p>Form will be added later</p>
        </section>
      </main>
    </section>
  );
}
