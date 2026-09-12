import { callOpenAI, safeJSONParse } from './_lib/openai.js';
import {
  normalizeText,
  extractRequirementsHeuristically,
  evaluateRequirementEvidence,
  calculateDeterministicMatchScore,
} from './_lib/matchingEngine.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { resumeText, jobDescription } = req.body || {};

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({ error: 'Resume text is required.' });
    }

    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({ error: 'Job description is required.' });
    }

    // Step 1: Normalize JD & Resume inputs
    const normalizedJD = normalizeText(jobDescription);
    const normalizedResume = normalizeText(resumeText);

    // Step 2: Try OpenAI Structured Extraction + Evaluation
    let extractedRequirements = [];
    let matchedRequirements = [];

    const systemPrompt = `You are a strict, objective Technical Recruiter and Resume Match Analyst.
YOUR GOAL: Extract genuine requirements from the Job Description and evaluate them against the actual candidate Resume.

STRICT RULES:
1. NEVER invent candidate experience or skills.
2. The resume and JD are the ONLY sources of truth.
3. DO NOT confuse related skills:
   - PyTorch / TensorFlow is NOT Python. If candidate knows Python but not PyTorch, PyTorch is MISSING.
   - Edge AI is NOT local Ollama inference. At most it is TRANSFERABLE or PARTIAL.
   - Computer Vision is NOT generic AI/ML. If candidate built NLP or general ML, Computer Vision is MISSING.
   - Reinforcement Learning is NOT standard supervised learning.
4. Categorize importance:
   - "must_have": explicit requirements, minimum qualifications, core prerequisites.
   - "standard": expected job competencies.
   - "nice_to_have": preferred qualifications, bonuses, pluses.
5. Classify matchStatus for each requirement:
   - "DIRECT_MATCH": Explicitly verified in resume projects or skills.
   - "TRANSFERABLE": Adjacent tech stack with related conceptual foundation.
   - "PARTIAL": Some project exposure but lacks key scope.
   - "MISSING": Absent from resume.
6. DO NOT calculate match percentage yourself. The system will compute it deterministically.

Return ONLY valid JSON in this exact structure:
{
  "requirements": [
    {
      "skill": "Python",
      "text": "Strong programming skills in Python",
      "category": "technical",
      "importance": "must_have",
      "matchStatus": "DIRECT_MATCH",
      "evidence": "Listed in technical skills and Mental Health Detection project",
      "explanation": "Explicitly evidenced in resume."
    },
    {
      "skill": "PyTorch",
      "text": "Experience with PyTorch or TensorFlow for deep learning",
      "category": "framework",
      "importance": "must_have",
      "matchStatus": "MISSING",
      "evidence": null,
      "explanation": "Candidate lists Python but has no deep learning framework experience."
    }
  ],
  "strengths": ["List 2-3 genuine resume strengths grounded in evidence"],
  "gaps": ["List 2-3 verified missing requirements from the JD"],
  "recommendations": ["List 1-2 actionable interview preparation tips"]
}`;

    const userPrompt = `Target Job Description:\n"""\n${normalizedJD}\n"""\n\nCandidate Resume:\n"""\n${normalizedResume}\n"""\n\nExtract all requirements from the JD, classify importance, and evaluate evidence against the resume. Return JSON.`;

    const openAIResponse = await callOpenAI(
      [{ role: 'user', content: userPrompt }],
      systemPrompt,
      'json_object'
    );

    let parsedOpenAI = null;
    if (openAIResponse) {
      parsedOpenAI = safeJSONParse(openAIResponse, null);
    }

    if (parsedOpenAI && Array.isArray(parsedOpenAI.requirements) && parsedOpenAI.requirements.length > 0) {
      // Validate each requirement
      matchedRequirements = parsedOpenAI.requirements.filter(
        (r) => r && r.skill && r.importance && r.matchStatus
      );
    }

    // Step 3: Heuristic Fallback if OpenAI was unavailable or returned 0 valid requirements
    if (matchedRequirements.length === 0) {
      extractedRequirements = extractRequirementsHeuristically(normalizedJD);
      if (extractedRequirements.length > 0) {
        matchedRequirements = extractedRequirements.map((req) => {
          const evalResult = evaluateRequirementEvidence(req, normalizedResume);
          return {
            skill: req.skill,
            text: req.text,
            category: req.category,
            importance: req.importance,
            matchStatus: evalResult.matchStatus,
            evidence: evalResult.evidence,
            explanation: evalResult.explanation,
          };
        });
      }
    }

    // Step 4: CRITICAL FAILURE CHECK
    // The system must NEVER calculate a match percentage if JD extraction failed!
    if (matchedRequirements.length === 0) {
      console.warn('Match Analysis: 0 requirements extracted from JD.');
      return res.status(200).json({
        status: 'analysis_failed',
        matchPercentage: null,
        message: "We couldn't identify meaningful requirements from this job description. Please ensure the JD contains clear qualifications or skills.",
        requirements: [],
        directMatches: [],
        transferableMatches: [],
        missingSkills: [],
        confidence: 'Low',
        debug: {
          rawJDLength: jobDescription.length,
          normalizedJDLength: normalizedJD.length,
          extractedCount: 0,
        },
      });
    }

    // Step 5: Deterministic Score Calculation
    const scoreData = calculateDeterministicMatchScore(matchedRequirements);

    // Step 6: Categorize skills for UI display
    const directMatches = matchedRequirements
      .filter((r) => r.matchStatus === 'DIRECT_MATCH')
      .map((r) => r.skill);

    const transferableMatches = matchedRequirements
      .filter((r) => r.matchStatus === 'TRANSFERABLE' || r.matchStatus === 'PARTIAL')
      .map((r) => r.skill);

    const missingSkills = matchedRequirements
      .filter((r) => r.matchStatus === 'MISSING')
      .map((r) => r.skill);

    // Formulate concise rationale
    let matchReason = '';
    if (scoreData.categoryScores.mustHave !== null) {
      matchReason = `Must-Have alignment is ${scoreData.categoryScores.mustHave}% (${scoreData.counts.mustHaveCount} requirements). Candidate directly matches ${directMatches.length} skills, with ${missingSkills.length} critical gaps.`;
    } else {
      matchReason = `Candidate matches ${directMatches.length} of ${matchedRequirements.length} identified competencies.`;
    }

    const strengths = parsedOpenAI?.strengths?.length
      ? parsedOpenAI.strengths
      : directMatches.length > 0
      ? [
          `Demonstrated direct foundation in ${directMatches.slice(0, 3).join(', ')}.`,
          'Direct project evidence supporting core technical competencies.',
        ]
      : ['Candidate demonstrates structured communication potential.'];

    const gaps = parsedOpenAI?.gaps?.length
      ? parsedOpenAI.gaps
      : missingSkills.length > 0
      ? [
          `Missing critical requirements: ${missingSkills.slice(0, 4).join(', ')}.`,
          'Practical production/scale verification required in interview.',
        ]
      : ['No critical must-have gaps identified.'];

    const recommendations = parsedOpenAI?.recommendations?.length
      ? parsedOpenAI.recommendations
      : [
          'Focus interview answers on the exact technical trade-offs in your verified projects.',
          'Be upfront about missing technologies and emphasize adjacent problem-solving fundamentals.',
        ];

    // Safe server logging
    console.log('[MatchAnalysis]', {
      extraction_success: true,
      requirement_count: matchedRequirements.length,
      must_have_count: scoreData.counts.mustHaveCount,
      direct_matches: directMatches.length,
      missing_count: missingSkills.length,
      overall_score: scoreData.matchPercentage,
      confidence: scoreData.confidence,
    });

    return res.status(200).json({
      status: 'success',
      matchPercentage: scoreData.matchPercentage,
      categoryScores: scoreData.categoryScores,
      confidence: scoreData.confidence,
      counts: scoreData.counts,
      matchReason,
      directMatches,
      transferableMatches,
      missingSkills,
      requirements: matchedRequirements,
      strengths,
      gaps,
      recommendations,
      debug: {
        rawJDLength: jobDescription.length,
        normalizedJDLength: normalizedJD.length,
        extractedRequirementsCount: matchedRequirements.length,
        scoringWeights: { mustHave: 0.6, standard: 0.25, niceToHave: 0.15 },
        finalScore: scoreData.matchPercentage,
      },
    });
  } catch (error) {
    console.error('Analyze API Error:', error);
    return res.status(500).json({
      status: 'analysis_failed',
      error: 'Failed to analyze resume and job description. Please try again.',
    });
  }
}
