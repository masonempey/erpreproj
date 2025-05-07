import { Metadata } from "next";
import AdminLayout from "@/app/components/Admin/AdminLayout";
import AdminNavBar from "@/app/components/Admin/AdminNavBar";

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