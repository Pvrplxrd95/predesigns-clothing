// Blog JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize blog functionality
    initBlogFilters();
    initNewsletterForm();
    initLoadMore();
    initSocialSharing();
    initSavePosts();
});

// Blog Filters Functionality
function initBlogFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const searchFilter = document.getElementById('search-filter');
    const sortFilter = document.getElementById('sort-filter');
    const blogGrid = document.getElementById('blog-grid');
    const noResults = document.getElementById('no-results');

    // Filter posts based on category, search, and sort
    function filterPosts() {
        const categoryValue = categoryFilter.value.toLowerCase();
        const searchValue = searchFilter.value.toLowerCase();
        const sortValue = sortFilter.value;
        
        const posts = blogGrid.querySelectorAll('.blog-post-card');
        let visibleCount = 0;
        
        // Convert NodeList to Array for easier manipulation
        const postsArray = Array.from(posts);
        
        // Filter posts
        const filteredPosts = postsArray.filter(post => {
            const category = post.getAttribute('data-category') || '';
            const tags = post.getAttribute('data-tags') || '';
            const title = post.querySelector('.blog-post-title a').textContent.toLowerCase();
            const excerpt = post.querySelector('.blog-post-excerpt').textContent.toLowerCase();
            
            const categoryMatch = categoryValue === 'all' || category.includes(categoryValue);
            const searchMatch = searchValue === '' || 
                               title.includes(searchValue) || 
                               excerpt.includes(searchValue) || 
                               tags.includes(searchValue);
            
            return categoryMatch && searchMatch;
        });
        
        // Sort posts
        switch(sortValue) {
            case 'newest':
                filteredPosts.sort((a, b) => {
                    const dateA = getDateFromPost(a);
                    const dateB = getDateFromPost(b);
                    return dateB - dateA;
                });
                break;
            case 'oldest':
                filteredPosts.sort((a, b) => {
                    const dateA = getDateFromPost(a);
                    const dateB = getDateFromPost(b);
                    return dateA - dateB;
                });
                break;
            case 'popular':
                filteredPosts.sort((a, b) => {
                    const viewsA = getViewsFromPost(a);
                    const viewsB = getViewsFromPost(b);
                    return viewsB - viewsA;
                });
                break;
            case 'title':
                filteredPosts.sort((a, b) => {
                    const titleA = a.querySelector('.blog-post-title a').textContent.toLowerCase();
                    const titleB = b.querySelector('.blog-post-title a').textContent.toLowerCase();
                    return titleA.localeCompare(titleB);
                });
                break;
        }
        
        // Update DOM
        blogGrid.innerHTML = '';
        filteredPosts.forEach(post => {
            blogGrid.appendChild(post);
            post.style.display = 'block';
            visibleCount++;
        });
        
        // Show/hide no results message
        if (visibleCount === 0) {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
        }
    }
    
    function getDateFromPost(post) {
        const dateElement = post.querySelector('.blog-post-date');
        const month = dateElement.querySelector('.month').textContent;
        const day = dateElement.querySelector('.day').textContent;
        const year = new Date().getFullYear(); // Current year
        
        const monthIndex = getMonthIndex(month);
        return new Date(year, monthIndex, day);
    }
    
    function getViewsFromPost(post) {
        const viewsText = post.querySelector('.post-stats').textContent;
        const viewsMatch = viewsText.match(/(\d+(?:\.\d+)?K?)\s*views?/);
        if (!viewsMatch) return 0;
        
        const viewsStr = viewsMatch[1];
        if (viewsStr.includes('K')) {
            return parseFloat(viewsStr) * 1000;
        }
        return parseInt(viewsStr);
    }
    
    function getMonthIndex(month) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.indexOf(month);
    }
    
    // Add event listeners
    categoryFilter.addEventListener('change', filterPosts);
    searchFilter.addEventListener('input', filterPosts);
    sortFilter.addEventListener('change', filterPosts);
}

