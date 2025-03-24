"use client";
import { useEffect, useState } from "react";
import {useUser} from "../../../context/UserContext"
import AdminNavBar from "@/app/components/AdminNavBar";

export default function Admin() {
  const { user, loading } = useUser();
  const [upcoming, setUpcoming] = useState([null])
  const fetchUpcoming = () => {
    
  }
  return(
    <>
    <AdminNavBar />
     <p></p>
    </>
  );
}