"use client"

import {useState} from "react";
import AdminNavBar from "@/app/components/AdminNavBar";

export default async function Statistics({params}) {
    const [selectedBarber, setSelectedBarber] = useState(params.barberName?.[0] || null);
    return(
        <>
            <AdminNavBar />
        </>
    );
}