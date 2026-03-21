from datetime import datetime
from app.services.merchant_extractor import extract_merchant


def analyze(transactions):
    category_totals = {}
    recurring_map = {}

    for t in transactions:

        # only spending
        if t["type"] != "debit":
            continue

        category = t["category"]
        amount = t["amount"]

        # ---------- CATEGORY TOTAL ----------
        if category not in category_totals:
            category_totals[category] = 0

        category_totals[category] += amount

        # ---------- MERCHANT ----------
        merchant = extract_merchant(t["description"])

        # ---------- DATE ----------
        date_obj = datetime.strptime(t["date"], "%d-%b-%Y")

        # ---------- BUILD MAP ----------
        if merchant not in recurring_map:
            recurring_map[merchant] = {
                "count": 0,
                "dates": [],
                "amounts": [],
                "category": category
            }

        recurring_map[merchant]["count"] += 1
        recurring_map[merchant]["dates"].append(date_obj)
        recurring_map[merchant]["amounts"].append(amount)

    # ---------- DETECT RECURRING ----------
    recurring = []

    for merchant, data in recurring_map.items():

        count = data["count"]

        # ❗ minimum frequency
        if count < 3:
            continue

        dates = sorted(data["dates"])
        span_days = (dates[-1] - dates[0]).days

        # ❗ avoid same-day bursts
        if span_days < 7:
            continue

        # ❗ filter noise (shopping)
        if data["category"] == "Shopping":
            continue

        # ❌ skip ATM
        if "atm" in merchant:
            continue

        recurring.append({
            "merchant": merchant,
            "count": count,
            "category": data["category"]
        })

    return {
        "category_totals": category_totals,
        "recurring": recurring,
        "total_transactions":len(transactions),
        "transactions_sample":transactions[:200]
    }