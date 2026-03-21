import sqlite3

def get_connection():
    conn = sqlite3.connect("merchants.db")
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS merchants (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE,
            category TEXT
        )
    """)

    conn.commit()
    conn.close()

def seed_data():
    conn = get_connection()
    cursor = conn.cursor()

    data = [
        ("zomato", "Food"),
        ("swiggy", "Food"),
        ("cafe coffee day", "Food"),
        ("hotel saravana", "Food"),
        ("masala hut", "Food"),

        ("bigbasket", "Grocery"),
        ("dmart", "Grocery"),
        ("metro", "Grocery"),
        ("spar", "Grocery"),
        ("reliance smart", "Grocery"),

        ("netflix", "Subscription"),
        ("spotify", "Subscription"),
        ("adobe", "Subscription"),
        ("hotstar", "Subscription"),
        ("youtube", "Subscription"),

        ("hpcl", "Transport"),

        ("airtel", "Bills"),
        ("jiofiber", "Bills"),
        ("mtnl", "Bills"),
        ("bescom", "Bills"),
        ("water", "Bills"),

        ("apollo", "Health"),
        ("medplus", "Health"),
        ("hospital", "Health"),

        ("emi", "Financial"),
        ("loan", "Financial"),
        ("sip", "Financial"),
        ("ppf", "Financial"),
        ("figma", "Subscription"),
        ("notion", "Subscription"),
        ("github", "Subscription"),
        ("copilot", "Subscription"),
        ("aws", "Subscription"),
        ("slack", "Subscription"),
        ("apple", "Shopping"),
        ("amazon", "Shopping"),
        ("flipkart", "Shopping"),
        ("myntra", "Shopping"),
        ("h&m", "Shopping"),
        ("croma", "Shopping"),
        ("reliance digital", "Shopping"),
        ("uber", "Transport"),
        ("ola", "Transport"),
        ("irctc", "Travel"),
        ("makemytrip", "Travel"),
        ("goibibo", "Travel"),
        ("oyo", "Travel"),
        ("indigo", "Travel"),
        ("air india", "Travel"),
        ("blinkit", "Grocery"),
        ("jiomart", "Grocery"),
    ]

    for name, category in data:
        try:
            cursor.execute(
                "INSERT INTO merchants (name, category) VALUES (?, ?)",
                (name, category)
            )
        except:
            pass  # ignore duplicates

    conn.commit()
    conn.close()