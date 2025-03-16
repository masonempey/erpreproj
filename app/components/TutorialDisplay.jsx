
import styles from "../styles/TutorialDisplay.module.css";
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from "@mui/material";

export default function TutorialDisplay({tutorialPosition, tutorialDisplay, isTutorialVisible, handleTutorialDisplay}) {

  const x = tutorialPosition.x;
  const y = tutorialPosition.y;
  return (
    <div
      className={styles.tutorialDisplay}
      style={{
        position: "fixed",
        visibility: isTutorialVisible ? "visible" : "hidden",
        top: y,
        left: x,
        transform: "translate(-50%, -50%)",
      }}
    >
      <IconButton onClick={(e) => handleTutorialDisplay(e, null, false)}>
        <CloseIcon />
      </IconButton>
      <h1>{tutorialDisplay}</h1>
    </div>
  );
}