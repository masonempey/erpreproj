"use client";
import { useEffect, useState } from "react";
import styles from '../../styles/DateTime.module.css';
import { useRouter } from "next/router";
import Badge from '@mui/material/Badge';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { useUser } from "@auth0/nextjs-auth0/client";


export default function Admin() {
  const [barber, setBarber] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const isAdmin = user && user.given_name === 'Simon';

  // Scuffed way of checking if the user is an admin, will be replaced with proper auth later
  if (!isAdmin) {
    console.log("Not an admin");
    return <p>Not an Admin</p>;
  }

  // Fetch current barber from the API -- Mason Assisted Code
  const fetchBarber = async (name) => {
    try {
      const fetchString = `http://localhost:5000/api/barbers/${name}`;
      const response = await fetch(fetchString);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const currentUser = await response.json();
      setBarber(currentUser);
    } catch (error) {
      console.error("Error fetching barbers:", error);
    }
  };

  const fetchAppointments = async (id) => { 
    try {
      const fetchString = `http://localhost:5000/api/appointments/barbers/${id}`;
      const response = await fetch(fetchString);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const list = await response.json();
      setAppointments(list);
    } catch (error) {
      console.error("Error fetching barbers:", error);
    }
  }

  useEffect(() => {
    console.log(user);
    if (user) {
      fetchBarber(user.given_name);
    }
  }, [user]);

  useEffect(() => {
      // Fetch using object ID
      if (barber) {
        fetchAppointments(barber._id);
      }
  }, [barber]);

  // Map the appointments to an array of dayjs objects so they can be compared with the calendar days
  const appointmentDays = appointments.map(appointment => dayjs(appointment.date));

  return (
    <div>
      <h1>Welcome {barber.name}!</h1>
      {/* Alex Assisted Code + Calendar taken from https://mui.com/x/react-date-pickers/date-calendar */}
      <LocalizationProvider dateAdapter={AdapterDayjs} >
        <DateCalendar
          disablePast
          showDaysOutsideCurrentMonth 
          fixedWeekNumber={6}
          value={selectedDate}
          onChange={(newValue) => setSelectedDate(newValue)}
          views={['day']}
          // This slots section is almost entirely taken from https://mui.com/x/react-date-pickers/date-calendar/ and Chat GPT - needs further investigation
          slots={{
            day: (props) => {
              const { day, appointmentDays, ...other } = props;
        
              const isSelected = !props.outsideCurrentMonth && appointmentDays.some(date => date.isSame(day, 'day'));
        
              return (
                <Badge overlap="circular" badgeContent={isSelected ? '🔴' : undefined}>
                  <PickersDay
                    {...other}
                    day={day}
                  /> 
                </Badge>  
              );
            },
          }}
          slotProps={{
            day: {
              appointmentDays: appointmentDays,
            },
          }}
          className={styles.calendar}      
        />
      </LocalizationProvider>

      {selectedDate && appointmentDays.some(date => date.isSame(selectedDate, 'day')) && (
        <div>
          <p>View Appointments on {selectedDate.format('MMMM DD YYYY')}</p>
          <ul>
            {appointments.filter(appointment => dayjs(appointment.date).isSame(selectedDate, 'day')).map((appointment) => (
              <li key={appointments._id}>Customer: {appointment.customerName}, Haircut Type: {appointment.serviceType}, Time: {appointment.time}</li>
            ))}
          </ul>
        </div>
      )}
    </div>

  );
}