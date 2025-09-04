import React, { useState, useCallback } from 'react'
import Layout from './components/Layout'
import ProgressBar from './components/ProgressBar'
import IntroSection from './components/IntroSection'
import QuestionSection from './components/QuestionSection'
import MetaSection from './components/MetaSection'
import ResultsSection from './components/ResultsSection'
import LoadingSpinner from './components/LoadingSpinner'
import { submitAssessment } from './services/api'
import { questions } from './data/questions'

export default function App() {
  const [currentStep, setCurrentStep] = useState('intro')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [metadata, setMetadata] = useState({ team_size: '', meetings: '', platform: '' })
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const progress = currentStep === 'intro' ? 0 :
    currentStep === 'questions' ? ((currentQuestion + 1) / questions.length) * 90 :
    currentStep === 'meta' ? 95 :
    currentStep === 'results' ? 100 : 0

  const startAssessment = useCallback(() => {
    setCurrentStep('questions'); setCurrentQuestion(0); setAnswers({}); setError(null)
  }, [])

  const selectAnswer = useCallback((i, choice) => {
    setAnswers(prev => ({ ...prev, [i]: choice }))
  }, [])

  const nextQuestion = useCallback(() => {
    if (currentQuestion < questions.length - 1) setCurrentQuestion(q => q + 1)
    else setCurrentStep('meta')
  }, [currentQuestion])

  const previousQuestion = useCallback(() => {
    if (currentQuestion > 0) setCurrentQuestion(q => q - 1)
  }, [currentQuestion])

  const previousFromMeta = useCallback(() => {
    setCurrentStep('questions'); setCurrentQuestion(questions.length - 1)
  }, [])

  const updateMetadata = useCallback((field, value) => {
    setMetadata(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleSubmit = useCallback(async () => {
    setLoading(true); setError(null); setCurrentStep('loading')
    try {
      const data = await submitAssessment({ responses: answers, meta: metadata })
      setResults(data); setCurrentStep('results')
    } catch (err) {
      setError(err.message); setCurrentStep('meta')
    } finally {
      setLoading(false)
    }
  }, [answers, metadata])

  const restart = useCallback(() => {
    setCurrentStep('intro'); setCurrentQuestion(0); setAnswers({})
    setMetadata({ team_size: '', meetings: '', platform: '' })
    setResults(null); setError(null)
  }, [])

  return (
    <Layout>
      <div className="container">
        {currentStep !== 'intro' && (
          <ProgressBar progress={progress} currentQuestion={currentQuestion} totalQuestions={questions.length} currentStep={currentStep}/>
        )}
        {error && <div className="error-message"><p>Error: {error}</p></div>}
        {currentStep === 'intro' && <IntroSection onStart={startAssessment}/>}
        {currentStep === 'questions' && (
          <QuestionSection
            question={questions[currentQuestion]}
            questionIndex={currentQuestion}
            answer={answers[currentQuestion]}
            onSelectAnswer={selectAnswer}
            onNext={nextQuestion}
            onPrevious={previousQuestion}
            isFirst={currentQuestion === 0}
            isLast={currentQuestion === questions.length - 1}
          />
        )}
        {currentStep === 'meta' && (
          <MetaSection
            metadata={metadata}
            onUpdateMetadata={updateMetadata}
            onSubmit={handleSubmit}
            onPrevious={previousFromMeta}
            isValid={metadata.team_size && metadata.meetings && metadata.platform}
          />
        )}
        {currentStep === 'loading' && <LoadingSpinner message="analyzing your responses..." />}
        {currentStep === 'results' && results && <ResultsSection results={results} onRestart={restart}/>}
      </div>
    </Layout>
  )
}
