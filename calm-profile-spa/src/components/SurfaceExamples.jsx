// Surface.tsx Usage Examples
// =========================

import React from "react";
import Surface from "./Surface";

// Example 1: Basic glass surface (level 1)
const BasicExample = () => (
  <Surface>
    <h3>basic glass surface</h3>
    <p>subtle backdrop blur with teal border accent</p>
  </Surface>
);

// Example 2: Prominent glass surface (level 2)
const ProminentExample = () => (
  <Surface level={2}>
    <h3>prominent glass surface</h3>
    <p>stronger blur and saturation for emphasis</p>
  </Surface>
);

// Example 3: Custom styling with className override
const CustomExample = () => (
  <Surface level={2} className="custom-padding custom-width">
    <h3>custom styled surface</h3>
    <p>combines glass styling with additional classes</p>
  </Surface>
);

// Example 4: Hero card implementation
const HeroCardExample = () => (
  <div className="hero-background">
    <Surface level={2} className="hero-card">
      <h1>
        syrıs<span className="dot">.</span>
      </h1>
      <p>systematic calm for modern teams</p>
      <button>begin assessment</button>
    </Surface>
  </div>
);

// Example 5: Card grid with mixed levels
const CardGridExample = () => (
  <div className="card-grid">
    <Surface level={1}>
      <h4>assessment</h4>
      <p>20 questions to identify your archetype</p>
    </Surface>

    <Surface level={2}>
      <h4>results</h4>
      <p>personalized insights and recommendations</p>
    </Surface>

    <Surface level={1}>
      <h4>roi calculation</h4>
      <p>quantified impact on team efficiency</p>
    </Surface>
  </div>
);

// CSS Classes for Examples
// =======================

/*
.hero-background {
  background: linear-gradient(135deg, 
    rgba(0, 201, 167, 0.1) 0%, 
    rgba(0, 201, 167, 0.05) 50%, 
    rgba(245, 245, 245, 0.8) 100%
  );
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.hero-card {
  max-width: 600px;
  padding: 3rem;
  text-align: center;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
}

.custom-padding {
  padding: 2rem;
}

.custom-width {
  max-width: 400px;
}

.dot {
  color: #00c9a7;
}
*/

export {
  BasicExample,
  ProminentExample,
  CustomExample,
  HeroCardExample,
  CardGridExample,
};
