/**
 * AI Interview Coach - Deterministic Job Matching & Resume Analysis Engine
 *
 * Implements strict requirement extraction, normalization, evidence-based matching,
 * anti-hallucination validation, and deterministic scoring.
 */

// 1. TEXT NORMALIZATION
export function normalizeText(text) {
  if (!text || typeof text !== 'string') return '';

  return text
    // Replace corrupted unicode bullets and quotes
    .replace(/‚Ä¢|\u2022|\u2023|\u25E6|\u2043|\u2219/g, '\n• ')
    .replace(/\u2013|\u2014/g, '-')
    .replace(/\u2018|\u2019/g, "'")
    .replace(/\u201C|\u201D/g, '"')
    // Remove typical PDF/Doc page headers/footers
    .replace(/Page\s+\d+\s+of\s+\d+/gi, '')
    .replace(/Confidential\s*-\s*Do\s*not\s*distribute/gi, '')
    // Normalize newlines and whitespace
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .trim();
}

// 2. KNOWN SKILL CATALOG WITH STRICT BOUNDARIES
export const SKILL_TAXONOMY = {
  // AI / ML / Robotics / Autonomy
  'python': { name: 'Python', category: 'programming', aliases: ['python', 'python3', 'py', 'python programming', 'python development'] },
  'c++': { name: 'C++', category: 'programming', aliases: ['c++', 'cpp'] },
  'c': { name: 'C', category: 'programming', aliases: ['c programming', 'c language'] },
  'pytorch': { name: 'PyTorch', category: 'framework', aliases: ['pytorch', 'torch'] },
  'tensorflow': { name: 'TensorFlow', category: 'framework', aliases: ['tensorflow', 'tf', 'keras'] },
  'scikit-learn': { name: 'Scikit-learn', category: 'framework', aliases: ['scikit-learn', 'scikit', 'sklearn'] },
  'deep learning': { name: 'Deep Learning', category: 'domain', aliases: ['deep learning', 'neural networks', 'ann', 'cnn', 'rnn', 'transformers'] },
  'computer vision': { name: 'Computer Vision', category: 'domain', aliases: ['computer vision', 'cv', 'opencv', 'object detection', 'image segmentation', 'yolo'] },
  'reinforcement learning': { name: 'Reinforcement Learning', category: 'domain', aliases: ['reinforcement learning', 'rl', 'q-learning', 'policy gradient', 'ppo', 'dqn'] },
  'control systems': { name: 'Control Systems', category: 'domain', aliases: ['control systems', 'pid', 'mpc', 'model predictive control', 'feedback control'] },
  'robotics': { name: 'Robotics', category: 'domain', aliases: ['robotics', 'ros', 'ros2', 'robot operating system', 'kinematics'] },
  'sensor fusion': { name: 'Sensor Fusion', category: 'domain', aliases: ['sensor fusion', 'kalman filter', 'kalman filters', 'ekf', 'ukf', 'lidar', 'imu', 'radar fusion'] },
  'state estimation': { name: 'State Estimation', category: 'domain', aliases: ['state estimation', 'slam', 'odometry', 'localization'] },
  'edge ai': { name: 'Edge AI Deployment', category: 'domain', aliases: ['edge ai', 'tinyml', 'tensorrt', 'onnx runtime', 'tflite', 'jetson', 'edge deployment'] },
  'embedded systems': { name: 'Embedded Systems', category: 'domain', aliases: ['embedded systems', 'microcontrollers', 'arm', 'rtos', 'c/c++ embedded'] },
  'simulation': { name: 'Simulation', category: 'tools', aliases: ['simulation', 'gazebo', 'isaac sim', 'carla', 'matlab', 'simulink', 'pybullet'] },
  'rag': { name: 'RAG (Retrieval-Augmented Generation)', category: 'domain', aliases: ['rag', 'retrieval-augmented generation', 'vector database', 'chromadb', 'pinecone'] },
  'llm': { name: 'LLM Application Development', category: 'domain', aliases: ['llm', 'large language models', 'langchain', 'llamaindex', 'prompt engineering', 'ollama'] },
  'nlp': { name: 'Natural Language Processing', category: 'domain', aliases: ['nlp', 'natural language processing', 'spacy', 'nltk', 'huggingface'] },

  // Web & Backend
  'javascript': { name: 'JavaScript', category: 'programming', aliases: ['javascript', 'js', 'es6', 'ecmascript'] },
  'typescript': { name: 'TypeScript', category: 'programming', aliases: ['typescript', 'ts'] },
  'react': { name: 'React', category: 'framework', aliases: ['react', 'react.js', 'reactjs'] },
  'node.js': { name: 'Node.js', category: 'framework', aliases: ['node.js', 'nodejs', 'node'] },
  'fastapi': { name: 'FastAPI', category: 'framework', aliases: ['fastapi'] },
  'django': { name: 'Django', category: 'framework', aliases: ['django'] },
  'flask': { name: 'Flask', category: 'framework', aliases: ['flask'] },
  'html': { name: 'HTML & CSS', category: 'frontend', aliases: ['html', 'html5', 'css', 'css3', 'tailwind', 'bootstrap'] },
  'rest apis': { name: 'RESTful APIs', category: 'backend', aliases: ['rest api', 'restful api', 'rest apis', 'restful apis', 'api design'] },
  'graphql': { name: 'GraphQL', category: 'backend', aliases: ['graphql'] },
  'sql': { name: 'SQL & Relational Databases', category: 'database', aliases: ['sql', 'postgres', 'postgresql', 'mysql', 'sqlite', 'rdbms'] },
  'nosql': { name: 'NoSQL Databases', category: 'database', aliases: ['nosql', 'mongodb', 'redis', 'cassandra', 'dynamodb'] },
  'docker': { name: 'Docker', category: 'tools', aliases: ['docker', 'containerization', 'containers'] },
  'kubernetes': { name: 'Kubernetes', category: 'tools', aliases: ['kubernetes', 'k8s'] },
  'aws': { name: 'Cloud Infrastructure (AWS/GCP)', category: 'cloud', aliases: ['aws', 'amazon web services', 'gcp', 'google cloud', 'azure'] },
  'git': { name: 'Git & Version Control', category: 'tools', aliases: ['git', 'github', 'gitlab', 'version control'] },
  'dsa': { name: 'Data Structures & Algorithms', category: 'cs_fundamentals', aliases: ['data structures', 'algorithms', 'dsa', 'problem solving', 'algorithmic thinking'] },
  'system design': { name: 'System Design & Scalability', category: 'architecture', aliases: ['system design', 'scalability', 'distributed systems', 'microservices'] },

  // Education & Foundations
  'btech_cs': { name: 'Computer Science / Engineering Degree', category: 'education', aliases: ['computer science', 'b.tech', 'm.tech', 'bachelor', 'master', 'bs in cs', 'b.e.'] },
};

