def calculate_score(analysis):
    score = 0
    totals = analysis.get("category_totals", {})

    score += min(totals.get("Subscription", 0) / 100, 30)
    score += min(totals.get("Food", 0) / 200, 20)
    score += min(totals.get("Others", 0) / 500, 30)
    score += min(totals.get("Cash Withdrawal", 0) / 500, 20)

    return int(min(score, 100))