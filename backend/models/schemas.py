from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, Field


class InterviewMode(StrEnum):
    HR = "hr"
    TECHNICAL = "technical"
    AI_ML = "ai_ml"
    DATA_SCIENCE = "data_science"
    BACKEND = "backend"
    FULL_STACK = "full_stack"
    CLOUD = "cloud"
    BEHAVIORAL = "behavioral"
    MIXED = "mixed"


class Difficulty(StrEnum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"
    ADAPTIVE = "adaptive"


class ResumeProfile(BaseModel):
    skills: list[str] = []
    tools: list[str] = []
    frameworks: list[str] = []
    databases: list[str] = []
    programming_languages: list[str] = []
    projects: list[str] = []
    certifications: list[str] = []
    internships: list[str] = []
    education: list[str] = []
    expected_role: str | None = None


class InterviewCreate(BaseModel):
    mode: InterviewMode = InterviewMode.MIXED
    difficulty: Difficulty = Difficulty.ADAPTIVE
    company: str | None = None
    resume: ResumeProfile = Field(default_factory=ResumeProfile)


class AnswerSubmission(BaseModel):
    answer: str = Field(min_length=1, max_length=12000)
    thinking_time_seconds: float = Field(default=0, ge=0)


class Score(BaseModel):
    technical_knowledge: int = Field(ge=0, le=100)
    communication: int = Field(ge=0, le=100)
    english_grammar: int = Field(ge=0, le=100)
    fluency: int = Field(ge=0, le=100)
    confidence: int = Field(ge=0, le=100)
    problem_solving: int = Field(ge=0, le=100)
    critical_thinking: int = Field(ge=0, le=100)
    project_knowledge: int = Field(ge=0, le=100)
    explanation_skills: int = Field(ge=0, le=100)
    logical_thinking: int = Field(ge=0, le=100)
    creativity: int = Field(ge=0, le=100)


class Evaluation(BaseModel):
    scores: Score
    strengths: list[str]
    weaknesses: list[str]
    missing_concepts: list[str]
    better_answer: str
    learning_resources: list[str]
    reasoning: dict[str, str]


class InterviewSession(BaseModel):
    id: str
    mode: InterviewMode
    difficulty: Difficulty
    company: str | None = None
    resume: ResumeProfile
    asked_questions: list[str] = []
    covered_topics: list[str] = []
    answers: list[AnswerSubmission] = []
    evaluations: list[Evaluation] = []
    current_question: str | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)