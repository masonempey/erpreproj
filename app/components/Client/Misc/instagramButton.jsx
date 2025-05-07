import React from "react";
import IconButton from "@mui/material/IconButton";
import InstagramIcon from "@mui/icons-material/Instagram";

export default function InstagramButton() {
  const instagramUrl = "https://www.instagram.com/erprebarberandshop/";

  return (
    <IconButton
      onClick={() => window.open(instagramUrl, "_blank")}
      aria-label="Visit Instagram"
    >
      <InstagramIcon fontSize="large" sx={{color: "#FAFAFA"}} />
    </IconButton>
  );
}
