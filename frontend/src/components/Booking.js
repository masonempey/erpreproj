// This skeleton code was created by GPT 4o using the previous code as a reference.
// Prompt used: please create a template/skeleton for this component-based booking system. 
// I will implement the actual code and logic. There should be a booking component, sidebar component, 
// and the landing page should also be updated to display this new booking setup.

import React, { useState } from 'react';
import styles from '../styles/Booking.module.css';

function SelectService({ onServiceSelect }) {
  return <div>Select Service Component</div>;
}

function ChooseBarber({ service, onBarberSelect }) {
  return <div>Choose Barber Component</div>;
}

function DateTime({ onNext }) {
  return <div>DateTime Component</div>;
}

function Info({ onNext }) {
  return <div>Info Component</div>;
}

function PaymentInfo() {
  return <div>PaymentInfo Component</div>;
}

function Confirmation() {
  return <div>Confirmation Component</div>;
}

export default function Booking({ onClose }) {
  const [currentStep, setCurrentStep] = useState('service');
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState({ date: null, time: null });
  const [userInfo, setUserInfo] = useState({});

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
      <Confirmation />
    ),
  };

  const CurrentStepComponent = steps[currentStep];

  return (
    <div className={styles.bookingContainer}>
      <button className={styles.closeButton} onClick={onClose}>X</button>
      {CurrentStepComponent}
      {currentStep !== 'service' && (
        <button className={styles.backButton} onClick={handleBack}>Back</button>
      )}
    </div>
  );
}