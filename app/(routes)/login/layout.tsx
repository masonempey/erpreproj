import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login | Erpre"
}

export default function LoginLayout({children}) {
    return(
        <div>
            {children}
        </div>
    )
}