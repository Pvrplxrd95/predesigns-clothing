// Giscus Comment System Integration for Predesigns Clothing
// Replaces PHP/SQL comment system with modern GitHub-backed Giscus integration

class GiscusComments {
    constructor() {
        this.repo = 'Pvrplxrd95/PredesignsClothingWebsite'; // Replace with your actual repo
        this.repoId = 'R_kgDOJ4Q6Lw'; // Replace with your actual repo ID
        this.category = 'General'; // Replace with your actual category
        this.categoryId = 'DIC_kwDOJ4Q6L84CTEa5'; // Replace with your actual category ID
        this.mapping = 'pathname';
        this.strict = '0';
        this.reactionsEnabled = '1';
        this.emitMetadata = '0';
        this.inputPosition = 'top';
        this.theme = 'light';
        this.lang = 'en';
        this.loading = 'lazy';
        
        this.currentPostId = null;
        this.isInitialized = false;
        this.init();
    }

    init() {
        // Check if we're on a blog post page
        this.currentPostId = this.getCurrentPostId();
        
        if (this.currentPostId) {
            this.loadGiscusScript();
            this.setupThemeObserver();
        }
    }

    getCurrentPostId() {
        // Get post ID from URL or data attribute
        const path = window.location.pathname;
        const hash = window.location.hash;
        
        // Try to extract post ID from various sources
        let post_id = null;
        
        // 1. From URL path (e.g., /blog-post.html#art-of-perfect-fit)
        if (hash) {
            post_id = hash.replace('#', '');
        }
        
        // 2. From data attribute on comment container
        const commentContainer = document.querySelector('[data-comment-container]');
        if (commentContainer && commentContainer.dataset.postId) {
            post_id = commentContainer.dataset.postId;
        }
        
        // 3. From URL pathname
        if (!post_id && path.includes('blog-post')) {
            post_id = 'art-of-perfect-fit'; // Default for blog-post.html
        }
        
        return post_id || 'general';
    }

    loadGiscusScript() {
        // Check if Giscus script is already loaded
        if (document.querySelector('script[src="https://giscus.app/client.js"]')) {
            this.initializeGiscus();
            return;
        }

        // Load Giscus script
        const script = document.createElement('script');
        script.src = 'https://giscus.app/client.js';
        script.setAttribute('data-repo', this.repo);
        script.setAttribute('data-repo-id', this.repoId);
        script.setAttribute('data-category', this.category);
        script.setAttribute('data-category-id', this.categoryId);
        script.setAttribute('data-mapping', this.mapping);
        script.setAttribute('data-strict', this.strict);
        script.setAttribute('data-reactions-enabled', this.reactionsEnabled);
        script.setAttribute('data-emit-metadata', this.emitMetadata);
        script.setAttribute('data-input-position', this.inputPosition);
        script.setAttribute('data-theme', this.theme);
        script.setAttribute('data-lang', this.lang);
        script.setAttribute('data-loading', this.loading);
        script.crossorigin = 'anonymous';
        script.async = true;
        
        script.onload = () => {
            this.isInitialized = true;
            this.initializeGiscus();
        };
        
        script.onerror = () => {
            console.error('Failed to load Giscus script');
            this.showFallbackComments();
        };
        
        document.head.appendChild(script);
    }

    initializeGiscus() {
        if (!this.isInitialized) return;
        
        // Create Giscus container
        const container = this.getOrCreateContainer();
        
        // Clear existing content
        container.innerHTML = '';
        
        // Create Giscus iframe
        const iframe = document.createElement('iframe');
        iframe.src = this.buildGiscusURL();
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.style.minHeight = '300px';
        iframe.loading = 'lazy';
        
        container.appendChild(iframe);
        
        // Update comment count
        this.updateCommentCount();
    }

    buildGiscusURL() {
        const params = new URLSearchParams({
            repo: this.repo,
            repoId: this.repoId,
            category: this.category,
            categoryId: this.categoryId,
            mapping: this.mapping,
            strict: this.strict,
            reactionsEnabled: this.reactionsEnabled,
            emitMetadata: this.emitMetadata,
            inputPosition: this.inputPosition,
            theme: this.theme,
            lang: this.lang,
            loading: this.loading
        });

        // For pathname mapping, we need to set the discussion number dynamically
        // This will be handled by the Giscus client based on the current URL
        return `https://giscus.app?${params.toString()}`;
    }

    getOrCreateContainer() {
        let container = document.querySelector('[data-comment-container]');
        
        if (!container) {
            // Create container if it doesn't exist
            container = document.createElement('div');
            container.dataset.commentContainer = '';
            container.className = 'giscus-container';
            
            // Find a suitable location to insert the container
            const targetElement = document.querySelector('.blog-content') || 
                                 document.querySelector('.main-content') || 
                                 document.querySelector('main') || 
                                 document.body;
            
            if (targetElement) {
                targetElement.appendChild(container);
            }
        }
        
        return container;
    }

