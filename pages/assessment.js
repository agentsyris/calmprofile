import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { questions } from '../data/questions';

export default function AssessmentPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('assessmentResponses');
    if (saved) {
      try {
        setResponses(JSON.parse(saved));
      } catch(e) {
        console.error('Error loading saved responses:', e);
      }
    }
  }, []);

  const handleAnswer = (answer) => {
    const updatedResponses = { ...responses, [currentQuestion]: answer };
    setResponses(updatedResponses);
    localStorage.setItem('assessmentResponses', JSON.stringify(updatedResponses));
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      router.push('/context');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Fixed progress calculation
  const progress = (((currentQuestion + 1) / questions.length) * 100).toFixed(0);
  const question = questions[currentQuestion];

  return (
    <>
      <Head>
        <title>Assessment - calm.profile</title>
        <meta name="description" content="20 questions to reveal your workstyle archetype" />
      </Head>
      
      <div className="assessment-container">
        <div className="progress-wrapper">
          <div className="progress-label">
            <span>assessment progress</span>
            {/* Fixed progress display */}
            <span>{currentQuestion + 1} of {questions.length}</span>
          </div>
          <div className="progress-bar">
            <div 
              className={`progress-fill ${progress === '100' ? 'complete' : ''}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="question-card">
          <span className="context-badge">{question.context}</span>
          <h2 className="question-text">{question.statement}</h2>
          
          <button 
            className={`answer-button ${responses[currentQuestion] === 'A' ? 'selected' : ''}`}
            onClick={() => handleAnswer('A')}
          >
            <span className="answer-label">a</span>
            {question.optionA}
          </button>
          
          <button 
            className={`answer-button ${responses[currentQuestion] === 'B' ? 'selected' : ''}`}
            onClick={() => handleAnswer('B')}
          >
            <span className="answer-label">b</span>
            {question.optionB}
          </button>
        </div>

        <div className="nav-container">
          <button 
            className="nav-button" 
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            previous
          </button>
          
          <span className="nav-status">
            {currentQuestion + 1}/{questions.length}
          </span>
          
          <button 
            className="nav-button" 
            disabled={!responses[currentQuestion]}
            onClick={() => {
              if (currentQuestion === questions.length - 1) {
                router.push('/context');
              }
            }}
          >
            {currentQuestion === questions.length - 1 ? 'complete' : 'next'}
          </button>
        </div>
      </div>
    </>
  );
}