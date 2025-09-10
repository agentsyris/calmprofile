import React, { useState, useEffect } from "react";
import { setABTestVariant, getABTestVariant } from "../utils/abTesting";

const ABTestPanel = () => {
  const [currentVariant, setCurrentVariant] = useState("original");

  useEffect(() => {
    setCurrentVariant(getABTestVariant());
  }, []);

  const handleVariantChange = (variant) => {
    setABTestVariant(variant);
    setCurrentVariant(variant);
    // Reload the page to see the change
    window.location.reload();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        background: "white",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        zIndex: 1000,
        fontSize: "14px",
      }}
    >
      <h4 style={{ margin: "0 0 12px 0", fontSize: "16px" }}>A/B Test Panel</h4>
      <div style={{ marginBottom: "8px" }}>
        <strong>Current:</strong> {currentVariant}
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={() => handleVariantChange("original")}
          style={{
            padding: "6px 12px",
            fontSize: "12px",
            backgroundColor:
              currentVariant === "original" ? "#00c9a7" : "#f0f0f0",
            color: currentVariant === "original" ? "white" : "#333",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Original
        </button>
        <button
          onClick={() => handleVariantChange("v2")}
          style={{
            padding: "6px 12px",
            fontSize: "12px",
            backgroundColor: currentVariant === "v2" ? "#00c9a7" : "#f0f0f0",
            color: currentVariant === "v2" ? "white" : "#333",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          V2
        </button>
      </div>
      <div style={{ marginTop: "8px", fontSize: "11px", color: "#666" }}>
        Or use ?v=2 in URL
      </div>
    </div>
  );
};

export default ABTestPanel;
