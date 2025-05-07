import { Metadata } from "next";
import AdminLayout from "@/app/components/AdminLayout";
import AdminNavBar from "@/app/components/AdminNavBar";

export const metadata: Metadata = {
    title: "Erpre Admin | Erpre"
}

export default function RootAdminLayout({children}) {
    return(
        <AdminLayout>
            <AdminNavBar />
            {children}
        </AdminLayout>
    )
}