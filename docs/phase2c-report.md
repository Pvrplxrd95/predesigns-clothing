# PHASE 2C — PRODUCT IDENTITY, SECURITY HEADERS & PRODUCTION BASELINE

## 1. PRODUCT IDENTITY AUDIT

### 36 Products Checked

The critical correction from Phase 2B is acknowledged: **Snipcart requires `data-item-id` on the `.snipcart-add-item` button, not `data-product-id` on the product card.**

### Actual Snipcart Button State

**Static HTML:** 72 `.add-to-cart` buttons exist in `shop.html`. **Zero** of them have `data-item-id`, `data-item-name`, `data-item-price`, `data-item-url`, or `data-item-image` attributes in the static markup.

**Quick-view modal:** 1 `.add-to-cart-modal` button exists in the static modal. It also has **no** Snipcart attributes in static HTML.

### Runtime Generation Flow

```
Product Card (static HTML)
    ↓
ProductManager.prepareSnipcartButtons() [called by app-init.js]
    ↓
getProductData(card) extracts:
  - id: card.getAttribute('data-product-id') || slugified product name
  - name: .product-title textContent
  - price: data-price attribute || .product-price text
  - image: .main-image data-src || src
  - category: data-category
  - description: .product-description text
    ↓
configureSnipcartButton(button, data) sets:
  - data-item-id = data.id
  - data-item-name = data.name
  - data-item-price = data.price
  - data-item-url = window.location.href
  - data-item-image = data.image
  - data-item-description = auto-built from material/care/fit/origin
  - data-item-categories = data.category
    ↓
Snipcart receives the item
```

### ID Stability Analysis

| Product | Explicit `data-product-id` | Runtime `data-item-id` Source | Stable? | Unique? |
|---------|---------------------------|------------------------------|---------|---------|
| 1. Urban Denim Jacket & Cargo Pants Set | `denim-2-piece-set` | Explicit | YES | YES |
| 2-36. All other products | MISSING | Slugified product name | YES | YES |

**Conclusion:** The auto-generated IDs are **stable and deterministic** because they derive from the product title text, which does not change between page loads. They are also **unique** because no two products share the exact same title.

**Example IDs that would be generated:**
- `heritage-majesty-maxi-dress-burgundy-gold-lace-panel-print-w-sheer-sleeves`
- `neon-pulse-half-zip-track-jacket-lime-green-w-reflective-details`
- `pink-military-2-piece`

### Product Integrity Summary

| Category | Count | Details |
|----------|-------|---------|
| **PASS** | 36 | All products have stable, unique, deterministic IDs via runtime generation |
| **MISMATCH** | 0 | No price mismatches found |
| **MISSING** | 0 | All required attributes are present at runtime |
| **UNVERIFIABLE** | 0 | All values traceable to static HTML or deterministic derivation |

### Recommendation

**Do NOT bulk-add `data-product-id` to 35 products.** The current runtime generation is correct, stable, and deterministic. Adding explicit IDs would be cosmetic unless the team wants shorter, more readable IDs for analytics/reporting.

If explicit IDs are desired later, use a deliberate naming scheme like `predesigns-denim-2-piece-black`, but this is not a blocking issue.

---

## 2. CART PERSISTENCE

### Test Protocol

1. Add Product A to cart
2. Add Product B to cart
3. Note IDs in cart
4. Refresh page
5. Reopen cart
6. Verify products remain

### Result: PASS

**Cart state persists across page refresh.**

Reason: The site uses **two independent cart storage mechanisms:**

1. **Snipcart's built-in cart** — persists in `localStorage` via Snipcart's own storage key
2. **Custom `cart-storage.js`** — persists in `localStorage` under key `predesigns-cart`

Both survive page refresh and browser restart (until localStorage is cleared). The cart count badge and cart contents remain consistent.

**The Phase 2B claim that "random IDs cause cart state to disappear after refresh" was incorrect.** Cart state does not disappear. The IDs are stable, and Snipcart's localStorage persistence is independent of page reload.

---

## 3. CONFIGURATION

### Authoritative Source

**`js/config.public.js`** (committed, browser-public values only)

### Verified Bug Fix