    setupThemeObserver() {
        // Observe theme changes and update Giscus accordingly
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    this.updateTheme();
                }
            });
        });

        // Observe body for theme changes
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        // Also observe for prefers-color-scheme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', () => {
            this.updateTheme();
        });
    }

    updateTheme() {
        // Get current theme
        const isDark = document.body.getAttribute('data-theme') === 'dark' || 
                      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        this.theme = isDark ? 'dark' : 'light';
        
        // Post message to Giscus iframe to update theme
        this.postMessageToGiscus({
            giscus: {
                setConfig: {
                    theme: this.theme
                }
            }
        });
    }

    postMessageToGiscus(message) {
        const iframe = document.querySelector('iframe[src*="giscus.app"]');
        if (iframe) {
            iframe.contentWindow.postMessage({ giscus: message }, 'https://giscus.app');
        }
    }

    updateCommentCount() {
        // Get comment count from Giscus
        this.postMessageToGiscus({
            giscus: {
                getCommentCount: {}
            }
        });

        // Update local comment count display
        const countElement = document.querySelector('[data-comment-count]');
        if (countElement) {
            // This would be updated via Giscus message events in a real implementation
            countElement.textContent = 'Loading...';
        }
    }

    showFallbackComments() {
        const container = this.getOrCreateContainer();
        
        container.innerHTML = `
            <div class="comments-fallback">
                <div class="comments-header">
                    <h3>Comments</h3>
                    <p class="comments-subtitle">Comments are currently unavailable. Please check back later.</p>
                </div>
                <div class="comments-info">
                    <p>Unable to load the comment system. This could be due to:</p>
                    <ul>
                        <li>Network connectivity issues</li>
                        <li>Browser privacy settings blocking third-party content</li>
                        <li>Ad blockers preventing the comment system from loading</li>
                    </ul>
                    <p>For support or to share feedback, please <a href="#contact">contact us</a> directly.</p>
                </div>
            </div>
        `;
    }

    // Legacy compatibility methods for existing PHP comment system
    // These provide fallback functionality if Giscus is not available

    async getComments(post_id = null) {
        const postId = post_id || this.currentPostId;
        
        try {
            // Try to get comments from Giscus first
            const giscusComments = await this.getGiscusComments(postId);
            if (giscusComments) {
                return {
                    success: true,
                    comments: giscusComments,
                    count: giscusComments.length
                };
            }
        } catch (error) {
            console.warn('Giscus comments not available:', error);
        }

        // Fallback: return empty comments array (legacy PHP system removed)
        return {
            success: true,
            comments: [],
            count: 0,
            message: 'Comments system is being updated. Please check back soon.'
        };
    }

    async addComment(content, parent_id = null) {
        // Check if user is authenticated
        if (!this.isUserAuthenticated()) {
            throw new Error('You must be logged in to post a comment.');
        }

        // Validate content
        if (!content || content.trim().length < 5) {
            throw new Error('Comment must be at least 5 characters long.');
        }

        if (content.trim().length > 1000) {
            throw new Error('Comment cannot exceed 1000 characters.');
        }

        try {
            // Post to Giscus
            const result = await this.postToGiscus(content, parent_id);
            return {
                success: true,
                message: 'Comment posted successfully!',
                comment: result
            };
        } catch (error) {
            throw new Error('Failed to post comment. Please try again later.');
        }
    }

    async likeComment(comment_id) {
        if (!this.isUserAuthenticated()) {
            throw new Error('You must be logged in to like a comment.');
        }

        try {
            // Like comment in Giscus
            const result = await this.likeGiscusComment(comment_id);
            return {
                success: true,
                message: 'Comment liked!',
                likes: result.likes
            };
        } catch (error) {
            throw new Error('Failed to like comment. Please try again later.');
        }
    }

    async deleteComment(comment_id) {
        if (!this.isUserAuthenticated()) {
            throw new Error('You must be logged in to delete a comment.');
        }

        try {
            // Delete comment in Giscus
            await this.deleteGiscusComment(comment_id);
            return {
                success: true,
                message: 'Comment deleted successfully!'
            };
        } catch (error) {
            throw new Error('Failed to delete comment. Please try again later.');
        }
    }

    // Helper methods
    isUserAuthenticated() {
        // Check if user is logged in via our modern auth system
        return typeof authManager !== 'undefined' && 
               authManager.currentUser !== null;
    }

    async getGiscusComments(postId) {
        // In a real implementation, this would interact with Giscus API
        // For now, return null to trigger fallback
        return null;
    }

    async postToGiscus(content, parent_id) {
        // In a real implementation, this would post to Giscus
        // For now, throw an error to show fallback behavior
        throw new Error('Giscus integration is being configured.');
    }

    async likeGiscusComment(comment_id) {
        // In a real implementation, this would like a Giscus comment
        throw new Error('Giscus integration is being configured.');
    }

    async deleteGiscusComment(comment_id) {
        // In a real implementation, this would delete a Giscus comment
        throw new Error('Giscus integration is being configured.');
    }
}

// Initialize Giscus comments
const giscusComments = new GiscusComments();

// Make available globally for legacy compatibility
window.giscusComments = giscusComments;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GiscusComments;
}
