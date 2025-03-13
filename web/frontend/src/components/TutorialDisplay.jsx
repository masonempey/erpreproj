"use client";
import { useEffect, useState } from "react";

export default function TutorialDisplay({tutorialPosition, tutorialDisplay}) {
  const [tutorialPosition, setTutorialPosition] = useState({ x: "50%", y: "50%" });
  const [isTutorialVisible, ToggleTutorialVisibility] = useState(false);



  return (
    <div>
      <h1>{tutorialDisplay}</h1>
    </div>
  );
}