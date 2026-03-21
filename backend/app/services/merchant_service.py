from app.database.db import get_connection

def get_category_from_db(merchant):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT category FROM merchants WHERE name = ?",
        (merchant,)
    )

    result = cursor.fetchone()
    conn.close()

    if result:
        return result["category"]

    return None
    
def save_merchant_if_valid(merchant, category):

    if not merchant or len(merchant) < 3:
        return

    # ❌ reject people names
    if "." in merchant:
        return

    # ❌ reject garbage patterns
    invalid_words = ["upi", "to", "ref", "payment", "txn", "transfer"]
    if any(word in merchant for word in invalid_words):
        return

    # ❌ DO NOT save "Others"
    if category == "Others":
        return

    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "INSERT INTO merchants (name, category) VALUES (?, ?)",
            (merchant, category)
        )
        conn.commit()
    except:
        pass

    conn.close()