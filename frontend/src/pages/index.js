import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <header>
        <h1>Erpre Barber & Shop</h1>
      </header>

      <main>
        <section id="about">
          <h2>About Us</h2>
          <p>about us and stuff</p>
        </section>

        <section id="services">
          <h2>Our Services</h2>
          <Link href="/booking/service">
            <button>Book a Service</button>
          </Link>
        </section>

        <section id="reviews">
          <h2>Customer Reviews</h2>
          <p>review card</p>
        </section>

        <section id="products">
          <h2>Product Newsletter</h2>
          <p>text here</p>
        </section>

        <section id="contact">
          <h2>Contact Us</h2>
          <p>form will be added later</p>
        </section>
      </main>
    </div>
  );
}
