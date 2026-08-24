# Payment System Setup Guide

## Overview

The Predesigns Clothing website now has a complete environment-based configuration system for payment processing. This guide explains how to set up and configure payment methods for your store.

## Quick Start

### 1. Copy Environment Template

```bash
cp .env.example .env
```

### 2. Add Your Snipcart API Key

Edit `.env` and add your Snipcart API key:

```
SNIPCART_API_KEY=pk_test_YOUR_TEST_KEY_HERE
SNIPCART_ENVIRONMENT=test
```

Get your key from: <https://dashboard.snipcart.com>

### 3. Include Configuration Files in HTML

Make sure your HTML files include these scripts in this order:

```html
<!-- Must be first - loads environment config -->
<script src="js/config.js"></script>

<!-- Snipcart configuration - uses ENV from config.js -->
<script src="snipcart-config.js"></script>

<!-- Snipcart library - configured by snipcart-config.js -->
<script async src="https://cdn.snipcart.com/themes/v3.3.0/default/snipcart.js"></script>

<!-- Snipcart integration - converts product cards -->
<script src="js/snipcart-integration.js"></script>

<!-- Payment system - handles checkout -->
<script src="js/payment.js"></script>
```

## Configuration Variables

### Snipcart Configuration

```env
# API Key for Snipcart (required for cart functionality)
# Get from: https://dashboard.snipcart.com
# Use pk_test_... for testing, pk_live_... for production
SNIPCART_API_KEY=pk_test_YOUR_KEY_HERE

# Environment mode
# Options: 'test' or 'live'
SNIPCART_ENVIRONMENT=test
```

### Yoco Integration (Optional)

```env
# Yoco payment gateway (South African payment processor)
# Get from: https://www.yoco.com
YOCO_PUBLIC_KEY=pk_test_YOUR_YOCO_KEY_HERE
YOCO_ENVIRONMENT=test
```

### Email Notifications

```env
# Mailerlite for email marketing and order notifications
MAILERLITE_API_KEY=YOUR_MAILERLITE_API_KEY_HERE
MAILERLITE_GROUP_ID=YOUR_MAILERLITE_GROUP_ID_HERE
```

### Application Settings

```env
# Development, testing, or production
NODE_ENV=development

# Your website URL
APP_URL=http://localhost:3000

# Enable debug logging in console
DEBUG_MODE=false
```

## How It Works

### Configuration Loading (`js/config.js`)

The `ENV` configuration object is automatically created when `config.js` loads:

```javascript
// Access configuration in your code
console.log(ENV.snipcart.apiKey);        // Get API key
console.log(ENV.snipcart.isConfigured);  // Check if configured
console.log(ENV.app.environment);        // Get environment
```

### Setting API Keys Dynamically

For development/testing, you can set API keys in the browser console:

```javascript
// In browser console
ENV.setApiKey('snipcart', 'pk_test_YOUR_KEY_HERE');
```

This stores the key in localStorage and persists it.

## Payment Flows

### 1. Snipcart Flow (Recommended)

```
User clicks "Add to Cart"
    ↓
Snipcart library loads (if not already)
    ↓
User adds items to cart
    ↓
User clicks "Checkout"
    ↓
Snipcart handles payment processing
    ↓
Order confirmation sent
```

**Configuration required:**

- `SNIPCART_API_KEY` must be set

**Supports:**

- Credit/Debit cards
- PayFast (South African)
- Local pickup and delivery options

### 2. Custom Checkout + Bank Transfer

```
User clicks "Proceed to Payment"
    ↓
Checkout page loads
    ↓
User enters delivery information
    ↓
User sees bank transfer details
    ↓
User transfers payment
    ↓
User submits proof of payment
```

**Configuration required:**

- None (uses fallback)

**Payment method:**

- Manual bank transfer to Tyme Bank
- Email confirmation: <purpleray23@gmail.com>

### 3. Yoco Integration (Future)

