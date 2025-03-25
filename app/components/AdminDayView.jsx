"use client";

import { useState, useEffect } from "react";

const AdminDayView = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [appointments, setAppointments] = useState([])
    const barberId = "barber2"

    const fetchAppointments = async () => {
        const response = await fetch(`/api/appointments/barbers/${barberId}?date=${selectedDate}`);
        const data = await response.json();
        setAppointments(data);
    }

    useEffect(() => {
        fetchAppointments(selectedDate);
    }, [selectedDate]);
    
    // Navigate to previous day
    const handlePrevDay = () => {
        const prevDay = new Date(selectedDate);
        prevDay.setDate(selectedDate.getDate() - 1);
        setSelectedDate(prevDay);
    };
    
    // Navigate to next day
    const handleNextDay = () => {
        const nextDay = new Date(selectedDate);
        nextDay.setDate(selectedDate.getDate() + 1);
        setSelectedDate(nextDay);
    };

    //data formating taken from chatgpt
    const formatDate = (date) => {
        const timePart = date.split("T")[1]; 
        const [hourStr, minuteStr] = timePart.split(":");
        const hour = parseInt(hourStr);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 === 0 ? 12 : hour % 12;
        const timeFormatted = `${hour12}:${minuteStr} ${ampm}`;
        return timeFormatted;
    }

    return (
        <div className="daily-view">
            <h2>Daily Appointments</h2>
            <div className="date-navigation">
                <button onClick={handlePrevDay}>Previous Day</button>
                <span>{selectedDate.toDateString()}</span>
                <button onClick={handleNextDay}>Next Day</button>
            </div>
            <ul>
                {appointments.length > 0 ? (
                appointments.map((appointment) => (
                    <li key={appointment.id}>
                        
                        {formatDate(appointment.date)} - {appointment.guest_name}
                    </li>
                ))
                ) : (
                    <p>No appointments for this day.</p>
                )}
            </ul>
        </div>
    );
};

export default AdminDayView;