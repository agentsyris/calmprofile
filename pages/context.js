import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { submitAssessment } from '../lib/api';

export default function ContextPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [responses, setResponses] = useState({});
  const [context, setContext] = useState({
    teamSize: '',
    meetingLoad: '',
    hourlyRate: '',
    platform: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('assessmentResponses');
    if (saved) {
      setResponses(JSON.parse(saved));
    } else {
      router.push('/assessment');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!context.teamSize || !context.meetingLoad || !context.hourlyRate || !context.platform) {
      setError('please complete all fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await submitAssessment({ responses, context });
      localStorage.setItem('assessmentResult', JSON.stringify(result));
      if (result.assessment_id) {
        localStorage.setItem('assessmentId', result.assessment_id);
      }
      router.push('/results');
    } catch (error) {
      console.error('submission error:', error);
      setError('submission failed. please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Context Calibration - calm.profile</title>
        <meta name="description" content="Calibrate your assessment for team-scaled ROI calculations" />
      </Head>
      
      <div className="context-container">
        <div className="context-card">
          <h2 className="context-title">context calibration</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">team size</label>
              <select 
                className="form-select"
                value={context.teamSize}
                onChange={(e) => setContext({...context, teamSize: e.target.value})}
                required
              >
                <option value="">select...</option>
                <option value="solo">solo</option>
                <option value="2-5">2-5 people</option>
                <option value="6-15">6-15 people</option>
                <option value="16-50">16-50 people</option>
                <option value="50+">50+ people</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">meeting density</label>
              <select 
                className="form-select"
                value={context.meetingLoad}
                onChange={(e) => setContext({...context, meetingLoad: e.target.value})}
                required
              >
                <option value="">select...</option>
                <option value="light">&lt;5 hours/week</option>
                <option value="moderate">5-15 hours/week</option>
                <option value="heavy">&gt;15 hours/week</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">hourly rate ($)</label>
              <select 
                className="form-select"
                value={context.hourlyRate}
                onChange={(e) => setContext({...context, hourlyRate: e.target.value})}
                required
              >
                <option value="">select...</option>
                <option value="50">50</option>
                <option value="75">75</option>
                <option value="100">100</option>
                <option value="125">125</option>
                <option value="150">150</option>
                <option value="200">200+</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">primary platform</label>
              <select 
                className="form-select"
                value={context.platform}
                onChange={(e) => setContext({...context, platform: e.target.value})}
                required
              >
                <option value="">select...</option>
                <option value="google">google workspace</option>
                <option value="microsoft">microsoft 365</option>
                <option value="slack">slack</option>
                <option value="mixed">mixed/other</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'calculating...' : 'calculate roi'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}