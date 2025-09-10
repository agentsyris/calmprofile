// A/B Testing utility functions
export const getABTestVariant = () => {
  // Check URL parameter first
  const urlParams = new URLSearchParams(window.location.search);
  const urlVariant = urlParams.get("v");

  if (urlVariant === "2") {
    return "v2";
  }

  // Check localStorage feature flag
  const featureFlag = localStorage.getItem("landingVariant");
  if (featureFlag === "v2") {
    return "v2";
  }

  // Default to original
  return "original";
};

export const setABTestVariant = (variant) => {
  localStorage.setItem("landingVariant", variant);
};

// Helper to check if we should show LandingV2
export const shouldShowLandingV2 = () => {
  return getABTestVariant() === "v2";
};
