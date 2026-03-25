from fastapi import APIRouter, UploadFile, File
import shutil
import os

from app.services import parser, cleaner, categorizer, analyzer, scorer
from app.services.insights import generate_insights, get_top_leak_category, get_top_leak_categories
from app.services.explainer import generate_explanations, generate_leak_breakdown
from app.routes.dashboard import store_analysis

router = APIRouter()

UPLOAD_DIR = "uploads"
@router.post("/analyze")
async def analyze_file(file: UploadFile = File(...), view: str = "full"):
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
    store_analysis(analysis)  # Store for dashboard access
    score_data = scorer.calculate_score(analysis)
    insights = generate_insights(analysis)

    explanations = generate_explanations(categorized, analysis)

    spending_breakdown = generate_leak_breakdown(categorized, only_leaks=False)
    leak_breakdown = generate_leak_breakdown(categorized, only_leaks=True)

    top_leak = get_top_leak_category(analysis)
    if top_leak:
        insights.append(
            f"Primary Spending Area: {top_leak['category']} (₹{top_leak['amount']})"
        )

    top_leaks = get_top_leak_categories(analysis)
    if top_leaks:
        top_names = [f"{l['category']} (₹{l['amount']})" for l in top_leaks]
        insights.append(
            f"Top spending areas: {', '.join(top_names)}"
        )
    # ---------------- VIEW HANDLING ----------------

    if view == "score":
        return {"leak_score": score_data["score"]}

    if view == "insights":
        return {"insights": insights}

    if view == "explanations":
        return {"explanations": explanations}

    if view == "spending":
        return {"spending_breakdown": spending_breakdown}

    if view == "leaks":
        return {"leak_breakdown": leak_breakdown}

    if view == "top_leak":
        return {"biggest_leak": top_leak}

    if view == "top_leaks":
        return {"top_leaks": top_leaks}

    if view == "transactions":
        return {"transactions": categorized}

    if view == "analysis":
        return {"analysis": analysis}


    # DEFAULT → FULL RESPONSE
    return {
        "transactions": categorized,
        "analysis": analysis,
        "leak_score": score_data["score"],
        "score_band": score_data["band"],
        "insights": insights,
        "explanations": explanations,
        "spending_breakdown": spending_breakdown,
        "leak_breakdown": leak_breakdown,
        "biggest_leak": top_leak,
        "top_leaks": top_leaks
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
    spending_breakdown = generate_leak_breakdown(categorized, only_leaks=False)
    leak_breakdown = generate_leak_breakdown(categorized, only_leaks=True)
    top_leak = get_top_leak_category(analysis)
    if top_leak:
        insights.append(
            f"Primary Leak:  {top_leak['category']} (₹{top_leak['amount']})"
        )
    top_leaks = get_top_leak_categories(analysis)
    if top_leaks:
        top_names = [f"{l['category']} (₹{l['amount']})" for l in top_leaks]
        insights.append(
            f"Top money leaks: {', '.join(top_names)}"
        )

    return {
        "leak_score": score,
        "insights": insights,
        "explanations": explanations,
        "spending_breakdown": spending_breakdown,
        "leak_breakdown": leak_breakdown,
        "biggest_leak": top_leak,
        "top_leaks": top_leaks
    }