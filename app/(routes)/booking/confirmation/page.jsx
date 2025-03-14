"use client";

import { useRouter } from "next/navigation";

export default function Confirmation() {
  const router = useRouter();
  const { service, barber, date, time, firstName } = router.query;

  return (
    <div>
      <h1>Booking Confirmed!</h1>
      <p>Thank you, {firstName}, for booking with us. See you soon!</p>

      <h2>Booking Details:</h2>
      <p>Service: {service}</p>
      <p>Barber: {barber}</p>
      <p>Date: {date}</p>
      <p>Time: {time}</p>
    </div>
  );
}
