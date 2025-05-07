import React from "react";
import aboutStyles from "../../../styles/About.module.css";

const AboutImages = () => {
  return (
    <div className={aboutStyles.imageSection}>
      <div className={aboutStyles.imageWrapper}>
        <img
          src="/images/aboutus_image1.jpg"
          alt="alt 1 lol"
          className={`${aboutStyles.image} ${aboutStyles.image1}`}
        />
        <img
          src="/images/aboutus_image2.jpg"
          alt="alt 2 lol"
          className={`${aboutStyles.image} ${aboutStyles.image2}`}
        />
        <img
          src="/images/aboutus_image3.jpg"
          alt="alt 3 lol"
          className={`${aboutStyles.image} ${aboutStyles.image3}`}
        />
      </div>
    </div>
  );
};

export default AboutImages;