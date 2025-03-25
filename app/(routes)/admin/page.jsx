"use client";
import { useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
import AdminNavBar from "@/app/components/AdminNavBar";
import AdminProtected from "@/app/components/AdminProtected";

export default function Admin() {
  const { user, loading } = useUser();
<<<<<<< Updated upstream
  const [upcoming, setUpcoming] = useState([null]);
  const fetchUpcoming = () => {};
  return (
=======
  const [upcoming, setUpcoming] = useState([null])
  const [selectedDate, setSelectedDate] = useState(new Date())
  
  useEffect(() => {
    
  }, [selectedDate])
 
  return(
>>>>>>> Stashed changes
    <>
      <AdminProtected>
        <AdminNavBar />
        <p></p>
      </AdminProtected>
    </>
  );
}
