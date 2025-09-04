import express from 'express'
const app = express()
app.use(express.json())

app.post('/api/assess', (req, res) => {
  res.json({
    success: true,
    assessment_id: 'cp_mock_123',
    archetype: { primary: 'architect' },
    scores: { overhead_index: 62, axes: { structure: 78, collaboration: 42, scope: 55, tempo: 68 } },
    metrics: { hours_lost_ppw: 12, annual_cost: 81000 },
    recommendations: {
      strengths: ['repeatable delivery', 'risk foresight'],
      quick_wins: ['convert daily standup to async form + weekly live review'],
      tool_stack: ['m365', 'planner', 'sharepoint']
    }
  })
})

app.post('/api/create-checkout', (req, res) => {
  res.json({ checkout_url: 'http://localhost:3000/thank-you?session_id=cp_mock_12345678' })
})

app.listen(5000, () => console.log('mock api on :5000'))
