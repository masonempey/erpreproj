import { useState } from 'react';
import { useRouter } from 'next/router';

export default function ChooseBarber() {
  const [selectedBarber, setSelectedBarber] = useState(null);
  const router = useRouter();
  // debugging
  const { service } = router.query;

  const handleNext = () => {
    if (selectedBarber) {
      router.push(`/booking/datetime?service=${service}&barber=${selectedBarber}`);
    }
  };

  return (
    <div>
      <h1>Choose a Barber</h1>
      <p>Selected Service: {service}</p>
      <button onClick={() => setSelectedBarber('Rogin')}>Rogin</button>
      <button onClick={() => setSelectedBarber('Carl')}>Carl</button>
      <button onClick={() => setSelectedBarber('Guio')}>Guio</button>
      <button onClick={() => setSelectedBarber('George')}>George</button>
      <button onClick={() => setSelectedBarber('Troy')}>Troy</button>
      <p>Selected Barber: {selectedBarber || 'None'}</p>
      <button onClick={handleNext} disabled={!selectedBarber}>Next</button>
    </div>
  );
}
