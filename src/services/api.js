import axios from 'axios'
const api = axios.create({ baseURL: '/api', headers: { 'Content-Type': 'application/json' } })

export async function submitAssessment(data) {
  try {
    const r = await api.post('/assess', data)
    if (r.data.success) return r.data
    throw new Error(r.data.error || 'Assessment failed')
  } catch (e) {
    if (e.response) throw new Error(e.response.data.error || 'Server error')
    if (e.request) throw new Error('Network error - please check your connection')
    throw new Error('An unexpected error occurred')
  }
}

export async function createCheckout(email, assessment_id) {
  try {
    const r = await api.post('/create-checkout', { email, assessment_id })
    return r.data
  } catch {
    throw new Error('Failed to create checkout session')
  }
}
