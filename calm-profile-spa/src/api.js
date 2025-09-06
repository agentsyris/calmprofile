import axios from 'axios';
const raw = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = raw.replace(/\/+$/, '');

export const submitAssessment = async ({ responses, context }) =>
  (await axios.post(`${API_URL}/api/assess`, { responses, context })).data;

export const createCheckout = async (email, assessmentId) =>
  (await axios.post(`${API_URL}/api/create-checkout`, { email, assessment_id: assessmentId })).data;
