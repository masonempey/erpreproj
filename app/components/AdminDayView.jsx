"use client";

import { useState, useEffect } from "react";

export default function AdminDayView() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [appointments, setAppointments] = useState([])

    const fetchAppointments = async () => {
        const formattedDate = Date.toISOString().split("T")[0];
        const response = await fetch('/api/')
    }

    return(
        <>
        </>
    )
}