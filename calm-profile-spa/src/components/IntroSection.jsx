import React from 'react';
import { Link } from 'react-router-dom';

const IntroSection = () => {
  return (
    <div className="intro-container">
      <div className="intro-card">
        {/* hierarchy indicator */}
        <span className="hierarchy-badge">calm.profile → calm.stack → calm.os</span>
        
        {/* syrıs wordmark with dotless ı */}
        <h1 className="brand-title">
          syr<span className="dotless-i">ı</span>s<span className="brand-dot">.</span>
        </h1>
        
        <p className="brand-subtitle">
          systematic calm for modern teams
        </p>
        
        {/* quantified outcome */}
        <div className="intro-metric">
          average outcome: <strong>12.5 hours saved/week</strong> · <strong>$48k annual roi</strong>
        </div>
        
        <p style={{ marginBottom: '48px', color: 'var(--ink-60)' }}>
          20 questions. 3 minutes. quantified insights into your workstyle archetype.
        </p>
        
        <Link to="/assessment" className="cta-button">
          begin assessment
        </Link>
      </div>
    </div>
  );
};

export default IntroSection;