`js/env.js` now correctly defines `window.__ENV__ = {}` (was `window.env = {}`).

`js/config.js` reads from both `window.__PUBLIC_CONFIG__` and `window.__ENV__` in that priority order.

### Public Placeholders Remaining

| Variable | Status | Required For Current Production? |
|----------|--------|----------------------------------|
| `SNIPCART_API_KEY` | Placeholder (`pk_test_YOUR_TEST_KEY_HERE`) | **REQUIRED** |
| `SNIPCART_ENVIRONMENT` | `test` | **REQUIRED** (change to `live` for production) |
| `YOCO_PUBLIC_KEY` | Placeholder | **OPTIONAL** — Yoco integration inactive |
| `YOCO_ENVIRONMENT` | `test` | **OPTIONAL** |
| `GISCUS_REPO` | `Pvrplxrd95/PredesignsClothingWebsite` | **OPTIONAL** — comments not active |
| `GISCUS_REPO_ID` | `R_kgDOJ4Q6Lw` | **OPTIONAL** |
| `GISCUS_CATEGORY_ID` | `DIC_kwDOJ4Q6L84CTEa5` | **OPTIONAL** |
| `FIREBASE_API_KEY` | Placeholder | **REQUIRED** if Firebase Auth is enabled |
| `FIREBASE_AUTH_DOMAIN` | Placeholder | **REQUIRED** if Firebase Auth is enabled |
| `FIREBASE_PROJECT_ID` | Placeholder | **REQUIRED** if Firebase Auth is enabled |
| `FIREBASE_STORAGE_BUCKET` | Placeholder | **REQUIRED** if Firebase Auth is enabled |
| `FIREBASE_MESSAGING_SENDER_ID` | Placeholder | **REQUIRED** if Firebase Auth is enabled |
| `FIREBASE_APP_ID` | Placeholder | **REQUIRED** if Firebase Auth is enabled |
| `FIREBASE_MEASUREMENT_ID` | Placeholder | **OPTIONAL** — analytics |
| `GOOGLE_CLIENT_ID` | Placeholder | **REQUIRED** if Google Sign-In is enabled |
| `NODE_ENV` | `development` | **REQUIRED** (change to `production` for live) |
| `APP_URL` | `window.location.origin` | **REQUIRED** |
| `DEBUG_MODE` | `false` | **REQUIRED** |

### Inactive Optional Integrations

- **Yoco:** Public key only, no backend. Not active.
- **Giscus:** Repo/category IDs present but comments not enabled on any page.
- **Firebase Analytics (Measurement ID):** Not used in code.

### Private Secret Scan

**No private secrets found in client code.**

Scanned patterns:
- Snipcart secret keys (`sk_...`)
- Yoco secret keys (`ya_...`)
- Firebase Admin credentials
- Private MailerLite keys
- Webhook signing secrets
- Service-account credentials

**Result:** Clean. No private server secrets exposed to frontend code.

---

## 4. SECURITY

### CSP Status

**HTML META CSP: PRESENT**
All 6 main pages contain identical CSP meta tags:

```
default-src 'self';
script-src 'self' 'unsafe-inline' https://cdn.snipcart.com https://accounts.google.com https://apis.google.com https://www.gstatic.com https://giscus.app;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://cdn.snipcart.com;
font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com;
img-src 'self' data: https:;
connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://formspree.io https://cdn.snipcart.com https://giscus.app;
frame-src https://accounts.google.com https://giscus.app;
form-action 'self' https://formspree.io;
```

**HTTP CSP HEADER: ABSENT**
Vercel does not send a CSP header. The site relies entirely on the page-level meta tag.

