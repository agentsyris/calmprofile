import axios from 'axios';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');

async function post(path, payload) {
  const res = await axios.post(`${API_BASE}${path}`, payload, {
    headers: { 'content-type': 'application/json' },
  });
  return res.data;
}

export const submitAssessment = async ({ responses, context }) => {
  return post('/api/assess', { responses, context });
};

export const createCheckout = async (email, assessmentId) => {
  return post('/create-checkout-session', {  // Remove '/api' prefix
    email,
    assessment_id: assessmentId,
  });
};
