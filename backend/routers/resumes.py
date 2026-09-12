from fastapi import APIRouter, File, HTTPException, UploadFile

from backend.services.resume_parser import parse_resume

router = APIRouter()


@router.post("/parse")
async def parse_uploaded_resume(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith((".pdf", ".docx")):
        raise HTTPException(status_code=415, detail="Upload a PDF or DOCX resume")
    try:
        return parse_resume(file.filename, await file.read())
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error