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
        this.initValidation();

        // Expose global modal triggers
        window.openCustomOrderForm = () => this.openCustomOrderForm();
        window.closeCustomOrderForm = () => this.closeCustomOrderForm();
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
    async handleContactSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const name = form.querySelector('input[name="name"]')?.value.trim();
        const email = form.querySelector('input[name="email"]')?.value.trim();
        const message = form.querySelector('textarea[name="message"]')?.value.trim();

        if (!name || !email || !message) {
            this.showMessage('Please fill in all required fields.', 'error');
            return;
        }

        if (window.isValidEmail && !window.isValidEmail(email)) {
            this.showMessage('Please enter a valid email address.', 'error');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
        }

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                this.showMessage('Thank you! Your message has been sent.', 'success');
                form.reset();
            } else {
                const data = await response.json().catch(() => ({}));
                this.showMessage(data?.error || 'Failed to send message. Please try again.', 'error');
            }
        } catch {
            this.showMessage('Network error. Please check your connection and try again.', 'error');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
        }
    }

    /**
     * Handle newsletter subscription
     */
    async handleNewsletterSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const emailInput = form.querySelector('input[type="email"]');
        const email = emailInput?.value.trim();

        if (!email || (window.isValidEmail && !window.isValidEmail(email))) {
            this.showMessage('Please enter a valid email address.', 'error');
            return;
        }

        if (!form.action || form.action === window.location.href) {
            this.showMessage('Thank you for subscribing!', 'success');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Subscribing...';
        }

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                this.showMessage('Thank you for subscribing!', 'success');
                form.reset();
            } else {
                const data = await response.json().catch(() => ({}));
                this.showMessage(data?.error || 'Subscription failed. Please try again.', 'error');
            }
        } catch {
            this.showMessage('Network error. Please check your connection and try again.', 'error');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Subscribe';
            }
        }
    }

    /**
     * Open a modal for custom order requests
     */
    openCustomOrderForm() {
        // Close existing if any
        this.closeCustomOrderForm();

        const modal = document.createElement('div');
        modal.className = 'custom-order-modal';
        modal.id = 'custom-order-modal';

        // Custom Order Form HTML (based on form_updates.html standard)
        modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close" onclick="closeCustomOrderForm()">&times;</span>
                <h3>Custom Order Request</h3>
                <p>Tell us your vision and we'll bring it to life.</p>
                
                <form action="https://formspree.io/f/mqagpypo" method="POST" id="custom-order-form">
                    <div class="form-group">
                        <label>Full Name *</label>
                        <input type="text" name="name" required>
                    </div>

                    <div class="form-group">
                        <label>Phone Number (WhatsApp) *</label>
                        <input type="tel" name="phone" required placeholder="e.g. 069 431 3721">
                    </div>

                    <div class="form-group">
                        <label>Email Address</label>
                        <input type="email" name="email">
                    </div>

                    <div class="form-group">
                        <label>Type of Clothing *</label>
                        <select name="order_type" required>
                            <option value="">Select type...</option>
                            <option value="streetwear">Luxury Streetwear</option>
                            <option value="traditional">Traditional Wear</option>
                            <option value="suit">Custom Suit</option>
                            <option value="dress">Dress/Gown</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Describe Your Vision *</label>
                        <textarea name="description" rows="4" required placeholder="Style, colors, occasion..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>Budget Range (ZAR)</label>
                        <select name="budget">
                            <option value="">Select budget...</option>
                            <option value="500-1000">R500 - R1,000</option>
                            <option value="1000-2000">R1,000 - R2,000</option>
                            <option value="2000-5000">R2,000 - R5,000</option>
                            <option value="5000+">R5,000+</option>
                        </select>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">Submit Request</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        // Add submission listener
        const form = modal.querySelector('form');
        form.addEventListener('submit', (e) => {
            if (this.handleCustomOrderSubmit(e)) {
                // Form will submit to Formspree naturally
            }
        });
    }

    closeCustomOrderForm() {
        const modal = document.getElementById('custom-order-modal');
        if (modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    }

    handleCustomOrderSubmit(e) {
        this.showMessage('Submitting your request...', 'info');
        // Let it submit to formspree
        return true;
    }

    /**
     * Centralized message display
     */
    showMessage(message, type = 'info') {
        if (window.authManager && window.authManager.showMessage) {
            window.authManager.showMessage(message, type);
        } else if (window.uiManager && window.uiManager.showToast) {
            window.uiManager.showToast(message, type);
        } else {
            console.log(`[FormManager ${type}]: ${message}`);
            alert(message);
        }
    }
}

// Export for use in app-init.js
window.formManager = new FormManager();
