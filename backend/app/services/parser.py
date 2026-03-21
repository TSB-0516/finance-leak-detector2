import pdfplumber
import re

DATE_PATTERN = r"\d{2}-[A-Za-z]{3}-\d{4}"


def is_transaction_line(line):
    return re.search(DATE_PATTERN, line)  # changed from match → search


def extract_amount(line):
    amounts = re.findall(r"\d{1,3}(?:,\d{3})*\.\d{2}", line)

    print("AMOUNTS FOUND:", amounts)

    if not amounts:
        return None

    if len(amounts) >= 2:
        return float(amounts[-2].replace(",", ""))
    else:
        return float(amounts[0].replace(",", ""))


def extract_description(line):
    line = re.sub(DATE_PATTERN, "", line)
    line = re.sub(r"\d{2}:\d{2}:\d{2}", "", line)
    return line.strip()


def parse_pdf(file_path):
    transactions = []

    with pdfplumber.open(file_path) as pdf:
        for page_num, page in enumerate(pdf.pages):
            text = page.extract_text()

            if not text:
                continue

            lines = text.split("\n")

            print(f"\n--- PAGE {page_num} ---")

            for line in lines:
                line = line.strip()
                print("LINE:", line)

                if not is_transaction_line(line):
                    continue

                print("MATCHED TRANSACTION LINE:", line)

                try:
                    date_match = re.findall(DATE_PATTERN, line)
                    if not date_match:
                        continue

                    date = date_match[0]
                    amount = extract_amount(line)

                    if amount is None:
                        continue

                    description = extract_description(line)

                    transactions.append({
                        "date": date,
                        "description": description,
                        "amount": amount
                    })

                except Exception as e:
                    print("ERROR:", e)
                    continue

    print("\nFINAL TRANSACTIONS:", len(transactions))
    return transactions