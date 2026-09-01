/**
 * UI Manager Module
 * Handles general UI behaviors like preloader, navigation, and mobile menu.
 */

class UIManager {
    constructor() {
        this.preloader = document.querySelector('.preloader');
        this.navLinks = document.querySelectorAll('.nav-links a');
        this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        this.mobileMenu = document.querySelector('.mobile-menu');
    }

    /**
     * Initialize preloader behavior
     */
    initPreloader() {
        if (!this.preloader) return;

        const hidePreloader = () => {
            this.preloader.classList.add('hidden');
            setTimeout(() => {
                if (this.preloader && this.preloader.parentNode) {
                    this.preloader.style.display = 'none';
                }
            }, 500);
        };

        if (document.readyState === 'complete') {
            hidePreloader();
        } else {
            window.addEventListener('load', hidePreloader);
            setTimeout(hidePreloader, 5000); // Fallback
        }
    }

    /**
     * Initialize navigation links
     */
    initNavigation() {
        if (!this.navLinks.length) return;

        const currentPath = window.location.pathname;
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath || (href === 'index.html' && (currentPath === '/' || currentPath === ''))) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Initialize mobile menu behavior
     */
    initMobileMenu() {
        if (!this.mobileMenuToggle || !this.mobileMenu) return;

        this.mobileMenuToggle.addEventListener('click', () => {
            this.mobileMenuToggle.classList.toggle('active');
            this.mobileMenu.classList.toggle('active');
            document.body.style.overflow = this.mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.mobileMenu.contains(e.target) && !this.mobileMenuToggle.contains(e.target)) {
                this.mobileMenu.classList.remove('active');
                this.mobileMenuToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// Export for use in app-init.js
window.uiManager = new UIManager();
