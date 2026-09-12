import axios from 'axios';

// Base API URL points to local/serverless endpoints
const API_BASE = '/api';

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

/**
 * 1. Analyze Resume and Job Description Match
 */
export async function analyzeResumeAndJD(resumeText, jobDescription) {
  try {
    const response = await client.post('/analyze', {
      resumeText,
      jobDescription,
    });
    return response.data;
  } catch (error) {
    console.error('API Error in analyzeResumeAndJD:', error);
    // Fallback in case of serverless timeout or offline mode
    throw new Error(error.response?.data?.error || 'Failed to analyze resume and job description. Please check inputs and try again.');
  }
}

/**
 * 2. Initialize and Start Interview
 */
export async function startInterviewSession(config) {
  try {
    const response = await client.post('/interview/start', config);
    return response.data;
  } catch (error) {
    console.error('API Error in startInterviewSession:', error);
    throw new Error(error.response?.data?.error || 'Failed to start interview session.');
  }
}

/**
 * 3. Submit and Evaluate Answer, Adapt Next Question
 */
export async function submitInterviewAnswer(payload) {
  try {
    const response = await client.post('/interview/answer', payload);
    return response.data;
  } catch (error) {
    console.error('API Error in submitInterviewAnswer:', error);
    throw new Error(error.response?.data?.error || 'Failed to submit answer.');
  }
}

/**
 * 4. Evaluate Code Submission
 */
export async function evaluateCodeSubmission(payload) {
  try {
    const response = await client.post('/interview/coding', payload);
    return response.data;
  } catch (error) {
    console.error('API Error in evaluateCodeSubmission:', error);
    throw new Error(error.response?.data?.error || 'Failed to evaluate code.');
  }
}

/**
 * 5. Generate Final Comprehensive Report
 */
export async function generateFinalReport(payload) {
  try {
    const response = await client.post('/interview/final', payload);
    return response.data;
  } catch (error) {
    console.error('API Error in generateFinalReport:', error);
    throw new Error(error.response?.data?.error || 'Failed to generate final report.');
  }
}
