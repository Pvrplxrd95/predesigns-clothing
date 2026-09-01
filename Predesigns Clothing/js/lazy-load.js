/**
 * Lazy Loading and Image Optimization
 * Handles lazy loading of images and responsive image loading
 */

document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const config = {
        rootMargin: '200px 0px',
        threshold: 0.01
    };

    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const lazyImages = [].slice.call(document.querySelectorAll('img.lazy-loading'));
        
        // If there are no images to lazy load, exit
        if (lazyImages.length === 0) {
            return;
        }

        // Create observer instance
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src') || img.src;
                    
                    // Only load if not already loaded
                    if (src && img.src !== src) {
                        // Load the image
                        img.src = src;
                        
                        // Handle image load
                        img.onload = function() {
                            img.classList.add('lazy-loaded');
                            img.removeAttribute('data-src');
                            
                            // If it's a background image, set it
                            const bgSrc = img.getAttribute('data-bg-src');
                            if (bgSrc) {
                                img.style.backgroundImage = `url(${bgSrc})`;
                                img.removeAttribute('data-bg-src');
                            }
                            
                            // Remove the loading class
                            img.classList.remove('lazy-loading');
                        };
                        
                        // Handle image error
                        img.onerror = function() {
                            console.error('Error loading image:', src);
                            img.classList.add('lazy-load-error');
                            img.classList.remove('lazy-loading');
                        };
                        
                        // Stop observing this image
                        imageObserver.unobserve(img);
                    }
                }
            });
        }, config);

        // Observe all lazy images
        lazyImages.forEach(function(img) {
            // Skip if already loaded or if it's a data URI
            if (img.complete || img.src.startsWith('data:')) {
                return;
            }
            
            // Add loading state
            img.classList.add('lazy-loading');
            
            // If there's a placeholder, set it as the initial source
            const placeholder = img.getAttribute('data-placeholder');
            if (placeholder && !img.src) {
                img.src = placeholder;
            }
            
            // Observe the image
            imageObserver.observe(img);
        });
    }
    
    // Fallback for browsers without IntersectionObserver
    else {
        const loadImages = function() {
            const lazyImages = [].slice.call(document.querySelectorAll('img[data-src]'));
            
            if (lazyImages.length === 0) {
                window.removeEventListener('scroll', loadImages);
                window.removeEventListener('resize', loadImages);
                window.removeEventListener('orientationchange', loadImages);
                return;
            }
            
            lazyImages.forEach(function(img) {
                if (isInViewport(img)) {
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    img.classList.add('lazy-loaded');
                    img.classList.remove('lazy-loading');
                }
            });
        };
        
        // Check if element is in viewport
        const isInViewport = function(el) {
            const rect = el.getBoundingClientRect();
            return (
                rect.bottom >= 0 &&
                rect.right >= 0 &&
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.left <= (window.innerWidth || document.documentElement.clientWidth)
            );
        };
        
        // Add event listeners for fallback
        window.addEventListener('scroll', loadImages);
        window.addEventListener('resize', loadImages);
        window.addEventListener('orientationchange', loadImages);
        
        // Initial check
        loadImages();
    }
});