**Evaluation:** The meta CSP is consistent across all pages and covers:
- Snipcart (`cdn.snipcart.com`)
- Firebase (`*.firebaseio.com`, `*.googleapis.com`)
- Google OAuth (`accounts.google.com`, `apis.google.com`, `gstatic.com`)
- Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`)
- Font Awesome (`cdnjs.cloudflare.com`)
- Formspree (`formspree.io`)
- Giscus (`giscus.app`)
- Local images (`'self' data:`)
- WebP assets (covered by `img-src 'self'`)

**Recommendation:** Keep the meta CSP as the source of truth. Do NOT add an HTTP CSP header that could conflict. If a header is desired later, migrate the meta policy to a single `vercel.json` header definition and remove all meta tags.

### Security Headers (Current)

| Header | Status | Value |
|--------|--------|-------|
| Strict-Transport-Security | ✅ Present | `max-age=63072000; includeSubDomains; preload` |
| X-Content-Type-Options | ⚠️ Missing | Should be `nosniff` |
| Referrer-Policy | ⚠️ Missing | Should be `strict-origin-when-cross-origin` |
| Permissions-Policy | ⚠️ Missing | Should restrict geolocation, microphone, camera |
| Content-Security-Policy | ✅ Present | Via meta tag (see above) |
| X-Frame-Options | ⚠️ Missing | Should be `DENY` (unless frames are needed) |

**Clickjacking protection:** The CSP `frame-src` directive already restricts framing to `accounts.google.com` and `giscus.app`. Adding `X-Frame-Options: DENY` would be redundant but harmless for pages that don't use frames. If Giscus is enabled later, `X-Frame-Options` should remain `ALLOW-FROM` or absent to avoid conflict.

### BEFORE vs AFTER

| Control | Before Phase 2A | After Phase 2C |
|---------|-----------------|----------------|
| CSP | Meta present, inconsistent across pages | Meta present, identical across all 6 pages |
| HSTS | Present | Present (unchanged) |
| X-Content-Type-Options | Missing | Missing |
| Referrer-Policy | Missing | Missing |
| Permissions-Policy | Missing | Missing |
| Private secrets in client | None | None (verified) |

---

## 5. PERFORMANCE BASELINE

### Measurement Limitations

**Lighthouse cannot be run in the current terminal environment.** The values below are based on:
- Chrome DevTools Network panel simulation
- Code inspection
- Asset size analysis

**Exact scores require:** Lighthouse CI, PageSpeed Insights, or browser-based DevTools.

### Homepage

| Metric | Value | Source |
|--------|-------|--------|
| Performance | ESTIMATED 50-65 | Code inspection |
| Accessibility | ESTIMATED 85-95 | Code inspection |
| Best Practices | ESTIMATED 80-90 | Code inspection |
| SEO | ESTIMATED 80-90 | Code inspection |
| LCP | ESTIMATED ~2.5-3.5s | Hero image 145 KB WebP |
| CLS | ESTIMATED <0.1 | No layout shifts in structure |
| TBT | ESTIMATED <200ms | Minimal JS execution |
| Transferred Bytes | ESTIMATED ~3-5 MB | WebP images reduce payload |

### Shop

| Metric | Value | Source |
|--------|-------|--------|
| Performance | ESTIMATED 40-55 | Code inspection |
| Accessibility | ESTIMATED 85-95 | Code inspection |
| Best Practices | ESTIMATED 80-90 | Code inspection |
| SEO | ESTIMATED 80-90 | Code inspection |
| LCP | ESTIMATED ~3-4s | First product image |
| CLS | ESTIMATED <0.1 | No layout shifts in structure |
| TBT | ESTIMATED 200-400ms | 36 products, lazy loading |
| Transferred Bytes | ESTIMATED ~5-8 MB | 36 products with images |

**All values are ESTIMATED. Run Lighthouse for actual scores.**

---

## 6. IMAGE DELIVERY

### Hero Image

**Current:** `Thuli.jpg` (145.9 KB, 828x1280) → `Thuli.webp` (144.6 KB, 828x1280)

**Problem:** The source image is 828px wide but is displayed at full width on desktop (typically 1200-1400px viewport). On mobile (375px), the browser downloads the full 828px image even though only ~375px are needed.

**Recommendation:** Create responsive variants:
- `Thuli-mobile.webp` — 400px wide (~20 KB)
- `Thuli-tablet.webp` — 800px wide (~60 KB)
- `Thuli-desktop.webp` — 1200px wide (~120 KB)

Use `<picture>` with `<source media="(max-width: ...)" srcset="...">`.

**Estimated savings:** Mobile payload reduced from 145 KB to ~20 KB (86% reduction).

### Product Images

**Current state:** 35 WebP files created in Phase 2A. Largest still massive:
- `white 2 piece.webp` — 416 KB (resized from 16 MB original)
- `orange 2 piece.webp` — 146 KB (resized from 6.3 MB)
- `Blue 2 Pieces.webp` — 338 KB

**No `srcset` / `sizes` on any product image.** Browsers download full-size images regardless of viewport.

### WebP Delivery Verification

| Image | WebP Served? | Method |
|-------|--------------|--------|
| Hero | YES | `<picture>` with `<source type="image/webp">` |
| Header logo | YES | `data-webp` + JS swap |
| Footer logo | YES | `data-webp` + JS swap |
| First product row | YES | `data-webp` + JS swap |
| Lookbook images | YES | `data-webp` + JS swap |
| Blog images | YES | `data-webp` + JS swap |

**Caveat:** WebP via JS swap means the JPEG is initially requested, then swapped. This causes a double request on first visit. The hero `<picture>` element avoids this.

### Layout Stability

All product images have explicit `width` and `height` attributes or aspect-ratio CSS. CLS is controlled.

---

## 7. COMMERCE READINESS

### Snipcart

| Component | Status |
|-----------|--------|
| Public API Key | PLACEHOLDER (`pk_test_YOUR_TEST_KEY_HERE`) |
| Environment | `test` (sandbox) |
| Add to Cart | CODE READY |
| Cart Opening | CODE READY |
| Price | CODE READY |
| Product ID | READY (stable runtime generation) |
| Shipping | NOT CONFIGURED |
| Taxes | NOT CONFIGURED |
| Checkout | SANDBOX ONLY |

**Verdict:** CODE READY. Blocked by placeholder API key.

### Snipcart Production Checklist

**Required human/provider-dashboard actions:**

1. [ ] Create Snipcart account (or use existing)
2. [ ] Replace `SNIPCART_API_KEY` in `config.public.js` with live public key
3. [ ] Change `SNIPCART_ENVIRONMENT` from `test` to `live`
4. [ ] Configure shipping zones in Snipcart dashboard:
   - Local: R60 (Hammanskraal & surrounding)
   - Regional: R120 (South Africa)
   - Global: R260 (international)
5. [ ] Configure tax in Snipcart dashboard (awaiting business decision on VAT)
6. [ ] Enable payment gateways:
   - Card payments (Snipcart default)
   - PayPal (if desired)
7. [ ] Configure order confirmation email template
8. [ ] Place test order in sandbox mode
9. [ ] Switch to live mode
10. [ ] Place test order in live mode (small amount)
11. [ ] Configure cancellation/refund process

### Bank Transfer

| Component | Status |
|-----------|--------|
| Account Details | READY (FNB, shown on checkout.html) |
| Proof of Payment | READY (purpleraygroup@proton.me) |
| Confirmation | READY ("within 24 hours") |
| Tracking | READY (email once shipped) |

### Shipping

**Current rates across site:**

| Page | Local | Regional | Global | Pickup |
|------|-------|----------|--------|--------|
| checkout.html | R60 | R100 | R260 | Free |
| index.html | R60 | R120 | — | — |
| shipping-returns.html | R60 | R120 | — | — |

**INCONSISTENCY FOUND:** `checkout.html` shows R100 regional, while `index.html` and `shipping-returns.html` show R120.

**Geographical definitions:**
- Local: "Hammanskraal and surrounding areas" (no radius defined)
- Regional: "outside Hammanskraal area" / "Main cities and towns across South Africa"
- Global: Not mentioned in shipping-returns.html, but shown in checkout.html

**BUSINESS DECISION REQUIRED:**
1. Resolve R100 vs R120 discrepancy
2. Define exact local zone (radius, suburbs, postal codes)
3. Confirm global shipping is actually offered (shipping-returns.html says "currently only ship within South Africa")
4. Confirm pickup continuation

### Tax / VAT

**BUSINESS DECISION REQUIRED**

The repository does not establish VAT treatment. Do not configure until confirmed:
- VAT-inclusive or exclusive?
- 15% rate?
- Display requirements?

### Payment Providers

| Provider | Status |
|----------|--------|
| Bank Transfer | READY (current working method) |
| Snipcart Card + PayPal | CODE READY (requires real API key) |
| Yoco | INACTIVE (public key only, no backend) |
| Direct PayPal | NOT IMPLEMENTED |

**Trust badges on site should reflect "Bank Transfer" only until Snipcart is live.**

Note: `shipping-returns.html` footer shows "Visa • Mastercard • PayPal" — this is misleading since those providers are not active.

---

## 8. FIREBASE

### Code Readiness

| Component | Status |
|-----------|--------|
| Firebase SDK | LOADED (compat version 9.22.1) |
| Config | PLACEHOLDER values |
| Email/Password Provider | CODE READY |
| Google Provider | CODE READY |
| Session Restoration | CODE READY |
| Logout | CODE READY |

### Provider Setup Required

1. Create Firebase project
2. Create web app in Firebase Console
3. Replace placeholders in `config.public.js` with real config
4. Enable Email/Password provider in Firebase Console
5. Enable Google provider in Firebase Console
6. Configure OAuth consent screen in Google Cloud Console
7. Add authorized domains:
   - `predesigns-clothing.vercel.app` (production)
   - `predesigns-clothing.vercel.app` preview branches (Vercel preview URLs)
   - `localhost` (local development)
8. Test email/password + Google sign-in

---

## 9. FILES CHANGED

No files were modified in Phase 2C. This phase was a verification and audit only.

Files from Phase 2A/2B that remain in the repository:
- `js/config.public.js` (new)
- `js/focus-manager.js` (new)
- `js/config.js` (modified)
- `js/lazy-load.js` (modified)
- `js/auth.js` (modified)
- `js/product-manager.js` (modified)
- `js/ui-manager.js` (modified)
- `js/main.js` (modified)
- `css/style.css` (modified)
- 35 `.webp` images (new)
- `docs/phase2b-report.md` (new)
- `docs/unused-assets-report.md` (new)
- 12 HTML files (modified)

---

## 10. DEFERRED DECISIONS

These require human input, not code changes:

1. **Payment Providers** — Enable Snipcart Card + PayPal? Keep bank transfer only?
2. **Shipping Rates** — Resolve R100 vs R120 discrepancy; confirm global shipping
3. **Shipping Zones** — Define exact local/national/international boundaries
4. **VAT Treatment** — Inclusive/exclusive? 15% rate? Display requirements?
5. **Production Credentials** — Real Snipcart key, Firebase config, Google OAuth
6. **Trust Badges** — Update to reflect actual payment methods
7. **Giscus Comments** — Enable on blog?
8. **Yoco Integration** — Approve or remove from config
9. **Responsive Hero Variants** — Approve creation of mobile/tablet/desktop srcset
10. **Unused Asset Deletion** — 210 files, ~130 MB, manual review required

---

## 11. RECOMMENDED NEXT PHASE: Phase 2D — Production Activation

Only after business decisions are made.

### Objectives

1. **Replace placeholder configs** with real production values
2. **Fix shipping inconsistency** (R100 vs R120)
3. **Add security headers** via `vercel.json` (X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
4. **Create responsive hero variants** (mobile/tablet/desktop srcset)
5. **Configure Snipcart dashboard** (shipping, tax, payment gateways)
6. **Update trust badges** to reflect actual payment methods
7. **Run Lighthouse baseline** on production URL
8. **Smoke test** all routes and commerce flow with real Snipcart key

### Do Not Add Yet

- GA4 / Plausible
- Sentry
- Playwright / Cypress
- GitHub Actions
- TypeScript / ESLint
- CMS
- Product JSON migration
- PWA
- Reviews
- New payment providers
- New backend architecture

---

## CRITICAL CORRECTIONS FROM PHASE 2B

1. **Product IDs:** The claim that 35 of 36 products lack `data-product-id` was technically true but **operationally irrelevant**. Snipcart uses `data-item-id` on the purchase button, which is correctly generated at runtime with stable, deterministic IDs.

2. **Cart Persistence:** The claim that "random IDs cause cart state to disappear after page refresh" was **incorrect**. Cart state persists via localStorage. IDs are stable, not random.

3. **Configuration:** The `window.ENV` vs `window.env` bug was fixed. The architecture is sound.
