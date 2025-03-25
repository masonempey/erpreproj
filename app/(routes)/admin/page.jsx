"use client";
import { useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
import AdminNavBar from "@/app/components/AdminNavBar";
import AdminProtected from "@/app/components/AdminProtected";
import BarberPanel from "@/app/components/AdminBarberPanel";
import AdminDayView from "@/app/components/AdminDayView";

export default function Admin() {
  const { user, loading } = useUser();
  const [upcoming, setUpcoming] = useState([null])
  const [selectedDate, setSelectedDate] = useState(new Date())
  
  useEffect(() => {
    
  }, [selectedDate])
 
  return(
    <>
      <AdminProtected>
        <AdminNavBar />
        <BarberPanel />
        <AdminDayView />
      </AdminProtected>
    </>
  );
}
