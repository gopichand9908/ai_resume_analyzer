from backend.models.schemas import Evaluation, Score


def evaluate_answer(answer: str, question: str) -> Evaluation:
    words = answer.split()
    length_score = min(95, 35 + len(words))
    has_reasoning = any(term in answer.lower() for term in ("because", "trade-off", "measured", "tested", "impact"))
    technical = min(96, length_score + (15 if has_reasoning else 0))
    scores = Score(
        technical_knowledge=technical,
        communication=min(95, length_score + 5),
        english_grammar=min(94, 50 + len(words) // 2),
        fluency=min(92, 45 + len(words)),
        confidence=min(90, 48 + len(words)),
        problem_solving=technical,
        critical_thinking=min(93, technical + (5 if has_reasoning else 0)),
        project_knowledge=technical,
        explanation_skills=min(95, length_score + 3),
        logical_thinking=min(93, technical),
        creativity=min(88, 45 + len(words) + (10 if has_reasoning else 0)),
    )
    return Evaluation(
        scores=scores,
        strengths=["You answered with useful context.", "Your response had a clear point of view." if has_reasoning else "You kept the response focused."],
        weaknesses=["Add a measurable outcome to make the example more credible."] if not has_reasoning else ["Make the trade-off explicit earlier."],
        missing_concepts=["Constraints and validation"],
        better_answer=f"A stronger response to '{question}' would explain the context, decision, trade-off, and measurable result in that order.",
        learning_resources=["Practice the STAR framework", "Review system design trade-offs"],
        reasoning={"technical_knowledge": "Based on specificity, reasoning signals, and answer completeness.", "communication": "Based on structure and directness."},
    )