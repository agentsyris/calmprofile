import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCheckout } from "../api";

const Results = ({ result, onReset }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!result) {
    return (
      <div className="loading-container">
        <span className="loading-text">calculating outcomes...</span>
      </div>
    );
  }

  const handleGetReport = async () => {
    if (!email) return;

    setLoading(true);
    try {
      const { checkout_url } = await createCheckout(
        email,
        result.assessment_id
      );
      window.location.href = checkout_url;
    } catch (error) {
      console.error("checkout error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="results-container">
      <div className="results-hero">
        <span className="hierarchy-badge">calm.profile</span>
        <h1 className="archetype-title">
          {result.archetype.primary.toLowerCase()}
        </h1>
        <p className="archetype-tagline">{result.tagline}</p>
      </div>

      {/* quantified outcomes */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">overhead index</div>
          <div className="metric-value">
            {result.scores.overhead_index}
            <span className="metric-unit">%</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">hours lost/week</div>
          <div className="metric-value">
            {result.metrics.hours_lost_ppw}
            <span className="metric-unit">h</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">annual cost</div>
          <div className="metric-value">
            ${(result.metrics.annual_cost / 1000).toFixed(0)}
            <span className="metric-unit">k</span>
          </div>
        </div>
      </div>

      {/* axis scores */}
      <div className="recommendations-section">
        <h3 className="recommendations-title">workstyle dimensions</h3>
        <div style={{ marginBottom: "48px" }}>
          {Object.entries(result.scores.axes || {}).map(([axis, score]) => (
            <div key={axis} style={{ marginBottom: "24px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span style={{ fontSize: "0.875rem", color: "var(--ink-60)" }}>
                  {axis}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.875rem",
                    color: "var(--ink)",
                  }}
                >
                  {score}%
                </span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${score}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* quick wins */}
      <div className="recommendations-section">
        <h3 className="recommendations-title">immediate optimizations</h3>
        <ul className="recommendations-list">
          {result.recommendations.quick_wins.map((win, i) => (
            <li key={i} className="recommendation-item">
              {win.toLowerCase()}
            </li>
          ))}
        </ul>
      </div>

      {/* strategy session capture */}
      <div className="strategy-session">
        <h3 className="strategy-title">
          next step: strategy session
        </h3>
        <p className="strategy-description">
          based on your <strong>{result.archetype.primary.toLowerCase()}</strong> profile, we'll explore:
        </p>
        <ul className="strategy-list">
          <li>whether calm.stack could address your friction points</li>
          <li>expected timeline and investment</li>
          <li>specific improvements for your team</li>
        </ul>

        <div className="strategy-form">
          <input
            type="email"
            className="strategy-email-input"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="strategy-submit"
            onClick={handleGetReport}
            disabled={!email || loading}
          >
            {loading ? "scheduling..." : "schedule your strategy call - $495"}
          </button>
        </div>
        
        <p className="no-obligation-note">
          not ready for calm.stack? no problem.<br/>
          the insights are yours to keep.
        </p>
      </div>

      <div className="meta-info">assessment id: {result.assessment_id}</div>
    </div>
  );
};

export default Results;
