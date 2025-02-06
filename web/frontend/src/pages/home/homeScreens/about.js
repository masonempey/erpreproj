import React from "react";
import aboutStyles from "../../../styles/About.module.css";
import { Paper } from "@mui/material";

export default function AboutScreen() {
  return (
    <div>
      <Paper
        sx={{
          padding: "5rem",
          textAlign: "center",
          background: "linear-gradient(-26.5deg, #35281f 50%, #fafafa 50%)",
          color: "#FAFAFA",
        }}
      >
        <div className={aboutStyles.textContainer}>
          <span
            className={aboutStyles.title}
            style={{
              color: "transparent",
              backgroundClip: "text",
              backgroundImage:
                "linear-gradient(-26.5deg, #fafafa 43%, #35281f 43%)",
              width: "auto",
              fontSize: "4rem",
            }}
          >
            erpre
          </span>
          <span
            className={aboutStyles.description}
            style={{
              color: "transparent",
              backgroundClip: "text",
              backgroundImage:
                "linear-gradient(-26.5deg, #fafafa 67.3%, #35281f 67.3%)",
              width: "auto",
            }}
          >
            means friend in Filipino. Erpre is more than just a haircut, it's a
            lifestyle.
          </span>
        </div>
      </Paper>
      {/* <div className={aboutStyles.cardsWrapper}>
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
      </div> */}
    </div>
  );
}
