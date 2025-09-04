"use client";

import { useState } from 'react';
import { startAssessment } from '@/lib/assessment';
import Progress from '@/components/Progress';

export default function AssessmentPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const questions = [
    { id: 'q1', question: 'What is your experience level?', options: ['Beginner', 'Intermediate', 'Advanced'] },
    { id: 'q2', question: 'Which technology are you most interested in?', options: ['React', 'Vue', 'Angular'] },
    { id: 'q3', question: 'How many hours per week can you dedicate to learning?', options: ['1-3 hours', '4-6 hours', '7+ hours'] },
  ];

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsSubmitted(true);
      startAssessment(answers);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">Assessment Complete!</h1>
          <p className="mb-6">Thank you for completing the assessment. Your results are being processed.</p>
          <button 
            onClick={() => window.location.href = '/results'}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            View Results
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Assessment</h1>
        
        <Progress currentStep={currentStep} totalSteps={questions.length} />
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">{questions[currentStep].question}</h2>
          <div className="space-y-3">
            {questions[currentStep].options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(questions[currentStep].id, option)}
                className={`w-full text-left p-3 rounded-lg border ${
                  answers[questions[currentStep].id] === option
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`px-4 py-2 rounded ${
              currentStep === 0 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          >
            Previous
          </button>
          
          <button
            onClick={handleNext}
            disabled={!answers[questions[currentStep].id]}
            className={`px-4 py-2 rounded ${
              !answers[questions[currentStep].id]
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {currentStep === questions.length - 1 ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
