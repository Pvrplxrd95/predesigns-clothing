# Predesigns Clothing — Official Store 2026
![Predesigns Clothing Banner](images/logo.jpg)

## 🏢 Brand Overview
**Predesigns Clothing** is a premium luxury streetwear and custom tailoring brand based in **Hammanskraal, Pretoria**. Founded in 2019 by **Josias Tlou**, the brand specializes in artisanal craftsmanship, merging traditional South African heritage with high-end modern streetwear.

**Domain:** [https://predesigns.onl](https://predesigns.onl)  
**Location:** Hammanskraal, North of Pretoria, SA

---

## 🛠️ Tech Architecture (2026 Modernization)
The website has been refactored from a legacy PHP/jQuery structure into a high-performance, modular **Vanilla JavaScript + Cloud Infrastructure** system.

### 🧩 Core "Manager" System
We use a centralized manager pattern to ensure UI and functional consistency across all pages:
*   **`AuthManager` (js/auth.js)**: Handles global authentication, login/signup modals, and Firebase Auth state syncing.
*   **`UIManager` (js/ui-manager.js)**: Manages nav-menus, mobile toggles, toast notifications, and general UI interactions.
*   **`ProductManager` (js/product-manager.js)**: Powers the shop filtering, quick-view modals, wishlist persistence, and "Add to Cart" logic.
*   **`FormManager` (js/form-manager.js)**: Centralizes all form submissions (Contact, Custom Order, Newsletter) with Formspree integration and UI feedback.

### 🧵 Custom Lead Generation
We have implemented a high-conversion custom order system:
*   **Trigger**: Any "Custom Order" button triggers `openCustomOrderForm()`.
*   **Form Details**: Collects Name, Email, Phone, Garment Category, and a detailed description.
*   **Submission**: Data is sent to **Formspree (mqagpypo)**, allowing you to manage leads directly from your inbox.
*   **Confirmation**: Professional success/error messaging integrated with `AuthManager` for a premium user feel.
*   **`AppInit` (js/app-init.js)**: The orchestrator that initializes all managers and provides global access to system functions.

### 🌩️ Cloud & Third-Party Integrations
*   **Firebase**: Powers User Authentication (Email/Password & Google Sign-In) and Firestore database (optional).
*   **Snipcart**: Enterprise-grade E-Commerce engine handling the cart, checkout, and inventory tracking (ZAR Currency).
*   **Formspree**: High-reliability lead generation for custom orders and contact requests.
*   **Google Identity Services**: Integrated one-click Google Login.

---

## 🏗️ Technical Stack
*   **Frontend**: HTML5, Vanilla CSS3 (Flexible Design System), JavaScript (ES6+ Modules).
*   **Design**: 2026 Luxury Aesthetic (Montserrat & Playfair Display typography, responsive glassmorphism, dynamic transitions).
*   **State Management**: LocalStorage for Wishlist and Cart count persistence.
*   **Performance**: Lazy-loading 2.0, asynchronous script loading, and pre-connected CDN domains.

---

## 📂 File Structure
```text
Predesigns Clothing/
├── js/
│   ├── app-init.js         # System Orchestrator
│   ├── auth.js             # Firebase Auth Logic
│   ├── ui-manager.js       # Global UI Behaviors
│   ├── product-manager.js  # Shop & Catalog Logic
│   ├── form-manager.js     # Form Handling & Modals
│   ├── env.js              # ENVIRONMENT KEYS (Do not commit)
│   └── config.js           # Shared Configuration
├── css/
│   ├── style.css           # Global Design Tokens
│   ├── responsive.css      # Mobile/Tablet Optimization
│   └── blog-post.css       # Article-specific Styling
├── images/                 # Optimized Asset Library
├── index.html              # Home Page
├── shop.html               # Luxury Catalog
├── blog.html               # Community & News
├── lookbook.html           # Style Gallery
└── checkout.html           # Custom Checkout Entry
```

---

## 🚀 Deployment & Environment Setup
The site uses a zero-build environment system.

### 1. Configure Keys
Create or update `js/env.js`:
```javascript
window.__ENV__ = {
    SNIPCART_API_KEY: 'PASTE_YOUR_KEY_HERE',
    SNIPCART_ENVIRONMENT: 'live', 
    FIREBASE_API_KEY: '...', // See Firebase Console
    APP_URL: 'https://predesigns.onl'
};
```

### 2. Local Development
We recommend using **VS Code Live Server** or a simple local server:
```bash
# Example if using python
python -m http.server 5500
```

---

## 📞 Support and Contact
*   **Owner:** Josias Tlou
*   **WhatsApp:** +27 69 431 3721
*   **Email:** purpleray23@gmail.com
*   **Instagram:** [@predesignsclothing](https://instagram.com/predesignsclothing)

---
*Est. 2019 — Quality tailor-made clothing from scratch with local love and taste.*
