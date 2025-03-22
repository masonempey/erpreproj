"use client";

import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase/client";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Collapse from "@mui/material/Collapse";
import styles from "../styles/Profile_Popup.module.css";
import Image from "next/image";
import CloseIcon from "@mui/icons-material/Close";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ProgressBar from "react-bootstrap/ProgressBar";
import EarnTable from "./TableOfRewards";
import SpendTable from "./TableSpend";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import PersonIcon from "@mui/icons-material/Person";
import CardHeader from "@mui/material/CardHeader";

const Icons = {
  coins: "/images/hairstyle.png",
};

const ProfilePopup = ({ user }) => {
  const [drop, setDrop] = useState(false);
  const [open, setOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [coins, setCoins] = useState(0);
  const [redeemRewards, setRedeemRewards] = useState([]);

  const totalcoins = coins;

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    async function fetchUsersData() {
      try {
        const userId = user.uid;
        const res = await fetch(`/api/users/${userId}`);
        if (res.status === 404) {
          console.log("error to fetch user data");
        }
        const data = await res.json();
        const appointments = data.appointments;
        const coins = data.coins;
        setAppointments(appointments);
        setCoins(coins);
      } catch (error) {
        console.error("Error fetching appointments: ", error);
      }
    }

    fetchUsersData();
  }, [user.uid]);

  const handleSpendCoins = async (amount, rewardName) => {
    // Ensure you can't spend more coins than the user has
    if (coins < amount) {
      alert("Not enough coins!");
      return;
    }

    try {
      const response = await fetch(`/api/users/${user.uid}/coins/redeem`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ coins: amount }),
      });

      if (!response.ok) {
        throw new Error("Failed to update coins");
      }

      const data = await response.json();
      setCoins(data.coins);
      setRedeemRewards((prevRewards) => [...prevRewards, rewardName]);
    } catch (error) {
      console.error("Error updating coins:", error);
      alert("Failed to update coins. Please try again.");
    }
  };

  return (
    <>
      <Avatar
        sx={{
          bgcolor: "#fafafa",
          color: "#5F402C",
          cursor: "pointer",
          transition: "transform 0.2s ease",
          border: "1px solid #E0E0E0",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0px 2px 4px rgba(95, 64, 44, 0.2)",
          },
        }}
        onClick={handleOpen}
      >
        <PersonIcon />
      </Avatar>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <h3>Personal Profile</h3>
              <AccountBoxIcon style={{ fontSize: "30px" }} />
            </div>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>

        <DialogContent dividers>
          <div className={styles.userProgress}>
            <span
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "10px",
                padding: "10px",
              }}
            >
              <h1>Your Barber Coins</h1>
              <Image
                src={Icons.coins}
                width={40}
                height={40}
                alt="Coins Icon"
              />
            </span>
            <hr />
            <span>
              <h4>Current Coins: {totalcoins}</h4>
            </span>
            <span>
              <ProgressBar
                striped
                animated
                variant="danger"
                now={totalcoins}
                max={
                  totalcoins >= 200
                    ? 200
                    : totalcoins >= 150
                    ? 200
                    : totalcoins >= 120
                    ? 150
                    : totalcoins >= 100
                    ? 120
                    : 100
                }
                key={1}
              />
            </span>
          </div>

          <div className={styles.userInformation}>
            <h3>User Information</h3>
            <hr />
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

          <SpendTable coins={totalcoins} onSpend={handleSpendCoins} />
          <EarnTable />

          <Card
            sx={{ minWidth: 300, border: "1px solid rgba(211,211,211,0.6)" }}
          >
            <CardHeader
              title="Rewards Inventory"
              action={
                <IconButton
                  onClick={() => setDrop(!drop)}
                  aria-label="expand"
                  size="small"
                >
                  {drop ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                </IconButton>
              }
            />
            <div style={{ borderTop: "1px solid gray" }}>
              <Collapse in={drop} timeout="auto" unmountOnExit>
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
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            onClick={handleLogout}
            style={{ margin: "10px auto", width: "50%" }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProfilePopup;
