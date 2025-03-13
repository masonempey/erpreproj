import { useState } from "react";
import "../styles/BarberToggleButton.css"; // Import the CSS file

export default function BarberToggleButton() {
  const [isAdmin, setIsAdmin] = useState(true);

  return (
    <div className={styles.toggleButton}>
      <button
        className={`toggle-button ${isAdmin ? "active" : ""}`}
        onClick={() => setIsAdmin(true)}
      >
        Admin View
      </button>
      <button
        className={`toggle-button ${!isAdmin ? "active" : ""}`}
        onClick={() => setIsAdmin(false)}
      >
        Barber View
      </button>
    </div>
  );
}
