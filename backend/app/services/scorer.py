def calculate_score(analysis):
    totals = analysis.get("category_totals", {})

    # convert all to positive spending
    def spend(cat):
        return abs(totals.get(cat, 0))

    # -----------------------------
    # STEP 1: CLASSIFY SPENDING
    # -----------------------------

    essential = (
        spend("Rent") +
        spend("Financial") +
        spend("Bills")
    )

    discretionary = (
        spend("Food") +
        spend("Shopping") +
        spend("Subscription") +
        spend("Cash Withdrawal") +
        spend("Others")
    )

    transfer = spend("Transfer")

    total_spend = essential + discretionary  # exclude transfer

    if total_spend == 0:
        return 0

    # -----------------------------
    # STEP 2: RATIO BASED SCORING
    # -----------------------------

    discretionary_ratio = discretionary / total_spend

    # -----------------------------
    # STEP 3: PENALTIES
    # -----------------------------

    score = 0

    # High discretionary spending
    score += discretionary_ratio * 60

    # Subscriptions penalty
    score += min(spend("Subscription") / 100, 20)

    # Cash withdrawal penalty (untracked money)
    score += min(spend("Cash Withdrawal") / 500, 20)

    # -----------------------------
    return int(min(score, 100))