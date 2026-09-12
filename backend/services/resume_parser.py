import io
import re

from docx import Document

from backend.models.schemas import ResumeProfile

KNOWN_TERMS = {
    "programming_languages": ["Python", "Java", "JavaScript", "TypeScript", "C++", "SQL"],
    "frameworks": ["FastAPI", "React", "Next.js", "Django", "Node.js", "TensorFlow", "PyTorch"],
    "tools": ["AWS", "Docker", "Git", "Kubernetes", "Power BI", "Jupyter"],
    "databases": ["PostgreSQL", "MySQL", "MongoDB", "Redis", "DynamoDB"],
}


def _extract_text(filename: str, content: bytes) -> str:
    if filename.lower().endswith(".docx"):
        return "\n".join(paragraph.text for paragraph in Document(io.BytesIO(content)).paragraphs)
    try:
        import fitz
        return "\n".join(page.get_text() for page in fitz.open(stream=content, filetype="pdf"))
    except Exception as error:
        raise ValueError("Could not parse this PDF") from error


def parse_resume(filename: str, content: bytes) -> ResumeProfile:
    text = _extract_text(filename, content)
    lowered = text.lower()
    extracted: dict[str, list[str]] = {}
    for category, terms in KNOWN_TERMS.items():
        extracted[category] = [term for term in terms if term.lower() in lowered]
    sections = re.split(r"\n(?=[A-Z][A-Z &/-]{3,}\s*$)", text, flags=re.MULTILINE)
    extracted["projects"] = [section[:120].strip() for section in sections if "project" in section.lower()][:5]
    extracted["certifications"] = [line.strip() for line in text.splitlines() if "certif" in line.lower()][:5]
    extracted["internships"] = [line.strip() for line in text.splitlines() if "intern" in line.lower()][:5]
    extracted["education"] = [line.strip() for line in text.splitlines() if any(word in line.lower() for word in ("university", "college", "b.tech", "bachelor", "master"))][:5]
    return ResumeProfile(**extracted)