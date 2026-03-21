import pdfplumber
import re

DATE_PATTERN = r"\d{2}-[A-Za-z]{3}-\d{4}"


def is_transaction_line(line):
    # must contain date AND amount
    has_date = re.search(DATE_PATTERN, line)
    has_amount = re.search(r"\d{1,3}(?:,\d{3})*\.\d{2}", line)

    return has_date and has_amount


def extract_amount(line):
    amounts = re.findall(r"\d{1,3}(?:,\d{3})*\.\d{2}", line)

    if not amounts:
        return None

    # transaction amount = second last
    if len(amounts) >= 2:
        txn_amount = amounts[-2]
    else:
        txn_amount = amounts[0]

    amount = float(txn_amount.replace(",", ""))

    # ✅ detect debit ONLY if '-' appears BEFORE this specific amount
    pattern = rf"-\s*{re.escape(txn_amount)}"
    if re.search(pattern, line):
        return -amount
    else:
        return amount

def extract_description(line):
    # remove date + time
    line = re.sub(DATE_PATTERN, "", line)
    line = re.sub(r"\d{2}:\d{2}:\d{2}", "", line)

    # remove amounts (both debit & balance)
    line = re.sub(r"\d{1,3}(?:,\d{3})*\.\d{2}", "", line)

    # remove extra symbols
    line = line.replace("|", "").strip()

    return line


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

                # ❌ skip obvious non-transactions
                if "opening balance" in line.lower():
                    continue

                if "closing balance" in line.lower():
                    continue

                if "total credits" in line.lower():
                    continue

                if "account" in line.lower():
                    continue
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

                    # detect debit ONLY if "-" appears BEFORE amount
                    # if re.search(r"-\s*\d{1,3}(?:,\d{3})*\.\d{2}", line):
                    #     amount = -amount

                    if amount is None:
                        continue

                    description = extract_description(line)

                    if not isinstance(amount, float):
                        print("SKIPPING INVALID:", line)
                        continue

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