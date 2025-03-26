"use client";

import Link from "next/link";
import {useState, useEffect} from "react";

const BarberPanel = () => {
    const [barbers, setBarbers] = useState([]);
    useEffect(() => {
        const fetchBarbers = async () => {
            const response = await fetch("/api/barbers");
            const data = await response.json();
            setBarbers(data);
        };
        fetchBarbers();
    }, [])
    return(
        <div className="barber-panel">
            <h2>Barbers</h2>
            <ul>
                {barbers.map((barber) => (
                <li key={barber.id}>
                    <Link href={`/admin/statistics/${barber.id}`}>
                        {barber.name}
                </Link>
                </li>
                ))}
            </ul>
        </div>
    );
}

export default BarberPanel;