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
      currentQuestion = '',
      answer = '',
      questionNumber = 1,
      totalQuestions = 15,
      interviewType = 'Full Interview',
      difficulty = 'Adaptive',
      history = [],
      stage = 'Technical',
      thinkingTimeSeconds = 0,
    } = req.body || {};

    if (!answer || !answer.trim()) {
      return res.status(400).json({ error: 'Answer is required.' });
    }

    const isFinalQuestion = questionNumber >= Number(totalQuestions);

    const systemPrompt = `You are a world-class, objective AI Interview Coach evaluating a candidate's answer in real-time.
RULES FOR EVALUATION:
1. Evaluate on 7 dimensions (0 to 10 each):
   - correctness
   - technical_depth
   - relevance
   - clarity
   - confidence
   - communication
   - resume_consistency
2. Provide a numerical score from 1 to 10 for the overall answer quality.
3. Provide concise, constructive feedback:
   - "good": 1-2 bullet strings describing what was strong
   - "improve": 1-2 bullet strings on what was missing or how to elevate the response
   - "missingConcepts": technical terms, trade-offs, or numbers they should have mentioned
   - "modelAnswer": A stellar 2-3 sentence example answer using the STAR technique (Situation, Task, Action, Result)
4. GENERATE THE NEXT QUESTION (if not final):
   - If answer was strong (score >= 8): Increase difficulty, ask deep architectural or scale/edge-case follow-up.
   - If answer was partial (score 5-7): Ask a targeted follow-up to test nuances or trade-offs.
   - If answer was weak (score < 5): Ask a simpler question to test fundamental understanding.
   - Ground questions in their actual resume and target JD.
   - For Project Deep Dive, follow levels: Problem -> Tech Stack -> Architecture -> Individual Contribution -> Hard Technical Problems -> Scalability/Future Improvements.
   - Switch stages appropriately across the interview (Technical -> Coding -> HR).
5. Return JSON ONLY matching this structure:
{
  "evaluation": {
    "score": 8,
    "scores": {
      "correctness": 8,
      "technical_depth": 7,
      "relevance": 9,
      "clarity": 8,
      "confidence": 8,
      "communication": 8,
      "resume_consistency": 9
    },
    "good": "You clearly explained the primary architectural components and justified the technology choices.",
    "improve": "Add concrete metrics and mention how you handled edge cases or concurrency.",
    "missingConcepts": ["Database indexing", "Caching strategy", "Latency metrics"],
    "modelAnswer": "In my Mental Health Detection project, we parsed text using NLP pipelines. I chose Random Forest because of its interpretability with high-dimensional TF-IDF vectors, reducing latency to under 45ms while maintaining 89% precision."
  },
  "isFinished": ${isFinalQuestion},
  "nextQuestion": {
    "question": "Next question text here...",
    "stage": "Technical | Project Deep Dive | Coding | HR",
    "category": "Scaling | Algorithms | Behavioral | System Design",
    "difficulty": "Medium | Hard | Fundamentals",
    "targetSkill": "Skill name",
    "guidance": "Brief hint"
  }
}`;

    const userPrompt = `Candidate Resume:
"""
${resumeText.slice(0, 2000)}
"""

Target JD:
"""
${jobDescription.slice(0, 2000)}
"""

Current Question (${questionNumber} of ${totalQuestions}):
"${currentQuestion}"

Candidate Answer:
"""
${answer}
"""

Thinking Time: ${thinkingTimeSeconds}s
Interview Type: ${interviewType} | Difficulty Mode: ${difficulty}
Previous history length: ${history.length} questions

Evaluate the answer and generate the next question.`;

    const openAIResponse = await callOpenAI([{ role: 'user', content: userPrompt }], systemPrompt, 'json_object');

    if (openAIResponse) {
      const parsed = safeJSONParse(openAIResponse, null);
      if (parsed && parsed.evaluation) {
        return res.status(200).json({
          questionNumber: Number(questionNumber),
          totalQuestions: Number(totalQuestions),
          ...parsed,
        });
      }
    }

    // Heuristic Evaluation Fallback
    const fallbackEval = evaluateAnswerHeuristically(
      answer,
      currentQuestion,
      resumeText,
      jobDescription,
      questionNumber,
      totalQuestions,
      interviewType
    );

    return res.status(200).json(fallbackEval);
  } catch (error) {
    console.error('Answer Evaluation Error:', error);
    return res.status(500).json({ error: 'Failed to evaluate answer. Please try again.' });
  }
}

