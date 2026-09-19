/**
 * Public Client Configuration for Predesigns Clothing
 *
 * This file contains ONLY configuration values that are explicitly designed
 * by their providers to be exposed in the browser (public API keys, identifiers).
 *
 * NEVER add private/secrets here. This file is committed to git.
 * For local development overrides, create js/env.js (gitignored) which takes precedence.
 */

// Feature flags - control optional integrations
window.__FEATURE_FLAGS__ = {
    // Card payments via Snipcart (requires live key + payment processor config)
    ENABLE_CARD_PAYMENTS: false,
    // Firebase Authentication + Google Sign-In
    ENABLE_AUTH: false,
    // Giscus comments on blog
    ENABLE_COMMENTS: false,
    // Yoco payment gateway
    ENABLE_YOCO: false
};

// Public configuration - safe to expose in browser
window.__PUBLIC_CONFIG__ = {
    // Snipcart E-Commerce (public API key per Snipcart docs)
    SNIPCART_API_KEY: 'pk_test_YOUR_TEST_KEY_HERE',
    SNIPCART_ENVIRONMENT: 'test',

    // Yoco Payment Gateway (public key per Yoco docs)
    YOCO_PUBLIC_KEY: 'pk_test_YOUR_YOCO_KEY_HERE',
    YOCO_ENVIRONMENT: 'test',

    // Giscus Comments (public GitHub identifiers)
    GISCUS_REPO: 'Pvrplxrd95/PredesignsClothingWebsite',
    GISCUS_REPO_ID: 'R_kgDOJ4Q6Lw',
    GISCUS_CATEGORY_ID: 'DIC_kwDOJ4Q6L84CTEa5',

    // Firebase Web Configuration (public per Firebase docs)
    FIREBASE_API_KEY: 'your_firebase_api_key_here',
    FIREBASE_AUTH_DOMAIN: 'your_project_id.firebaseapp.com',
    FIREBASE_PROJECT_ID: 'your_project_id',
    FIREBASE_STORAGE_BUCKET: 'your_project_id.appspot.com',
    FIREBASE_MESSAGING_SENDER_ID: 'your_messaging_sender_id',
    FIREBASE_APP_ID: 'your_app_id',
    FIREBASE_MEASUREMENT_ID: 'your_measurement_id',

    // Google OAuth (public Client ID)
    GOOGLE_CLIENT_ID: 'your_google_client_id_here',

    // Application Environment
    NODE_ENV: 'development',
    APP_URL: window.location.origin,
    DEBUG_MODE: false
};

// Export for immediate use
console.log('Public configuration loaded');
console.log('Feature flags:', window.__FEATURE_FLAGS__);