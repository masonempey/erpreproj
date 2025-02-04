import styles from '../styles/Footer.module.css';
import InstagramButton from './instagramButton';
import FacebookButton from './facebookButton';

const footer = () => {
  return (
      <div className={styles.footer}>
        <div style={{display: 'flex', width: '80%', alignItems: 'center', justifyContent: 'space-evenly'}}>
          <div className={styles.contact}>
            <h3><b>Contact us!</b></h3>
            <p><b>Phone:</b>  403-452-0154</p>
            <p><b>Email:</b> erprebarberandshop@gmail.com</p>
            <div style={{display: 'flex', justifyContent: 'space-evenly', width: '100%'}}>
              <InstagramButton/>
              <FacebookButton/>
            </div>
          </div>  
          <img
            src="/images/logo.png"
            alt="Erpre Barber & Shop Logo"
            className={styles.logo}
          />
        </div>
          <p>© Copyright 2025 | Epre Barber and Shop | All Rights Reserved | 1012 16 Ave NW 2nd floor, Calgary, AB T2M 0K5  |   Website created by The Copilots   </p>
      </div>
  );
}

export default footer;
