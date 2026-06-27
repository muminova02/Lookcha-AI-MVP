# Lookcha AI — Final Checklist

## Backend (http://localhost:8000)

- [ ] `GET /health` → `{ "status": "ok" }`
- [ ] `GET /products` → 7 products
- [ ] `GET /products/premium-ipak-koylak` → product
- [ ] `POST /tryon/upload-profile` (multipart) → `profile_id` + `photo_url`
- [ ] `POST /tryon/generate` → match 88 / size M / color "Juda yaxshi" / 6 recs
- [ ] `GET /recommendations?product_id=premium-ipak-koylak` → sections + products
- [ ] `GET /merchant/dashboard` → KPIs, traffic, leads, conversion, AI advice
- [ ] `GET /merchant/qr-link` → link, QR, stats
- [ ] `POST /orders` → success message
- [ ] `POST /leads` → lead id

## Frontend

- [ ] `npm run build` passes
- [ ] No TypeScript errors
- [ ] No console runtime errors in the main flow
- [ ] Customer flow works end-to-end
- [ ] Merchant flow works end-to-end
- [ ] Offline fallback works (backend off)
- [ ] All UI text is Uzbek Latin
- [ ] No "UZS" / dollar labels (only "so‘m")
- [ ] Uses "AI moslik" (not "AI Match"); brand always "Lookcha AI"
- [ ] Full-body try-on image is NOT cropped (head-to-toe visible)
- [ ] No dead-end screens (every page has back + next action)

## Demo readiness

- [ ] Backend running (`uvicorn app.main:app --reload --port 8000`)
- [ ] Frontend running (`npm run dev`)
- [ ] Browser opened at `/`
- [ ] Backup offline fallback tested (stop backend, repeat flow)
- [ ] `DEMO_SCRIPT.md` ready
- [ ] Screen recording path ready (if needed)

## Quick demo route list

- [ ] `/`
- [ ] `/product/premium-ipak-koylak`
- [ ] `/merchant/dashboard`
- [ ] `/merchant/qr-link`
