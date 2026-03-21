from app.services.merchant_extractor import extract_merchant


def generate_explanations(transactions, analysis):
    explanations = []

    totals = analysis.get("category_totals", {})

    def spend(cat):
        return abs(totals.get(cat, 0))

    # -----------------------------
    # SUBSCRIPTIONS
    # -----------------------------
    sub_spend = spend("Subscription")

    if sub_spend > 2000:
        merchants = {}

        for t in transactions:
            if t.get("category") == "Subscription":
                merchant = extract_merchant(t.get("description", ""))
                merchants[merchant] = merchants.get(merchant, 0) + abs(t.get("amount", 0))

        top = sorted(merchants.items(), key=lambda x: x[1], reverse=True)[:3]
        top_names = [m[0] for m in top]

        explanations.append({
            "type": "subscription",
            "amount": int(sub_spend),
            "top_merchants": top_names,
            "message": f"You spent ₹{int(sub_spend)} on subscriptions including {', '.join(top_names)}"
        })

    # -----------------------------
    # FOOD
    # -----------------------------
    food_spend = spend("Food")

    if food_spend > 8000:
        explanations.append({
            "type": "food",
            "amount": int(food_spend),
            "message": f"You spent ₹{int(food_spend)} on food (frequent dining / orders detected)"
        })

    # -----------------------------
    # CASH WITHDRAWAL
    # -----------------------------
    cash_spend = spend("Cash Withdrawal")

    if cash_spend > 10000:
        explanations.append({
            "type": "cash",
            "amount": int(cash_spend),
            "message": f"You withdrew ₹{int(cash_spend)} in cash (hard to track usage)"
        })

    # -----------------------------
    # FINANCIAL COMMITMENTS
    # -----------------------------
    fin_spend = spend("Financial")

    if fin_spend > 20000:
        explanations.append({
            "type": "financial",
            "amount": int(fin_spend),
            "message": f"You committed ₹{int(fin_spend)} towards EMI, SIP, taxes"
        })

    # -----------------------------
    # SMALL SPEND LEAK
    # -----------------------------
    small_count = 0

    for t in transactions:
        if t.get("type") == "debit" and abs(t.get("amount", 0)) < 200:
            small_count += 1

    if small_count > 50:
        explanations.append({
            "type": "small_spend",
            "count": small_count,
            "message": f"{small_count}+ small transactions may be causing money leakage"
        })

    # -----------------------------
    # RECURRING
    # -----------------------------
    recurring = analysis.get("recurring", [])

    if len(recurring) >= 3:
        explanations.append({
            "type": "recurring",
            "count": len(recurring),
            "message": f"{len(recurring)} recurring payments detected — possible subscriptions or EMIs"
        })

    # -----------------------------
    # SORT BY IMPACT (amount)
    # -----------------------------
    explanations = sorted(
        explanations,
        key=lambda x: x.get("amount", 0),
        reverse=True
    )

    return explanations