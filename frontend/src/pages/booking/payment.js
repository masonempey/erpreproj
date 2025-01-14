import { useRouter } from 'next/router';

export default function PaymentInfo() {
  const router = useRouter();
  const { service, barber, date, time, firstName } = router.query;

  const handleNext = () => {
    router.push(
      `/booking/confirmation?service=${service}&barber=${barber}&date=${date}&time=${time}&firstName=${firstName}`
    );
  };

  return (
    <div>
      <h1>Payment Info</h1>
      <p>Imagine stripe stuff here</p>
      <button onClick={handleNext}>Next</button>
    </div>
  );
}
