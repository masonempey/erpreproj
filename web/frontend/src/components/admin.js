"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import styles from '../styles/DateTime.module.css';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';

const admin = ({name}) => {
  const [barber, setBarber] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState();

  // Fetch current barber from the API -- Mason Assisted Code
  const fetchBarber = async () => {
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
    fetchBarber();
  }, []);

  useEffect(() => {
      // Fetch using object ID
      if (barber) {
        fetchAppointments(barber._id);
      }
  }, [barber]);

  // If the barber is not loaded yet, display a loading message
  if (!barber) {
    return <div>Loading...</div>;
  }

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
        
              const isSelected = appointmentDays.some(date => date.isSame(day, 'day'));
        
              const dayStyle = !selectedDate && isSelected ? { backgroundColor: 'green', color: 'white' } : {};
        
              return (
                <PickersDay
                  {...other}
                  day={day}
                  style={dayStyle}
                />
              );
            },
          }}
          slotProps={{
            day: {
              appointmentDays,
            },
          }}
          className={styles.calendar}      
        />
      </LocalizationProvider>

      {selectedDate && appointmentDays.some(date => date.isSame(selectedDate, 'day')) && (
        <div>
          <p>View Appointments on {selectedDate.format('MMMM DD YYYY')}</p>
          <ul>
            {appointments.map((appointment) => (
              <li key={appointments._id}>Customer: {appointment.customerName}, Haircut Type: {appointment.serviceType}, Time: {appointment.time}</li>
            ))}
          </ul>
        </div>
      )}
    </div>

  );
};

export default admin;