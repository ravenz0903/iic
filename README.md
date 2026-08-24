# AI Produce Intelligence Platform (Agritech SaaS)

> An AI-powered platform for farmers, traders, mandis, and enterprise buyers that leverages computer vision, dynamic market intelligence, and decision intelligence to evaluate agricultural produce from images, estimate quality grades, forecast market values, optimize logistics, and connect sellers with optimal buyers.

---

##  Key Features Overview

1. **AI Produce Scanner & Quality Assay**
   - Automated produce classification (Wheat, Rice, Tomato, Onion, Potato).
   - Defect segmentation & pixel area percentage calculation ($Q = 100 \cdot (1 - \text{Defect Penalty}) \cdot S_{\text{uniformity}}$).
   - Standardized Grade Assignment: **Grade A** ($\ge 85$), **Grade B** ($\ge 65$), **Grade C** ($\ge 40$), or **Rejected**.
2. **Digital Quality Certificate**
   - Downloadable/shareable audit reports with defect proportions, size classification, and storage handling recommendations.
3. **AI Price Estimator Engine**
   - Multi-factor valuation formula ($P_{\text{estimated}} = P_{\text{base}} \times Q_{\text{factor}} \times S_{\text{seasonal}} \times D_{\text{demand}}$).
4. **Market Intelligence & 90-Day Trends**
   - Historical APMC Mandi price curves, 7-day moving averages, and cross-market price comparison.
5. **Mandi Route & Net Realization Optimizer**
   - True Net Realization ($R_{\text{net}}$) calculator subtracting round-trip transit, tolls, and mandi cess.
6. **Logistics Optimizer**
   - Freight comparison across Mini Trucks, Large Trucks, and Shared Transit Pools.
7. **Profit Waterfall Calculator**
   - Gross-to-net waterfall chart detailing exact deduction flows.
8. **Smart Buyer Marketplace & AI Matchmaking**
   - Weighted multi-attribute buyer matching algorithm ($M_{\text{score}}$) considering proximity, volume, quality requirements, and reliability.
9. **Negotiation & Offers Portal**
   - Bid review, direct acceptance, rejection, and counter-offer workflows.
10. **Digital Traceability**
    - End-to-end chain of custody from farm scanning to mandi delivery confirmation.
11. **AI Agricultural Copilot**
    - Natural language assistant answering questions in English & Hindi regarding best selling destinations, pricing forecasts, and timing advice.
12. **Farmer-Friendly Simple Mode**
    - High-contrast 2x2 tap-only interface in Hindi & English for rural farmers.

---

##  Architecture & Tech Stack

```
├── backend/                  # FastAPI REST API & AI Agents
│   ├── agents/               # Copilot, Decision, Prediction & Alert Agents
│   ├── models/               # SQLAlchemy ORM Models (SQLite)
│   ├── routers/              # Modular FastAPI endpoints
│   ├── schemas/              # Pydantic v2 schemas
│   ├── services/             # CV Pipeline, Price, Market & Logistics Engines
│   ├── database.py           # SQLite connection & session management
│   ├── main.py               # Application factory & CORS middleware
│   └── requirements.txt      # Python dependencies
│
├── frontend-web/             # Modern React Web Application (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── api/              # Axios client configuration
│   │   ├── components/       # ScoreRing, CopilotDrawer, Navbar, Sidebar
│   │   ├── pages/            # 13 dedicated feature views
│   │   ├── types/            # TypeScript interfaces
│   │   ├── App.tsx           # React Router & layout
│   │   └── main.tsx          # Application entrypoint
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── frontend/                 # React Native / Expo Mobile App (Optional)
├── models/                   # YOLOv8 segmentation model storage (.pt)
└── docs/                     # Documentation & specification files
```

---

##  Quick Start Guide

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**

---

### 2. Backend Setup (FastAPI)

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI server (runs on 0.0.0.0:8000)
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

* **Interactive Swagger API Docs**: Open [http://localhost:8000/docs](http://localhost:8000/docs) in your browser.

---

### 3. Frontend Web Setup (React + Vite)

Open a new terminal window:

```bash
# Navigate to web frontend directory
cd frontend-web

# Install Node dependencies
npm install

# Start Vite development server
npm run dev
```

* **Live Web Application**: Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📡 Core API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/scan` | Run AI produce scan and receive quality certificate |
| `POST` | `/api/v1/estimate-price` | AI price prediction based on grade and seasonality |
| `GET` | `/api/v1/prices/history/{produce}` | 90-day historical price simulation |
| `POST` | `/api/v1/optimize-route` | Rank mandis by True Net Realization ($R_{\text{net}}$) |
| `POST` | `/api/v1/copilot/ask` | Natural language agricultural copilot query |
| `POST` | `/api/v1/profit/calculate` | Gross-to-net P&L waterfall breakdown |
| `POST` | `/api/v1/match/buyers` | AI buyer matchmaking algorithm |
| `GET` | `/api/v1/listings` | Search and filter marketplace listings |
| `GET` | `/api/v1/batches/{id}/timeline`| Farm-to-mandi traceability events |

---

## 📄 License
This project is licensed under the MIT License.
