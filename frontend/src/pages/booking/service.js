"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";

export default function SelectService() {
  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch services from the API
    const fetchServices = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/services");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Error fetching barbers:", error);
      }
    };

    fetchServices();
  }, []);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    // note: when redirecting to services page, display only the barbers who offer that service
    router.push(`/booking/barber?service=${service}`);
  };

  return (
    <div>
      <h1>Choose a Service</h1>
      {services.map((service) => (
        <Button
          key={service._id}
          onClick={() => handleServiceSelect(service.serviceName)}
        >
          {service.serviceName}
        </Button>
      ))}
      <p>Selected Service: {selectedService ? selectedService.name : "None"}</p>
    </div>
  );
}
