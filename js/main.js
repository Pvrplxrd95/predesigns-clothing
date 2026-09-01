// Main JavaScript file for Predesigns Clothing Website
// This file is now coordinated by js/app-init.js for centralized initialization

// Note: All initialization is now handled by the ApplicationInitializer in js/app-init.js
// This file contains the core functionality that gets called during initialization

// Preloader Functionality
function initPreloader() {
    console.log('Initializing preloader...');
    const preloader = document.querySelector('.preloader');

    if (!preloader) {
        console.log('No preloader element found');
        return;
    }

    console.log('Preloader element found, setting up...');

    // Function to hide preloader
    const hidePreloader = () => {
        console.log('Hiding preloader...');
        if (preloader) {
            preloader.classList.add('hidden');
            // Remove the preloader from the DOM after animation completes
            setTimeout(() => {
                if (preloader && preloader.parentNode) {
                    preloader.style.display = 'none';
                    console.log('Preloader hidden and removed from flow');
                }
            }, 500); // Match this with your CSS transition time
        }
    };

    // Check if page is already loaded
    if (document.readyState === 'complete') {
        console.log('Document already loaded, hiding preloader immediately');
        hidePreloader();
    } else {
        console.log('Waiting for window load event...');
        window.addEventListener('load', () => {
            console.log('Window load event fired, hiding preloader');
            hidePreloader();
        });

        // Add a timeout as a fallback in case load event doesn't fire
        setTimeout(() => {
            console.log('Fallback timeout reached, forcing preloader hide');
            hidePreloader();
        }, 5000); // Increased to 5 seconds
    }
}

// Navigation Functionality
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const currentPath = window.location.pathname;

    // Update active link based on current page
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath ||
            (link.getAttribute('href') === 'index.html' && currentPath === '/')) {
            link.classList.add('active');
        }

        // Remove active class from all links when clicked
        link.addEventListener('click', function () {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Mobile Menu Functionality
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function () {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');

            // Prevent body scroll when menu is open
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking on nav links
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function () {
                mobileMenuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        mobileMenu.addEventListener('click', function (e) {
            if (e.target === this) {
                mobileMenuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking the X button
        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', function () {
                mobileMenuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    }
}

// Smooth Scrolling
// use initSmoothScrolling from utils.js

// Form Validation
function initFormValidation() {
    // Contact Form (index.html)
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            // Remove e.preventDefault() to allow actual form submission to Formspree
            // Only prevent default if validation fails

            const name = contactForm.querySelector('input[name="name"]').value.trim();
            const email = contactForm.querySelector('input[name="email"]').value.trim();
            const phone = contactForm.querySelector('input[name="phone"]').value.trim();
            const serviceType = contactForm.querySelector('select[name="service-type"]').value;
            const message = contactForm.querySelector('textarea[name="message"]').value.trim();

            // Basic validation
            if (!name || !email || !phone || !serviceType || !message) {
                e.preventDefault();
                showMessage('Please fill in all fields', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                e.preventDefault();
                showMessage('Please enter a valid email address', 'error');
                return;
            }

            if (!isValidPhone(phone)) {
                e.preventDefault();
                showMessage('Please enter a valid phone number', 'error');
                return;
            }

            // Allow form to submit to Formspree, then show success message
            showMessage('Thank you for your inquiry! We\'ll contact you within 24 hours.', 'success');
        });
    }
}

// Newsletter Form
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('newsletter-email').value.trim();

            if (!email) {
                showMessage('Please enter your email address', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showMessage('Please enter a valid email address', 'error');
                return;
            }

            // Simulate newsletter subscription
            submitForm(this, 'newsletter');
        });
    }
}

