# Snipcart & Payment Configuration (Static Site)

Since Predesigns Clothing is now a static site hosted on Vercel, most e-commerce settings must be configured in the **Snipcart Dashboard** rather than code.

## 1. Domain Validation
In the Snipcart Dashboard > **Domains & URLs**:
- Add `predesigns.onl` and `www.predesigns.onl`.
- Ensure strict domain protocol validation is set to strict match for security.

## 2. Currency Settings (ZAR)
In the Snipcart Dashboard > **Regional Settings**:
- Set default currency: **South African Rand (ZAR)**
- Set symbol: `R`
- Set precision: `2`

## 3. Payment Methods (Client-Side Limitation)
Since we have removed the PHP backend, Snipcart handles payments directly.
In Snipcart Dashboard > **Payment Gateway**:
- **Status**: Enabled
- **Supported Methods**:
  - **Credit Card** (via Stripe, PayFast, etc.) - Requires backend config if custom.
  - **PayFast (Recommended for SA)**: Native integration supported. Just add Merchant ID/Key in Snipcart dashboard.
  - **Yoco**: DOES NOT have native integration. Requires a custom payment gateway serverless function. 
    - **Currently Disabled** unless you deploy a custom API.
    - Recommendation: Use PayFast for now.

## 4. Shipping & Taxes
- **Taxes**: Set up VAT (15%) for South Africa in Dashboard > Taxes.
- **Shipping**: Set up Flat Rate or Weight-based shipping in Dashboard > Shipping.

## 5. Deployment Checklist
1. Verify `js/config.js` has the correct `SNIPCART_API_KEY` (use `pk_live_...` for production).
2. Ensure `shop.html` product URLs match the live URLs so Snipcart crawler can validate prices.
3. Test a full checkout flow with a test card (using `pk_test_...` key).
