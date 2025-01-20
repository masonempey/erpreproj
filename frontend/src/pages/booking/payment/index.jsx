import Link from 'next/link';

export default function PaymentInfo() {
  return (
    <div>
      <h1>Payment Info</h1>
      <p>Imagine stripe stuff here</p>
      <Link href="/booking/confirmation">
          <button>Next</button>
      </Link>
    </div>
  );
}