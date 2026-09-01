/**
 * Form Manager Module
 * Handles form validation and submission for contact and newsletter forms.
 */

class FormManager {
    constructor() {
        this.init();
    }

    init() {
        // Setup global form validation
    }

    /**
     * Initialize validation for all forms
     */
    initValidation() {
        // Contact Form
        const contactForm = document.querySelector('.contact-form form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
        }

        // Newsletter Forms
        const newsletterForms = document.querySelectorAll('#newsletter-form, #blog-newsletter-form');
        newsletterForms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));
        });
    }

    /**
     * Handle contact form submission
     */
    handleContactSubmit(e) {
        const form = e.target;
        const name = form.querySelector('input[name="name"]')?.value.trim();
        const email = form.querySelector('input[name="email"]')?.value.trim();
        const message = form.querySelector('textarea[name="message"]')?.value.trim();

        if (!name || !email || !message) {
            e.preventDefault();
            if (window.showMessage) window.showMessage('Please fill in all required fields.', 'error');
            return;
        }

        if (window.isValidEmail && !window.isValidEmail(email)) {
            e.preventDefault();
            window.showMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Formspree handles the actual POST, we just provide UI feedback
        // window.showMessage('Thank you! Your message has been sent.', 'success');
    }

    /**
     * Handle newsletter subscription
     */
    handleNewsletterSubmit(e) {
        const emailInput = e.target.querySelector('input[type="email"]');
        const email = emailInput?.value.trim();

        if (!email || (window.isValidEmail && !window.isValidEmail(email))) {
            e.preventDefault();
            if (window.showMessage) window.showMessage('Please enter a valid email address.', 'error');
            return;
        }

        // UI Feedback
        // window.showMessage('Thank you for subscribing!', 'success');
    }
}

// Export for use in app-init.js
window.formManager = new FormManager();
