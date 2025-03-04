import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../pages/firebase/config";
import { Dialog } from '@base-ui-components/react/dialog';
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import styles from "../styles/Profile_Popup.module.css";
import { deepOrange } from "@mui/material/colors";
import Image from "next/image";
import CloseIcon from "@mui/icons-material/Close";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ProgressBar from 'react-bootstrap/ProgressBar';

const ProfilePopup = ({user}) => {
  const handleLogout = async () => {
    await signOut(auth);
  };
  const [open, setOpen] = React.useState(false);
  const Icons = {
    coins: "/images/hairstyle.png",
  };
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className={styles.Button}>
          <Avatar sx={{ bgcolor: deepOrange[500] }}/>
      </Dialog.Trigger>

      <Dialog.Portal keepMounted>
        <Dialog.Backdrop className={styles.Backdrop} />
        <Dialog.Popup className={styles.Popup}>

          <Dialog.Title className={styles.Title}>
            <div style={{display: "flex", flexDirection: "row", alignItems: "center", gap: "10px"}}>
              <h3>Personal Profile</h3>
              <AccountBoxIcon style={{fontSize: "30px"}}></AccountBoxIcon>
            </div>
            
            <div className={styles.Close}>
              <Dialog.Close className={styles.Button}><CloseIcon/></Dialog.Close>
            </div>
          </Dialog.Title>
          
          <Dialog.Description className={styles.Description}>
            <div className={styles.userProgress}>
                <span style={{display: "flex", flexDirection: "row", alignItems: "center", gap: "10px", padding: "10px"}}>
                  <h1>Your Barber Coins</h1>
                  <Image src={Icons.coins} width={40} height={40} alt="Coins Icon"></Image>
                </span>
                <hr></hr>
                <span>
                  <h4>Current Coins: 120</h4>
                </span>
                <span>  
                    <ProgressBar 
                      striped
                      animated
                      variant="danger" 
                      now={50} 
                      key={1} 
                    >
                    </ProgressBar>
                </span>
                
            </div>
            
            <div className={styles.userInformation}>
              <h3>User Information</h3>
              <hr></hr>
              <p>
                <span>Email: </span>
                <span className={styles.greyInfo}>{user.email}</span>
              </p>
              <p>
                <span>Phone Number: </span>
                <span className={styles.greyInfo}>{user.phoneNumber}</span>
              </p>
            </div>

          </Dialog.Description>
          
          <div className={styles.Actions}>          
            <div className={styles.Logout}>
              <Button onClick={handleLogout}>Logout</Button>
            </div>
          </div>
        </Dialog.Popup>
      
      </Dialog.Portal>
    </Dialog.Root>
    );
      
};

export default ProfilePopup;