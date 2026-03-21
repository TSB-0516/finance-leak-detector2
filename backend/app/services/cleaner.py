def detect_type(amount):
    return "debit" if amount < 0 else "credit"

def clean_data(transactions):
    cleaned = []

    for t in transactions:

        # ❌ skip invalid objects
        if not isinstance(t, dict):
            print("SKIPPING INVALID OBJECT:", t, type(t))
            continue

        # ❌ skip malformed transactions
        if "description" not in t or "amount" not in t or "date" not in t:
            print("SKIPPING MALFORMED:", t)
            continue
        
        try:
            desc = t["description"].lower()

            # ❌ skip useless rows
            if "opening balance" in desc:
                continue

            # 🔹 detect type
            amount= float(t["amount"])
            txn_type = detect_type(amount)
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