// Newsletter Form Functionality
function initNewsletterForm() {
    const form = document.getElementById('blog-newsletter-form');
    const emailInput = document.getElementById('blog-newsletter-email');
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const selectedCategories = Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.id.replace('-checkbox', ''));
        
        if (!email) {
            alert('Please enter your email address');
            return;
        }
        
        if (selectedCategories.length === 0) {
            alert('Please select at least one category');
            return;
        }
        
        // Simulate form submission
        console.log('Newsletter signup:', {
            email,
            categories: selectedCategories
        });
        
        // Show success message
        alert('Thank you for subscribing to our blog newsletter!');
        form.reset();
    });
}

// Load More Functionality
function initLoadMore() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    let currentPage = 1;
    const postsPerPage = 8;
    
    loadMoreBtn.addEventListener('click', function() {
        currentPage++;
        loadMorePosts(currentPage, postsPerPage, loadMoreBtn);
    });
}

function loadMorePosts(page, limit, loadMoreBtn) {
    // Simulate loading more posts (in a real implementation, this would fetch from a server)
    const newPosts = generateMockPosts(page, limit);
    
    if (newPosts.length === 0) {
        loadMoreBtn.style.display = 'none';
        return;
    }
    
    const blogGrid = document.getElementById('blog-grid');
    newPosts.forEach(post => {
        blogGrid.appendChild(post);
    });
}

function generateMockPosts(page, limit) {
    const posts = [];
    const startId = (page - 1) * limit + 9; // Start from ID 9 for new posts
    
    for (let i = 0; i < limit; i++) {
        const postId = startId + i;
        const post = createMockPost(postId);
        if (post) {
            posts.push(post);
        }
    }
    
    return posts;
}

function createMockPost(id) {
    const categories = ['streetwear', 'tailoring', 'lifestyle', 'trends', 'behind-the-scenes'];
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    const post = document.createElement('article');
    post.className = `blog-post-card`;
    post.setAttribute('data-category', category);
    post.setAttribute('data-tags', generateTags(category));
    
    post.innerHTML = `
        <div class="blog-post-image">
            <img src="images/blog${id % 8 + 1}.jpg" alt="Blog Post ${id}">
            <div class="blog-post-date">
                <span class="day">${Math.floor(Math.random() * 28) + 1}</span>
                <span class="month">${getRandomMonth()}</span>
            </div>
        </div>
        <div class="blog-post-content">
            <div class="blog-post-meta">
                <span class="blog-category">${category.charAt(0).toUpperCase() + category.slice(1)}</span>
                <div class="blog-post-actions">
                    <button class="share-btn" onclick="sharePost('Blog Post ${id}')">
                        <i class="fas fa-share-alt"></i>
                    </button>
                    <button class="save-btn" onclick="savePost(this)">
                        <i class="far fa-bookmark"></i>
                    </button>
                </div>
            </div>
            <h3 class="blog-post-title">
                <a href="blog-post.php?id=${id}">Blog Post ${id}: ${generateTitle(category)}</a>
            </h3>
            <p class="blog-post-excerpt">${generateExcerpt(category)}</p>
            <div class="blog-post-footer">
                <div class="read-time">
                    <i class="fas fa-clock"></i> ${Math.floor(Math.random() * 10) + 5} min read
                </div>
                <div class="post-stats">
                    <span><i class="fas fa-eye"></i> ${Math.floor(Math.random() * 2000) + 500} views</span>
                    <span><i class="fas fa-heart"></i> ${Math.floor(Math.random() * 100) + 20} likes</span>
                </div>
            </div>
        </div>
    `;
    
    return post;
}

function generateTags(category) {
    const tagSets = {
        'streetwear': ['urban', 'fashion', 'culture'],
        'tailoring': ['custom', 'fit', 'craftsmanship'],
        'lifestyle': ['sustainable', 'wardrobe', 'style'],
        'trends': ['forecast', 'colors', 'styles'],
        'behind-the-scenes': ['studio', 'design', 'process']
    };
    
    return tagSets[category] || ['fashion', 'style', 'trends'];
}

