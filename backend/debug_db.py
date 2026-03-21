from app.database.db import get_connection

conn = get_connection()
cursor = conn.cursor()

# ❌ delete all bad entries
cursor.execute("DELETE FROM merchants WHERE category = 'Others'")

conn.commit()
conn.close()

print("Cleaned DB")