import React from "react";
import Surface from "./Surface";

const GlassDemo = () => {
  return (
    <div className="hero-container">
      {/* Background gradient for glass effect demonstration */}
      <div className="hero-bg" />

      {/* Subtle accent elements */}
      <div className="accent-elements">
        <div className="accent-line accent-1"></div>
        <div className="accent-line accent-2"></div>
      </div>

      <div className="demo-grid">
        <Surface level={1} className="demo-card">
          <h3>level 1 glass</h3>
          <p>subtle backdrop blur with teal border accent</p>
        </Surface>

        <Surface level={2} className="demo-card">
          <h3>level 2 glass</h3>
          <p>stronger blur and saturation for emphasis</p>
        </Surface>

        <Surface level={1} className="demo-card">
          <h3>assessment</h3>
          <p>20 questions to identify your archetype</p>
        </Surface>

        <Surface level={2} className="demo-card">
          <h3>results</h3>
          <p>personalized insights and recommendations</p>
        </Surface>
      </div>
    </div>
  );
};

export default GlassDemo;
