import React from "react";
import { Link } from "react-router-dom";
import Surface from "./Surface";
import "../styles/hero-card.css";

const HeroCard = () => {
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

        <p className="brand-subtitle">systematic calm for modern teams</p>

        {/* proof bar */}
        <div className="proof-bar">
          <span className="proof-item">12-page diagnostic</span>
          <span className="proof-separator">•</span>
          <span className="proof-item">quantified roi</span>
          <span className="proof-separator">•</span>
          <span className="proof-item">3–5 days</span>
          <span className="proof-separator">•</span>
          <span className="proof-item">30-min debrief</span>
        </div>

        {/* methodology */}
        <div className="methodology">
          <p>
            we ask 20 calibrated questions, map friction, quantify impact, and
            hand you a focused 30/90-day plan.
          </p>
        </div>

        {/* assurance */}
        <div className="assurance">
          <p>
            if we can't surface ≥$25k in annual efficiency opportunity, we'll
            refund the $495.
          </p>
        </div>

        {/* micro-case template */}
        <div className="micro-cases">
          <div className="case-card">
            <div className="case-header">
              <span className="case-type">agency</span>
              <span className="case-size">(12)</span>
            </div>
            <div className="case-result">
              −30% meetings in 30 days → +10 hrs/wk creative time.
            </div>
          </div>

          <div className="case-card">
            <div className="case-header">
              <span className="case-type">studio</span>
              <span className="case-size">(8)</span>
            </div>
            <div className="case-result">
              task capture fixed → −2 revision rounds avg.
            </div>
          </div>

          <div className="case-card">
            <div className="case-header">
              <span className="case-type">brand team</span>
              <span className="case-size">(20)</span>
            </div>
            <div className="case-result">tools 7→3 → −$540/mo, +clarity.</div>
          </div>
        </div>

        {/* peek captions */}
        <div className="peek-captions">
          <div className="peek-item">
            <span className="peek-label">exec summary</span>
            <span className="peek-desc">what matters in 8 bullets</span>
          </div>
          <div className="peek-item">
            <span className="peek-label">roi table</span>
            <span className="peek-desc">
              hours → dollars, conservative math
            </span>
          </div>
          <div className="peek-item">
            <span className="peek-label">30/90 plan</span>
            <span className="peek-desc">6 moves, owners, metrics</span>
          </div>
        </div>

        <Link to="/assessment" className="cta-button">
          begin assessment
        </Link>
      </Surface>
    </div>
  );
};

export default HeroCard;
