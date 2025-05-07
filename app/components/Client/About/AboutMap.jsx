// app/components/AboutMap.js
import React from "react";
import aboutStyles from "../../../styles/About.module.css";

const AboutMap = () => {
  return (
    <div className={aboutStyles.mapSection}>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2507.2394426053756!2d-114.0863216231418!3d51.06712984277058!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x53716fdfd2894597%3A0x94f777de287fa819!2sErpre%20Barber%20and%20Shop!5e0!3m2!1sen!2sca!4v1743024684260!5m2!1sen!2sca"
        width="100%"
        height="400px"
        className={aboutStyles.mapIframe} // Apply the new class
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Erpre Barber and Shop Location"
      ></iframe>
    </div>
  );
};

export default AboutMap;