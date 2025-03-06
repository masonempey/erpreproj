import React, { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../pages/firebase/config";
import { Dialog } from '@base-ui-components/react/dialog';
import Avatar from "@mui/material/Avatar";
import { Button, Card, CardContent, IconButton } from '@mui/material';
import Collapse from "@mui/material/Collapse"; 
import styles from "../styles/Profile_Popup.module.css";
import { deepOrange } from "@mui/material/colors";
import Image from "next/image";
import CloseIcon from "@mui/icons-material/Close";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ProgressBar from 'react-bootstrap/ProgressBar';
import EarnTable from "./TableOfRewards";
import SpendTable from "./TableSpend";
import { useState } from "react";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import CardHeader from "@mui/material/CardHeader";

const Icons = {
  coins: "/images/hairstyle.png",
};

const ProfilePopup = ({user}) => {
  const [drop, setDrop] = useState(false);
  const [open, setOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [coins, setCoins] = useState(0);
  const [redeemRewards, setRedeemRewards] = useState([]);

  const totalcoins =coins;
  
  const handleLogout = async () => {
    await signOut(auth);
  };

  useEffect(()=>{
    async function fetchUsersData(){
      try{
        const userId = user.uid;
        const res = await fetch(`http://localhost:5000/api/users/${userId}`);
        if (res.status === 404){
          console.log("error to fetch user data");
        }
        const data = await res.json();
        const appointments = data.appointments;
        const coins = data.coins;
        setAppointments(appointments);
        setCoins(coins);
      }

      catch (error){
        console.error("Error fetching appointments: ", error);
      }
    }

    fetchUsersData();
  }, [user.uid]);


  const handleSpendCoins = async (amount, rewardName) => {
    // Ensure you can't spend more coins than the user has
    if (coins < amount) {
      alert('Not enough coins!');
      return;
    }

    // Proceed with the API request to redeem coins
    try {
      // Make the API call to redeem coins (send a negative value to deduct)
      const response = await fetch(`http://localhost:5000/api/users/${user.uid}/coins/redeem`, {
        method: 'PATCH',
        headers: {  
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ coins: amount }), // Send amount to deduct
      });

      if (!response.ok) {
        throw new Error('Failed to update coins');
      }

      // After success, get the updated user data
      const data = await response.json();
      
      // Update the state with the new coins value
      setCoins(data.coins); // Assuming the backend response includes the updated coins
      setRedeemRewards(prevRewards => [...prevRewards, rewardName]);
    } catch (error) {
      console.error('Error updating coins:', error);
      alert('Failed to update coins. Please try again.');
    }
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
                  <h4>Current Coins: {totalcoins}</h4>
                </span>
                <span>  
                    <ProgressBar 
                      striped
                      animated
                      variant="danger" 
                      now={totalcoins}
                      max={totalcoins >= 200 ? 200 : totalcoins >= 150 ? 200 : totalcoins >= 120 ? 150 : totalcoins >= 100 ? 120 : 100}
                      key={1} 
                    >
                    </ProgressBar>
                </span>      
            </div>

            
            <div className={styles.userInformation}>
              <h3>User Information</h3>
              <hr></hr>
              <div>
                <div>
                  <span>Email: </span>
                  <span className={styles.greyInfo}>{user.email}</span>
                </div>

                <div>
                  <span>Phone Number: </span>
                  <span className={styles.greyInfo}>{user.phoneNumber}</span>
                </div>
                
              </div>
            
            </div>
            <SpendTable coins = {totalcoins} onSpend={handleSpendCoins}></SpendTable>
            <EarnTable></EarnTable>
            <Card sx={{ 
                minWidth: 300, 
                border: "1px solid rgba(211,211,211,0.6)"
            }}> 
                <CardHeader 
                    title="Rewards Inventory"
                    action={ 
                        <IconButton 
                            onClick={() => setDrop(!drop)} 
                            aria-label="expand"
                            size="small"
                        > 
                            {drop ? <ArrowDropUpIcon /> 
                                : <ArrowDropDownIcon />} 
                        </IconButton> 
                    } 
                ></CardHeader> 
                <div style={{borderTop: "1px solid gray", width: "100rem"}}>
                  
                    <Collapse in={drop} timeout="auto"
                        unmountOnExit> 
                        <CardContent> 
                            <ul>
                              {redeemRewards.map((reward, index) => (
                                <li key={index}>{reward}</li>
                              ))}
                            </ul>
                        </CardContent> 
                    </Collapse> 
                </div> 
            </Card> 
          </Dialog.Description>
          
          <hr></hr>
          <div className={styles.Logout}>
            <Button 
              variant="contained"  
              onClick={handleLogout}
              style={{marginTop: "10px", width: "50%"}}
            >
              Logout
            </Button>
          </div>
        </Dialog.Popup>
      
      </Dialog.Portal>
    </Dialog.Root>
    );
      
};

export default ProfilePopup;