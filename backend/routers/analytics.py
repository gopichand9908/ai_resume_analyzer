from fastapi import APIRouter, HTTPException

from backend.services.interview_engine import engine

router = APIRouter()


@router.get("/{session_id}")
async def get_analytics(session_id: str):
    if session_id not in engine.sessions:
        raise HTTPException(status_code=404, detail="Interview not found")
    session = engine.sessions[session_id]
    if not session.evaluations:
        return {"overall_score": 0, "evaluations": []}
    score_fields = list(session.evaluations[-1].scores.model_dump().values())
    return {"overall_score": round(sum(score_fields) / len(score_fields)), "evaluations": session.evaluations, "questions_asked": len(session.asked_questions), "answers_submitted": len(session.answers)}