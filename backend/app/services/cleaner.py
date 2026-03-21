def detect_type(desc):
    desc = desc.lower()

    if " cr" in desc or "credited" in desc:
        return "credit"

    if " dr" in desc or "debited" in desc:
        return "debit"

    # fallback: UPI usually debit unless salary/refund
    if "salary" in desc or "refund" in desc or "neft cr" in desc:
        return "credit"

    return "debit"
def clean_data(transactions):
    cleaned = []

    for t in transactions:
        try:
            desc = t["description"].lower()

            # ❌ skip useless rows
            if "opening balance" in desc:
                continue

            # 🔹 detect type
            txn_type = detect_type(desc)
            cleaned.append({
                "date": t["date"],
                "description": desc,
                "amount": float(t["amount"]),
                "type": txn_type
            })

        except Exception as e:
            print("CLEAN ERROR:", e)
            continue

    return cleaned