import React from "react";
import "../styles/sample-report.css";

const SampleReport = () => {
  const handleBackToLanding = () => {
    window.location.href = "/";
  };

  const handleStartAssessment = () => {
    window.location.href = "/assessment";
  };

  return (
    <div className="sample-report-container">
      {/* Header */}
      <div className="sample-header">
        <span className="header-text">calm</span>
        <span className="header-dot">.</span>
        <span className="header-text">profile</span>
        <div className="header-tagline">operational friction diagnostic</div>
      </div>

      {/* Main Content */}
      <div className="sample-content">
        <h1 className="sample-title">sample diagnostic report</h1>
        <p className="sample-subtitle">
          see exactly what you'll receive after completing the assessment
        </p>

        {/* Report Preview */}
        <div className="report-preview">
          <div className="preview-header">
            <h2>operational friction diagnostic</h2>
            <p className="company-name">acme operations</p>
            <p className="report-date">december 2024</p>
          </div>

          <div className="preview-sections">
            {/* Archetype Section */}
            <div className="preview-section">
              <h3>behavioral archetype</h3>
              <div className="archetype-card">
                <div className="archetype-name">architect</div>
                <div className="archetype-tagline">
                  systems-first, process-driven
                </div>
                <div className="confidence-score">confidence: 87%</div>
              </div>
            </div>

            {/* Scores Section */}
            <div className="preview-section">
              <h3>friction axes</h3>
              <div className="scores-grid">
                <div className="score-item">
                  <span className="score-label">structure</span>
                  <span className="score-value">7.2</span>
                </div>
                <div className="score-item">
                  <span className="score-label">collaboration</span>
                  <span className="score-value">6.8</span>
                </div>
                <div className="score-item">
                  <span className="score-label">scope</span>
                  <span className="score-value">5.4</span>
                </div>
                <div className="score-item">
                  <span className="score-label">tempo</span>
                  <span className="score-value">8.1</span>
                </div>
              </div>
            </div>

            {/* Metrics Section */}
            <div className="preview-section">
              <h3>productivity impact</h3>
              <div className="metrics-grid">
                <div className="metric-item">
                  <div className="metric-value">8.2</div>
                  <div className="metric-label">hours lost per week</div>
                </div>
                <div className="metric-item">
                  <div className="metric-value">$187,200</div>
                  <div className="metric-label">annual cost</div>
                </div>
                <div className="metric-item">
                  <div className="metric-value">23%</div>
                  <div className="metric-label">overhead percentage</div>
                </div>
              </div>
            </div>

            {/* Recommendations Preview */}
            <div className="preview-section">
              <h3>prioritized recommendations</h3>
              <div className="recommendations-list">
                <div className="recommendation-item">
                  <div className="rec-title">optimize meeting structure</div>
                  <div className="rec-description">
                    implement structured meeting formats with clear agendas and
                    outcomes
                  </div>
                  <div className="rec-meta">
                    effort: low • impact: high • timeline: 2 weeks
                  </div>
                </div>
                <div className="recommendation-item">
                  <div className="rec-title">establish async communication</div>
                  <div className="rec-description">
                    implement async-first communication protocols
                  </div>
                  <div className="rec-meta">
                    effort: medium • impact: high • timeline: 4 weeks
                  </div>
                </div>
                <div className="recommendation-item">
                  <div className="rec-title">automate routine tasks</div>
                  <div className="rec-description">
                    implement automation for administrative processes
                  </div>
                  <div className="rec-meta">
                    effort: medium • impact: medium • timeline: 6 weeks
                  </div>
                </div>
              </div>
            </div>

            {/* ROI Section */}
            <div className="preview-section">
              <h3>roi projections</h3>
              <div className="roi-grid">
                <div className="roi-item">
                  <div className="roi-value">5.2x</div>
                  <div className="roi-label">conservative (12 months)</div>
                </div>
                <div className="roi-item">
                  <div className="roi-value">7.8x</div>
                  <div className="roi-label">realistic (12 months)</div>
                </div>
                <div className="roi-item">
                  <div className="roi-value">12.4x</div>
                  <div className="roi-label">optimistic (12 months)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Report Link */}
        <div className="full-report-section">
          <h3>full report includes</h3>
          <ul className="report-features">
            <li>detailed behavioral archetype analysis</li>
            <li>comprehensive friction mapping</li>
            <li>30/60/90 day implementation roadmap</li>
            <li>sensitivity analysis and risk assessment</li>
            <li>team-specific recommendations</li>
            <li>roi calculations and projections</li>
            <li>success metrics and tracking</li>
          </ul>

          <div className="download-preview">
            <a
              href="/reports/diagnostic-sample.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="download-link"
            >
              download full sample report (pdf)
            </a>
          </div>
        </div>

        {/* CTA Section */}
        <div className="sample-cta-section">
          <h3>ready to get your personalized report?</h3>
          <p className="cta-description">
            complete the 12-minute assessment to receive your custom diagnostic
          </p>
          <div className="cta-buttons">
            <button className="primary-cta" onClick={handleStartAssessment}>
              begin assessment
            </button>
            <button className="secondary-cta" onClick={handleBackToLanding}>
              back to overview
            </button>
          </div>
          <p className="guarantee-text">
            full refund if roi &lt; 5x in 90 days.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SampleReport;
