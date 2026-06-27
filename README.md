# Lookcha AI

**Lookcha AI is an AI try-on integration platform for fashion marketplaces, online stores, and Instagram boutiques in Uzbekistan.**

It adds a **"Lookcha'da kiyib ko'rish"** button to fashion product pages. The customer uploads a full-body photo, virtually tries on the item, receives AI fit/size/style recommendations, and discovers matching products — all **without leaving the partner platform**.

> **Not just a fashion app. Not just a marketplace.**
> Lookcha AI is an **AI commerce integration layer** for fashion platforms.

---

## Core flows

**Customer flow**

```
Landing → Product Page → Try-On Modal → Upload/Profile → Try-On Result → Recommendations → Order
```

**Merchant flow**

```
Landing → Merchant Dashboard → QR/Link Page → Analytics
```

---

## Tech stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query, Axios
**Backend:** FastAPI, Pydantic, JSON storage, multipart upload, mock AI adapter

---

## Features

- AI virtual try-on flow
- Full-body photo upload with guided framing
- AI moslik (match), size, color, and style advice
- AI-powered product recommendations
- Merchant dashboard (try-on, leads, traffic, conversion, AI sales advice)
- QR / link sharing for Instagram, Telegram, web, and offline traffic
- Widget / API-ready integration architecture
- Offline demo fallback (works even with the backend off)

---

## Project structure

```
lookcha-ai/
├─ backend/          FastAPI app (routers, schemas, services, JSON storage, mock AI adapter)
├─ frontend/         React + TS + Vite app (pages, components, hooks, services, design system)
├─ README.md
├─ DEMO_SCRIPT.md
└─ FINAL_CHECKLIST.md
```

---

## Run instructions

### Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload --port 8000
```

### Frontend

```powershell
cd frontend
npm install
Copy-Item .env.example .env   # optional; defaults to http://localhost:8000
npm run dev
```

### URLs

| | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend  | http://localhost:8000 |
| Swagger  | http://localhost:8000/docs |

### Build check

```powershell
cd frontend
npm run build
```

---

## Main demo routes

| Route | Page |
|---|---|
| `/` | Landing (B2B integration platform) |
| `/product/premium-ipak-koylak` | Marketplace product page + try-on |
| `/merchant/dashboard` | Merchant analytics dashboard |
| `/merchant/qr-link` | QR / link sharing & widget code |

---

## API endpoints

| Method | Path |
|---|---|
| GET | `/health` |
| GET | `/products` · `/products/{id}` |
| POST | `/tryon/upload-profile` (multipart) |
| POST | `/tryon/generate` |
| GET | `/recommendations?product_id=` |
| GET | `/merchant/dashboard` · `/merchant/qr-link` |
| POST | `/orders` · `/leads` |

---

## AI integration note

The current MVP uses a **mock AI adapter** (`backend/app/services/ai/mock_adapter.py`) behind an abstract interface (`base.py`) resolved by a factory (`factory.py`).

To go live, implement the same `AITryOnAdapter.generate(...)` contract for a real provider (OpenAI / Gemini / Replicate or a dedicated virtual try-on API) and switch `AI_PROVIDER` in `.env` — **no caller code changes required**.
