# Lookcha AI — Demo Script (2–3 daqiqa)

> Hackathon taqdimoti uchun. Til: O'zbek (lotin). Backend va frontend ishlab turgan bo'lsin.

---

## A. Ochilish — muammo (~20s)

> "Online kiyim xaridida xaridor kiyim o'zida qanday turishini bilmaydi. Shu sababli ikkilanadi, savatni tashlab ketadi va sotuv kamayadi. Do'konlar esa qaysi mijoz qiziqqanini, qaysi mahsulot ko'p ko'rilganini aniq ko'ra olmaydi."

---

## B. Yechim (~25s)

> "Lookcha AI — bu marketplace va online do'konlar uchun AI try-on integratsiyasi. Biz mahsulot sahifasiga **'Lookcha'da kiyib ko'rish'** tugmasini qo'shamiz. Xaridor platformadan chiqmasdan kiyimni virtual kiyib ko'radi, AI moslik bahosini va razmer tavsiyasini oladi."

> "Bu shunchaki kiyim ilovasi emas — bu kiyim savdosi platformalari uchun AI integratsiya qatlami."

---

## C. Customer demo (~60s)

1. **Landing** (`/`) — "Mana platforma. 'Demo ko'rish' tugmasini bosamiz."
2. **Product Page** (`/product/premium-ipak-koylak`) — "Oddiy marketplace mahsulot sahifasi: Premium ipak ko'ylak, 450 000 so'm, Moda UZ. Mana bizning tugma — 'Lookcha'da kiyib ko'rish'."
3. **Try-On Modal** — "Platformadan chiqmasdan ochiladi. 3 qadam: rasm, o'lcham, natija. 'Kiyib ko'rishni boshlash'."
4. **Upload / Profile** — "Xaridor boshdan oyoqqacha to'liq rasm yuklaydi va o'lcham ma'lumotlarini kiritadi. 'AI natijani ko'rish'."
5. **Try-On Result** — "AI kiyimni xaridorga moslab to'liq obraz ko'rinishini beradi: **moslik bahosi 88%, razmer M, rang mosligi juda yaxshi** va stilist maslahati."
6. **Recommendations** — "AI stilist boshqa mos mahsulotlarni tavsiya qiladi — shu do'kondan."
7. **Order** — "Xaridor buyurtma beradi. 'Buyurtma qabul qilindi' — do'kon bilan to'g'ridan-to'g'ri aloqa."

---

## D. Merchant demo (~40s)

1. **Merchant Dashboard** (`/merchant/dashboard`) — "Do'kon egasi paneli: bu oy try-on soni, yangi leadlar, trafik manbalari (Instagram, Telegram, QR), eng ko'p sinab ko'rilgan mahsulotlar, conversion va AI savdo tavsiyasi."
2. **QR / Link** (`/merchant/qr-link`) — "Do'kon Instagram, Telegram, sayt yoki offline QR orqali mijozlarni try-on oqimiga olib keladi. Bitta kod qatori bilan integratsiya."

> "Ya'ni do'kon nafaqat sotadi, balki qaysi mijoz qiziqqanini va qaysi mahsulot ishlayotganini aniq ko'radi."

---

## E. Biznes model (~20s)

> "Boshlang'ich bosqichda — pilot do'konlar uchun oylik obuna paketi. Keyingi bosqichda — marketplace'lar uchun widget/API integratsiyasi va katta hajmli litsenziya."

---

## F. Yakun (~15s)

> "Lookcha AI kiyim savdosida ishonchni oshiradi, xaridorga tanlashni osonlashtiradi, do'konlarga esa conversion va analytics beradi. Rahmat."

---

### Demo eslatma
- Agar backend o'chsa ham, demo **offline fallback** bilan ishlaydi (demo natija, demo dashboard, demo tavsiyalar).
- Asosiy yo'l: `/` → `/product/premium-ipak-koylak` → try-on → natija → tavsiyalar → buyurtma → do'kon paneli.
