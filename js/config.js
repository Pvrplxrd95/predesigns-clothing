/**
 * Configuration Module for Predesigns Clothing
 *
 * This module manages both application constants and environment-based configuration.
 * Priority order for config values:
 *   1. window.__PUBLIC_CONFIG__ (committed public config - js/config.public.js)
 *   2. window.__ENV__ (local override - js/env.js, gitignored)
 *   3. Safe defaults
 *
 * IMPORTANT: Never expose sensitive API keys in production code or version control.
 * Only browser-public configuration belongs in __PUBLIC_CONFIG__.
 * Private secrets must NEVER reach the client.
 */

// ============================================
// ENVIRONMENT VARIABLE LOADER
// ============================================

class EnvironmentConfig {
    constructor() {
        // Initialize with safe defaults, reading from public config first
        const publicConfig = (typeof window !== 'undefined' && window.__PUBLIC_CONFIG__) || {};
        const localEnv = (typeof window !== 'undefined' && window.__ENV__) || {};

        this.snipcart = {
            apiKey: this.getConfig('SNIPCART_API_KEY', publicConfig, localEnv, 'pk_test_YOUR_TEST_KEY_HERE'),
            environment: this.getConfig('SNIPCART_ENVIRONMENT', publicConfig, localEnv, 'test'),
            isConfigured: !this.getConfig('SNIPCART_API_KEY', publicConfig, localEnv, '').startsWith('pk_test_') &&
                this.getConfig('SNIPCART_API_KEY', publicConfig, localEnv, '') !== ''
        };

        this.yoco = {
            publicKey: this.getConfig('YOCO_PUBLIC_KEY', publicConfig, localEnv, ''),
            environment: this.getConfig('YOCO_ENVIRONMENT', publicConfig, localEnv, 'test'),
            isConfigured: !!this.getConfig('YOCO_PUBLIC_KEY', publicConfig, localEnv, '')
        };

        this.giscus = {
            repo: this.getConfig('GISCUS_REPO', publicConfig, localEnv, ''),
            repoId: this.getConfig('GISCUS_REPO_ID', publicConfig, localEnv, ''),
            categoryId: this.getConfig('GISCUS_CATEGORY_ID', publicConfig, localEnv, ''),
            isConfigured: !!this.getConfig('GISCUS_REPO', publicConfig, localEnv, '')
        };

        this.firebase = {
            apiKey: this.getConfig('FIREBASE_API_KEY', publicConfig, localEnv, ''),
            authDomain: this.getConfig('FIREBASE_AUTH_DOMAIN', publicConfig, localEnv, ''),
            projectId: this.getConfig('FIREBASE_PROJECT_ID', publicConfig, localEnv, ''),
            storageBucket: this.getConfig('FIREBASE_STORAGE_BUCKET', publicConfig, localEnv, ''),
            messagingSenderId: this.getConfig('FIREBASE_MESSAGING_SENDER_ID', publicConfig, localEnv, ''),
            appId: this.getConfig('FIREBASE_APP_ID', publicConfig, localEnv, ''),
            measurementId: this.getConfig('FIREBASE_MEASUREMENT_ID', publicConfig, localEnv, ''),
            googleClientId: this.getConfig('GOOGLE_CLIENT_ID', publicConfig, localEnv, ''),
            isConfigured: !!this.getConfig('FIREBASE_API_KEY', publicConfig, localEnv, '')
        };

        this.app = {
            environment: this.getConfig('NODE_ENV', publicConfig, localEnv, 'development'),
            url: this.getConfig('APP_URL', publicConfig, localEnv, window.location.origin),
            debugMode: this.getConfig('DEBUG_MODE', publicConfig, localEnv, 'false') === 'true'
        };

        this.validateConfig();
    }

