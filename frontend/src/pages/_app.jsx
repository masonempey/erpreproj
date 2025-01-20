import { UserProvider } from "@auth0/nextjs-auth0/client";
import NavBar from "../components/navBar";
import { BookingProvider } from '../context/BookingContext';

export default function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <BookingProvider>
        <NavBar />
        <Component {...pageProps} />
      </BookingProvider>
    </UserProvider>
  );
}