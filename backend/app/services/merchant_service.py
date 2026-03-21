from app.database.db import get_connection

def get_category_from_db(merchant):
    conn = get_connection()
    cursor = conn.cursor()

    words = merchant.split()

    for word in words:
        cursor.execute(
            "SELECT category FROM merchants WHERE name LIKE ?",
            (f"%{word}%",)
        )
        result = cursor.fetchone()
        if result:
            conn.close()
            return result["category"]

    conn.close()
    return None
    
def save_merchant_if_valid(merchant, category):
    # ❌ Reject garbage merchants
    if not merchant or len(merchant) < 3:
        return

    invalid_words = ["upi", "to", "ref", "payment", "txn"]
    if merchant in invalid_words:
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
        pass  # already exists

    conn.close()