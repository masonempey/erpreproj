"use client";

import { useState, useEffect } from "react";
import styles from "../styles/Services.module.css";

export default function SelectService({ onServiceSelect }) {
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Fetch services from the API
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/services");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className={styles.servicesContainer}>
      {services.map((service) => (
        <div
          key={service._id}
          className={styles.serviceCard}
          onClick={() => onServiceSelect(service.serviceName)}
        >
          <div className={styles.serviceName}>{service.service_name}</div>
          <div className={styles.serviceTime}>45 min</div>
          <div className={styles.servicePrice}>${service.price}</div>
        </div>
      ))}
    </div>
  );
}
