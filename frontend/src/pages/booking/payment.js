import { useRouter } from "next/router";
import PaymentForm from "../../components/paymentForm";

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
      <PaymentForm onSuccess={handleNext} />
    </div>
  );
}
