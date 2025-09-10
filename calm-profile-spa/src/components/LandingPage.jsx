import React from "react";
import LandingV2 from "./LandingV2";

const LandingPage = () => {
  // Create a startAssessment function that navigates to /assessment
  const startAssessment = () => {
    window.location.href = "/assessment";
  };

  return <LandingV2 startAssessment={startAssessment} />;
};

export default LandingPage;
