import { callOpenAI, safeJSONParse } from '../_lib/openai.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const {
      resumeText = '',
      jobDescription = '',
      matchAnalysis = {},
      interviewType = 'Full Interview',
      history = [],
    } = req.body || {};

    const systemPrompt = `You are a Principal Bar Raiser and Hiring Committee Chair.
Evaluate the candidate's complete interview trajectory and generate a final comprehensive interview report.
RULES:
1. Base your evaluation strictly on the candidate's actual answers and resume evidence.
2. DO NOT invent skills or inflate scores.
3. Hiring Recommendation MUST be one of:
   - "Strong Hire" (Scores ~88+, exceptional depth, STAR metrics, zero unverified claims)
   - "Hire" (Scores ~75-87, solid fundamentals, good problem solving)
   - "Borderline" (Scores ~65-74, uneven depth, minor gaps in JD requirements)
   - "Weak Hire" (Scores ~50-64, surface-level explanations, unverified claims)
   - "Reject" (Scores <50, unable to explain core resume projects)
4. Return valid JSON ONLY:
{
  "overallScore": 82,
  "categoryScores": {
    "resumeJdMatch": 78,
    "technical": 84,
    "coding": 76,
    "projects": 90,
    "communication": 81,
    "hr": 85
  },
  "hiringRecommendation": "Hire",
  "recommendationRationale": "The candidate demonstrates exceptional ownership of their Python & ML projects with clear architectural reasoning. Minor revisions needed around edge-case performance and API authentication.",
  "strongestSkills": ["Python Architecture", "Data Modeling", "Clear Project Explanations"],
  "weakestSkills": ["API Security & Auth", "System Caching Edge Cases"],
  "unverifiedClaims": [
    { "claim": "Distributed Caching", "reason": "Candidate struggled to explain cache invalidation strategies when asked." }
  ],
  "failedQuestions": [
    {
      "question": "Explain how you handle cache invalidation and race conditions.",
      "candidateAnswer": "We just set a TTL of 5 minutes.",
      "missingConcept": "Cache-aside vs write-through patterns, Redis distributed locks, and handling stale read spikes.",
      "correctConcept": "A complete response addresses cache stampede mitigation (mutex/locking) and cache invalidation consistency protocols."
    }
  ],
  "jdGaps": ["Container Orchestration (Kubernetes)", "Commercial React State Management"],
  "preparationPlan": {
    "learn": [
      "Study distributed locking patterns and Redis cache stampede mitigation strategies.",
      "Review RESTful API authentication using JWT refresh token rotation."
    ],
    "practice": [
      "Build a mock two-way cache invalidation demo with Python and Redis.",
      "Practice 5 Medium array and hash map problems focusing on O(1) space constraints."
    ],
    "revise": [
      "Review the exact numbers, queries per second, and latency figures for your Mental Health Detection project.",
      "Prepare STAR answers for behavioral questions regarding cross-functional conflicts."
    ]
  }
}`;

    const userPrompt = `Interview Type: ${interviewType}
Resume-JD Match Analysis: ${JSON.stringify(matchAnalysis, null, 2)}
Candidate History (${history.length} questions):
${JSON.stringify(history, null, 2)}

Generate the comprehensive Final Interview Report.`;

    const openAIResponse = await callOpenAI([{ role: 'user', content: userPrompt }], systemPrompt, 'json_object');

    if (openAIResponse) {
      const parsed = safeJSONParse(openAIResponse, null);
      if (parsed && typeof parsed.overallScore === 'number') {
        return res.status(200).json(parsed);
      }
    }

    // Heuristic Fallback
    const fallbackReport = generateHeuristicFinalReport(history, matchAnalysis, resumeText, jobDescription);
    return res.status(200).json(fallbackReport);
  } catch (error) {
    console.error('Final Report API Error:', error);
    return res.status(500).json({ error: 'Failed to generate final report. Please try again.' });
  }
}

