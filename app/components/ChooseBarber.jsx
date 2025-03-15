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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect hook runs the fetchBarbers function when the component is mounted/rendered
  useEffect(() => {
    // Fetch barbers from the API
    const fetchBarbers = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/barbers");
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        const data = await response.json();
        console.log("Barbers data:", data); // Debug log
        setBarbers(data);
      } catch (error) {
        console.error("Error fetching barbers:", error);
        setError(`Failed to load barbers: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBarbers();
  }, []);

  if (loading) return <div>Loading barbers...</div>;
  if (error) return <div>{error}</div>;
  if (!barbers || barbers.length === 0) return <div>No barbers available</div>;

  const handleBarberSelect = (name, id) => {
    console.log(`Selected barber: ${name} with ID: ${id}`);
    onBarberSelect(name, id);
  };

  return (
    <div className={styles.barbers}>
      <div className={styles.barbersContainer}>
        {barbers.map((barber) => (
          <div
            key={barber.barber_id}
            className={styles.barberCard}
            onClick={() => handleBarberSelect(barber.name, barber.barber_id)}
          >
            <Image
              src={barberImages[barber.name] || "/images/default-avatar.png"}
              alt={barber.name}
              width={120}
              height={120}
              className={styles.barberImage}
            />
            <div className={styles.barberName}>{barber.name}</div>
            <div className={styles.barberAvailability}>Available Now</div>
          </div>
        ))}
      </div>
    </div>
  );
}
