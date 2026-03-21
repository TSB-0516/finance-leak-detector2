from app.services.merchant_extractor import extract_merchant
from app.services.merchant_service import get_category_from_db
import re

# fallback keywords
CATEGORY_KEYWORDS = {
    "Food": ["swiggy", "zomato", "restaurant", "cafe", "coffee"],
    "Grocery": ["supermarket", "grocery", "blinkit", "jiomart"],
    "Bills": ["bill", "electric", "water"],
    "Transport": ["fuel", "uber", "ola"],
    "Travel": ["flight", "airlines", "hotel", "oyo", "irctc"],
}


def keyword_fallback(desc):
    for category, keywords in CATEGORY_KEYWORDS.items():
        for keyword in keywords:
            if keyword in desc:
                return category
    return "Others"

def rule_based_category(desc):
    desc = desc.lower()

    if "reliance digital" in desc:
        return "Shopping"

    if "jiomart" in desc or "blinkit" in desc:
        return "Grocery"

    if "marriott" in desc or "leela" in desc:
        return "Food"

    if "gst" in desc or "tax" in desc:
        return "Tax"

    return None
def categorize(transactions):
    for t in transactions:
        desc = t["description"].lower()

        merchant = extract_merchant(desc)

        # 🔥 1. RULE-BASED (HIGHEST PRIORITY)
        rule_category = rule_based_category(desc)

        if rule_category:
            t["category"] = rule_category

        else:
            # 2. DB lookup
            category = get_category_from_db(merchant)

            if category:
                t["category"] = category
            else:
                # 3. fallback
                fallback = keyword_fallback(desc)
                t["category"] = fallback

                from app.services.merchant_service import save_merchant_if_valid
                save_merchant_if_valid(merchant, fallback)

        print("DESC:", desc)
        print("MERCHANT:", merchant)
        print("CATEGORY:", t["category"])
        print("------")
    return transactions
# TRANSFER_KEYWORDS = ["upi", "imps", "neft"]


# def normalize_text(text):
#     text = text.lower()
#     text = re.sub(r'[^a-z\s]', ' ', text)  # remove numbers/symbols
#     text = re.sub(r'\s+', ' ', text).strip()
#     return text


# def is_transfer(desc):
#     # If looks like person name (has dot or no known keyword)
#     if "." in desc:
#         return True

#     for word in ["transfer", "sent", "received"]:
#         if word in desc:
#             return True

#     return False


# def categorize(transactions):
#     for t in transactions:
#         desc = normalize_text(t["description"])

#         # Step 1: detect transfer
#         if is_transfer(desc):
#             t["category"] = "Transfer"
#             continue

#         # Step 2: keyword match
#         found = False

#         for category, keywords in CATEGORY_KEYWORDS.items():
#             for keyword in keywords:
#                 if keyword in desc:
#                     t["category"] = category
#                     found = True
#                     break
#             if found:
#                 break

#         # Step 3: fallback rules
#         if not found:
#             if "order" in desc:
#                 t["category"] = "Food"
#             elif "loan" in desc or "emi" in desc:
#                 t["category"] = "Financial"
#             elif "atm" in desc:
#                 t["category"] = "Cash Withdrawal"
#             else:
#                 t["category"] = "Others"

#     return transactions