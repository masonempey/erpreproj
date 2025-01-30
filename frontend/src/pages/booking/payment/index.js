import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../../../components/paymentForm';
import styles from '../../../styles/Payment.module.css';

// Ask Mason
// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function PaymentInfo() {
  const router = useRouter();
  const { service, barber, date, time, firstName } = router.query;
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch('/api/stripe/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 5000 }) // Example amount in cents
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const handleNext = () => {
    router.push(
      `/booking/confirmation?service=${service}&barber=${barber}&date=${date}&time=${time}&firstName=${firstName}`
    );
  };

  const appearance = {
    theme: 'stripe',
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className={styles.payment}>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <PaymentForm onSuccess={handleNext} />
        </Elements>
      )}
    </div>
  );
}