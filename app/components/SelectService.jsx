"use client";

import { useState, useEffect } from "react";
import styles from "../styles/Services.module.css";

export default function SelectService({ onServiceSelect }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch services from the API
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/services");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Services data:", data); // Debug log to see data structure
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
        setError("Failed to load services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) return <div>Loading services...</div>;
  if (error) return <div>{error}</div>;
  if (!services || services.length === 0)
    return <div>No services available</div>;

  return (
    <div className={styles.servicesContainer}>
      {services.map((service) => (
        <div
          key={service.id}
          className={styles.serviceCard}
          onClick={() => onServiceSelect(service.service_name, service.id)}
        >
          <div className={styles.serviceName}>{service.service_name}</div>
          <div className={styles.serviceTime}>45 min</div>
          <div className={styles.servicePrice}>${service.price}</div>
        </div>
      ))}
    </div>
  );
}
