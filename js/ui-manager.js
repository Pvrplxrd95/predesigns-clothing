/**
 * UI Manager Module
 * Handles general UI behaviors like preloader, navigation, mobile menu, and auth visibility.
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

    /**
     * Hide or show authentication controls based on feature flag
     */
    initAuthVisibility() {
        const enableAuth = window.__FEATURE_FLAGS__?.ENABLE_AUTH ?? false;
        const authContainers = document.querySelectorAll('.auth-container, .mobile-auth-buttons');
        
        authContainers.forEach(container => {
            if (!enableAuth) {
                // Hide auth controls and remove their space
                container.style.display = 'none';
                // Also hide any direct auth buttons without container
                container.querySelectorAll('button').forEach(btn => {
                    btn.setAttribute('disabled', 'disabled');
                    btn.setAttribute('aria-hidden', 'true');
                    btn.setAttribute('tabindex', '-1');
                });
            } else {
                container.style.display = '';
                container.querySelectorAll('button').forEach(btn => {
                    btn.removeAttribute('disabled');
                    btn.removeAttribute('aria-hidden');
                    btn.removeAttribute('tabindex');
                });
            }
        });
    }

    /**
     * Ensure consistent header behavior across viewports
     */
    initHeaderResponsiveness() {
        const header = document.querySelector('.header');
        if (!header) return;

        // Prevent header overflow at all widths
        const navbar = header.querySelector('.navbar');
        if (navbar) {
            navbar.style.overflow = 'visible';
        }

        // Collapse to mobile menu when desktop nav no longer fits
        const checkOverflow = () => {
            const navMenu = header.querySelector('.nav-menu');
            const navActions = header.querySelector('.nav-actions');
            if (!navMenu || !navActions) return;

            const headerWidth = header.offsetWidth;
            const logoWidth = header.querySelector('.logo')?.offsetWidth || 0;
            const actionsWidth = navActions.offsetWidth;
            const availableWidth = headerWidth - logoWidth - actionsWidth - 48; // 48px padding

            if (availableWidth < 300) {
                // Not enough room for desktop nav - ensure mobile menu is shown
                navMenu.classList.add('hidden');
            } else {
                navMenu.classList.remove('hidden');
            }
        };

        // Check on load and resize
        window.addEventListener('resize', checkOverflow);
        // Initial check after a short delay for layout to settle
        setTimeout(checkOverflow, 100);
    }
}

// Export for use in app-init.js
window.uiManager = new UIManager();