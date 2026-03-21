def generate_insights(analysis):
    insights = []

    totals = analysis.get("category_totals", {})

    def spend(cat):
        return abs(totals.get(cat, 0))

    total_spend = sum(spend(c) for c in totals)

    # -----------------------------
    # HIGH TRANSACTION VOLUME
    # -----------------------------
    total_transactions = analysis.get("total_transactions", 0)

    if total_transactions > 200:
        insights.append("Very high number of transactions detected (possible frequent spending habit)")
    elif total_transactions > 100:
        insights.append("High transaction volume detected")

    # Safety check
    if total_spend == 0:
        return insights

    # -----------------------------
    # DISCRETIONARY SPENDING
    # -----------------------------
    discretionary = (
        spend("Food") +
        spend("Shopping") +
        spend("Subscription") +
        spend("Cash Withdrawal") +
        spend("Others")
    )

    ratio = discretionary / total_spend
    if ratio > 0.6:
        insights.append(f"High discretionary spending ({int(ratio*100)}% of total spend)")
    elif ratio > 0.4:
        insights.append(f"Moderate discretionary spending ({int(ratio*100)}%)")

    subscription_spend = spend("Subscription")

    if subscription_spend > 5000:
        insights.append(f"High subscription spending (₹{int(subscription_spend)})")
    elif subscription_spend > 2000:
        insights.append(f"Moderate subscription spending (₹{int(subscription_spend)})")

    # -----------------------------
    # FOOD / DINING
    # -----------------------------
    food_spend = spend("Food")

    if food_spend > 15000:
        insights.append(f"High food spending detected (₹{int(food_spend)})")
    elif food_spend > 8000:
        insights.append(f"Moderate food spending (₹{int(food_spend)})")

    # -----------------------------
    # CASH WITHDRAWAL
    # -----------------------------
    cash_spend = spend("Cash Withdrawal")

    if cash_spend > 10000:
        insights.append(f"High cash withdrawals (₹{int(cash_spend)}) — hard to track usage")
    # -----------------------------
    # RECURRING PAYMENTS
    # -----------------------------
    # recurring = analysis.get("recurring", [])

    recurring = analysis.get("recurring", [])

    if len(recurring) >= 3:
        insights.append(f"{len(recurring)} recurring payments detected (subscriptions / EMIs)")

    # -----------------------------
    # FINANCIAL BURDEN
    # -----------------------------
    financial_spend = spend("Financial")

    if financial_spend > 20000:
        insights.append(f"High financial commitments (₹{int(financial_spend)}) — EMI / investments")


    # -----------------------------
    # SMALL SPEND DETECTION
    # -----------------------------
    small_txn_count = 0

    for t in analysis.get("transactions_sample", []):
        if abs(t.get("amount", 0)) < 200:
            small_txn_count += 1

    if small_txn_count > 50:
        insights.append(f"{small_txn_count}+ small transactions detected — possible money leakage")


    # -----------------------------
    # TRANSFER HEAVINESS
    # -----------------------------
    transfer_amt = spend("Transfer")

    if transfer_amt > total_spend * 0.3:
        insights.append(f"High transfer activity (₹{int(transfer_amt)}) — potential low savings retention")


    # -----------------------------
    # INCOME PRESENCE
    # -----------------------------
    income = spend("Income")

    if income > 50000:
        insights.append("Strong income inflow detected")
    elif income > 10000:
        insights.append("Moderate income inflow detected")

    return insights