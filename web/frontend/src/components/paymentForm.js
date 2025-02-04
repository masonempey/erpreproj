import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import styles from '../styles/Payment.module.css';

export default function PaymentForm({ onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [postalCode, setPostalCode] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!stripe || !elements) {
      return;
    }
  
    const cardElement = elements.getElement(CardElement);
  
    const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });
  
    if (paymentMethodError) {
      setError(paymentMethodError.message);
      return;
    }
  
    const response = await fetch('/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: 5000 }), // Example amount in cents
    });
  
    const { clientSecret } = await response.json();
  
    const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod.id,
    });
  
    if (confirmError) {
      setError(confirmError.message);
      return;
    }
  
    setSuccess(true);
    console.log("Payment successful, calling onSuccess");
    onSuccess();
  };

  const handleNext = () => {
    onSuccess();
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#32325d',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
    hidePostalCode: true,
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h1 className={styles.title}>Enter Your Payment Information</h1>
      <p className={styles.note}>You will only be charged in case of a no-show or late cancellation.</p>
      <CardElement options={cardElementOptions} className={styles.cardElement} />
      <input
        type="text"
        placeholder="Postal Code"
        value={postalCode}
        onChange={(e) => setPostalCode(e.target.value)}
        required
        className={styles.postalCodeInput}
      />
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>Payment successful!</div>}
      <button type="submit" disabled={!stripe} className={styles.submitButton}>
        Pay
      </button>
      <button type="button" onClick={handleNext} className={styles.nextButton}>
        Next
      </button>
    </form>
  );
}