// Custom Order Form Handler
function initCustomOrderForm() {
    const customOrderForm = document.getElementById('custom-order-form');
    if (customOrderForm) {
        customOrderForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            // Validate form data
            const errors = validateCustomOrderForm(data);

            if (errors.length > 0) {
                showMessage(errors.join('<br>'), 'error');
                return;
            }

            // Simulate successful submission
            showMessage('Thank you for your inquiry! We\'ll contact you within 24 hours.', 'success');
            this.reset();

            // Close mobile menu if open
            const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
            const mobileMenu = document.querySelector('.mobile-menu');
            if (mobileMenuToggle && mobileMenu) {
                mobileMenuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// Form Validation Helper Functions
function validateCustomOrderForm(data) {
    const errors = [];

    if (!data.name) errors.push('Full name is required');
    if (!data.email) errors.push('Email address is required');
    if (!isValidEmail(data.email)) errors.push('Please enter a valid email address');
    if (!data.phone) errors.push('Phone number is required');
    if (!isValidPhone(data.phone)) errors.push('Please enter a valid phone number');
    if (!data['service-type']) errors.push('Please select a service type');
    if (!data.message) errors.push('Please tell us about your project');

    return errors;
}

// use isValidEmail from utils.js

// use isValidPhone from utils.js

// Form Submission Handler
function submitForm(form, formType) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    // Simulate API call
    setTimeout(() => {
        if (formType === 'custom-order') {
            showMessage('Thank you for your inquiry! We\'ll contact you within 24 hours.', 'success');
            form.reset();
        } else if (formType === 'newsletter') {
            showMessage('You have been successfully subscribed to our newsletter!', 'success');
            form.reset();
        }

        // Re-enable button
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }, 2000);
}


// Back to Top Button
function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');

    if (backToTop) {
        // Show/hide based on scroll position
        window.addEventListener('scroll', function () {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });

        // Smooth scroll to top
        backToTop.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Sticky Header
function initStickyHeader() {
    const header = document.querySelector('.header');

    if (header) {
        window.addEventListener('scroll', function () {
            if (window.pageYOffset > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

// Animation on Scroll
function initAnimationOnScroll() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    const fadeUpElements = document.querySelectorAll('.fade-in-up');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = entry.target.dataset.delay || '0s';
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        element.style.animationPlayState = 'paused';
        observer.observe(element);
    });

    // Fade-in-up observer with stagger support
    const fadeUpObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || '0s';
                entry.target.style.transitionDelay = delay;
                entry.target.classList.add('visible');
                fadeUpObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    fadeUpElements.forEach(element => {
        fadeUpObserver.observe(element);
    });
}

// Contact Links Functionality
function initContactLinks() {
    // WhatsApp link
    const whatsappLinks = document.querySelectorAll('a[href*="whatsapp"]');
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const whatsappUrl = `https://wa.me/27694313721?text=Hello%20Predesigns%20Clothing!%20I%27m%20interested%20in%20your%20services.`;
            window.open(whatsappUrl, '_blank');
        });
    });

    // Email links
    const emailLinks = document.querySelectorAll('a[href^="mailto"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const email = 'purpleray23@gmail.com';
            const subject = 'Predesigns Clothing Inquiry';
            const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
            window.location.href = mailtoUrl;
        });
    });
}

// Cart Functionality (Enhanced for e-commerce)
function initCart() {
    const cartIcon = document.querySelector('.cart-icon');
    const cartCount = document.querySelector('.cart-count');

    if (cartIcon) {
        cartIcon.addEventListener('click', function (e) {
            e.preventDefault();

            // Use existing payment system instead of showing cart modal
            if (typeof proceedToPayment === 'function') {
                proceedToPayment();
            } else {
                // Fallback: redirect to checkout if payment system not available
                window.location.href = 'checkout.html';
            }
        });
    }

    // Initialize cart count
    updateCartCount();

    // Rehydrate cart count on page load to ensure it's always up to date
    document.addEventListener('DOMContentLoaded', function () {
        updateCartCount();
    });
}


