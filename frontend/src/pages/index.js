import React from 'react';
import styles from '../styles/Landing.module.css';
import aboutStyles from '../styles/About.module.css';
import Sidebar from '../components/Sidebar';

export default function Home() {
  return (
    <>
      <section className={styles.landing}>
        <header className={styles.header}>
          <img src="/images/logo.png" alt="Erpre Barber & Shop Logo" className={styles.logo} />
        </header>
        <Sidebar />
      </section>

      <main>
        <section id="about" className={aboutStyles.about}>
          <h2 className={aboutStyles.title}>Erpre</h2>
          <p className={aboutStyles.description}>means friend in Filipino. Erpre is more than just a haircut, it's a lifestyle.</p>
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
            <img
              src="/images/about_card_3.png"
              alt="About Card 3"
              className={aboutStyles.cardImage}
            />
          </div>
        </section>

        <section id="reviews" className="reviews">
          <h2>Customer Reviews</h2>
          <p>Review card</p>
        </section>

        <section id="products" className="products">
          <h2>Product Newsletter</h2>
          <p>Text here</p>
        </section>

        <section id="contact" className="contact">
          <h2>Contact Us</h2>
          <p>Form will be added later</p>
        </section>
      </main>
    </>
  );
}