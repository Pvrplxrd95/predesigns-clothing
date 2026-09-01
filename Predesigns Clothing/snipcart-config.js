/**
 * Snipcart Configuration for Predesigns Clothing
 * 
 * API Key is loaded from environment variables (via js/config.js)
 * 
 * NOTE: Shipping, Taxes, and Payment Gateways must be configured in the Snipcart Dashboard.
 * This file handles client-side initialization and UI customization.
 */

function initializeSnipcartConfig() {
    if (typeof ENV === 'undefined') {
        console.error('❌ ENV configuration not loaded.');
        return;
    }

    if (!ENV.snipcart.apiKey || ENV.snipcart.apiKey.includes('your_api_key')) {
        console.warn('⚠️ Snipcart API key not allowed. Check .env file.');
        return;
    }

    window.SnipcartSettings = {
        publicApiKey: ENV.snipcart.apiKey,
        loadStrategy: 'on-user-interaction',
        currency: 'zar', // Set default currency to ZAR
        modalStyle: 'side', // Use side modal for cart
        templates: {
            // Customize price display if needed, though Snipcart handles locale well
        }
    };

    // Initialize custom events/behavior
    document.addEventListener('snipcart.ready', function () {
        console.log('✅ Snipcart is ready');

        // Subscribe to cart changes to update custom counters if any
        Snipcart.store.subscribe(() => {
            const state = Snipcart.store.getState();
            updateGlobalCartCount(state.cart.items.count);
        });
    });
}

function updateGlobalCartCount(count) {
    const badges = document.querySelectorAll('.snipcart-items-count, .cart-count');
    badges.forEach(badge => {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';

        // Add minimal animation
        badge.classList.add('bump');
        setTimeout(() => badge.classList.remove('bump'), 300);
    });
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSnipcartConfig);
} else {
    initializeSnipcartConfig();
}
