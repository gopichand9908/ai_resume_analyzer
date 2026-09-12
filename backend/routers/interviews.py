from fastapi import APIRouter, HTTPException

from backend.models.schemas import AnswerSubmission, InterviewCreate
from backend.services.interview_engine import engine

router = APIRouter()


@router.post("")
async def create_interview(payload: InterviewCreate):
    return engine.create(payload)


@router.get("/{session_id}/next-question")
async def next_question(session_id: str):
    if session_id not in engine.sessions:
        raise HTTPException(status_code=404, detail="Interview not found")
    return {"question": engine.next_question(session_id)}


@router.post("/{session_id}/answers")
async def submit_answer(session_id: str, payload: AnswerSubmission):
    if session_id not in engine.sessions:
        raise HTTPException(status_code=404, detail="Interview not found")
    return engine.submit(session_id, payload.answer, payload.thinking_time_seconds)