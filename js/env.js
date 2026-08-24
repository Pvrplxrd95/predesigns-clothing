/**
 * Environment Variables for Local Development
 * 
 * This file injects environment variables into the window object
 * so that js/config.js can read them without a build step.
 * 
 * INSTRUCTIONS:
 * 1. Replace the placeholder values with your actual API keys.
 * 2. Do NOT commit this file to version control if it contains real secrets.
 *    (It should be added to .gitignore)
 */

window.__ENV__ = {
    // SNIPCART CONFIGURATION
    // Get your API key from: https://app.snipcart.com/dashboard/account/credentials
    SNIPCART_API_KEY: 'YOUR_SNIPCART_PUBLIC_API_KEY',
    SNIPCART_ENVIRONMENT: 'test', // 'test' or 'live'

    // FIREBASE CONFIGURATION
    FIREBASE_API_KEY: 'AIzaSyBFptzsMqbRym49Ck6YJRFuh1Ckeb9HNeE',
    FIREBASE_AUTH_DOMAIN: 'predesignsclothing.firebaseapp.com',
    FIREBASE_PROJECT_ID: 'predesignsclothing',
    FIREBASE_STORAGE_BUCKET: 'predesignsclothing.firebasestorage.app',
    FIREBASE_MESSAGING_SENDER_ID: '613234971334',
    FIREBASE_APP_ID: '1:613234971334:web:4dc67c7b6e4d6192297dc7',
    FIREBASE_MEASUREMENT_ID: 'G-5CP0YD1L0R',
    GOOGLE_CLIENT_ID: '613234971334-imecqtpfjkev0rn4udca6jop3jn1teqf.apps.googleusercontent.com',

    // APPLICATION SETTINGS
    NODE_ENV: 'development',
    DEBUG_MODE: 'true',
    APP_URL: 'http://localhost:5500' // Update if running on a different port
};

console.log('✅ Environment variables loaded from js/env.js');
