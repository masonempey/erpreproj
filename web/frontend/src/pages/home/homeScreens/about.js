import React from "react";
import aboutStyles from "../../../styles/About.module.css";

export default function AboutScreen() {
  return (
    <div>
      <h2 className={aboutStyles.title}>Erpre</h2>
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
        <img
          src="/images/about_card_3.png"
          alt="About Card 3"
          className={aboutStyles.cardImage}
        />
      </div>
    </div>
  );
}
