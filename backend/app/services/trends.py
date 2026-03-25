from collections import defaultdict
from datetime import datetime


def monthly_spending(transactions):
    month_map = defaultdict(lambda: defaultdict(float))

    for t in transactions:
        if t["type"] != "debit":
            continue

        month = datetime.strptime(t["date"], "%d-%b-%Y").strftime("%b")
        category = t["category"]
        month_map[month][category] += abs(t["amount"])

    result = []

    for month, cats in month_map.items():
        obj = {"month": month}
        obj.update(cats)
        result.append(obj)

    return result