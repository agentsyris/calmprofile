import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitAssessment } from "../api";

const AssessmentContext = ({ responses, onComplete }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState({
    teamSize: '',
    meetingLoad: '',
    hourlyRate: '',
    platform: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!context.teamSize || !context.meetingLoad || !context.hourlyRate) return;
    
    setLoading(true);
    try {
      const result = await submitAssessment({ responses, context });
      onComplete(result);
      navigate('/results');
    } catch (error) {
      console.error('submission error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="context-container">
      <div className="context-card">
        <h2 className="context-title">context calibration</h2>
        
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
            disabled={loading || !context.teamSize || !context.meetingLoad || !context.hourlyRate}
          >
            {loading ? 'calculating...' : 'calculate roi'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssessmentContext;