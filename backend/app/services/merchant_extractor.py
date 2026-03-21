import re

def extract_merchant(description):
    desc = description.lower()

    # -------- STEP 1: identify format --------
    merchant = desc

    if "upi" in desc:
        parts = desc.split("/")
        if len(parts) >= 3:
            merchant = parts[2]

    elif "neft" in desc:
        # try extracting after "to:"
        if "to:" in desc:
            merchant = desc.split("to:")[1].split("|")[0]

    elif "bbps" in desc:
        parts = desc.split("/")
        if len(parts) >= 3:
            merchant = parts[2]

    # -------- STEP 2: clean --------
    merchant = re.sub(r'[0-9]', '', merchant)   # remove numbers only
    merchant = merchant.strip()

    # -------- STEP 3: normalize --------
    if "amazon" in merchant:
        return "amazon"
    if "zomato" in merchant:
        return "zomato"
    if "swiggy" in merchant:
        return "swiggy"
    if "blinkit" in merchant:
        return "blinkit"
    if "jiomart" in merchant:
        return "jiomart"
    if "reliance digital" in merchant:
        return "reliance digital"
    if "marriott" in merchant:
        return "marriott"
    if "leela" in merchant:
        return "leela palace"
    if "adobe" in merchant:
        return "adobe"
    if "figma" in merchant:
        return "figma"
    if "notion" in merchant:
        return "notion"
    if "github" in merchant:
        return "github"
    if "slack" in merchant:
        return "slack"
    if "aws" in merchant:
        return "aws"
    if "airtel" in merchant:
        return "airtel"
    if "bescom" in merchant:
        return "electricity"
    if "rent" in merchant:
        return "rent"
    
    if "mcdonald" in merchant:
        return "mcdonald"

    if "burger king" in merchant:
        return "burger king"

    if "pizza hut" in merchant:
        return "pizza hut"

    if "dominos" in merchant:
        return "dominos"

    if "chai point" in merchant:
        return "chai point"

    if "maggi point" in merchant:
        return "maggi point"

    if "canteen" in merchant:
        return "canteen"

    if "udemy" in merchant:
        return "udemy"

    if "stationary" in merchant:
        return "stationary"

    # ❌ filter garbage merchants
    if len(merchant.strip()) < 3:
        return "unknown"

    if "txn" in merchant or "hdfc atm" in merchant:
        return "atm"

    return merchant