"use client";

import { useState, useEffect } from "react";
import styles from "../styles/Barber.module.css";
import Image from "next/image";

// Hard-coded for now, but we will later get the images from the database
const barberImages = {
  Anthony: "/images/barbers/Anthony.png",
  Carl: "/images/barbers/Carl.png",
  George: "/images/barbers/George.png",
  Guio: "/images/barbers/Guio.png",
  Rogin: "/images/barbers/Rogin.png",
};

export default function ChooseBarber({ onBarberSelect }) {
  const [barbers, setBarbers] = useState([]);

  // useEffect hook runs the fetchBarbers function when the component is mounted/rendered. That's when we fetch the barbers from the database.
  useEffect(() => {
    // Fetch barbers from the API
    const fetchBarbers = async () => {
      try {
        const response = await fetch("/api/barbers");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setBarbers(data);
      } catch (error) {
        console.error("Error fetching barbers:", error);
      }
    };

    fetchBarbers();
  }, []);

  return (
    <div className={styles.barbers}>
      <div className={styles.barbersContainer}>
        {barbers.map((barber) => (
          <div
            key={barber._id}
            className={styles.barberCard}
            onClick={() => onBarberSelect(barber.name)}
          >
            <Image
              src={barberImages[barber.name] || "/images/default-avatar.png"}
              alt={barber.name}
              width={120}
              height={120}
              className={styles.barberImage}
            />
            <div className={styles.barberName}>{barber.name}</div>
            <div className={styles.barberAvailability}>
              Available Now {barber.availableDate}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
