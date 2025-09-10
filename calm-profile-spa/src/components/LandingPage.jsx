import React from "react";
import HeroCard from "./HeroCard";
import LandingV2 from "./LandingV2";
import ABTestPanel from "./ABTestPanel";
import { shouldShowLandingV2 } from "../utils/abTesting";

const LandingPage = () => {
  const showV2 = shouldShowLandingV2();

  // Create a startAssessment function that navigates to /assessment
  const startAssessment = () => {
    window.location.href = "/assessment";
  };

  return (
    <>
      {/* Show A/B test panel in development */}
      {process.env.NODE_ENV === "development" && <ABTestPanel />}

      {showV2 ? <LandingV2 startAssessment={startAssessment} /> : <HeroCard />}
    </>
  );
};

export default LandingPage;