function generateTitle(category) {
    const titles = {
        'streetwear': ['Urban Fashion Evolution', 'Street Style Revolution', 'City Chic Trends'],
        'tailoring': ['Perfect Fit Guide', 'Tailoring Mastery', 'Custom Clothing Secrets'],
        'lifestyle': ['Sustainable Living', 'Wardrobe Essentials', 'Style Philosophy'],
        'trends': ['Fashion Forecast 2024', 'Color Trends', 'Style Predictions'],
        'behind-the-scenes': ['Design Process', 'Studio Tour', 'Creative Journey']
    };
    
    const categoryTitles = titles[category] || ['Fashion Insights', 'Style Tips', 'Trend Analysis'];
    return categoryTitles[Math.floor(Math.random() * categoryTitles.length)];
}

function generateExcerpt(category) {
    const excerpts = {
        'streetwear': 'Discover the latest trends in urban fashion and how streetwear is evolving globally...',
        'tailoring': 'Learn about the art of custom tailoring and what makes perfect fit so important...',
        'lifestyle': 'Explore sustainable fashion choices and build a timeless wardrobe...',
        'trends': 'Stay ahead of the curve with our expert fashion trend predictions...',
        'behind-the-scenes': 'Get an exclusive look at our design process and creative journey...'
    };
    
    return excerpts[category] || 'Read our latest insights on fashion and style...';
}

function getRandomMonth() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[Math.floor(Math.random() * months.length)];
}

// Social Sharing Functionality
function initSocialSharing() {
    // This would integrate with actual social media APIs in a real implementation
    console.log('Social sharing initialized');
}

function sharePost(title) {
    const url = window.location.href;
    const text = `Check out this article: ${title}`;
    
    // Try to use Web Share API if available
    if (navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: url
        }).then(() => {
            console.log('Shared successfully');
        }).catch((error) => {
            console.log('Error sharing:', error);
            fallbackShare(title, url);
        });
    } else {
        fallbackShare(title, url);
    }
}

function fallbackShare(title, url) {
    // Fallback to opening social media shares in new windows
    const socialShares = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };
    
    // Open Twitter share by default
    window.open(socialShares.twitter, '_blank', 'width=600,height=400');
}

// Save Posts Functionality
function initSavePosts() {
    // Check for saved posts in localStorage
    const savedPosts = JSON.parse(localStorage.getItem('savedBlogPosts') || '[]');
    
    // Update save button states
    const saveButtons = document.querySelectorAll('.save-btn');
    saveButtons.forEach(button => {
        const postId = getPostIdFromButton(button);
        if (savedPosts.includes(postId)) {
            button.innerHTML = '<i class="fas fa-bookmark"></i>';
            button.classList.add('saved');
        }
    });
}

function savePost(button) {
    const postId = getPostIdFromButton(button);
    let savedPosts = JSON.parse(localStorage.getItem('savedBlogPosts') || '[]');
    
    if (savedPosts.includes(postId)) {
        // Remove from saved
        savedPosts = savedPosts.filter(id => id !== postId);
        button.innerHTML = '<i class="far fa-bookmark"></i>';
        button.classList.remove('saved');
        alert('Post removed from bookmarks');
    } else {
        // Add to saved
        savedPosts.push(postId);
        button.innerHTML = '<i class="fas fa-bookmark"></i>';
        button.classList.add('saved');
        alert('Post saved to bookmarks');
    }
    
    // Save to localStorage
    localStorage.setItem('savedBlogPosts', JSON.stringify(savedPosts));
}

function getPostIdFromButton(button) {
    // Get the post ID from the href of the title link
    const postCard = button.closest('.blog-post-card');
    const titleLink = postCard.querySelector('.blog-post-title a');
    const href = titleLink.getAttribute('href');
    
    // Extract ID from href (e.g., "blog-post.html?id=1" -> "1")
    const match = href.match(/id=(\d+)/);
    return match ? match[1] : href;
}

// Tag Cloud Functionality
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('tag')) {
        e.preventDefault();
        const tag = e.target.textContent.toLowerCase();
        const searchFilter = document.getElementById('search-filter');
        searchFilter.value = tag;
        searchFilter.dispatchEvent(new Event('input'));
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Back to top functionality
const backToTop = document.querySelector('.back-to-top');
if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });
    
    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
