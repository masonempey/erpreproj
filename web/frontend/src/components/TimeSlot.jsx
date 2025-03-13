import styles from "../styles/TimeSlot.module.css";

export default function TimeSlot({appointmentsThisDay, handleViewAppointment}) {
  const timeSlots = {
    Morning: [
      "8:00 AM",
      "8:45 AM",
      "9:30 AM",
      "10:15 AM"
    ],
    Noon: [
      "11:00 AM",
      "11:45 AM",
      "12:30 PM",
      "1:15 PM"
    ],
    Afternoon: [
      "2:00 PM",
      "2:45:PM",
      "3:30 PM",
      "4:15 PM"
    ],
    Evening: [
      "5:00 PM",
      "5:45 PM",
      "6:30 PM",
      "7:15 PM"
    ]
  };

  let isMatch = false;
  let appointmentFound = {};

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const findAppointment = (slot) => {
    const appointment = appointmentsThisDay.find((appointment) => formatTime(appointment.startTime) === slot);
    handleViewAppointment(appointment); 
  }

  const appointmentTimesThisDay = appointmentsThisDay.map((appointment) => formatTime(appointment.startTime));

  return (
    <div className={styles.container}>
      {Object.entries(timeSlots).map(([period, slots]) => (
        <div key={period}>
          <h2 className={styles.periodTitle}>{period}</h2>
          <div className={styles.gridContainer}>
            {slots.map((slot) => (
              isMatch = appointmentTimesThisDay.includes(slot),
              <button
                disabled={!appointmentTimesThisDay.includes(slot)}
                key={slot}
                className={`${styles.timeSlot} ${isMatch ? styles.active : styles.inactive}`}
                onClick={() => findAppointment(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
