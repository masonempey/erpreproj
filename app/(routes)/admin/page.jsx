"use client";

import { useUser } from "../../../context/UserContext";
import AdminNavBar from "@/app/components/AdminNavBar";
import AdminProtected from "@/app/components/AdminProtected";
import BarberPanel from "@/app/components/AdminBarberPanel";
import AdminDayView from "@/app/components/AdminDayView";

export default function Admin() {
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
