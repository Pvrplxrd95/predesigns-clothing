// Utility functions for Predesigns Clothing Website
// This file consolidates common functions to avoid duplication

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param {string} input - The HTML string to sanitize
 * @returns {string} - Sanitized HTML string
 */
function sanitizeHTML(input) {
    if (typeof input !== 'string') {
        return '';
    }

    // Create a temporary DOM element to escape HTML
    const tempDiv = document.createElement('div');
    tempDiv.textContent = input;
    let escaped = tempDiv.innerHTML;

    // Remove any script tags and their content
    escaped = escaped.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Remove any iframe tags
    escaped = escaped.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');

    // Remove event handler attributes
    escaped = escaped.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '');

    // Remove javascript: protocol from href/src attributes
    escaped = escaped.replace(/(href|src)\s*=\s*["']\s*javascript:/gi, '$1="javascript:void(0)"');

    // This is a basic sanitization - in production, consider using DOMPurify library
    return escaped;
}

/**
 * Creates a safe DOM element with text content
 * @param {string} tag - HTML tag name
 * @param {Object} attributes - Object with attribute key-value pairs
 * @param {string} textContent - Text content for the element
 * @returns {HTMLElement} - Created DOM element
 */
function createSafeElement(tag, attributes = {}, textContent = '') {
    const element = document.createElement(tag);

    // Set allowed attributes safely
    Object.entries(attributes).forEach(([key, value]) => {
        if (['id', 'class', 'data-*'].some(allowed =>
            allowed === key || allowed === 'data-*' && key.startsWith('data-'))) {
            element.setAttribute(key, sanitizeHTML(value));
        }
    });

    // Set text content safely
    if (textContent) {
        element.textContent = textContent;
    }

    return element;
}

// Blog Utility Helpers
function getBlogPostId(defaultId = 'art-of-perfect-fit') {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || defaultId;
}

function formatBlogDate(dateInput, includeTime = false, locale = 'en-US') {
    const date = new Date(dateInput);
    if (Number.isNaN(date.valueOf())) {
        return '';
    }

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
    }

    return date.toLocaleDateString(locale, options);
}

// Message Display Function - Consolidated from main.js, cart.js, and shop.js
function showMessage(message, type = 'info') {
    // Remove any existing messages of the same type to avoid clutter
    const existingMessages = document.querySelectorAll('.message-toast, .add-to-cart-message, .cart-notification');
    existingMessages.forEach(msg => msg.remove());

    // Create message element based on type
    if (type === 'success' || type === 'error') {
        // Use the enhanced toast style from main.js for success/error messages
        const messageElement = document.createElement('div');
        messageElement.className = `message-toast message-${type}`;
        messageElement.innerHTML = `
            <div class="message-content">
                ${type === 'success' ? '<i class="fas fa-check-circle"></i>' :
                type === 'error' ? '<i class="fas fa-exclamation-circle"></i>' :
                    '<i class="fas fa-info-circle"></i>'}
                <span>${message}</span>
            </div>
            <button class="message-close">&times;</button>
        `;

        document.body.appendChild(messageElement);

        // Auto-hide after 5 seconds for success/error messages
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5000);

        // Close button functionality
        const closeBtn = messageElement.querySelector('.message-close');
        closeBtn.addEventListener('click', () => {
            messageElement.remove();
        });
    } else {
        // Use simple notification style for info messages (like shop.js notifications)
        const notification = document.createElement('div');
        notification.className = `cart-notification cart-notification-${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Remove after 3 seconds for info messages
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Lightweight notification helper used by wishlist/cart UX elements
function showCartNotification(message, type = 'info') {
    const existing = document.querySelectorAll('.cart-notification');
    existing.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `cart-notification cart-notification-${type}`;

    const iconMap = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };

    notification.innerHTML = `
        <i class="fas ${iconMap[type] || iconMap.info}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Cart Count Update Function - Consolidated from cart.js
function updateCartCount() {
    try {
        // Check if CartStorage is available (from cart-storage.js)
        if (typeof CartStorage !== 'undefined') {
            const cart = CartStorage.getCart();
            // CartStorage.getCart() returns a plain array, so use it directly or fallback to items prop
            const items = Array.isArray(cart) ? cart : (cart && Array.isArray(cart.items) ? cart.items : []);
            const count = items.reduce((total, item) => total + (item.quantity || 0), 0);
            const cartCount = document.querySelector('.cart-count');
            if (cartCount) {
                cartCount.textContent = count;
                cartCount.style.display = count > 0 ? 'inline-flex' : 'none';
            }
        } else {
            // Fallback for when CartStorage is not available
            try {
                const cartData = localStorage.getItem('predesigns-cart');
                const cart = cartData ? JSON.parse(cartData) : {};
                const items = cart && Array.isArray(cart.items) ? cart.items : [];
                const count = items.reduce((total, item) => total + (item.quantity || 0), 0);
                const cartCount = document.querySelector('.cart-count');
                if (cartCount) {
                    cartCount.textContent = count;
                    cartCount.style.display = count > 0 ? 'inline-flex' : 'none';
                }
            } catch (e) {
                console.error('Error reading cart from localStorage:', e);
                const cartCount = document.querySelector('.cart-count');
                if (cartCount) {
                    cartCount.style.display = 'none';
                }
            }
        }
    } catch (error) {
        console.error('Error updating cart count:', error);
        // Fallback: hide cart count if there's an error
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.style.display = 'none';
        }
    }
}

// Form Validation Helper Functions - Consolidated from main.js
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    // South African phone number format
    const phoneRegex = /^(\+27|0)[6-8][0-9]{7,8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Cookie Management Functions - Consolidated from main.js
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function checkCookieConsent() {
    const consent = getCookie('cookie_consent');
    return !!consent;
}

// Lazy Loading for Images - Enhanced version from main.js
function initLazyLoading() {
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;

                    // Load the actual image
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');

                        // Add fade-in effect
                        img.style.opacity = '0';
                        img.style.transition = 'opacity 0.3s ease-in-out';

                        // Remove blur effect if it exists
                        img.classList.remove('lazy-loading');

                        // Wait for image to load
                        img.onload = () => {
                            img.style.opacity = '1';
                        };
                    }

                    // Stop observing this image
                    observer.unobserve(img);
                }
            });
        });

        // Observe all images with data-src attribute
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// Smooth Scrolling Enhancement
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            e.preventDefault();

            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 80; // Account for fixed header
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Export functions for global use
window.showMessage = showMessage;
window.showCartNotification = showCartNotification;
window.updateCartCount = updateCartCount;
window.isValidEmail = isValidEmail;
window.isValidPhone = isValidPhone;
window.getCookie = getCookie;
window.setCookie = setCookie;
window.checkCookieConsent = checkCookieConsent;
window.initLazyLoading = initLazyLoading;
window.initSmoothScrolling = initSmoothScrolling;
window.sanitizeHTML = sanitizeHTML;
window.createSafeElement = createSafeElement;
window.getBlogPostId = getBlogPostId;
window.formatBlogDate = formatBlogDate;
