from fastapi import APIRouter
from app.services import analyzer, scorer
from app.services.insights import (
    generate_insights,
    get_top_leak_category,
    get_top_leak_categories
)
from app.services.explainer import generate_leak_breakdown

router = APIRouter()

# TEMP memory store (later DB)
LAST_ANALYSIS = {}


def store_analysis(data):
    global LAST_ANALYSIS
    LAST_ANALYSIS = data


def get_analysis():
    return LAST_ANALYSIS


@router.get("/score")
def get_score():
    analysis = get_analysis()
    return scorer.calculate_score(analysis)


@router.get("/insights")
def get_insights():
    analysis = get_analysis()
    return {"insights": generate_insights(analysis)}


@router.get("/top-leak")
def top_leak():
    analysis = get_analysis()
    return {"biggest_leak": get_top_leak_category(analysis)}


@router.get("/top-leaks")
def top_leaks():
    analysis = get_analysis()
    return {"top_leaks": get_top_leak_categories(analysis)}


@router.get("/spending-breakdown")
def spending():
    analysis = get_analysis()
    txns = analysis.get("all_transactions", [])
    return {
        "spending_breakdown":
            generate_leak_breakdown(txns, only_leaks=False)
    }


@router.get("/leak-breakdown")
def leak_breakdown():
    analysis = get_analysis()
    txns = analysis.get("all_transactions", [])
    return {
        "leak_breakdown":
            generate_leak_breakdown(txns, only_leaks=True)
    }


@router.get("/transactions")
def transactions():
    analysis = get_analysis()
    return {"transactions": analysis.get("all_transactions", [])}


@router.get("/recurring")
def recurring():
    analysis = get_analysis()
    return {"recurring": analysis.get("recurring", [])}


@router.get("/summary")
def summary():
    analysis = get_analysis()
    totals = analysis.get("category_totals", {})

    essential = abs(totals.get("Rent", 0)) + abs(totals.get("Bills", 0))
    discretionary = (
        abs(totals.get("Food", 0))
        + abs(totals.get("Shopping", 0))
        + abs(totals.get("Subscription", 0))
    )

    return {
        "essential": essential,
        "discretionary": discretionary
    }

from app.services.trends import monthly_spending

@router.get("/monthly-trend")
def trend():
    analysis = get_analysis()
    txns = analysis.get("all_transactions", [])
    return {"trend": monthly_spending(txns)}

@router.get("/micro-leaks")
def micro():
    analysis = get_analysis()
    txns = analysis.get("all_transactions", [])

    count = 0
    total = 0

    for t in txns:
        if t["type"] == "debit" and abs(t["amount"]) < 200:
            count += 1
            total += abs(t["amount"])

    return {"count": count, "total": total}