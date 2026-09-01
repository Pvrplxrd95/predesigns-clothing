// Blog JavaScript Functionality
document.addEventListener('DOMContentLoaded', function () {
    // Initialize blog functionality
    initBlogFilters();
    initNewsletterForm();
    initSocialSharing();
});

/**
 * Blog Filters Functionality
 * Matches the .filter-btn elements in blog.html
 */
function initBlogFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const blogPosts = document.querySelectorAll('.blog-post');

    if (filterButtons.length === 0 || blogPosts.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            blogPosts.forEach(post => {
                if (filterValue === 'all' || post.getAttribute('data-category') === filterValue) {
                    post.style.display = 'block';
                    // Optional: trigger animation
                    post.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    post.style.display = 'none';
                }
            });
        });
    });
}

/**
 * Newsletter Form Functionality
 */
function initNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        // Formspree handles the actual submission, 
        // we just add some UI feedback if needed
        console.log('Newsletter form submission intercepted for tracking');
        
        // Show a brief notification if manager is available
        if (window.showCartNotification) {
            window.showCartNotification('Thank you for subscribing!', 'success');
        }
    });
}

/**
 * Social Sharing Functionality
 */
function initSocialSharing() {
    window.sharePost = function (title, platform) {
        const url = encodeURIComponent(window.location.href);
        const encodedTitle = encodeURIComponent(title);
        let shareUrl = '';

        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${encodedTitle}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    };
}

/**
 * Load More Posts - Placeholder for firing additional post loads
 */
const loadMoreBtn = document.getElementById('load-more-posts');
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function () {
        this.textContent = 'No more posts to show';
        this.disabled = true;
        this.style.opacity = '0.5';
        this.style.cursor = 'not-allowed';
        
        if (window.showCartNotification) {
            window.showCartNotification('All current articles are displayed.', 'info');
        }
    });
}
