from app.services.merchant_extractor import extract_merchant
# from app.services.merchant_service import get_category_from_db

# --------------------------------------
# PERSON DETECTION
# --------------------------------------

def is_person_name(merchant):
    if "." in merchant:
        parts = merchant.split(".")
        if len(parts) == 2 and all(p.isalpha() for p in parts):
            return True
    return False


# --------------------------------------
# SINGLE TRANSACTION CLASSIFIER
# --------------------------------------

def classify_transaction(desc, merchant, amount):

    desc = desc.lower()
    merchant = merchant.lower()

    # 1. INCOME
    if amount > 0:
        if any(word in desc for word in ["salary", "scholarship", "income","interest","dividend","pension","bonus","reward","project","payout","freelancer","consulting","invoice"]):
            return "Income"
        
    if amount > 0 and "transfer" in desc:
        return "Transfer"

    # 2. TRANSFER (only people)
    if is_person_name(merchant):
        return "Transfer"
    
    if "loan disbursal" in desc or "disbursal" in desc:
        return "Income"

    if "emi" in desc or "repayment" in desc:
        return "Financial"

    # ---------------- SUBSCRIPTION (EARLY CATCH) ----------------
    if "subscription" in desc or ("premium" in desc and "restaurant" not in desc):
        return "Subscription"

    # ---------------- RECHARGE (PRIORITY FIX) ----------------
    if "recharge" in desc:
        return "Bills"

    # 3. STRONG MERCHANT RULES
    merchant_map = {

    # ---------------- SHOPPING / GROCERY ----------------
    "amazon": "Shopping",
    "flipkart": "Shopping",
    "myntra": "Shopping",
    "meesho": "Shopping",

    "bigbasket": "Grocery",
    "dmart": "Grocery",
    "spar": "Grocery",
    # "reliance": "Grocery",
    "metro": "Grocery",
    "supermarket": "Grocery",
    "kirana": "Grocery",
    "jiomart": "Grocery",
    "store": "Grocery",
    "blinkit": "Grocery",

    # ---------------- EDUCATION ----------------
    "udemy": "Education",
    "course": "Education",
    "library": "Education",
    "stationary": "Education",

    # ---------------- FOOD ----------------
    "swiggy": "Food",
    "zomato": "Food",
    "pizza": "Food",
    "burger": "Food",
    "kfc": "Food",
    "subway": "Food",
    "dominos": "Food",
    "mcdonald": "Food",
    "maggi": "Food",
    "canteen": "Food",
    "chai": "Food",
    "dhaba": "Food",
    "cafe": "Food",
    "coffee": "Food",
    "restaurant": "Food",
    "hotel": "Food",
    "hut": "Food",
    "kitchen": "Food",
    "dining": "Food",
    "dinner": "Food",

    # ---------------- SUBSCRIPTIONS ----------------
    "netflix": "Subscription",
    "spotify": "Subscription",
    "adobe": "Subscription",
    "hotstar": "Subscription",
    "youtube": "Subscription",
    "prime": "Subscription",

    # ---------------- TRANSPORT ----------------
    "fuel": "Transport",
    "hpcl": "Transport",

    # ---------------- BILLS ----------------
    "recharge": "Bills",
    "fees": "Bills",
    "hostel": "Bills",
    "exam": "Bills",
    "electric": "Bills",
    "water": "Bills",
    "gas": "Bills",
    "broadband": "Bills",
    "airtel": "Bills",
    "charges": "Bills",
    # "tax": "Bills",

    # ---------------- FINANCIAL ----------------
    "emi": "Financial",
    "loan": "Financial",
    "sip": "Financial",
    "ppf": "Financial",
    "insurance": "Financial",
    "policy": "Financial",
    "tds": "Financial",
    "tax": "Financial",

    # ---------------- HEALTH ----------------
    "hospital": "Health",
    "pharmacy": "Health",
    "medplus": "Health",
    "apollo": "Health",
    "hosp": "Health",
    "netmeds": "Health",
    "medical": "Health",

    # ---------------- RENT ----------------
    "rent": "Rent",

    #-----------------TRAVEL----------------
    "ticket": "Travel",
    "irctc": "Travel",
    "air india": "Travel",

    # ---------------- ATM ----------------
    "atm": "Cash Withdrawal",

    "donation": "Others",
    "temple": "Others",
    # ---------------- SHOPPING ----------------
    "apple": "Shopping",
    "croma": "Shopping",
    "reliance digital": "Shopping",
    "decathlon": "Shopping",
    "h&m": "Shopping",
    "apple india store": "Shopping",

    # ---------------- SUBSCRIPTIONS ----------------
    "figma": "Subscription",
    "github": "Subscription",
    "notion": "Subscription",
    "aws": "Subscription",
    "slack": "Subscription",

    # ---------------- TRAVEL ----------------
    "uber": "Travel",
    "ola": "Travel",
    "airlines": "Travel",
    "flight": "Travel",
    "oyo": "Travel",
    "makemytrip": "Travel",
    "goibibo": "Travel"
}

    for key in merchant_map:
        if key in merchant or key in desc:
            return merchant_map[key]

    # 4. DB lookup (optional fallback)
    # db_category = get_category_from_db(merchant)
    # if db_category:
    #     return db_category

    # 5. FINAL FALLBACK
    return "Others"


# --------------------------------------
# MAIN PIPELINE FUNCTION (DO NOT BREAK THIS)
# --------------------------------------

def categorize(transactions):

    for t in transactions:
        desc = t["description"]
        amount = t["amount"]

        merchant = extract_merchant(desc)

        category = classify_transaction(desc, merchant, amount)

        t["category"] = category

        # DEBUG
        print("DESC:", desc)
        print("MERCHANT:", merchant)
        print("CATEGORY:", category)
        print("------")

    return transactions