    /**
     * Get config value with priority: publicConfig > localEnv > defaultValue
     */
    getConfig(key, publicConfig, localEnv, defaultValue = '') {
        // 1. Committed public config (highest priority for production)
        if (publicConfig && publicConfig[key] !== undefined && publicConfig[key] !== '') {
            return publicConfig[key];
        }

        // 2. Local override (for development)
        if (localEnv && localEnv[key] !== undefined && localEnv[key] !== '') {
            return localEnv[key];
        }

        // 3. Default
        return defaultValue;
    }

    /**
     * Validate configuration and log warnings
     */
    validateConfig() {
        const isProduction = this.app.environment === 'production';

        if (isProduction && !this.snipcart.isConfigured) {
            console.warn(
                '%c⚠️ WARNING: Snipcart API key is not configured!',
                'color: orange; font-weight: bold;'
            );
        }

        if (this.app.debugMode) {
            console.log('%c📋 App Configuration Loaded', 'color: blue; font-weight: bold;');
        }
    }

    /**
     * Manually set an API key (useful for testing/development)
     */
    setApiKey(service, key) {
        if (service === 'snipcart') {
            this.snipcart.apiKey = key;
            this.snipcart.isConfigured = true;
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('ENV_SNIPCART_API_KEY', key);
            }
        }
        this.validateConfig();
    }

    /**
     * Get nested config value by dot notation (e.g., 'snipcart.apiKey')
     */
    get(path) {
        const parts = path.split('.');
        let value = this;

        for (const part of parts) {
            value = value[part];
            if (value === undefined) return undefined;
        }

        return value;
    }
}

// Create singleton instance
const ENV = new EnvironmentConfig();

// Make globally available for console debugging
if (typeof window !== 'undefined') {
    window.ENV = ENV;
}

// ============================================
// API ENDPOINTS (Legacy - for backward compatibility)
// ============================================

const API_ENDPOINTS = {
    // Authentication endpoints
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        LOGOUT: '/api/auth/logout',
        REFRESH: '/api/auth/refresh',
        GOOGLE_SIGNIN: '/api/auth/google-signin'
    },

    // User endpoints
    USER: {
        PROFILE: '/api/user/profile',
        UPDATE_PROFILE: '/api/user/update',
        CHANGE_PASSWORD: '/api/user/change-password',
        DELETE_ACCOUNT: '/api/user/delete'
    },

    // Product endpoints
    PRODUCT: {
        BASE: '/api/products',
        CATEGORIES: '/api/products/categories',
        SEARCH: '/api/products/search',
        FILTER: '/api/products/filter',
        RELATED: '/api/products/related'
    },

    // Cart endpoints
    CART: {
        GET: '/api/cart',
        ADD: '/api/cart/add',
        UPDATE: '/api/cart/update',
        REMOVE: '/api/cart/remove',
        CLEAR: '/api/cart/clear'
    },

    // Order endpoints
    ORDER: {
        CREATE: '/api/orders/create',
        LIST: '/api/orders',
        DETAIL: '/api/orders',
        CANCEL: '/api/orders/cancel',
        STATUS: '/api/orders/status'
    },

    // Payment endpoints
    PAYMENT: {
        PROCESS: '/api/payments/process',
        METHODS: '/api/payments/methods',
        VALIDATE: '/api/payments/validate'
    },

    // Newsletter endpoints
    NEWSLETTER: {
        SUBSCRIBE: '/api/newsletter/subscribe',
        UNSUBSCRIBE: '/api/newsletter/unsubscribe'
    },

    // Contact endpoints
    CONTACT: {
        INQUIRY: '/api/contact/inquiry',
        CUSTOM_ORDER: '/api/contact/custom-order',
        CONSULTATION: '/api/contact/consultation'
    },

    // Review endpoints
    REVIEW: {
        LIST: '/api/reviews',
        CREATE: '/api/reviews/create',
        VERIFY: '/api/reviews/verify'
    },

    // Blog endpoints
    BLOG: {
        POSTS: '/api/blog/posts',
        CATEGORIES: '/api/blog/categories',
        SEARCH: '/api/blog/search',
        COMMENTS: '/api/blog/comments'
    }
};