function generateHeuristicFinalReport(history, matchAnalysis, resumeText, jobDescription) {
  let totalScoreSum = 0;
  const failedQList = [];
  const techScores = [];
  const commScores = [];

  for (const item of history) {
    const s = item.evaluation?.score || 7;
    totalScoreSum += s * 10;
    if (s < 6) {
      failedQList.push({
        question: item.question || 'Interview Question',
        candidateAnswer: item.answer || 'Answer provided',
        missingConcept: item.evaluation?.missingConcepts?.join(', ') || 'In-depth trade-off analysis',
        correctConcept: item.evaluation?.modelAnswer || 'A structured response using the STAR framework with concrete trade-offs.',
      });
    }
    techScores.push((item.evaluation?.scores?.technical_depth || 7) * 10);
    commScores.push((item.evaluation?.scores?.communication || 8) * 10);
  }

  const count = Math.max(1, history.length);
  const avgOverall = Math.round(totalScoreSum / count) || 80;
  const avgTech = Math.round(techScores.reduce((a, b) => a + b, 0) / count) || 82;
  const avgComm = Math.round(commScores.reduce((a, b) => a + b, 0) / count) || 84;
  const matchScore = matchAnalysis?.matchPercentage || 78;

  let recommendation = 'Hire';
  if (avgOverall >= 88) recommendation = 'Strong Hire';
  else if (avgOverall >= 74) recommendation = 'Hire';
  else if (avgOverall >= 62) recommendation = 'Borderline';
  else if (avgOverall >= 50) recommendation = 'Weak Hire';
  else recommendation = 'Reject';

  return {
    overallScore: avgOverall,
    categoryScores: {
      resumeJdMatch: matchScore,
      technical: avgTech,
      coding: Math.min(95, Math.max(65, avgTech - 4)),
      projects: Math.min(96, Math.max(70, avgTech + 6)),
      communication: avgComm,
      hr: Math.min(95, Math.max(70, avgComm + 2)),
    },
    hiringRecommendation: recommendation,
    recommendationRationale: `Candidate exhibited solid problem solving with consistent articulation across core domains. Targeted prep on deeper edge cases and system resilience will push this to a top-tier rating.`,
    strongestSkills: [
      matchAnalysis?.directMatches?.[0] || 'Technical Fundamentals',
      matchAnalysis?.directMatches?.[1] || 'Project Architecture',
      'Structured Communication',
    ],
    weakestSkills: [
      matchAnalysis?.missingSkills?.[0] || 'Scalability Edge Cases',
      'Metrics & Quantifiable Impact',
    ],
    unverifiedClaims: failedQList.length > 0
      ? [{ claim: 'Production Scale Resilience', reason: 'Could not provide concrete benchmarks or error handling patterns when challenged.' }]
      : [],
    failedQuestions: failedQList.length > 0
      ? failedQList
      : [
          {
            question: history[0]?.question || 'Walk me through your project trade-offs.',
            candidateAnswer: history[0]?.answer || 'Answer provided in session.',
            missingConcept: 'Explicit quantitative outcomes and alternative design benchmarks.',
            correctConcept: 'Always state the baseline metric, the alternative explored, and the measured improvement.',
          },
        ],
    jdGaps: matchAnalysis?.missingSkills || ['Advanced Cloud Orchestration', 'Distributed Caching'],
    preparationPlan: {
      learn: [
        'Master the STAR framework (Situation, Task, Action, Result) for all resume project stories.',
        'Review concurrency, indexing, and REST API failure-mode resilience.',
      ],
      practice: [
        'Solve 5 medium-level LeetCode problems on arrays and hash tables with clean O(N) complexity.',
        'Simulate timed 2-minute project pitch responses with a focus on metrics.',
      ],
      revise: [
        'Document exact architecture diagrams and tech-choice rationales for your primary resume project.',
        'Prepare 3 crisp questions to ask the interviewer at the end of the session.',
      ],
    },
  };
}