// Cart Management Functions using CartStorage
function addToCart(productId, productName, productPrice, productImage) {
    if (typeof CartStorage === 'undefined') {
        console.error('CartStorage is not available');
        showMessage('Cart functionality is temporarily unavailable. Please try again later.', 'error');
        return false;
    }

    // Check if item already exists in cart
    const cart = CartStorage.getCart();
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        // Update quantity of existing item
        existingItem.quantity += 1;
    } else {
        // Add new item to cart
        const newItem = {
            id: productId,
            name: productName,
            price: parseFloat(productPrice),
            quantity: 1,
            image: productImage || ''
        };

        // Validate item before adding
        if (!CartStorage.isValidCartItem(newItem)) {
            console.error('Invalid cart item:', newItem);
            showMessage('Unable to add item to cart. Please try again.', 'error');
            return false;
        }

        cart.push(newItem);
    }

    // Save updated cart
    const success = CartStorage.setCart(cart);

    if (success) {
        updateCartCount();
        showMessage(`${productName} has been added to your cart!`, 'success');
        return true;
    } else {
        showMessage('Failed to add item to cart. Please try again.', 'error');
        return false;
    }
}

// Remove item from cart
function removeFromCart(productId) {
    if (typeof CartStorage === 'undefined') {
        console.error('CartStorage is not available');
        return false;
    }

    return CartStorage.removeItem(productId);
}

// Update cart item quantity
function updateCartItemQuantity(productId, quantity) {
    if (typeof CartStorage === 'undefined') {
        console.error('CartStorage is not available');
        return false;
    }

    return CartStorage.updateItemQuantity(productId, quantity);
}

// Clear entire cart
function clearCart() {
    if (typeof CartStorage === 'undefined') {
        console.error('CartStorage is not available');
        return false;
    }

    return CartStorage.clearCart();
}


// Lookbook Modal Functionality
function initLookbook() {
    // Only run if viewLookbookButtons exist
    const viewLookbookButtons = document.querySelectorAll('.view-lookbook');

    if (viewLookbookButtons.length > 0) {
        viewLookbookButtons.forEach(button => {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                const lookbookTitle = this.parentElement.querySelector('h3').textContent;

                // Create modal
                const modal = document.createElement('div');
                modal.className = 'lookbook-modal';
                modal.innerHTML = `
                    <div class="modal-content">
                        <span class="modal-close">&times;</span>
                        <h2>${lookbookTitle}</h2>
                        <p>Full lookbook story coming soon! This feature will showcase our latest fashion stories and inspiration.</p>
                        <div class="modal-actions">
                            <a href="#contact" class="btn btn-primary">Book a Consultation</a>
                            <button class="btn btn-secondary modal-close-btn">Close</button>
                        </div>
                    </div>
                `;

                document.body.appendChild(modal);
                document.body.style.overflow = 'hidden';

                // Close modal
                const closeButtons = modal.querySelectorAll('.modal-close, .modal-close-btn');
                closeButtons.forEach(btn => {
                    btn.addEventListener('click', () => {
                        modal.remove();
                        document.body.style.overflow = '';
                    });
                });

                // Close on click outside
                modal.addEventListener('click', function (e) {
                    if (e.target === modal) {
                        modal.remove();
                        document.body.style.overflow = '';
                    }
                });
            });
        });
    }
}

// Collection Navigation
function initCollections() {
    const collectionLinks = document.querySelectorAll('.collection-link');

    collectionLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Allow default navigation to the href (e.g., shop.html?collection=streetwear)
            // No interception here to ensure the collection filters apply on the shop page
        });
    });
}

// Mobile menu functionality is now handled by app-init.js
// Cookie consent is now handled by app-init.js
// Lookbook navigation is now handled by app-init.js

// Initialize Lookbook Navigation (for main website)
function initLookbookNavigation() {
    console.log('Lookbook navigation initialized');
}

// Cookie Consent Functions
function checkCookieConsent() {
    const consent = getCookie('cookie_consent');
    if (!consent) {
        showCookieConsentBanner();
    }
}

function showCookieConsentBanner() {
    const banner = document.getElementById('cookieConsentBanner');
    if (banner) {
        banner.classList.add('show');
    }
}

function hideCookieConsentBanner() {
    const banner = document.getElementById('cookieConsentBanner');
    if (banner) {
        banner.classList.remove('show');
    }
}

function manageCookiePreferences() {
    const modal = document.getElementById('cookieModal');
    if (modal) {
        modal.classList.add('show');

        // Load current preferences
        loadCookiePreferences();
    }
}