function isSectionHeader(line) {
  // Never treat bullets or list items as headers
  if (/^[•\-*+~>]\s+|^\d+[\.\)]\s+/i.test(line)) {
    return false;
  }
  // Never treat lines containing specific programming languages or deep stack items as section headers
  if (/\b(python|java|react|c\+\+|sql|aws|docker|pytorch|opencv)\b/i.test(line)) {
    return false;
  }
  // Check if it's a short header phrase
  const clean = line.replace(/[:\-()]/g, ' ').trim().toLowerCase();
  const headerKeywords = [
    'required',
    'must have',
    'must-have',
    'minimum qualifications',
    'essential',
    'requirements',
    'qualifications',
    'preferred',
    'desired',
    'nice to have',
    'nice-to-have',
    'bonus',
    'skills',
    'technical skills',
    'responsibilities',
    'what were looking for',
    "what you'll need",
    'eligibility',
  ];

  return headerKeywords.some((kw) => clean === kw || clean.startsWith(kw) || clean.endsWith(kw)) && line.length < 45;
}

// 3. ROBUST REQUIREMENT EXTRACTION HEURISTIC
export function extractRequirementsHeuristically(normalizedJD) {
  const lines = normalizedJD.split('\n').map((l) => l.trim()).filter(Boolean);
  const requirements = [];
  const seenSkills = new Set();

  let currentSectionImportance = 'standard';

  const mustHaveHeaderRegex = /(must[- ]have|required|minimum qualifications|essential|requirements|what you['’]ll need|eligibility|what we require)/i;
  const niceToHaveHeaderRegex = /(preferred|desired|nice[- ]to[- ]have|bonus|plus|good to have|advantages)/i;
  const standardHeaderRegex = /(responsibilities|qualifications|skills|technical skills|key qualifications|what we['’]re looking for)/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if line is a pure section header
    if (isSectionHeader(line)) {
      if (mustHaveHeaderRegex.test(line)) {
        currentSectionImportance = 'must_have';
      } else if (niceToHaveHeaderRegex.test(line)) {
        currentSectionImportance = 'nice_to_have';
      } else if (standardHeaderRegex.test(line)) {
        currentSectionImportance = 'standard';
      }
      continue;
    }

    // Check individual line inline importance indicators
    let lineImportance = currentSectionImportance;
    if (/\b(must|required|mandatory|essential|minimum|strong experience)\b/i.test(line)) {
      lineImportance = 'must_have';
    } else if (/\b(preferred|desirable|plus|bonus|nice to have|advantage|optional)\b/i.test(line)) {
      lineImportance = 'nice_to_have';
    }

    const lineLower = line.toLowerCase();

    // Check skills in catalog
    for (const [key, skillData] of Object.entries(SKILL_TAXONOMY)) {
      if (seenSkills.has(key)) continue;

      const matchedAlias = skillData.aliases.find((alias) => {
        const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const reg = new RegExp(`(^|[^a-zA-Z0-9_#+])${escaped}([^a-zA-Z0-9_#+]|$)`, 'i');
        return reg.test(lineLower);
      });

      if (matchedAlias) {
        seenSkills.add(key);
        requirements.push({
          skillKey: key,
          skill: skillData.name,
          text: line.length > 8 ? line.replace(/^[•\-*0-9.]+\s*/, '') : `Proficiency in ${skillData.name}`,
          category: skillData.category,
          importance: lineImportance,
          aliases: skillData.aliases,
        });
      }
    }

    // Also check for pipe-separated format: "Skills: Python | PyTorch | Computer Vision"
    if (line.includes('|')) {
      const parts = line.split('|').map((p) => p.trim()).filter(Boolean);
      for (const part of parts) {
        const partLower = part.toLowerCase();
        for (const [key, skillData] of Object.entries(SKILL_TAXONOMY)) {
          if (seenSkills.has(key)) continue;
          if (skillData.aliases.some((a) => partLower.includes(a))) {
            seenSkills.add(key);
            requirements.push({
              skillKey: key,
              skill: skillData.name,
              text: `Proficiency in ${skillData.name}`,
              category: skillData.category,
              importance: lineImportance,
              aliases: skillData.aliases,
            });
          }
        }
      }
    }
  }

  // Deduplicate and prioritize stricter importance
  const deduplicated = [];
  const map = new Map();

  for (const req of requirements) {
    if (!map.has(req.skillKey)) {
      map.set(req.skillKey, req);
      deduplicated.push(req);
    } else {
      const existing = map.get(req.skillKey);
      if (req.importance === 'must_have') {
        existing.importance = 'must_have';
      }
    }
  }

  return deduplicated;
}

// 4. EVIDENCE-BASED RESUME MATCHING
export function evaluateRequirementEvidence(requirement, resumeText) {
  const resumeLower = resumeText.toLowerCase();
  const skillKey = requirement.skillKey || requirement.skill?.toLowerCase();

  // Helper: check exact aliases
  const aliases = requirement.aliases || (SKILL_TAXONOMY[skillKey]?.aliases) || [requirement.skill?.toLowerCase() || ''];
  const hasDirectMention = aliases.some((alias) => {
    if (!alias) return false;
    const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const reg = new RegExp(`(^|[^a-zA-Z0-9_#+])${escaped}([^a-zA-Z0-9_#+]|$)`, 'i');
    return reg.test(resumeLower);
  });

  // Extract snippet evidence from resume if matched
  let directEvidence = null;
  if (hasDirectMention) {
    const lines = resumeText.split('\n');
    for (const l of lines) {
      if (aliases.some((a) => a && l.toLowerCase().includes(a))) {
        directEvidence = l.trim().replace(/^[•\-*0-9.]+\s*/, '');
        break;
      }
    }
  }

  // STRICT ANTI-CONFUSION RULES:
  // Rule 1: PyTorch / TensorFlow / Scikit-learn
  if (skillKey === 'pytorch' || skillKey === 'tensorflow' || skillKey === 'scikit-learn') {
    if (hasDirectMention) {
      return {
        matchStatus: 'DIRECT_MATCH',
        evidence: directEvidence || `${requirement.skill} explicitly evidenced in resume projects or technical skills.`,
        explanation: `${requirement.skill} is directly verified in candidate's experience.`,
      };
    }
    // DO NOT mark PyTorch as matched just because candidate has Python!
    return {
      matchStatus: 'MISSING',
      evidence: null,
      explanation: `Resume demonstrates Python experience, but lacks required ${requirement.skill} framework exposure.`,
    };
  }

  // Rule 2: Edge AI
  if (skillKey === 'edge ai') {
    if (hasDirectMention) {
      return {
        matchStatus: 'DIRECT_MATCH',
        evidence: directEvidence,
        explanation: `Edge AI / embedded deployment explicitly listed.`,
      };
    }
    if (resumeLower.includes('ollama') || resumeLower.includes('docker') || resumeLower.includes('fastapi')) {
      return {
        matchStatus: 'TRANSFERABLE',
        evidence: `Experience with local model hosting & API inference.`,
        explanation: `Candidate demonstrates model deployment experience, but lacks verified embedded/Edge hardware (e.g. Jetson, TensorRT, microcontrollers) exposure.`,
      };
    }
    return {
      matchStatus: 'MISSING',
      evidence: null,
      explanation: `No evidence of Edge AI or constrained hardware deployment found in resume.`,
    };
  }

  // Rule 3: Computer Vision
  if (skillKey === 'computer vision') {
    if (hasDirectMention) {
      return {
        matchStatus: 'DIRECT_MATCH',
        evidence: directEvidence,
        explanation: `Computer Vision projects or OpenCV/YOLO tools explicitly verified.`,
      };
    }
    // Generic AI/ML does NOT equal Computer Vision
    return {
      matchStatus: 'MISSING',
      evidence: null,
      explanation: `Candidate has generic AI/ML or NLP projects, but no Computer Vision or image processing evidence.`,
    };
  }

  // Rule 4: Reinforcement Learning
  if (skillKey === 'reinforcement learning') {
    if (hasDirectMention) {
      return {
        matchStatus: 'DIRECT_MATCH',
        evidence: directEvidence,
        explanation: `Reinforcement learning concepts / algorithms explicitly evidenced.`,
      };
    }
    return {
      matchStatus: 'MISSING',
      evidence: null,
      explanation: `Supervised ML / NLP experience does not demonstrate Reinforcement Learning knowledge.`,
    };
  }

  // Rule 5: Sensor Fusion / Robotics / Control Systems
  if (skillKey === 'sensor fusion' || skillKey === 'robotics' || skillKey === 'control systems' || skillKey === 'state estimation') {
    if (hasDirectMention) {
      return {
        matchStatus: 'DIRECT_MATCH',
        evidence: directEvidence,
        explanation: `${requirement.skill} explicitly documented in resume.`,
      };
    }
    return {
      matchStatus: 'MISSING',
      evidence: null,
      explanation: `No robotics, control theory, or sensor fusion experience evidenced in resume.`,
    };
  }

  // Rule 6: RAG / LLM
  if (skillKey === 'rag' || skillKey === 'llm') {
    if (hasDirectMention || resumeLower.includes('rag') || resumeLower.includes('retrieval-augmented') || resumeLower.includes('chromadb')) {
      return {
        matchStatus: 'DIRECT_MATCH',
        evidence: directEvidence || 'Developed RAG / LLM application pipelines.',
        explanation: `Demonstrated hands-on experience building generative AI and RAG architectures.`,
      };
    }
    return {
      matchStatus: 'MISSING',
      evidence: null,
      explanation: `No direct RAG or LLM architecture experience listed.`,
    };
  }

  // Rule 7: General Direct Matches
  if (hasDirectMention) {
    return {
      matchStatus: 'DIRECT_MATCH',
      evidence: directEvidence || `${requirement.skill} explicitly listed in candidate profile.`,
      explanation: `${requirement.skill} is verified in resume.`,
    };
  }

  // Rule 8: Transferable Checks for standard web/backend
  if (skillKey === 'fastapi' && (resumeLower.includes('flask') || resumeLower.includes('django'))) {
    return {
      matchStatus: 'TRANSFERABLE',
      evidence: 'Experience with Python web frameworks (Flask / Django).',
      explanation: 'Python web API experience is transferable to FastAPI.',
    };
  }
  if (skillKey === 'react' && resumeLower.includes('javascript')) {
    return {
      matchStatus: 'PARTIAL',
      evidence: 'JavaScript knowledge listed.',
      explanation: 'Has core JavaScript foundation, but commercial React component lifecycle experience is missing.',
    };
  }
  if (skillKey === 'sql' && (resumeLower.includes('database') || resumeLower.includes('mongodb'))) {
    return {
      matchStatus: 'PARTIAL',
      evidence: 'Database concepts listed in resume.',
      explanation: 'General database experience, but specific relational SQL modeling was not verified.',
    };
  }

  // Default Missing
  return {
    matchStatus: 'MISSING',
    evidence: null,
    explanation: `No evidence for ${requirement.skill} found in the candidate's resume.`,
  };
}

// 5. DETERMINISTIC APPLICATION-SIDE SCORING
export function calculateDeterministicMatchScore(matchedRequirements) {
  // CRITICAL VALIDATION: Never calculate match score if 0 requirements extracted
  if (!matchedRequirements || matchedRequirements.length === 0) {
    return {
      status: 'analysis_failed',
      matchPercentage: null,
      categoryScores: { mustHave: null, standard: null, niceToHave: null },
      confidence: 'Low',
      message: "We couldn't identify meaningful requirements from this job description. Please provide a clear JD containing skills or qualifications.",
    };
  }

  // Evidence weights
  const statusWeights = {
    DIRECT_MATCH: 1.0,
    TRANSFERABLE: 0.65,
    PARTIAL: 0.35,
    MISSING: 0.0,
    CONFLICT: 0.0,
  };

  let mustHaveWeightTotal = 0;
  let mustHaveScoreTotal = 0;
  let standardWeightTotal = 0;
  let standardScoreTotal = 0;
  let niceToHaveWeightTotal = 0;
  let niceToHaveScoreTotal = 0;

  for (const req of matchedRequirements) {
    const statusWeight = statusWeights[req.matchStatus] !== undefined ? statusWeights[req.matchStatus] : 0.0;
    const importance = req.importance || 'standard';

    if (importance === 'must_have') {
      mustHaveWeightTotal += 1.0;
      mustHaveScoreTotal += statusWeight;
    } else if (importance === 'nice_to_have') {
      niceToHaveWeightTotal += 1.0;
      niceToHaveScoreTotal += statusWeight;
    } else {
      standardWeightTotal += 1.0;
      standardScoreTotal += statusWeight;
    }
  }

  // Calculate percentages per category
  const mustHavePct = mustHaveWeightTotal > 0 ? Math.round((mustHaveScoreTotal / mustHaveWeightTotal) * 100) : null;
  const standardPct = standardWeightTotal > 0 ? Math.round((standardScoreTotal / standardWeightTotal) * 100) : null;
  const niceToHavePct = niceToHaveWeightTotal > 0 ? Math.round((niceToHaveScoreTotal / niceToHaveWeightTotal) * 100) : null;

  // Composite Weighted Score: Must-Have = 60%, Standard = 25%, Nice-to-Have = 15%
  let totalCategoryWeight = 0;
  let weightedScoreSum = 0;

  if (mustHavePct !== null) {
    totalCategoryWeight += 0.60;
    weightedScoreSum += mustHavePct * 0.60;
  }
  if (standardPct !== null) {
    totalCategoryWeight += 0.25;
    weightedScoreSum += standardPct * 0.25;
  }
  if (niceToHavePct !== null) {
    totalCategoryWeight += 0.15;
    weightedScoreSum += niceToHavePct * 0.15;
  }

  let finalOverallScore = totalCategoryWeight > 0 ? Math.round(weightedScoreSum / totalCategoryWeight) : 0;

  // CRITICAL PRINCIPLE: Missing critical must-haves penalize heavily!
  // If must-have score is low (e.g. < 50%), cap the overall score so nice-to-haves cannot falsely inflate it
  if (mustHavePct !== null && mustHavePct < 40) {
    finalOverallScore = Math.min(finalOverallScore, mustHavePct + 10);
  } else if (mustHavePct !== null && mustHavePct < 60) {
    finalOverallScore = Math.min(finalOverallScore, mustHavePct + 15);
  }

  // Determine confidence
  const reqCount = matchedRequirements.length;
  const hasEvidenceCount = matchedRequirements.filter((r) => r.matchStatus !== 'MISSING').length;
  let confidence = 'High';
  if (reqCount < 4) {
    confidence = 'Low';
  } else if (reqCount < 7 || hasEvidenceCount < 2) {
    confidence = 'Medium';
  }

  return {
    status: 'success',
    matchPercentage: Math.max(0, Math.min(100, finalOverallScore)),
    categoryScores: {
      mustHave: mustHavePct,
      standard: standardPct,
      niceToHave: niceToHavePct,
    },
    confidence,
    counts: {
      totalRequirements: reqCount,
      mustHaveCount: matchedRequirements.filter((r) => r.importance === 'must_have').length,
      standardCount: matchedRequirements.filter((r) => r.importance === 'standard').length,
      niceToHaveCount: matchedRequirements.filter((r) => r.importance === 'nice_to_have').length,
      directMatchCount: matchedRequirements.filter((r) => r.matchStatus === 'DIRECT_MATCH').length,
      transferableCount: matchedRequirements.filter((r) => r.matchStatus === 'TRANSFERABLE').length,
      partialCount: matchedRequirements.filter((r) => r.matchStatus === 'PARTIAL').length,
      missingCount: matchedRequirements.filter((r) => r.matchStatus === 'MISSING').length,
    },
  };
}
