import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IntroSection from './components/IntroSection';
import Assessment from './components/Assessment';
import AssessmentContext from './components/AssessmentContext';
import Results from './components/Results';
import ThankYou from './components/ThankYou';

function App() {
  const [responses, setResponses] = useState({});
  const [assessmentResult, setAssessmentResult] = useState(null);

  useEffect(() => {
    const savedResponses = localStorage.getItem('assessmentResponses');
    const savedResult = localStorage.getItem('assessmentResult');
    if (savedResponses) { 
      try { 
        const parsed = JSON.parse(savedResponses);
        // Only restore if not a complete set (avoid auto-fill issue)
        if (Object.keys(parsed).length < 20) {
          setResponses(parsed);
        }
      } catch(e) {
        console.error('Error loading saved responses:', e);
      }
    }
    if (savedResult) { 
      try { 
        setAssessmentResult(JSON.parse(savedResult)); 
      } catch(e) {
        console.error('Error loading saved result:', e);
      }
    }
  }, []);

  const handleResponsesComplete = (newResponses) => {
    setResponses(newResponses);
    localStorage.setItem('assessmentResponses', JSON.stringify(newResponses));
  };

  const handleAssessmentComplete = (result) => {
    setAssessmentResult(result);
    localStorage.setItem('assessmentResult', JSON.stringify(result));
    if (result.assessment_id) {
      localStorage.setItem('assessmentId', result.assessment_id);
    }
  };

  const handleReset = () => {
    setResponses({});
    setAssessmentResult(null);
    localStorage.removeItem('assessmentResponses');
    localStorage.removeItem('assessmentResult');
    localStorage.removeItem('assessmentId');
    // Clear all localStorage to ensure fresh start
    localStorage.clear();
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<IntroSection />} />
        
        <Route path="/assessment" element={
          <Assessment 
            onComplete={handleResponsesComplete} 
            existingResponses={responses} 
          />
        } />
        
        <Route path="/context" element={
          Object.keys(responses).length === 20 ? (
            <AssessmentContext 
              responses={responses} 
              onComplete={handleAssessmentComplete} 
            />
          ) : <Navigate to="/assessment" replace />
        } />
        
        <Route path="/results" element={
          assessmentResult ? (
            <Results 
              result={assessmentResult} 
              onReset={handleReset} 
            />
          ) : <Navigate to="/" replace />
        } />

        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/thank-you/" element={<ThankYou />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;