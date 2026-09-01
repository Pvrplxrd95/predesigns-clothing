/**
 * Lazy Loading and Image Optimization
 * Handles lazy loading of images and responsive image loading
 */

// Immediate execution if possible to catch early images
(function () {
    // Configuration
    const config = {
        rootMargin: '500px 0px', // Load images well before they are in view
        threshold: 0.01
    };

    /**
     * Main initialization function
     */
    function initLazyLoading() {
        // Check if IntersectionObserver is supported
        if ('IntersectionObserver' in window) {
            const lazyImages = [].slice.call(document.querySelectorAll('img.lazy-loading, .bg-lazy-load'));

            if (lazyImages.length === 0) return;

            // Create observer instance
            const imageObserver = new IntersectionObserver(function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        loadImage(img);
                        observer.unobserve(img);
                    }
                });
            }, config);

            // Observe all lazy images
            lazyImages.forEach(function (img) {
                imageObserver.observe(img);
            });
        }
        else {
            // Fallback for older browsers
            initFallback();
        }
    }

    /**
     * Loads the image source
     * @param {HTMLElement} img - The image element
     */
    function loadImage(img) {
        // Handle standard images
        if (img.tagName === 'IMG') {
            const src = img.getAttribute('data-src');
            if (src) {
                // Set up handlers BEFORE setting src to avoid race conditions
                img.onload = function () {
                    img.classList.remove('lazy-loading');
                    img.classList.add('lazy-loaded');
                };
                img.onerror = function () {
                    console.error('Error loading image:', src);
                    img.classList.remove('lazy-loading');
                    img.classList.add('lazy-load-error');
                };

                img.src = src;
                img.removeAttribute('data-src');

                // Safety: if image was already cached, onload may not fire
                if (img.complete && img.naturalWidth > 0) {
                    img.classList.remove('lazy-loading');
                    img.classList.add('lazy-loaded');
                }
            } else {
                // No data-src but has lazy-loading class - just clean up
                img.classList.remove('lazy-loading');
                img.classList.add('lazy-loaded');
            }
        }
        // Handle background images
        else {
            const bgSrc = img.getAttribute('data-bg-src');
            if (bgSrc) {
                img.style.backgroundImage = `url(${bgSrc})`;
                img.removeAttribute('data-bg-src');
            }
            img.classList.remove('lazy-loading');
            img.classList.add('lazy-loaded');
        }
    }

    /**
     * Fallback implementation for older browsers
     */
    function initFallback() {
        let active = false;

        const lazyLoad = function () {
            if (active === false) {
                active = true;

                setTimeout(function () {
                    const lazyImages = document.querySelectorAll('img.lazy-loading, .bg-lazy-load');

                    if (lazyImages.length === 0) {
                        window.removeEventListener('scroll', lazyLoad);
                        window.removeEventListener('resize', lazyLoad);
                        window.removeEventListener('orientationchange', lazyLoad);
                        return;
                    }

                    lazyImages.forEach(function (lazyImage) {
                        if ((lazyImage.getBoundingClientRect().top <= window.innerHeight + 500 && lazyImage.getBoundingClientRect().bottom >= -500) && getComputedStyle(lazyImage).display !== 'none') {
                            loadImage(lazyImage);
                        }
                    });

                    active = false;
                }, 200);
            }
        };

        document.addEventListener('scroll', lazyLoad);
        window.addEventListener('resize', lazyLoad);
        window.addEventListener('orientationchange', lazyLoad);

        // Run once immediately
        lazyLoad();
    }

    /**
     * Safety net: force-load any images still stuck invisible after 5 seconds
     */
    function initFailsafe() {
        setTimeout(function () {
            const stuckImages = document.querySelectorAll('img.lazy-loading');
            if (stuckImages.length > 0) {
                console.warn('Lazy-load failsafe: force-loading', stuckImages.length, 'stuck images');
                stuckImages.forEach(function (img) {
                    loadImage(img);
                });
            }
        }, 5000);
    }

    // Run initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            initLazyLoading();
            initFailsafe();
        });
    } else {
        initLazyLoading();
        initFailsafe();
    }

})();