function closeCookieModal() {
    const modal = document.getElementById('cookieModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function loadCookiePreferences() {
    // Load saved preferences or use defaults
    const analytics = getCookie('analytics_consent') === 'true';
    const marketing = getCookie('marketing_consent') === 'true';

    document.getElementById('analyticsCookies').checked = analytics;
    document.getElementById('marketingCookies').checked = marketing;
}

function saveCookiePreferences() {
    const analytics = document.getElementById('analyticsCookies').checked;
    const marketing = document.getElementById('marketingCookies').checked;

    // Set cookies
    setCookie('analytics_consent', analytics, 365);
    setCookie('marketing_consent', marketing, 365);

    // Set overall consent
    setCookie('cookie_consent', 'true', 365);

    // Hide banner and modal
    hideCookieConsentBanner();
    closeCookieModal();

    // Reload page to apply cookie settings
    location.reload();
}

function acceptAllCookies() {
    // Set all cookies to true
    setCookie('analytics_consent', 'true', 365);
    setCookie('marketing_consent', 'true', 365);
    setCookie('cookie_consent', 'true', 365);

    // Hide banner and modal
    hideCookieConsentBanner();
    closeCookieModal();

    // Reload page to apply cookie settings
    location.reload();
}

// use getCookie from utils.js

// use setCookie from utils.js

function getCookieConsent() {
    return {
        essential: true, // Always true
        analytics: getCookie('analytics_consent') === 'true',
        marketing: getCookie('marketing_consent') === 'true'
    };
}

// Resize Event
window.addEventListener('resize', function () {
    // Handle any resize-specific functionality
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');

    if (window.innerWidth > 767 && mobileMenu && mobileMenuToggle) {
        // Close mobile menu on desktop
        mobileMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Before Unload Event
window.addEventListener('beforeunload', function () {
    // Cleanup any event listeners or intervals if needed
    console.log('User is leaving the page');
});

// Error Handling
window.addEventListener('error', function (e) {
    console.error('JavaScript Error:', e.error);
});

// Custom Order Form Function (for main website)
function openCustomOrderForm() {
    const customOrderHTML = `
        <div class="custom-order-modal" id="custom-order-modal">
            <div class="modal-content">
                <span class="modal-close" onclick="closeCustomOrderForm()">&times;</span>
                <div class="modal-form-content">
                    <h2>Custom Order Request</h2>
                    <p>Let us create something unique just for you! Please fill out this form with your requirements.</p>
                    
                    <form id="main-custom-order-form">
                        <div class="form-group">
                            <label for="customer-name">Full Name *</label>
                            <input type="text" id="customer-name" name="name" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="customer-phone">Phone Number (WhatsApp) *</label>
                            <input type="tel" id="customer-phone" name="phone" placeholder="069 431 3721" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="customer-email">Email Address</label>
                            <input type="email" id="customer-email" name="email">
                        </div>
                        
                        <div class="form-group">
                            <label for="order-type">Type of Clothing *</label>
                            <select id="order-type" name="orderType" required>
                                <option value="">Select type...</option>
                                <option value="streetwear">Luxury Streetwear</option>
                                <option value="traditional">Traditional Wear</option>
                                <option value="suit">Custom Suit</option>
                                <option value="dress">Dress/Gown</option>
                                <option value="other">Other (please specify)</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="order-description">Describe Your Vision *</label>
                            <textarea id="order-description" name="description" rows="4" 
                                placeholder="Tell us about the clothing you want - style, colors, materials, occasion, etc." required></textarea>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Submit Request</button>
                            <button type="button" class="btn btn-secondary" onclick="closeCustomOrderForm()">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', customOrderHTML);

    // Add event listener to the form
    document.getElementById('main-custom-order-form').addEventListener('submit', handleCustomOrderSubmit);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

// Book Consultation Form Function (for main website)
function openConsultationForm() {
    const consultationHTML = `
        <div class="custom-order-modal" id="consultation-modal">
            <div class="modal-content">
                <span class="modal-close" onclick="closeConsultationForm()">&times;</span>
                <div class="modal-form-content">
                    <h2>Book Consultation</h2>
                    <p>Schedule a consultation with our designer to discuss your custom clothing needs.</p>
                    
                    <form id="main-consultation-form">
                        <div class="form-group">
                            <label for="consultation-name">Full Name *</label>
                            <input type="text" id="consultation-name" name="name" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="consultation-phone">Phone Number (WhatsApp) *</label>
                            <input type="tel" id="consultation-phone" name="phone" placeholder="069 431 3721" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="consultation-email">Email Address</label>
                            <input type="email" id="consultation-email" name="email">
                        </div>
                        
                        <div class="form-group">
                            <label for="consultation-type">Consultation Type</label>
                            <select id="consultation-type" name="type">
                                <option value="in-person">In-Person (Hammanskraal Studio)</option>
                                <option value="video-call">Video Call</option>
                                <option value="phone-call">Phone Call</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="consultation-details">What would you like to discuss?</label>
                            <textarea id="consultation-details" name="details" rows="3" 
                                placeholder="Tell us about what you'd like to create or discuss..."></textarea>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Book Consultation</button>
                            <button type="button" class="btn btn-secondary" onclick="closeConsultationForm()">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', consultationHTML);

    // Add event listener to the form
    document.getElementById('main-consultation-form').addEventListener('submit', handleConsultationSubmit);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

// Handle custom order form submission
function handleCustomOrderSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const orderData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        orderType: formData.get('orderType'),
        description: formData.get('description'),
        timestamp: new Date().toISOString()
    };

    // In a real implementation, you would send this to your server
    console.log('Custom order request:', orderData);

    // Show success message
    showMessage('Thank you for your custom order request! We\'ll contact you within 24 hours.', 'success');

    // Close modal
    closeCustomOrderForm();

    // Reset form
    e.target.reset();
}

// Handle consultation form submission
function handleConsultationSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const consultationData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        type: formData.get('type'),
        details: formData.get('details'),
        timestamp: new Date().toISOString()
    };

    // In a real implementation, you would send this to your server
    console.log('Consultation booking:', consultationData);

    // Show success message
    showMessage('Your consultation has been booked! We\'ll send you a confirmation.', 'success');

    // Close modal
    closeConsultationForm();

    // Reset form
    e.target.reset();
}

// Close custom order form
function closeCustomOrderForm() {
    const modal = document.getElementById('custom-order-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// Close consultation form
function closeConsultationForm() {
    const modal = document.getElementById('consultation-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}



// Authentication System Integration
// Note: Modern authentication system is now handled by js/auth.js
// This section provides compatibility and initialization

// Initialize modern authentication system
function initModernAuth() {
    // Check if authManager is available (loaded from js/auth.js)
    if (typeof authManager !== 'undefined' && authManager instanceof AuthManager) {
        // AuthManager is already initialized in auth.js
        console.log('Modern authentication system initialized');
    } else {
        console.warn('AuthManager not found. Please ensure js/auth.js is loaded.');
    }
}

// Legacy compatibility functions (redirect to modern system)
function updateAuthUI(user) {
    if (typeof authManager !== 'undefined') {
        authManager.updateAuthUI(user);
    }
}

function checkLoginStatus() {
    if (typeof authManager !== 'undefined') {
        authManager.checkSession();
    }
}

// Lazy Loading for Images
// use initLazyLoading from utils.js

// Console Welcome Message
console.log('%c Welcome to Predesigns Clothing Website!', 'font-size: 16px; font-weight: bold; color: #6A0DAD;');
console.log('%c Est. 2019 by Josias Tlou in Hammanskraal, Pretoria', 'color: #FFD700;');
console.log('%c Quality tailor-made clothing from scratch with local love and taste', 'color: #333;');
// Function to handle cart icon click globally
function handleCartClick() {
    if (typeof Snipcart !== 'undefined') {
        Snipcart.api.modal.show();
    } else {
        // Fallback for non-Snipcart pages if they exist, or just log
        console.warn('Snipcart not initialized yet.');
    }
}
