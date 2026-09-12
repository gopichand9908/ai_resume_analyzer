from uuid import uuid4

from backend.models.schemas import Difficulty, Evaluation, InterviewCreate, InterviewSession
from backend.services.evaluator import evaluate_answer


class InterviewEngine:
    def __init__(self) -> None:
        self.sessions: dict[str, InterviewSession] = {}

    def create(self, payload: InterviewCreate) -> InterviewSession:
        session = InterviewSession(id=str(uuid4()), **payload.model_dump())
        self.sessions[session.id] = session
        return session

    def next_question(self, session_id: str) -> str:
        session = self.sessions[session_id]
        context = session.resume.projects or session.resume.skills or ["your experience"]
        index = len(session.answers)
        topic = context[index % len(context)]
        if index == 0:
            question = f"I noticed {topic} on your resume. Walk me through the problem, your approach, and the trade-off you are most proud of."
        elif session.evaluations[-1].scores.technical_knowledge >= 78:
            question = f"You mentioned {topic}. If the scale doubled tomorrow, what would you change in the design and why?"
        elif session.evaluations[-1].scores.technical_knowledge < 50:
            question = f"Let's ground this in fundamentals: what is the core idea behind {topic}, and when would you avoid it?"
        else:
            question = f"What was the hardest decision you made while working with {topic}, and how did you validate it?"
        if question in session.asked_questions:
            question += " Can you give a concrete example?"
        session.current_question = question
        session.asked_questions.append(question)
        return question

    def submit(self, session_id: str, answer: str, thinking_time_seconds: float) -> Evaluation:
        session = self.sessions[session_id]
        from backend.models.schemas import AnswerSubmission
        session.answers.append(AnswerSubmission(answer=answer, thinking_time_seconds=thinking_time_seconds))
        evaluation = evaluate_answer(answer, session.current_question or "")
        session.evaluations.append(evaluation)
        return evaluation


engine = InterviewEngine()