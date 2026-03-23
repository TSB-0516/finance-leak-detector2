# 💸 Personal Finance Leak Detector

A rule-based financial analysis system that processes bank statements to identify spending leaks, detect patterns, and generate actionable insights.

---

## 🚨 Problem Statement

Most people are unaware of where their money is leaking due to:

- Hidden subscriptions
- Frequent small transactions
- Excessive food & shopping spend
- Cash withdrawals (untracked)
- Recurring payments (EMIs, bills)

This system helps users:

- Understand spending behavior
- Detect financial leaks
- Prioritize what to fix

---

## 🎯 Key Features

### 📄 PDF Parsing

- Extracts transaction data from bank statements
- Handles multi-page PDFs and varying formats

### 🧹 Data Cleaning

- Normalizes descriptions
- Converts amounts to numeric format
- Detects debit/credit transactions

### 🏷️ Rule-Based Categorization

- Deterministic logic (no ML)
- Categories include:
  - Food, Shopping, Subscription, Bills, Financial, Travel, Grocery, etc.

- Handles:
  - Merchant mapping
  - UPI transfers (person detection)
  - Refunds and income

### 📊 Spending Analysis

- Category-wise totals
- Recurring transaction detection
- Transaction sampling

### 🧠 Leak Score

Computed based on:

- Discretionary spending ratio
- Subscription usage
- Cash withdrawal behavior

### 💡 Insights Engine

Generates high-level observations:

- Spending patterns
- Financial commitments
- Behavioral indicators

### 🧾 Explanation Engine

Provides actionable explanations:

- Subscription breakdown
- Food spending insights
- Small transaction leakage
- Recurring payments

### 📉 Leak Breakdown

- Category → Merchant-level breakdown
- Separate views:
  - Full spending
  - Leak-only categories

### 🔝 Top Leak Detection

- Identifies top 3 categories contributing to leakage

### 📈 Monthly Trend Analysis _(WIP)_

- Tracks spending changes over time
- Month-wise aggregation and trend insights

---

## ⚙️ Tech Stack

### Backend

- **FastAPI** – API framework
- **pdfplumber** – PDF parsing
- Pure Python (rule-based logic)

### Frontend _(In Progress)_

- React
- Tailwind CSS

---

## 🧱 Project Structure

```bash
backend/
│
├── app/
│   ├── routes/
│   │   └── upload.py              # API endpoints
│   │
│   ├── services/
│   │   ├── parser.py              # PDF parsing
│   │   ├── cleaner.py             # Data cleaning
│   │   ├── categorizer.py         # Rule-based classification
│   │   ├── analyzer.py            # Spending + recurring analysis
│   │   ├── scorer.py              # Leak score calculation
│   │   ├── insights.py            # Insights generation
│   │   ├── explainer.py           # Explanations + breakdown
│   │   └── merchant_extractor.py  # Merchant detection
│
├── uploads/                       # Uploaded PDFs
├── main.py                        # FastAPI app entry
```

---

## 🔄 System Workflow

```text
PDF → Parser → Cleaner → Categorizer → Analyzer → Scorer → Insights → Output
```

### Step-by-step:

1. **Parse PDF**
2. **Clean data**
3. **Categorize transactions**
4. **Analyze spending**
5. **Calculate leak score**
6. **Generate insights & explanations**
7. **Return structured output**

---

## 🔌 API Endpoint

### POST `/analyze`

#### Request:

- Form-data with PDF file

#### Response:

```json
{
  "transactions": [...],
  "analysis": {...},
  "leak_score": 67,
  "insights": [...],
  "explanations": [...],
  "spending_breakdown": [...],
  "leak_breakdown": [...],
  "biggest_leak": {...},
  "top_leaks": [...]
}
```

---

## 🧠 Core Logic Highlights

### Categorization Priority

1. Income detection
2. Transfers (person-based)
3. Special rules (EMI, recharge, etc.)
4. Merchant mapping
5. Fallback → Others

---

### Recurring Detection

- Minimum frequency: 3
- Spread across days (>7)
- Amount consistency (±20%)
- Filtered categories:
  - Subscription
  - Financial
  - Bills

---

### Leak Score Calculation

Based on:

- Discretionary spending ratio
- Subscription load
- Cash withdrawals

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/TSB-0516/finance-leak-detector.git
cd finance-leak-detector
```

### 2. Setup backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
```

### 3. Run server

```bash
uvicorn app.main:app --reload
```

### 4. Access API docs

```
http://localhost:8000/docs
```

---

## ⚠️ Design Principles

- No machine learning (pure rule-based)
- Deterministic outputs
- Minimal external dependencies
- Pattern-based logic (not hardcoding)

---

## 📌 Current Status

- Backend: ✅ Complete
- Categorization: ✅ Stable (~85–90% accuracy)
- Insights: ✅ Working
- Frontend: 🚧 In progress
- Monthly Trends: 🚧 In progress

---

## 🔮 Future Improvements

- Monthly trend visualization
- Budget tracking
- Recommendations engine
- UI dashboard
- Export reports

---

## 🤝 Contribution

Open to improvements in:

- Categorization accuracy
- UI/UX
- Performance optimization

---

## 📄 License

For academic and learning purposes.

---

## 👤 Author

**Thamini**
Computer Science Student | Full Stack Developer
