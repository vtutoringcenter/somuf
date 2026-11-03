# My Beauty Product — Luxury Halal Cosmetics Website (Static Edition)

This is a complete, production-ready static e-commerce website for **My Beauty Product**, featuring an integrated **LuxeAI Beauty Advisor**, live client-side cart, interactive checkout (with Cash on Delivery & WhatsApp integration), live product filtering & search, and real-time order tracking.

---

## 📁 Pages & Structure (صفحات اور ساخت)

- **`index.html`** — Home page with Hero banner, features, bestsellers, reviews, FAQ preview & newsletter.
- **`shop.html`** — Full e-commerce catalog with live category filtering, price slider, search, and sorting.
- **`mufti.html`** — **مفتی صاحب (Online Mufti AI)**: مکمل اسلامی و شرعی رہنمائی و فتویٰ اسسٹنٹ مع قرآنی آیات، احادیثِ نبویہ ﷺ، ائمہ اربعہ کے اقوال، آڈیو وائس ان پٹ (Speech-to-Text)، اور حلال و حرام مصنوعات کے شرعی احکام۔
- **`ai-assistant.html`** — **LuxeAI Beauty Advisor**: بیوٹی شیڈز اور اسکن کیئر روٹین گائیڈ۔
- **`about.html`** — Brand story, 100% Halal certification philosophy, milestones, and core values.
- **`faq.html`** — Categorized interactive accordion FAQs (Halal ingredients, shipping, returns, payments).
- **`contact.html`** — Contact details, working hours, interactive inquiry form, and WhatsApp support.
- **`track-order.html`** — Real-time parcel tracking with animated delivery progress stepper.
- **`privacy.html`** — Privacy policy.
- **`terms.html`** — Terms & conditions, refund, and halal guarantee.
- **`vercel.json`** — Deployment configuration for Vercel with clean URLs and asset caching.
- **`css/style.css`** — Master responsive luxury stylesheet.
- **`js/`** — `main.js` (navigation, animation) and `cart.js` (cart & checkout system).
- **`assets/images/`** — Product photos, banners, and vector logos.
- **`php-wordpress-backup/`** — Safe backup of original WordPress theme PHP files.

---

## 🚀 How to Upload to GitHub & Deploy to Vercel (گٹ ہب اور ورسل پر اپلوڈ کرنے کا طریقہ)

### 1. گٹ ہب (GitHub) پر اپلوڈ کرنا:
1. اپنے کمپیوٹر پر کمانڈ لائن (Terminal / PowerShell) کھولیں۔
2. گٹ ریپوزٹری بنائیں:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of static luxury beauty website with AI advisor"
   ```
3. گٹ ہب پر ایک نئی ریپوزٹری (New Repository) بنائیں (مثلاً `my-beauty-store`)۔
4. ریپوزٹری کو لنک کریں اور پش کریں:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/my-beauty-store.git
   git push -u origin main
   ```

### 2. ورسل (Vercel) پر لائیو کرنا:
1. [Vercel.com](https://vercel.com) پر لاگ ان کریں (اپنے گٹ ہب اکاؤنٹ کے ذریعے)۔
2. **"Add New Project"** پر کلک کریں اور گٹ ہب سے اپنی ریپوزٹری (`my-beauty-store`) منتخب کریں۔
3. Framework Preset میں **"Other"** رہنے دیں (چونکہ یہ مکمل سٹیٹک ایچ ٹی ایم ایل ویب سائٹ ہے)۔
4. **"Deploy"** کے بٹن پر کلک کریں۔
5. چند سیکنڈز میں آپ کی ویب سائٹ ایک مفت لائیو ڈومین (مثلاً `my-beauty-store.vercel.app`) پر لائیو ہو جائے گی!

---

## ✨ AI Beauty Advisor Features (اے آئی بیوٹی ایڈوائزر کی خصوصیات)
- **Built-in Mode (بغیر کسی کی کے فوراً فعال):** آف لائن بیوٹی نالج انجن جو پاکستانی جلد کے ٹونز، موسم اور حلال بیوٹی کے سوالات کے فوراً جواب دیتا ہے۔
- **Direct Add to Bag:** اے آئی کے تجویز کردہ پروڈکٹس چیٹ کے اندر سے ایک کلک میں کارٹ میں شامل ہو جاتے ہیں۔
- **Optional Gemini API:** صارف چاہیں تو گوگل اے آئی اسٹوڈیو کی مفت کی (API Key) ڈال کر لائیو جیمینائی اے آئی سے بھی گفتگو کر سکتے ہیں۔
