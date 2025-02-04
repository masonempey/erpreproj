"use client";
import { useEffect, useState } from "react";
import styles from "../../styles/DateTime.module.css";
// import { useUser } from "@auth0/nextjs-auth0/client";
import Badge from "@mui/material/Badge";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";

export default function Admin() {
  const [barber, setBarber] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  // const { user, isLoading } = useUser();

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // Fetch current barber from the API
  useEffect(() => {
    const fetchBarber = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/barbers/Simon");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const currentUser = await response.json();
        setBarber(currentUser);
      } catch (error) {
        console.error("Error fetching barber:", error);
      }
    };

    fetchBarber();
  }, []);

  // Fetch appointments when barber is set
  useEffect(() => {
    if (!barber || !barber._id) return;

    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/appointments/barbers/${barber._id}`
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

  // Map appointments to dayjs objects
  const appointmentDays = appointments.map((appointment) => dayjs(appointment.date));

  return (
    <div>
      {barber ? <h1>Welcome {barber.name}!</h1> : <h1>Loading Barber...</h1>}

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          disablePast
          showDaysOutsideCurrentMonth
          fixedWeekNumber={6}
          value={selectedDate}
          onChange={(newValue) => setSelectedDate(newValue)}
          views={["day"]}
          slots={{
            day: (props) => {
              const { day, outsideCurrentMonth, ...other } = props;
              const isSelected =
                !outsideCurrentMonth &&
                appointmentDays.some((date) => date.isSame(day, "day"));

              return (
                <Badge overlap="circular" badgeContent={isSelected ? "🔴" : undefined}>
                  <PickersDay {...other} day={day} />
                </Badge>
              );
            },
          }}
          className={styles.calendar}
        />
      </LocalizationProvider>

      {selectedDate &&
        appointmentDays.some((date) => date.isSame(selectedDate, "day")) && (
          <div>
            <p>View Appointments on {selectedDate.format("MMMM DD YYYY")}</p>
            <ul>
              {appointments
                .filter((appointment) => dayjs(appointment.date).isSame(selectedDate, "day"))
                .map((appointment) => (
                  <li key={appointment._id}>
                    Customer: {appointment.customerName}, Haircut Type: {appointment.serviceType}, Time: {appointment.time}
                  </li>
                ))}
            </ul>
          </div>
        )}
    </div>
  );
}
