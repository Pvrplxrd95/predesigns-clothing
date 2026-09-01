/**
 * Application Initialization Module
 * 
 * Centralized initialization system that coordinates all DOMContentLoaded
 * listeners and specialized managers (UI, Product, Form).
 */

class ApplicationInitializer {
    constructor() {
        this.isInitialized = false;
        this.config = this.getDefaultConfig();
    }

    /**
     * Main initialization entry point
     */
    async initializeApp() {
        if (this.isInitialized) return;

        console.log('🚀 Initializing Predesigns Clothing Application...');

        try {
            // 1. Initialize core UI components
            this.initCoreUI();

            // 2. Initialize page-specific modules
            const page = this.getCurrentPage();
            await this.initializePage(page);

            this.isInitialized = true;
            console.log('✅ Application initialization complete');
        } catch (error) {
            console.error('❌ Application initialization failed:', error);
        }
    }

    /**
     * Initialize UI behaviors shared across all pages
     */
    initCoreUI() {
        if (window.uiManager) {
            window.uiManager.initPreloader();
            window.uiManager.initNavigation();
            window.uiManager.initMobileMenu();
        }

        if (window.formManager) {
            window.formManager.initValidation();
        }
    }

    /**
     * Route and initialize page-specific logic
     */
    async initializePage(page) {
        console.log(`📄 Initializing ${page} page...`);

        switch (page) {
            case 'shop':
                this.initializeShopPage();
                break;
            case 'index':
                this.initializeIndexPage();
                break;
            default:
                // Generic page initialization
                if (window.productManager) {
                    window.productManager.prepareSnipcartButtons();
                }
                break;
        }
    }

    /**
     * Shop page specific initialization
     */
    initializeShopPage() {
        if (window.productManager) {
            window.productManager.prepareSnipcartButtons();
            window.productManager.initProductFiltering();
            window.productManager.initQuickViewModals();
            window.productManager.initImageGalleries();
            window.productManager.initWishlist();
        }
    }

    /**
     * Homepage specific initialization
     */
    initializeIndexPage() {
        if (window.productManager) {
            window.productManager.prepareSnipcartButtons();
            window.productManager.initImageGalleries();
            window.productManager.initWishlist();
        }
    }

    /**
     * Get current page type from URL
     */
    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop().split('.')[0];

        if (filename === 'index' || filename === '') return 'index';
        if (filename === 'shop') return 'shop';
        if (filename === 'checkout') return 'checkout';
        if (filename === 'blog' || filename === 'blog-post') return 'blog';

        return 'generic';
    }

    getDefaultConfig() {
        return {
            MAX_QUANTITY: 10,
            STORAGE_KEYS: {
                CART: 'predesigns_cart',
                USER: 'predesigns_user'
            }
        };
    }
}

// Create global application initializer instance
window.appInitializer = new ApplicationInitializer();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.appInitializer.initializeApp());
} else {
    window.appInitializer.initializeApp();
}
