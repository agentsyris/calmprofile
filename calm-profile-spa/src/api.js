import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const submitAssessment = async ({ responses, context }) => {
  try {
    const response = await axios.post(`${API_URL}/api/assess`, {
      responses,
      context
    });
    return response.data;
  } catch (error) {
    console.error('Assessment submission error:', error);
    throw error;
  }
};

export const createCheckout = async (email, assessmentId) => {
  try {
    const response = await axios.post(`${API_URL}/api/create-checkout`, {
      email,
      assessment_id: assessmentId
    });
    return response.data;
  } catch (error) {
    console.error('Checkout creation error:', error);
    throw error;
  }
};