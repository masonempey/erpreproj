import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";

export default function ChooseBarber() {
  const [barbers, setBarbers] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const router = useRouter();
  // debugging
  const { service } = router.query;

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

  const handleNext = () => {
    if (selectedBarber) {
      router.push(
        `/booking/datetime?service=${service}&barber=${selectedBarber}`
      );
    }
  };

  return (
    <div>
      <h1>Choose a Barber</h1>
      <p>Selected Service: {service}</p>
      {barbers.map((barber) => (
        <Button
          key={barber.barberId}
          onClick={() => setSelectedBarber(barber.name)}
        >
          {barber.name}
        </Button>
      ))}
      <p>Selected Barber: {selectedBarber || "None"}</p>
      <Button onClick={handleNext} disabled={!selectedBarber}>
        Next
      </Button>
    </div>
  );
}
