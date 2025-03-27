// components/AboutText.js
import React from "react";
import aboutStyles from "../styles/About.module.css";

const AboutText = () => {
  return (
    <div className={aboutStyles.textSection}>
      <h2 className={aboutStyles.title}>About Erpre Barber and Shop</h2>
      <p className={aboutStyles.subtitle}>Our Story - Filipino Pride in Every Cut</p>
      <p className={aboutStyles.description}>
        Welcome to Erpre Barber and Shop, a Filipino-owned local barbershop where tradition meets style. 
        Established with a passion for bringing authentic Filipino hospitality to our community, we offer 
        more than just haircuts – we provide an experience rooted in culture, care, and craftsmanship.
      </p>
    </div>
  );
};

export default AboutText;