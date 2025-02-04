import React from "react";
import IconButton from "@mui/material/IconButton";
import FacebookIcon from "@mui/icons-material/Facebook";

export default function FacebookButton() {
  const facebookUrl = "https://www.facebook.com/people/Erpre-barber-and-shop/61550313146005/?mibextid=LQQJ4d";

  return (
    <IconButton
      onClick={() => window.open(facebookUrl, "_blank")}
      aria-label="Visit Facebook"
    >
      <FacebookIcon fontSize="large" sx={{ color: "#FAFAFA" }} />
    </IconButton>
  );
}
