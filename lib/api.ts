const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export type ResumeProfile = {
  skills: string[];
  tools: string[];
  frameworks: string[];
  databases: string[];
  programming_languages: string[];
  projects: string[];
  certifications: string[];
  internships: string[];
  education: string[];
  expected_role: string | null;
};

export type Evaluation = {
  strengths: string[];
  weaknesses: string[];
  missing_concepts: string[];
  better_answer: string;
  scores: Record<string, number>;
};

const demoResume: ResumeProfile = {
  skills: ["Python", "FastAPI", "Machine Learning"],
  tools: ["Git", "AWS"],
  frameworks: ["FastAPI"],
  databases: ["PostgreSQL"],
  programming_languages: ["Python"],
  projects: ["Mental Health Detection project"],
  certifications: ["AWS AI Practitioner"],
  internships: [],
  education: ["Computer Science"],
  expected_role: "Backend Engineer",
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export async function createInterview(mode: string): Promise<{ id: string }> {
  const modeValue = mode.toLowerCase().replace(" interview", "").replace(" / ", "_").replace(" ", "_");
  return request<{ id: string }>("/interviews", {
    method: "POST",
    body: JSON.stringify({ mode: modeValue, difficulty: "adaptive", resume: demoResume }),
  });
}

export async function getNextQuestion(sessionId: string): Promise<{ question: string }> {
  return request<{ question: string }>(`/interviews/${sessionId}/next-question`);
}

export async function submitAnswer(sessionId: string, answer: string): Promise<Evaluation> {
  return request<Evaluation>(`/interviews/${sessionId}/answers`, {
    method: "POST",
    body: JSON.stringify({ answer, thinking_time_seconds: 0 }),
  });
}