/**
 * Focus Management Utility for Predesigns Clothing
 * Provides consistent, reusable focus trapping and restoration for modals/dialogs
 */

class FocusManager {
    constructor() {
        this.focusStack = [];
        this.trapHandlers = new Map();
    }

    /**
     * Trap focus within an element
     * @param {HTMLElement} element - Element to trap focus within
     * @returns {Function} Cleanup function to remove trap
     */
    trapFocus(element) {
        if (!element) return () => {};

        const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const focusableElements = element.querySelectorAll(focusableSelector);
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleTab = (e) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement?.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement?.focus();
                }
            }
        };

        element.addEventListener('keydown', handleTab);

        // Focus first element
        firstElement?.focus();

        return () => {
            element.removeEventListener('keydown', handleTab);
        };
    }

    /**
     * Open a dialog/modal with proper focus management
     * @param {HTMLElement} dialog - Dialog element (should have role="dialog")
     * @param {HTMLElement} trigger - Element that triggered the dialog
     */
    openDialog(dialog, trigger) {
        // Save current focus for restoration
        this.focusStack.push(trigger || document.activeElement);

        // Set aria attributes
        dialog.setAttribute('aria-modal', 'true');
        if (!dialog.hasAttribute('role')) {
            dialog.setAttribute('role', 'dialog');
        }

        // Trap focus
        const cleanup = this.trapFocus(dialog);

        // Store cleanup for later
        this.trapHandlers.set(dialog, cleanup);

        // Prevent background scroll
        document.body.style.overflow = 'hidden';

        return cleanup;
    }

    /**
     * Close a dialog/modal and restore focus
     * @param {HTMLElement} dialog - Dialog element
     */
    closeDialog(dialog) {
        // Remove focus trap
        const cleanup = this.trapHandlers.get(dialog);
        if (cleanup) cleanup();
        this.trapHandlers.delete(dialog);

        // Restore focus to trigger element
        const trigger = this.focusStack.pop();
        if (trigger && typeof trigger.focus === 'function') {
            trigger.focus();
        }

        // Restore body scroll
        if (this.focusStack.length === 0) {
            document.body.style.overflow = '';
        }
    }

    /**
     * Add skip link functionality
     */
    static initSkipLink() {
        // Check if skip link already exists
        if (document.querySelector('.skip-link')) return;

        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';

        // Insert at very beginning of body
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Ensure main content has id
        const main = document.querySelector('main, #main, .main-content, [role="main"]');
        if (main && !main.id) {
            main.id = 'main-content';
        } else if (!main) {
            // Fallback: find first substantial content area
            const fallback = document.querySelector('.container, .page-content, section');
            if (fallback && !fallback.id) {
                fallback.id = 'main-content';
            }
        }
    }
}

// Export singleton
window.focusManager = new FocusManager();

// Auto-init skip link
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => FocusManager.initSkipLink());
} else {
    FocusManager.initSkipLink();
}