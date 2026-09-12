import { callOpenAI, safeJSONParse } from '../_lib/openai.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const {
      resumeText,
      jobDescription,
      matchAnalysis = {},
      interviewType = 'Full Interview',
      difficulty = 'Adaptive',
      totalQuestions = 15,
    } = req.body || {};

    const {
      directMatches = [],
      missingSkills = [],
      requirements = [],
    } = matchAnalysis;

    const systemPrompt = `You are an expert, professional technical interviewer conducting an interview for the target role.
RULES:
1. Ground questions directly in the candidate's actual resume projects, verified skills (${directMatches.slice(0, 4).join(', ')}), and the target JD requirements.
2. If the candidate has verified projects, prioritize a deep dive into the architecture and decisions of their real projects.
3. If critical JD skills are missing (${missingSkills.slice(0, 3).join(', ')}), you may later test their theoretical fundamentals without assuming prior commercial experience.
4. Ask exactly ONE clear, focused question.
5. Return valid JSON only:
{
  "question": "Question text here...",
  "stage": "Technical | Project Deep Dive | Coding | HR",
  "category": "Architecture | Fundamentals | Behavioral | Problem Solving",
  "difficulty": "Medium",
  "targetSkill": "Python / FastAPI",
  "guidance": "Brief tip for the candidate on what a good answer covers."
}`;

    const userPrompt = `Interview Type: ${interviewType}
Difficulty: ${difficulty}
Total Questions: ${totalQuestions}
Verified Direct Matches: ${directMatches.join(', ')}
Identified Gaps: ${missingSkills.join(', ')}

Target Job Description:
"""
${(jobDescription || '').slice(0, 2000)}
"""

Candidate Resume:
"""
${(resumeText || '').slice(0, 2000)}
"""

Generate the first interview question.`;

    const openAIResponse = await callOpenAI([{ role: 'user', content: userPrompt }], systemPrompt, 'json_object');

    if (openAIResponse) {
      const parsed = safeJSONParse(openAIResponse, null);
      if (parsed && parsed.question) {
        return res.status(200).json({
          sessionId: `sess_${Date.now()}`,
          questionNumber: 1,
          totalQuestions: Number(totalQuestions) || 15,
          interviewType,
          difficulty: difficulty || 'Adaptive',
          ...parsed,
        });
      }
    }

    // Heuristic opening question
    const defaultQuestion = generateDefaultFirstQuestion(resumeText, interviewType, matchAnalysis);
    return res.status(200).json({
      sessionId: `sess_${Date.now()}`,
      questionNumber: 1,
      totalQuestions: Number(totalQuestions) || 15,
      interviewType,
      question: defaultQuestion.question,
      stage: defaultQuestion.stage,
      category: defaultQuestion.category,
      difficulty: difficulty || 'Adaptive (Level 1)',
      targetSkill: defaultQuestion.targetSkill,
      guidance: 'Be structured: explain the problem context, your technical approach, and the impact.',
    });
  } catch (error) {
    console.error('Interview Start Error:', error);
    return res.status(500).json({ error: 'Failed to start interview. Please try again.' });
  }
}

function generateDefaultFirstQuestion(resumeText, interviewType, matchAnalysis = {}) {
  const text = (resumeText || '').toLowerCase();
  
  if (interviewType === 'Coding') {
    return {
      question: "Let's begin with a coding challenge. Write a function in Python or JavaScript that finds the second largest element in an unsorted array without using built-in sort functions. Explain the time and space complexity.",
      stage: 'Coding',
      category: 'Data Structures & Algorithms',
      targetSkill: 'Arrays & Logic',
    };
  }

  if (interviewType === 'HR') {
    return {
      question: "Welcome! To start, could you walk me through your background, highlighting the key projects you've built and why you are excited about this role?",
      stage: 'HR',
      category: 'Behavioral',
      targetSkill: 'Introduction & Role Fit',
    };
  }

  // Extract a project or prominent skill if mentioned
  if (text.includes('mental health') || text.includes('detection')) {
    return {
      question: "I noticed your Mental Health Detection project on your resume. Walk me through the problem it solves, the architecture you designed, and the key trade-off you had to make.",
      stage: 'Project Deep Dive',
      category: 'Architecture & Decisions',
      targetSkill: 'Machine Learning & Python',
    };
  }

  if (text.includes('fastapi') || text.includes('backend')) {
    return {
      question: "You've worked with backend development and API design. How do you approach designing a resilient REST API, and how do you handle asynchronous requests and database connection pooling?",
      stage: 'Technical',
      category: 'Backend Architecture',
      targetSkill: 'REST APIs & Databases',
    };
  }

  return {
    question: "Walk me through the most technically challenging project you have worked on. What was the core problem, what architectural choices did you make, and what did you learn?",
    stage: 'Project Deep Dive',
    category: 'System Architecture',
    targetSkill: 'Problem Solving & Architecture',
  };
}
