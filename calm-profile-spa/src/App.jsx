import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import IntroSection from "./components/IntroSection";
import Assessment from "./components/Assessment";
import AssessmentContext from "./components/AssessmentContext";
import Results from "./components/Results";
import ThankYou from "./components/ThankYou";
import ErrorBoundary from "./components/ErrorBoundary";
import "./styles/error-boundary.css";

function App() {
  const [responses, setResponses] = useState({});
  const [assessmentResult, setAssessmentResult] = useState(null);

  useEffect(() => {
    const savedResponses = localStorage.getItem("assessmentResponses");
    const savedResult = localStorage.getItem("assessmentResult");
    if (savedResponses) {
      try {
        setResponses(JSON.parse(savedResponses));
      } catch (e) {
        console.error("Error loading saved responses:", e);
      }
    }
    if (savedResult) {
      try {
        setAssessmentResult(JSON.parse(savedResult));
      } catch (e) {
        console.error("Error loading saved result:", e);
      }
    }
  }, []);

  const handleResponsesComplete = (newResponses) => {
    setResponses(newResponses);
    localStorage.setItem("assessmentResponses", JSON.stringify(newResponses));
  };

  const handleAssessmentComplete = (result) => {
    setAssessmentResult(result);
    localStorage.setItem("assessmentResult", JSON.stringify(result));
    if (result.assessment_id) {
      localStorage.setItem("assessmentId", result.assessment_id);
    }
  };

  const handleReset = () => {
    setResponses({});
    setAssessmentResult(null);
    localStorage.removeItem("assessmentResponses");
    localStorage.removeItem("assessmentResult");
    localStorage.removeItem("assessmentId");
  };

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<IntroSection />} />

          <Route
            path="/assessment"
            element={
              <ErrorBoundary>
                <Assessment
                  onComplete={handleResponsesComplete}
                  existingResponses={responses}
                />
              </ErrorBoundary>
            }
          />

          <Route
            path="/context"
            element={
              Object.keys(responses).length === 20 ? (
                <ErrorBoundary>
                  <AssessmentContext
                    responses={responses}
                    onComplete={handleAssessmentComplete}
                  />
                </ErrorBoundary>
              ) : (
                <Navigate to="/assessment" replace />
              )
            }
          />

          <Route
            path="/results"
            element={
              assessmentResult ? (
                <ErrorBoundary>
                  <Results result={assessmentResult} onReset={handleReset} />
                </ErrorBoundary>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/thank-you/" element={<ThankYou />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
