import React, { useState } from "react";
import styles from "../../styles/Landing.module.css";
import aboutStyles from "../../styles/About.module.css";
import Booking from "../../components/Booking";
import AboutScreen from "./homeScreens/about";
import NewsLetter from "./homeScreens/newsLetter";
import newsletterStyles from "../../styles/Products.module.css";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

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

        <section id="reviews" className={styles.section}>
          <h2>Customer Reviews</h2>
          <p>Review card</p>
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