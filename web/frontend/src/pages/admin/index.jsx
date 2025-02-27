"use client";
import { useEffect, useState } from "react";
import Calendar from "../../components/Calendar";
import dayjs from "dayjs";
import styles from "../../styles/Admin.module.css";


export default function Admin() {
  const [barber, setBarber] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  // Placeholder barber for testing while routes are being altered
  const placeholderBarber = 
   { 
    _id: "7bc50236-a87a-450e-ae56-d87a42615a63",
    name: "Anthony",
    email: "Anthony@gmail.com",
  };

  // TBD Altered routes and a new authentication system is implemented making this code obsolete
  // Fetch current barber from the API
  useEffect(() => {
    const fetchBarber = async () => {
      try {
        // const response = await fetch("http://localhost:5000/api/barbers/george");
        // if (!response.ok) {
        //   throw new Error("Network response was not ok");
        // }
        // const currentUser = await response.json();
        setBarber(placeholderBarber);
      } catch (error) {
        console.error("Error fetching barber:", error);
      }
    };

    fetchBarber();
  }, []);

  // Fetch appointments when barber is set
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Fetch appointments for the current barber
        const response = await fetch(
          `http://localhost:5000/api/appointments/barbers/${placeholderBarber._id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const list = await response.json();
        setAppointments(list);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [barber]);

  const handleSetSelectedDate = (date) => {
    setSelectedDate(date);
  }

  // Map appointments to dayjs objects for the calendar

  const appointmentDays = appointments.map((appointment) => dayjs(appointment.date));

  // Check if there are appointments on the selected date - returns a boolean
  const appointmentFound = appointmentDays.some((date) =>
    date.isSame(selectedDate, "day")
  );

  return (
    <main className={styles.dashboard}>
      <div className={styles.header}>
        {/*Conditional rendering of the welcome message*/}
        barber ? (<h1 className={styles.welcome}>Welcome {barber.name}!</h1> ) : null}
      </div>
      <section className={styles.view}>
        <div className={styles.calendar}>
          <Calendar handleSetSelectedDate={handleSetSelectedDate} selectedDate={selectedDate} appointmentDays={appointmentDays}/>
        </div>

        <div className={styles.appointments}>
          {appointmentFound ? (
              <div>
                <h1 className={styles.appointmentHeader}>View Appointments on</h1>
                <h1 className={styles.appointmentHeader}>{selectedDate.format("MMMM DD YYYY")}</h1>
                <ul>
                  {/*Filter appointments by selected date and map them to a list*/}
                  {appointments
                    .filter((appointment) => dayjs(appointment.date).isSame(selectedDate, "day"))
                    .map((appointment) => (
                      <li key={appointment._id} className={styles.appointment}>
                        Customer: {appointment.customerName}, Haircut Type: {appointment.serviceType}, Time: {appointment.time}
                      </li>
                    ))}
                </ul>
              </div>
            ) : (
              <div>
                {/* If no appointments are found */}
                <h1 className={styles.appointmentHeader}>No Appointments on</h1>
                <h1 className={styles.appointmentHeader}>{selectedDate.format("MMMM DD YYYY")}</h1>
              </div>
            )
          }
        </div>
      </section>  
    </main>
  );
}
