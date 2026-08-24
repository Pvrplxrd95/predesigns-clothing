# 🚀 Quick Deployment Guide
Follow these steps to successfully launch **Predesigns Clothing** on [https://predesigns.onl](https://predesigns.onl).

## 🛠 Step 1: Environment Sync (js/env.js)
Open `js/env.js` and ensure all values match your production credentials:
*   **`SNIPCART_API_KEY`**: Get your public API key from [Snipcart Credentials](https://app.snipcart.com/dashboard/account/credentials).
*   **`SNIPCART_ENVIRONMENT`**: Change to `'live'`.
*   **`APP_URL`**: Change to `'https://predesigns.onl'`.

## 🌩 Step 2: Firebase Check
Ensure your Firebase console has **predesigns.onl** listed under the **Authorized Domains** in Authentication > Settings.

## 🛍 Step 3: Snipcart Dashboard
In your Snipcart dashboard, verify the following are correctly set:
*   **Site URL Domain**: Set this to `https://predesigns.onl`.
*   **Cart Language**: Ensure it's set to English (multi-currency enabled).
*   **Currency**: Verify **ZAR** is active as the primary currency.

## 📧 Step 4: Formspree Activation
Ensure your email is verified to receive submissions for the following endpoints used on the site:
*   **`xanlepek`** (Newsletter Subscriptions)
*   **`mqagpypo`** (Contact & Custom Orders)

---

## ⚡ Deployment Readiness Summary
**All UI, Logic, and Interactive Components are already MODERNIZED.**
No build tools (like npm or webpack) are required for this deployment. Simply upload the files to your server (Netlify, Vercel, or traditional FTP) and they will run instantly using our high-performance modular system.

---
**Predesigns Clothing — Hammanskraal's Finest**
*Quality made with local love and taste.*
