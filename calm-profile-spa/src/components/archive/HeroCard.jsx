import React, { useState } from "react";
import { Link } from "react-router-dom";
import Surface from "./Surface";
import "../styles/hero-card.css";

const HeroCard = () => {
  const [teamSize, setTeamSize] = useState(5);
  const [hoursLost, setHoursLost] = useState(8);
  const [hourlyRate, setHourlyRate] = useState(85);

  const calculateCost = () => {
    return teamSize * hoursLost * hourlyRate * 52; // 52 weeks per year
  };

  return (
    <div className="hero-container">
      {/* Background gradient for glass effect demonstration */}
      <div className="hero-bg" />

      {/* Subtle accent elements */}
      <div className="accent-elements">
        <div className="accent-line accent-1"></div>
        <div className="accent-line accent-2"></div>
      </div>

      <Surface level={2} className="hero-card">
        {/* hierarchy indicator */}
        <span className="hierarchy-badge">
          calm.profile → calm.stack → calm.os
        </span>

        {/* syrıs logo */}
        <div className="logo-container">
          <img src="/syris-logo.svg" alt="syrıs." className="logo" />
        </div>

        {/* headline */}
        <h1 className="hero-headline">
          You lose 8 hours every week to operational chaos.
        </h1>

        {/* subhead */}
        <h2 className="hero-subhead">
          (meetings about meetings. lost handoffs. tool sprawl. decision
          bottlenecks.)
        </h2>

        {/* body */}
        <p className="hero-body">
          calm.profile finds exactly where—and how to fix it.
        </p>

        {/* explanation */}
        <div className="explanation-section">
          <p className="explanation-text">
            A diagnostic tool built from 300+ creative team audits.
          </p>
          <p className="explanation-text">
            20 questions → operational archetype → personalized roadmap
          </p>
          <p className="explanation-text">
            Not another personality test.
            <br />
            This measures how work actually flows (or doesn't) through your
            team.
          </p>
        </div>

        {/* cost calculator section */}
        <div className="cost-calculator-section">
          <h3 className="cost-title">Your current overhead cost:</h3>
          <div className="calculator">
            <div className="calculator-inputs">
              <div className="input-group">
                <label>Team size:</label>
                <input
                  type="number"
                  value={teamSize}
                  onChange={(e) => setTeamSize(parseInt(e.target.value) || 0)}
                  min="1"
                  max="50"
                />
              </div>
              <div className="input-group">
                <label>Hours lost:</label>
                <input
                  type="number"
                  value={hoursLost}
                  onChange={(e) => setHoursLost(parseInt(e.target.value) || 0)}
                  min="1"
                  max="40"
                />
              </div>
              <div className="input-group">
                <label>Hourly rate:</label>
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(parseInt(e.target.value) || 0)}
                  min="20"
                  max="200"
                />
              </div>
            </div>
            <div className="calculation-result">
              <div className="calculation-formula">
                {teamSize} × {hoursLost} × ${hourlyRate} × 52 weeks =
              </div>
              <div className="total-cost">
                ${calculateCost().toLocaleString()}/year in lost productivity
              </div>
            </div>
            <div className="roi-statement">
              The diagnostic pays for itself in 3 days.
            </div>
          </div>
        </div>

        {/* process section */}
        <div className="process-section">
          <h3 className="process-title">How it works:</h3>
          <ol className="process-list">
            <li>Answer 20 binary questions (8 minutes)</li>
            <li>Get your archetype + overhead metrics instantly</li>
            <li>Unlock full diagnostic with quick wins ($495)</li>
            <li>Implement with our guidance (30-min call included)</li>
          </ol>
        </div>

        {/* proof section */}
        <div className="proof-section">
          <h3 className="proof-title">Average client results:</h3>
          <ul className="proof-list">
            <li>45% reduction in operational overhead</li>
            <li>8 hours/week reclaimed per person</li>
            <li>$47,000 annual savings (5-person team)</li>
          </ul>
        </div>

        {/* trust section */}
        <div className="trust-section">
          <div className="guarantee-box">
            <h3 className="guarantee-title">
              100% money back + free process audit
            </h3>
            <p className="guarantee-text">
              if you don't save 10x your investment in year one.
            </p>
            <div className="trust-statements">
              <p>No contracts. No ongoing fees. Just clarity.</p>
            </div>
          </div>
        </div>

        {/* ctas */}
        <div className="cta-container">
          <Link to="/assessment" className="cta-button primary">
            Start Free Assessment
          </Link>
          <Link
            to="/reports/diagnostic-sample.pdf"
            className="cta-button secondary"
            target="_blank"
          >
            See Sample Report
          </Link>
        </div>
      </Surface>
    </div>
  );
};

export default HeroCard;
