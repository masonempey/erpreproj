"use client";
 
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
 
// Component that uses useSearchParams
function ConfirmationContent() {
  const searchParams = useSearchParams();
 
  const service = searchParams.get("service");
  const barber = searchParams.get("barber");
  const date = searchParams.get("date");
  const time = searchParams.get("time");
  const firstName = searchParams.get("firstName");
 
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
 
// Default export with Suspense boundary
export default function Confirmation() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}