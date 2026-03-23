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
            "type": "Subscription",
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
            "type": "Food",
            "amount": int(food_spend),
            "message": f"You spent ₹{int(food_spend)} on food (frequent dining / orders detected)"
        })

    # -----------------------------
    # CASH WITHDRAWAL
    # -----------------------------
    cash_spend = spend("Cash Withdrawal")

    if cash_spend > 10000:
        explanations.append({
            "type": "Cash Withdrawal",
            "amount": int(cash_spend),
            "message": f"You withdrew ₹{int(cash_spend)} in cash (hard to track usage)"
        })

    # -----------------------------
    # FINANCIAL COMMITMENTS
    # -----------------------------
    fin_spend = spend("Financial")

    if fin_spend > 20000:
        explanations.append({
            "type": "Financial",
            "amount": int(fin_spend),
            "message": f"You committed ₹{int(fin_spend)} towards EMI, SIP, taxes"
        })

    # -----------------------------
    # SMALL SPEND LEAK
    # -----------------------------
    small_count = 0

    for t in transactions:
        if (
            t.get("type") == "debit"
            and t.get("category") not in ["Transfer", "Income"]
            and abs(t.get("amount", 0)) < 200
        ):
            small_count += 1

    if small_count > 50:
        explanations.append({
            "type": "Small_spend",
            "count": small_count,
            "message": f"{small_count}+ small transactions may be causing money leakage"
        })

    # -----------------------------
    # RECURRING
    # -----------------------------
    recurring = analysis.get("recurring", [])

    if len(recurring) >= 3:
        explanations.append({
            "type": "Recurring",
            "count": len(recurring),
            "message": f"{len(recurring)} recurring payments detected — possible subscriptions or EMIs"
        })
    # -----------------------------
    # SHOPPING
    # -----------------------------
    shopping_spend = spend("Shopping")

    if shopping_spend > 10000:
        explanations.append({
            "type": "Shopping",
            "amount": int(shopping_spend),
            "message": f"You spent ₹{int(shopping_spend)} on shopping (high-value purchases detected)"
        })

    # -----------------------------
    # SORT BY IMPACT (amount)
    # -----------------------------
    explanations = sorted(
        explanations,
        key=lambda x: x.get("amount", 0),
        reverse=True
    )

    # -----------------------------
# FALLBACK: TOP LEAK EXPLANATIONS (LOW ACTIVITY CASE)
# -----------------------------
    if len(explanations) <= 1:
        leak_categories = ["Food", "Shopping", "Subscription", "Cash Withdrawal", "Others"]

        # get top 2 small leaks (excluding already covered ones)
        # Map explanation types to categories they represent
        EXPLANATION_CATEGORY_MAP = {
            "Cash Withdrawal": "Cash Withdrawal",
            "Subscription": "Subscription",
            "Food": "Food",
            "Financial": "Financial"
        }

        covered_categories = {
            EXPLANATION_CATEGORY_MAP.get(e["type"], "").strip()
            for e in explanations
        }

        leak_totals = []

        for cat in leak_categories:
            amount = abs(totals.get(cat, 0))
            if amount > 0:
                leak_totals.append((cat, amount))

        leak_totals.sort(key=lambda x: x[1], reverse=True)

        for cat, amt in leak_totals:
            if cat in covered_categories:
                continue

            # skip very tiny noise
            if amt < 300:
                continue

            explanations.append({
                "type": cat.lower(),
                "amount": int(amt),
                "message": f"You spent ₹{int(amt)} on {cat.lower()}"
            })

            if len(explanations) >= 3:
                break

    return explanations

from collections import defaultdict
from app.services.merchant_extractor import extract_merchant


def generate_leak_breakdown(transactions, only_leaks=True):
    """
    Generates category-wise merchant breakdown of spending.

    Output format:
    [
        {
            "category": "Food",
            "total": 27482,
            "top_sources": [
                {"merchant": "zomato", "amount": 12000},
                {"merchant": "swiggy", "amount": 8000}
            ]
        }
    ]
    """

    category_map = defaultdict(lambda: defaultdict(float))

    # Step 1: Aggregate spending
    for txn in transactions:
        txn_type = txn.get("type")
        amount = txn.get("amount", 0)

        # Only debit transactions
        if txn_type != "debit":
            continue

        category = str(txn.get("category", "Others")).strip()
        description = txn.get("description", "")

        merchant = extract_merchant(description)

        category_map[category][merchant] += abs(amount)

    breakdown = []

    # Step 2: Process each category
    LEAK_CATEGORIES = [
        "Food",
        "Shopping",
        "Subscription",
        "Cash Withdrawal",
        "Others"
    ]

    for category, merchants in category_map.items():

        # Always skip non-spending
        if category in ["Income", "Transfer"]:
            continue

        # Apply leak filter only if needed
        if only_leaks and category not in LEAK_CATEGORIES:
            continue
        
        total_spend = sum(merchants.values())

        # Skip low-value noise categories
        if total_spend < 500:  # threshold (can tune later)
            continue

        # Sort merchants by spend
        sorted_merchants = sorted(
            merchants.items(),
            key=lambda x: x[1],
            reverse=True
        )

        top_n = 5 if category == "Food" else 3

        top_sources = [
            {"merchant": m, "amount": round(a, 2)}
            for m, a in sorted_merchants[:top_n]
        ]

        breakdown.append({
            "category": category,
            "total": round(total_spend, 2),
            "top_sources": top_sources
        })

    # Step 3: Sort categories by total spend
    breakdown.sort(key=lambda x: x["total"], reverse=True)

    return breakdown