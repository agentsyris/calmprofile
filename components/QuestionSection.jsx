import React, { useEffect } from 'react'
export default function QuestionSection({
  question, questionIndex, answer, onSelectAnswer, onNext, onPrevious, isFirst, isLast
}) {
  const pick = (c) => onSelectAnswer(questionIndex, c)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key.toLowerCase() === 'a') pick('A')
      if (e.key.toLowerCase() === 'b') pick('B')
      if (e.key === 'ArrowRight' || e.key === 'Enter') { if (answer) onNext() }
      if (e.key === 'ArrowLeft') onPrevious()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [answer, onNext, onPrevious])
  return (
    <section className="question-section active">
      <div className="question-context">{question.context}</div>
      <div className="question-statement">{question.statement}</div>
      <div className="choice-container">
        <button className={`choice-option ${answer === 'A' ? 'selected' : ''}`} onClick={() => pick('A')}>{question.optionA}<span className="choice-letter">A</span></button>
        <button className={`choice-option ${answer === 'B' ? 'selected' : ''}`} onClick={() => pick('B')}>{question.optionB}<span className="choice-letter">B</span></button>
      </div>
      <div className="nav-buttons">
        <button className="btn btn-secondary" onClick={onPrevious} disabled={isFirst}>← previous</button>
        <button className="btn" onClick={onNext} disabled={!answer}>{isLast ? 'continue →' : 'next →'}</button>
      </div>
    </section>
  )
}
