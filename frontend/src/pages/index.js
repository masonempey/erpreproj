import React, { useState, useRef } from 'react';
import styles from '../styles/Landing.module.css';
import serviceStyles from '../styles/Services.module.css';
import aboutStyles from '../styles/About.module.css';
import SelectService from '../pages/booking/service';
import ChooseBarber from '../pages/booking/barber';
import DateTime from '../pages/booking/datetime';
import Info from '../pages/booking/info';
import PaymentInfo from '../pages/booking/payment';
import TiltedCard from '../components/TiltedCard';
import Admin from '../components/admin';
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Home() {
  const { user, error, isLoading } = useUser();
  const [currentStep, setCurrentStep] = useState('service');
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState({ date: null, time: null });
  const [userInfo, setUserInfo] = useState({});
  const bookingSectionRef = useRef(null);

  // Scuffed way of checking if the user is an admin, will be replaced with proper auth later
  const isAdmin = user && user.given_name === 'Simon';

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setCurrentStep('barber');
  };

  const handleBarberSelect = (barber) => {
    setSelectedBarber(barber);
    setCurrentStep('datetime');
  };

  const handleDateTimeSelect = (date, time) => {
    setSelectedDateTime({ date, time });
    setCurrentStep('info');
  };

  const handleInfoSubmit = (info) => {
    setUserInfo(info);
    setCurrentStep('payment');
  };

  const handleBack = () => {
    if (currentStep === 'barber') {
      setCurrentStep('service');
    } else if (currentStep === 'datetime') {
      setCurrentStep('barber');
    } else if (currentStep === 'info') {
      setCurrentStep('datetime');
    } else if (currentStep === 'payment') {
      setCurrentStep('info');
    }
  };

  const handleBookNowClick = () => {
    bookingSectionRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const steps = {
    service: (
      <SelectService onServiceSelect={handleServiceSelect} />
    ),
    barber: (
      <ChooseBarber service={selectedService} onBarberSelect={handleBarberSelect} />
    ),
    datetime: (
      <DateTime onNext={handleDateTimeSelect} />
    ),
    info: (
      <Info onNext={handleInfoSubmit} />
    ),
    payment: (
      <PaymentInfo />
    ),
    confirmation: (
      <p>Confirmation</p> // Placeholder for the confirmation step
    ),
  };

  const CurrentStepComponent = steps[currentStep];

  if (isAdmin) { 
    return (
      // return admin component
      <div>
        <Admin name={user.given_name}/>
      </div>
    );
 }

  return (
    <> 
      <section className={styles.landing}>
        <header className={styles.header}>
          <img src="/images/logo.png" alt="Erpre Barber & Shop Logo" className={styles.logo} />
        </header>
        <button className={styles.bookNowButton} onClick={handleBookNowClick}>BOOK NOW</button>
      </section>

      <main>
        <section id="services" className={serviceStyles.services} ref={bookingSectionRef}>
          <div className={serviceStyles.servicesContainer}>
            {CurrentStepComponent}
          </div>
          {currentStep !== 'service' && (
            <button onClick={handleBack}>Back</button>
          )}
        </section>

        <section id="about" className={aboutStyles.about}>
          <h2 className={aboutStyles.title}>Erpre</h2>
          <p className={aboutStyles.description}>means friend in Filipino. Erpre is more than just a haircut, it's a lifestyle.</p>
          {/* These cards are taken from https://www.reactbits.dev/components/tilted-card */}
          <div className={aboutStyles.cardsWrapper}>
            <TiltedCard
              imageSrc="/images/about_card_1.png"
              altText="About Card 1"
              containerHeight="auto"
              containerWidth="250px"
              imageHeight="auto"
              imageWidth="250px"
              rotateAmplitude={20}
              scaleOnHover={1.3}
              showMobileWarning={false}
              showTooltip={true}
            />
            <TiltedCard
              imageSrc="/images/about_card_2.png"
              altText="About Card 2"
              containerHeight="auto"
              containerWidth="250px"
              imageHeight="auto"
              imageWidth="250px"
              rotateAmplitude={20}
              scaleOnHover={1.3}
              showMobileWarning={false}
              showTooltip={true}
            />
            <TiltedCard
              imageSrc="/images/about_card_3.png"
              altText="About Card 3"
              containerHeight="auto"
              containerWidth="250px"
              imageHeight="auto"
              imageWidth="250px"
              rotateAmplitude={20}
              scaleOnHover={1.3}
              showMobileWarning={false}
              showTooltip={true}
            />
          </div>
        </section>

        <section id="reviews" className="reviews">
          <h2>Customer Reviews</h2>
          <p>Review card</p>
        </section>

        <section id="products" className="products">
          <h2>Product Newsletter</h2>
          <p>Text here</p>
        </section>

        <section id="contact" className="contact">
          <h2>Contact Us</h2>
          <p>Form will be added later</p>
        </section>
      </main>
    </>
  );
}