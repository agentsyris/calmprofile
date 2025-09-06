import axios from 'axios';

// Fixed API base URL to use your deployed backend
const API_BASE = 'https://calm-profile-api-9uhe.onrender.com';

async function post(path, payload) {
  const res = await axios.post(`${API_BASE}${path}`, payload, {
    headers: { 'content-type': 'application/json' },
  });
  return res.data;
}

export const submitAssessment = async ({ responses, context }) => {
  return post('/api/assess', { responses, context });
};

// Fixed endpoint path to match backend
export const createCheckout = async (email, assessmentId) => {
  return post('/create-checkout-session', {
    email,
    assessment_id: assessmentId,
  });
};