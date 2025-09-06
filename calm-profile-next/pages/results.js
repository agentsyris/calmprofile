import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { createCheckout } from '../lib/api';

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('assessmentResult');
    if (saved) {
      setResult(JSON.parse(saved));
    } else {
      router.push('/');
    }
  }, [router]);

  const handleGetReport = async () => {
    if (!email) {
      setError('please enter your email');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Fixed: backend returns 'url', not 'checkout_url'
      const { url } = await createCheckout(email, result.assessment_id);
      window.location.href = url;
    } catch (error) {
      console.error('checkout error:', error);
      setError('checkout failed. please try again.');
      setLoading(false);
    }
  };

  const handleReset = () => {
    localStorage.removeItem('assessmentResponses');
    localStorage.removeItem('assessmentResult');
    localStorage.removeItem('assessmentId');
    router.push('/');
  };

  if (!result) {
    return (
      <div className="loading-container">
        <span className="loading-text">calculating outcomes...</span>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Results - {result.archetype?.primary || 'calm.profile'}</title>
        <meta name="description" content={`Your workstyle archetype: ${result.archetype?.primary}. ${result.tagline}`} />
      </Head>
      
      <div className="results-container">
        <div className="results-hero">
          <span className="hierarchy-badge">calm.profile</span>
          <h1 className="archetype-title">
            {result.archetype?.primary?.toLowerCase() || 'calculating...'}
          </h1>
          <p className="archetype-tagline">
            {result.tagline || ''}
          </p>
        </div>

        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">overhead index</div>
            <div className="metric-value">
              {result.scores?.overhead_index || 0}<span className="metric-unit">%</span>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-label">hours lost/week</div>
            <div className="metric-value">
              {result.metrics?.hours_lost_ppw || 0}<span className="metric-unit">h</span>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-label">annual cost</div>
            <div className="metric-value">
              ${((result.metrics?.annual_cost || 0) / 1000).toFixed(0)}<span className="metric-unit">k</span>
            </div>
          </div>
        </div>

        <div className="recommendations-section">
          <h3 className="recommendations-title">workstyle dimensions</h3>
          <div style={{ marginBottom: '48px' }}>
            {Object.entries(result.scores?.axes || {}).map(([axis, score]) => (
              <div key={axis} style={{ marginBottom: '24px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--ink-60)' }}>
                    {axis}
                  </span>
                  <span style={{ 
                    fontFamily: 'var(--font-mono)', 
                    fontSize: '0.875rem',
                    color: 'var(--ink)'
                  }}>
                    {score}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="recommendations-section">
          <h3 className="recommendations-title">immediate optimizations</h3>
          <ul className="recommendations-list">
            {result.recommendations?.quick_wins?.map((win, i) => (
              <li key={i} className="recommendation-item">
                {win.toLowerCase()}
              </li>
            )) || []}
          </ul>
        </div>

        <div className="email-capture">
          <h3 className="email-capture-title">
            get your complete calm.stack recommendations
          </h3>
          <p className="email-capture-subtitle">
            personalized tool stack · integration playbook · roi calculator
          </p>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="email-form">
            <input
              type="email"
              className="email-input"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button 
              className="email-submit"
              onClick={handleGetReport}
              disabled={!email || loading}
            >
              {loading ? 'processing...' : 'get report - $495'}
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <button 
            className="nav-button"
            onClick={handleReset}
            style={{ margin: '0 auto' }}
          >
            restart assessment
          </button>
        </div>

        <div className="meta-info">
          assessment id: {result.assessment_id}
        </div>
      </div>
    </>
  );
}