```
User selects "Pay with Card"
    ↓
Yoco payment form opens
    ↓
User enters card details
    ↓
Yoco processes payment
    ↓
Order confirmed
    ↓
Order sent to customer
```

**Configuration required:**

- `YOCO_PUBLIC_KEY` must be set
- Backend endpoint for token processing

## Troubleshooting

### Snipcart not working?

**Check 1:** API key is configured

```javascript
// In browser console
console.log(ENV.snipcart);
// Should show: {apiKey: "pk_test_...", environment: "test", isConfigured: true}
```

**Check 2:** Script order is correct

```html
<!-- config.js must come BEFORE snipcart-config.js -->
<script src="js/config.js"></script>
<script src="snipcart-config.js"></script>
```

**Check 3:** Check browser console for errors

```
Right click → Inspect → Console tab
Look for red error messages
```

### Can't access environment variables?

Make sure:

1. `.env` file exists in your project root
2. You're using a build tool that loads `.env` files (Vite, Webpack, etc.)
3. Or manually set in localStorage:

   ```javascript
   localStorage.setItem('ENV_SNIPCART_API_KEY', 'pk_test_...');
   ```

### Payment failing in production?

Common issues:

1. Using test API key (`pk_test_...`) in production
2. `NODE_ENV` not set to `'production'`
3. Payment provider account not in live mode

**Solution:**

```env
# Production settings
NODE_ENV=production
SNIPCART_API_KEY=pk_live_YOUR_LIVE_KEY_HERE
SNIPCART_ENVIRONMENT=live
```

## Security Best Practices

### ✅ DO

- Keep API keys in `.env` file
- Add `.env` to `.gitignore`
- Use environment variables for all secrets
- Never commit `.env` to version control
- Use live API keys only in production

### ❌ DON'T

- Hardcode API keys in JavaScript
- Commit `.env` to git
- Expose API keys in client-side code
- Mix test and live keys
- Share API keys in emails or chats

## File Structure

```
Predesigns Clothing/
├── .env                    # Environment variables (DO NOT COMMIT)
├── .env.example           # Template for .env
├── .gitignore             # Includes .env
├── js/
│   ├── config.js          # Environment configuration loader
│   ├── payment.js         # Payment processing logic
│   ├── snipcart-integration.js  # Product card conversion
│   └── ...
├── snipcart-config.js     # Snipcart settings (uses ENV)
├── checkout.html          # Checkout page
└── ...
```

## Next Steps

1. **Create `.env` file:**

   ```bash
   cp .env.example .env
   ```

2. **Add your Snipcart API key:**
   - Visit <https://dashboard.snipcart.com>
   - Get your API key
   - Add to `.env` file

3. **Test in development:**

   ```env
   SNIPCART_API_KEY=pk_test_YOUR_TEST_KEY
   SNIPCART_ENVIRONMENT=test
   NODE_ENV=development
   ```

4. **Deploy to production:**
   - Update API keys in hosting environment
   - Set `SNIPCART_ENVIRONMENT=live` (if using live key)
   - Set `NODE_ENV=production`

5. **Monitor payments:**
   - Check Snipcart dashboard for orders
   - Monitor email for payment confirmations
   - Track customer feedback

## Support

For issues or questions:

- Snipcart Support: <https://support.snipcart.com>
- Yoco Support: <https://www.yoco.com/support>
- Contact: <purpleray23@gmail.com>

## Migration Notes

The payment system has been refactored from hardcoded API keys to environment-based configuration. All old references have been updated:

**Before:**

```javascript
publicApiKey: 'YOUR_SNIPCART_API_KEY',  // Hardcoded
```

**After:**

```javascript
publicApiKey: ENV.snipcart.apiKey,      // From environment
```

This ensures:

- API keys are never committed to git
- Easy configuration per environment (dev/staging/production)
- Secure management of credentials
- No code changes needed when deploying
