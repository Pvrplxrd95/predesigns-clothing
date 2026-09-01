// Performance Optimizer for Predesigns Clothing Website
// Minimizes loading time while maintaining functionality

class PerformanceOptimizer {
    constructor() {
        this.lazyLoadedModules = new Set();
        this.initialized = false;
        this.init();
    }

    init() {
        if (this.initialized) return;
        
        // Defer non-critical initialization
        this.deferNonCriticalInit();
        
        // Optimize DOM ready handling
        this.optimizeDOMContentLoaded();
        
        // Lazy load heavy modules
        this.setupLazyLoading();
        
        this.initialized = true;
    }

    // Defer non-critical initialization until after page load
    deferNonCriticalInit() {
        // Use requestIdleCallback if available, otherwise setTimeout
        const deferFn = window.requestIdleCallback || setTimeout;
        
        deferFn(() => {
            // Initialize non-critical features after main content loads
            this.initNonCriticalFeatures();
        }, 0);
    }

    // Optimize DOM content loaded handling
    optimizeDOMContentLoaded() {
        // Only add essential event listeners initially
        document.addEventListener('DOMContentLoaded', () => {
            // Critical initialization only
            this.initCriticalFeatures();
        });
    }

    // Initialize only critical features
    initCriticalFeatures() {
        // Only essential cart functionality
        if (typeof CartStorage !== 'undefined') {
            CartStorage.init();
            this.updateCartCountFast();
        }
        
        // Basic navigation
        this.initBasicNavigation();
        
        // Essential form validation
        this.initEssentialForms();
    }

    // Initialize non-critical features later
    initNonCriticalFeatures() {
        // Advanced features loaded after page is ready
        if (typeof utils !== 'undefined') {
            utils.initSmoothScrolling();
            utils.initStickyHeader();
        }
        
        // Lazy load authentication
        if (typeof authManager !== 'undefined') {
            authManager.checkSession();
        }
        
        // Initialize animations
        this.initAnimations();
    }

    // Fast cart count update
    updateCartCountFast() {
        const cartCount = document.querySelector('.cart-count, [data-cart-count]');
        if (cartCount && typeof CartStorage !== 'undefined') {
            const cart = CartStorage.getCart();
            const count = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = count;
            cartCount.style.display = count > 0 ? 'inline' : 'none';
        }
    }

    // Basic navigation without heavy animations
    initBasicNavigation() {
        const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');
        navLinks.forEach(link => {
            // Only add active class, no complex animations
            if (link.getAttribute('href') === window.location.pathname) {
                link.classList.add('active');
            }
        });
    }

    // Essential form validation only
    initEssentialForms() {
        // Only basic validation, no complex features
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                const required = form.querySelectorAll('[required]');
                let valid = true;
                
                required.forEach(field => {
                    if (!field.value.trim()) {
                        valid = false;
                        field.style.borderColor = '#ff0000';
                    } else {
                        field.style.borderColor = '';
                    }
                });
                
                if (!valid) {
                    e.preventDefault();
                    this.showSimpleMessage('Please fill in all required fields', 'error');
                }
            });
        });
    }

    // Simple message without complex animations
    showSimpleMessage(message, type = 'info') {
        const existing = document.querySelector('.simple-message');
        if (existing) existing.remove();
        
        const msg = document.createElement('div');
        msg.className = `simple-message message-${type}`;
        msg.textContent = message;
        msg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#ff4444' : '#44ff44'};
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            z-index: 1000;
            transition: opacity 0.3s;
        `;
        
        document.body.appendChild(msg);
        
        setTimeout(() => {
            if (msg.parentNode) msg.remove();
        }, 3000);
    }

    // Lazy load modules
    setupLazyLoading() {
        // Only load heavy modules when needed
        this.setupScrollObserver();
        this.setupClickObserver();
    }

    // Observer for scroll-based loading
    setupScrollObserver() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadModule(entry.target.dataset.module);
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            // Observe elements that need lazy loading
            document.querySelectorAll('[data-module]').forEach(el => {
                observer.observe(el);
            });
        }
    }

    // Observer for click-based loading
    setupClickObserver() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-load-module]');
            if (target && !this.lazyLoadedModules.has(target.dataset.loadModule)) {
                this.loadModule(target.dataset.loadModule);
            }
        });
    }

    // Load module on demand
    async loadModule(moduleName) {
        if (this.lazyLoadedModules.has(moduleName)) return;
        
        try {
            this.lazyLoadedModules.add(moduleName);
            
            switch (moduleName) {
                case 'auth':
                    // Load auth only when needed
                    if (typeof authManager === 'undefined') {
                        await this.loadScript('js/auth.js');
                    }
                    break;
                    
                case 'animations':
                    // Load animations only when user scrolls
                    await this.loadScript('js/animations.js');
                    break;
                    
                case 'cart-detailed':
                    // Load detailed cart features only when cart is opened
                    await this.loadScript('js/cart-detailed.js');
                    break;
            }
        } catch (error) {
            console.warn(`Failed to load module ${moduleName}:`, error);
        }
    }

    // Dynamic script loading
    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Initialize animations (lightweight)
    initAnimations() {
        // Only CSS-based animations, no JavaScript animations
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transition = 'opacity 0.3s ease-out';
        });
        
        const handleScroll = () => {
            animatedElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.9) {
                    el.style.opacity = '1';
                }
            });
        };
        
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Trigger initial check
    }
}

// Initialize performance optimizer
window.performanceOptimizer = new PerformanceOptimizer();

// Optimize image loading
function optimizeImages() {
    const images = document.querySelectorAll('img[data-src]');
    let loadedCount = 0;
    const totalImages = images.length;
    
    const loadImage = (img) => {
        const imageLoader = new Image();
        imageLoader.onload = () => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.style.opacity = '1';
            loadedCount++;
            
            // Load next image
            if (loadedCount < totalImages) {
                loadNextImage();
            }
        };
        
        imageLoader.src = img.dataset.src;
    };
    
    let currentIndex = 0;
    const loadNextImage = () => {
        if (currentIndex < images.length) {
            loadImage(images[currentIndex]);
            currentIndex++;
        }
    };
    
    // Load images one by one to avoid overwhelming the browser
    loadNextImage();
}

// Only optimize if images exist
if (document.querySelectorAll('img[data-src]').length > 0) {
    window.addEventListener('load', optimizeImages);
}

// Minimize initial JavaScript execution
(function() {
    'use strict';
    
    // Only execute critical code immediately
    const criticalInit = () => {
        // Cart initialization
        if (typeof CartStorage !== 'undefined') {
            CartStorage.init();
        }
        
        // Basic event delegation
        document.addEventListener('click', (e) => {
            // Only handle critical clicks initially
            if (e.target.matches('[data-action="open-cart"]')) {
                e.preventDefault();
                // Simple cart opening logic
                const cartModal = document.querySelector('.cart-modal');
                if (cartModal) cartModal.style.display = 'block';
            }
        });
    };
    
    // Execute critical initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', criticalInit);
    } else {
        criticalInit();
    }
})();
