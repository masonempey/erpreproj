import { UserProvider } from "@auth0/nextjs-auth0/client";
import NavBar from "../components/navBar";

export default function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <NavBar />
      <Component {...pageProps} />
    </UserProvider>
  );
}
