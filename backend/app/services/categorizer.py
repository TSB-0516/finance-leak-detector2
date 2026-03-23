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

def is_transfer(desc, merchant):
    if "upi" in desc:
        words = desc.split()

        # short description + no business keywords
        if len(words) <= 4 and not any(w in desc for w in ["store", "mart", "cafe", "hotel", "restaurant"]):
            return True

    if is_person_name(merchant):
        return True

    return False


# --------------------------------------
# SINGLE TRANSACTION CLASSIFIER
# --------------------------------------

def classify_transaction(desc, merchant, amount):

    REFUND_KEYWORDS = ["refund", "reversal", "cashback"]

    desc = desc.lower()
    merchant = merchant.lower()
    if any(word in desc for word in REFUND_KEYWORDS):
        return "Income"

    if "restaurant" in desc or "hotel" in desc:
        return "Food"

    # 1. INCOME
    if amount > 0:
        if any(word in desc for word in ["salary", "scholarship", "income","interest","dividend","pension","bonus","reward","project","payout","freelancer","consulting","invoice"]):
            return "Income"
    if amount > 0 and "neft cr" in desc:
        return "Income"
        
    if amount > 0 and "transfer" in desc:
        return "Transfer"

    
    
    if "loan disbursal" in desc or "disbursal" in desc:
        return "Income"

    
    

    # ---------------- SUBSCRIPTION (EARLY CATCH) ----------------
    SUBSCRIPTION_KEYWORDS = ["subscription", "netflix", "spotify", "prime", "youtube", "hotstar"]

    if any(word in desc for word in SUBSCRIPTION_KEYWORDS):
        return "Subscription"

    if "premium" in desc and "restaurant" not in desc and "hotel" not in desc:
        return "Subscription"
    
    if "emi" in desc or "repayment" in desc:
        return "Financial"

    # ---------------- RECHARGE (PRIORITY FIX) ----------------
    if "recharge" in desc:
        return "Bills"

    
    # 3. STRONG MERCHANT RULES
    merchant_map = {

    # ---------------- EDUCATION ----------------
    "udemy": "Education",
    "course": "Education",
    "library": "Education",
    "stationary": "Education",
    # ---------------- SHOPPING ----------------
    "croma": "Shopping",
    "reliance digital": "Shopping",
    "decathlon": "Shopping",
    "h&m": "Shopping",
    # ---------------- SHOPPING / GROCERY ----------------
    "amazon": "Shopping",
    "flipkart": "Shopping",
    "myntra": "Shopping",
    "meesho": "Shopping",
    # ---------------- SHOPPING PRIORITY FIX ----------------
    "apple": "Shopping",
    "apple india": "Shopping",
    "apple store": "Shopping",
    "bigbasket": "Grocery",
    "dmart": "Grocery",
    "spar": "Grocery",
    # "reliance": "Grocery",
    "metro": "Grocery",
    "supermarket": "Grocery",
    "kirana": "Grocery",
    "jiomart": "Grocery",
    "provisional store": "Grocery",   # ✅ specific
    "general store": "Grocery",       # ✅ specific
    "grocery": "Grocery",  
    "blinkit": "Grocery",


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
        if key in merchant:
            return merchant_map[key]

        if key in desc:
            return merchant_map[key]
        
        if "youtube" in desc:
           return "Subscription"
            # return merchant_map[key]

    # 4. DB lookup (optional fallback)
    # db_category = get_category_from_db(merchant)
    # if db_category:
    #     return db_category

    # 2. TRANSFER (only people)
    if is_transfer(desc, merchant):
        return "Transfer"
    # 5. FINAL FALLBACK
    return "Others"


# --------------------------------------
# MAIN PIPELINE FUNCTION (DO NOT BREAK THIS)
# --------------------------------------

def categorize(transactions):

    NORMALIZATION_MAP = {
        "swiggy instamart": "swiggy",
        "swiggy food": "swiggy",
        "zomato online": "zomato",
        "amazon pay": "amazon",
    }

    # merchant = NORMALIZATION_MAP.get(merchant, merchant)
    merchant_memory = {}
    for t in transactions:
        desc = t["description"]
        amount = t["amount"]

        merchant = extract_merchant(desc)
        merchant = NORMALIZATION_MAP.get(merchant, merchant)
        if merchant in merchant_memory:
            t["category"] = merchant_memory[merchant]
            continue
        category = classify_transaction(desc, merchant, amount)
        merchant_memory[merchant] = category
        t["category"] = category

        # DEBUG
        print("DESC:", desc)
        print("MERCHANT:", merchant)
        print("CATEGORY:", category)
        print("------")

    return transactions