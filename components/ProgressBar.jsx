import React from 'react'
export default function ProgressBar({ progress, currentQuestion, totalQuestions, currentStep }) {
  const text = () => currentStep === 'questions' ? `question ${currentQuestion + 1} of ${totalQuestions}`
    : currentStep === 'meta' ? 'finalizing' : currentStep === 'results' ? 'complete' : ''
  return (
    <div className="progress-container">
      <div className="progress-bar" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin="0" aria-valuemax="100" aria-label={text()}>
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="progress-text">{text()}</div>
    </div>
  )
}
