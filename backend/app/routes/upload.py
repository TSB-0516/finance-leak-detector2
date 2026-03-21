from fastapi import APIRouter, UploadFile, File
import shutil
import os

from app.services import parser, cleaner, categorizer, analyzer, scorer
from app.services.insights import generate_insights

from app.services.explainer import generate_explanations

router = APIRouter()

UPLOAD_DIR = "uploads"
@router.post("/analyze")
async def analyze_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # PIPELINE
    raw_data = parser.parse_pdf(file_path)
    print("RAW DATA COUNT:", len(raw_data))

    cleaned = cleaner.clean_data(raw_data)
    print("CLEANED COUNT:", len(cleaned))

    categorized = categorizer.categorize(cleaned)
    print("CATEGORIZED COUNT:", len(categorized))

    analysis = analyzer.analyze(categorized)
    score = scorer.calculate_score(analysis)

    return {
        "transactions": categorized,
        "analysis": analysis,
        "leak_score": score
    }

@router.post("/insights")
async def get_insights(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # PIPELINE (same as analyze)
    raw_data = parser.parse_pdf(file_path)
    cleaned = cleaner.clean_data(raw_data)
    categorized = categorizer.categorize(cleaned)
    analysis = analyzer.analyze(categorized)
    score = scorer.calculate_score(analysis)

    # NEW
    insights = generate_insights(analysis)

    explanations=generate_explanations(categorized, analysis)

    return {
        "leak_score": score,
        "insights": insights,
        "explanations": explanations
    }