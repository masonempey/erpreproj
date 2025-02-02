import { useState, useEffect } from "react";
import styles from '../../../styles/Barber.module.css';

export default function ChooseBarber({ service, onBarberSelect }) {
  const [barbers, setBarbers] = useState([]);

  useEffect(() => {
    // Fetch barbers from the API
    const fetchBarbers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/barbers");
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
      <h1 className={styles.barbersTitle}>Choose a Barber</h1>
      <div className={styles.barbersContainer}>
        {barbers.map((barber) => (
          <div
            key={barber.barberId}
            className={styles.barberCard}
            onClick={() => onBarberSelect(barber.name)}
          >
            <img src={barber.image} alt={barber.name} className={styles.barberImage} />
            <div className={styles.barberName}>{barber.name}</div>
            <div className={styles.barberAvailability}>Available on {barber.availableDate}</div>
          </div>
        ))}
      </div>
    </div>
  );
}