// Application constants
const CONFIG = {
    // Site information
    SITE: {
        NAME: 'Predesigns Clothing',
        SHORT_NAME: 'Predesigns',
        ESTABLISHED: 2019,
        LOCATION: 'Hammanskraal, Pretoria, South Africa',
        CURRENCY: 'ZAR',
        CURRENCY_SYMBOL: 'R',
        SUPPORT_EMAIL: 'purpleray23@gmail.com',
        WHATSAPP_NUMBER: '+27694313721'
    },

    // Business hours (South Africa Standard Time)
    BUSINESS_HOURS: {
        WEEKDAYS: '09:00 - 17:00',
        SATURDAY: '09:00 - 13:00',
        SUNDAY: 'Closed',
        HOLIDAYS: 'Closed'
    },

    // Contact information
    CONTACT: {
        EMAIL: 'purpleray23@gmail.com',
        WHATSAPP: '+27694313721',
        FACEBOOK: 'https://facebook.com/predesignsclothing',
        INSTAGRAM: 'https://instagram.com/predesignsclothing'
    },

    // Cart Configuration
    CART_VERSION: '1.0',
    CART_KEY: 'predesigns-cart',
    MAX_QUANTITY: 10,
    MAX_CART_ITEMS: 50,

    // Cart configuration
    CART: {
        MAX_ITEMS: 50,
        SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
        TAX_RATE: 0.15, // 15% VAT
        FREE_SHIPPING_THRESHOLD: 1000,
        SHIPPING_COST: 100
    },

    // Delivery Configuration
    DELIVERY_FEES: {
        local: 60,      // R60 for Hammanskraal area
        nationwide: 100, // R100 for South Africa
        global: 260      // R260 for international
    },

    // Currency Configuration
    CURRENCY_CONFIG: {
        ZAR: { code: 'zar', symbol: 'R', name: 'South African Rand' },
        USD: { code: 'usd', symbol: '$', name: 'US Dollar', rate: 18.5 }
    },

    // Form Validation Configuration
    VALIDATION_CONFIG: {
        MAX_NAME_LENGTH: 100,
        MAX_MESSAGE_LENGTH: 1000,
        EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        PHONE_REGEX: /^(\+27|0)[6-8][0-9]{7,8}$/
    },

    // Form validation rules
    VALIDATION: {
        NAME: {
            MIN_LENGTH: 2,
            MAX_LENGTH: 50,
            PATTERN: /^[a-zA-Z\s]+$/
        },
        EMAIL: {
            PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        PHONE: {
            PATTERN: /^(\+27|0)[6-8][0-9]{7,8}$/
        },
        PASSWORD: {
            MIN_LENGTH: 6,
            MAX_LENGTH: 128
        },
        MESSAGE: {
            MIN_LENGTH: 10,
            MAX_LENGTH: 1000
        }
    },

    // Authentication configuration
    AUTH: {
        SESSION_TIMEOUT: 60 * 60 * 1000, // 1 hour
        MAX_LOGIN_ATTEMPTS: 5,
        LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
        TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 days
        RESET_TOKEN_EXPIRY: 1 * 60 * 60 * 1000 // 1 hour
    },

    // File upload configuration
    UPLOAD: {
        MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
        ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        MAX_FILES: 5
    },

    // Animation and timing
    ANIMATION: {
        TRANSITION_DURATION: 300,
        FADE_DURATION: 500,
        SLIDE_DURATION: 300,
        SCROLL_DURATION: 1000
    },

    // Breakpoints for responsive design
    BREAKPOINTS: {
        MOBILE: 767,
        TABLET: 1024,
        DESKTOP: 1200,
        LARGE_DESKTOP: 1400
    },

    // Cookie configuration
    COOKIES: {
        CONSENT_DURATION: 365,
        ANALYTICS_DURATION: 365,
        MARKETING_DURATION: 365,
        ESSENTIAL_DURATION: 365
    }
};

// Export for global use
window.CONFIG = CONFIG;
window.API_ENDPOINTS = API_ENDPOINTS;

console.log('Configuration loaded successfully');
