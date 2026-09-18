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
    /**
     * Initialize mobile menu behavior
     */
    initMobileMenu() {
        if (!this.mobileMenuToggle || !this.mobileMenu) return;

        this.mobileMenuBackdrop = document.querySelector('.mobile-menu-backdrop');
        this.mobileMenuClose = document.querySelector('.mobile-menu-close');

        // Toggle Menu
        this.mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent immediate closing
            this.toggleMobileMenu();
        });

        // Close when clicking nav links
        const navLinks = this.mobileMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Close when clicking backdrop
        if (this.mobileMenuBackdrop) {
            this.mobileMenuBackdrop.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }

        // Close when clicking close button
        if (this.mobileMenuClose) {
            this.mobileMenuClose.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.mobileMenu.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        const isActive = this.mobileMenu.classList.contains('active');
        if (isActive) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        this.mobileMenuToggle?.classList.add('active');
        this.mobileMenuToggle?.setAttribute('aria-expanded', 'true');
        this.mobileMenu?.classList.add('active');
        this.mobileMenuBackdrop?.classList.add('active');
        this.mobileMenuClose?.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    closeMobileMenu() {
        this.mobileMenuToggle?.classList.remove('active');
        this.mobileMenuToggle?.setAttribute('aria-expanded', 'false');
        this.mobileMenu?.classList.remove('active');
        this.mobileMenuBackdrop?.classList.remove('active');
        this.mobileMenuClose?.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
}

// Export for use in app-init.js
window.uiManager = new UIManager();
