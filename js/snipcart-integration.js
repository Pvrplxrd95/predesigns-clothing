/**
 * Snipcart Integration for Predesigns Clothing
 * 
 * This module handles conversion of product cards to Snipcart-compatible format
 * and manages the shopping cart functionality.
 * 
 * Dependencies:
 * - snipcart-config.js (must be loaded before this file)
 * - https://cdn.snipcart.com (external library)
 */

// Check if Snipcart is properly configured
function checkSnipcartConfiguration() {
    if (typeof ENV === 'undefined') {
        console.error('❌ ENV configuration not available');
        return false;
    }

    if (!ENV.snipcart.apiKey || ENV.snipcart.apiKey === 'pk_test_') {
        console.warn('⚠️ Snipcart API key not configured. Cart functionality will not work.');
        console.warn('Please add SNIPCART_API_KEY to your .env file');
        return false;
    }

    return true;
}

document.addEventListener('DOMContentLoaded', function() {
    // Verify Snipcart is configured before initializing
    if (!checkSnipcartConfiguration()) {
        console.warn('Snipcart integration skipped due to missing configuration');
        return;
    }

    // Convert all product cards to use Snipcart
    convertProductCards();
    
    // Update cart count in the header
    updateCartCount();
    
    // Listen for Snipcart events
    document.addEventListener('snipcart.ready', function() {
        console.log('Snipcart ready');
        updateCartCount();
    });
    
    document.addEventListener('snipcart.cart.open', function() {
        console.log('Cart opened');
    });
    
    document.addEventListener('snipcart.cart.adding', function() {
        console.log('Adding item to cart');
    });
    
    document.addEventListener('snipcart.cart.added', function() {
        console.log('Item added to cart');
        updateCartCount();
        if (typeof showMessage === 'function') {
            showMessage('Item added to cart!', 'success');
        }
    });
});

function convertProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        // Get product data from card attributes
        const productId = card.getAttribute('data-product-id') || generateProductId(card);
        const productName = card.querySelector('.product-title')?.textContent.trim() || 'Product';
        const productPrice = parseFloat(card.getAttribute('data-price') || '0').toFixed(2);
        const productImage = card.querySelector('.main-image')?.getAttribute('data-src') || '';
        const productCategory = card.getAttribute('data-category') || 'uncategorized';
        const productMaterial = card.getAttribute('data-material') || '';
        const productCare = card.getAttribute('data-care') || '';
        const productFit = card.getAttribute('data-fit') || '';
        const productOrigin = card.getAttribute('data-origin') || '';
        
        // Find all add to cart buttons in the card
        const addToCartButtons = card.querySelectorAll('.add-to-cart');
        
        // Convert each add to cart button
        addToCartButtons.forEach(button => {
            // Preserve existing classes and attributes
            const buttonClasses = button.className;
            const buttonHtml = button.innerHTML;
            
            // Create new button with Snipcart attributes
            const newButton = document.createElement('button');
            newButton.className = buttonClasses + ' snipcart-add-item';
            
            // Set Snipcart data attributes
            newButton.setAttribute('data-item-id', productId);
            newButton.setAttribute('data-item-name', productName);
            newButton.setAttribute('data-item-price', productPrice);
            newButton.setAttribute('data-item-url', window.location.href);
            
            if (productImage) {
                newButton.setAttribute('data-item-image', productImage);
            }
            
            // Add additional product details as custom fields
            newButton.setAttribute('data-item-categories', productCategory);
            
            // Build description from available details
            let description = [];
            if (productMaterial) description.push(`Material: ${productMaterial}`);
            if (productCare) description.push(`Care: ${productCare}`);
            if (productFit) description.push(`Fit: ${productFit}`);
            if (productOrigin) description.push(`Origin: ${productOrigin}`);
            
            if (description.length > 0) {
                newButton.setAttribute('data-item-description', description.join(' | '));
            }
            
            // Copy over any existing data attributes
            Array.from(button.attributes).forEach(attr => {
                if (attr.name.startsWith('data-') && !attr.name.startsWith('data-item-')) {
                    newButton.setAttribute(attr.name, attr.value);
                }
            });
            
            // Preserve button content
            newButton.innerHTML = buttonHtml;
            
            // Replace the old button with the new one
            button.parentNode.replaceChild(newButton, button);
        });
    });
}

function generateProductId(card) {
    // Generate a simple ID based on product name if no ID is provided
    const productName = card.querySelector('.product-title')?.textContent.trim() || 'product';
    return productName.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

function updateCartCount() {
    if (window.Snipcart) {
        const count = window.Snipcart.store.getState().cart.items.count || 0;
        const cartCountElements = document.querySelectorAll('.cart-count');
        
        cartCountElements.forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'flex' : 'none';
        });
    }
}

// Legacy add-to-cart toast removed in favor of global showMessage helper
