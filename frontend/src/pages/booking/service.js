import { useState } from 'react';
import { useRouter } from 'next/router';

export default function SelectService() {
  const [selectedService, setSelectedService] = useState(null);
  const router = useRouter();

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    // note: when redirecting to services page, display only the barbers who offer that service
    router.push(`/booking/barber?service=${service}`);
  };

  return (
    <div>
      <h1>Choose a Service</h1>
      <button onClick={() => handleServiceSelect('haircut')}>Haircut</button>
      <button onClick={() => handleServiceSelect('haircut & hairwash')}>Haircut & Hairwash</button>
      <button onClick={() => handleServiceSelect('haircut & beard trim')}>Haircut & Beard Trim</button>
      <button onClick={() => handleServiceSelect('kids haircut')}>Kid's Haircut</button>
      <button onClick={() => handleServiceSelect('womens haircut')}>Women's Haircut</button>
      <button onClick={() => handleServiceSelect('beard trim')}>Beard Trim</button>
      <button onClick={() => handleServiceSelect('hair perm')}>Hair Perm</button>
    </div>
  );
}
