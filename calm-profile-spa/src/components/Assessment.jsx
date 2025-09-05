import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions } from '../questions';

const Assessment = ({ onComplete, existingResponses = {} }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState(existingResponses);
  const navigate = useNavigate();

  const handleAnswer = (answer) => {
    const updatedResponses = { ...responses, [currentQuestion]: answer };
    setResponses(updatedResponses);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onComplete(updatedResponses);
      navigate('/context');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const progress = ((Object.keys(responses).length / questions.length) * 100).toFixed(0);
  const question = questions[currentQuestion];

  return (
    <div className="assessment-container">
      <div className="progress-wrapper">
        <div className="progress-label">
          <span>assessment progress</span>
          <span>{Object.keys(responses).length} of {questions.length}</span>
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
        >
          {currentQuestion === questions.length - 1 ? 'complete' : 'next'}
        </button>
      </div>
    </div>
  );
};

export default Assessment;