function evaluateAnswerHeuristically(answer, question, resume, jd, qNum, totalQ, type) {
  const words = answer.trim().split(/\s+/);
  const wordCount = words.length;
  const isFinal = qNum >= totalQ;

  // Signal detectors
  const hasReasoning = /\b(because|trade-off|tradeoff|therefore|why|since|whereas)\b/i.test(answer);
  const hasMetrics = /\b(\d+%|\d+ms|\d+ seconds|scale|users|queries|optimized|reduced|increased)\b/i.test(answer);
  const hasTechTerms = /\b(architecture|database|latency|cache|api|async|promise|algorithm|complexity|index|model|validation)\b/i.test(answer);
  const hasSTAR = /\b(situation|task|action|result|implemented|solved|designed|led|built)\b/i.test(answer);

  let score = 5;
  if (wordCount > 30) score += 1;
  if (wordCount > 70) score += 1;
  if (hasReasoning) score += 1;
  if (hasMetrics) score += 1;
  if (hasTechTerms) score += 1;
  if (wordCount < 12) score = Math.max(3, score - 2);

  score = Math.min(10, Math.max(3, score));

  const evaluation = {
    score,
    scores: {
      correctness: Math.min(10, score + (hasTechTerms ? 1 : 0)),
      technical_depth: Math.min(10, score - (wordCount < 40 ? 1 : 0)),
      relevance: Math.min(10, score + 1),
      clarity: Math.min(10, wordCount > 25 ? 8 : 6),
      confidence: Math.min(10, hasMetrics ? 8 : 7),
      communication: Math.min(10, hasSTAR ? 9 : 7),
      resume_consistency: 8,
    },
    good: hasReasoning
      ? 'Strong logical articulation with clear reasoning behind technical choices.'
      : 'Direct and focused response that addresses the core prompt.',
    improve: !hasMetrics
      ? 'Incorporate measurable impact (e.g., latency reduction, accuracy percentages, or throughput metrics).'
      : 'Structure the response explicitly around the STAR framework (Situation, Task, Action, Result).',
    missingConcepts: ['Concrete benchmarks', 'Alternative architectural trade-offs', 'Failure recovery / error handling'],
    modelAnswer: `When tackling this in production, I first isolated the core constraints. I implemented a decoupled pipeline with automated validation, which decreased processing overhead and ensured dependable throughput under peak loads.`,
  };

  if (isFinal) {
    return {
      questionNumber: qNum,
      totalQuestions: totalQ,
      isFinished: true,
      evaluation,
      nextQuestion: null,
    };
  }

  // Next Question Generator
  const nextQNum = qNum + 1;
  let nextStage = 'Technical';
  let nextCategory = 'Technical Breadth';
  let nextQ = '';

  if (type === 'Coding' || (type === 'Full Interview' && nextQNum >= 4 && nextQNum <= 7)) {
    nextStage = 'Coding';
    nextCategory = 'Algorithms & Data Structures';
    nextQ = 'Given an array of integers and a target sum, write a solution that returns the two indices whose values add up to the target in O(n) time complexity.';
  } else if (type === 'HR' || (type === 'Full Interview' && nextQNum >= totalQ - 2)) {
    nextStage = 'HR';
    nextCategory = 'Behavioral & Leadership';
    nextQ = 'Tell me about a time you faced a difficult technical disagreement with a team member or mentor. How did you handle the situation and what was the outcome?';
  } else if (score >= 8) {
    nextStage = 'Project Deep Dive';
    nextCategory = 'Scale & System Design';
    nextQ = `You provided a strong explanation. Now suppose traffic or data volume increases 10x overnight. Where will the primary bottleneck occur in this design, and how would you redesign the caching and persistence layer?`;
  } else if (score <= 5) {
    nextStage = 'Technical';
    nextCategory = 'Core Fundamentals';
    nextQ = `Let's break this down to the core fundamentals. How does memory management and time complexity impact this implementation under standard constraints?`;
  } else {
    nextStage = 'Technical';
    nextCategory = 'Practical Application';
    nextQ = `What was the most challenging technical edge case you encountered while building this, and what testing strategy did you use to validate your fix?`;
  }

  return {
    questionNumber: qNum,
    totalQuestions: totalQ,
    isFinished: false,
    evaluation,
    nextQuestion: {
      question: nextQ,
      stage: nextStage,
      category: nextCategory,
      difficulty: score >= 8 ? 'Hard' : score <= 5 ? 'Fundamentals' : 'Medium',
      targetSkill: 'Problem Solving & Architecture',
      guidance: 'Break down your thoughts step-by-step and highlight key trade-offs.',
    },
  };
}
