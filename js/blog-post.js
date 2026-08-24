// Blog Post JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize blog post functionality
    console.log('Blog post page loaded');
    
    // Load comments when page loads
    loadComments();
    
    // Check if user is logged in and show appropriate form
    checkLoginStatus();
    
    // Add event listener for comment form submission
    document.getElementById('comment-form-container').addEventListener('submit', function(e) {
        e.preventDefault();
        submitComment();
    });
});

// Function to load comments from server
function loadComments() {
    fetch('comments.php?action=get_comments&post_id=' + getPostId())
        .then(response => response.json())
        .then(data => {
            displayComments(data.comments);
            updateCommentCount(data.comments.length);
        })
        .catch(error => {
            console.error('Error loading comments:', error);
        });
}

// Function to display comments
function displayComments(comments) {
    const commentsList = document.getElementById('comments-list');
    
    if (comments.length === 0) {
        commentsList.innerHTML = '<div class="no-comments">No comments yet. Be the first to share your thoughts!</div>';
        return;
    }
    
    const commentsHTML = comments.map(comment => `
        <div class="comment">
            <div class="comment-avatar">
                <img src="${comment.avatar || 'images/avatar-placeholder.jpg'}" alt="${comment.username} Avatar">
            </div>
            <div class="comment-content">
                <div class="comment-header">
                    <h4>${comment.username}</h4>
                    <span class="comment-date">${formatDate(comment.created_at)}</span>
                </div>
                <p>${comment.content}</p>
                <div class="comment-actions">
                    <button onclick="likeComment(this)" data-comment-id="${comment.id}">
                        <i class="far fa-heart"></i> Like (${comment.likes || 0})
                    </button>
                    <button onclick="replyToComment(this)" data-comment-id="${comment.id}">
                        <i class="fas fa-reply"></i> Reply
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    commentsList.innerHTML = commentsHTML;
}

// Function to update comment count
function updateCommentCount(count) {
    document.getElementById('comment-count').textContent = count;
}

// Function to check if user is logged in
function checkLoginStatus() {
    fetch('auth.php?action=check_session')
        .then(response => response.json())
        .then(data => {
            if (data.logged_in) {
                showCommentForm(data.user);
            } else {
                showLoginRequiredMessage();
            }
        })
        .catch(error => {
            console.error('Error checking login status:', error);
            showLoginRequiredMessage();
        });
}

// Function to show comment form for logged in users
function showCommentForm(user) {
    const container = document.getElementById('comment-form-container');
    container.innerHTML = `
        <form id="comment-form">
            <div class="form-group">
                <textarea id="comment-text" name="comment" placeholder="Share your thoughts..." rows="4" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Post Comment</button>
        </form>
    `;
}

// Function to show login required message
function showLoginRequiredMessage() {
    const container = document.getElementById('comment-form-container');
    container.innerHTML = `
        <div class="login-required">
            <p>Please <a href="login.html">login</a> or <a href="register.html">register</a> to leave a comment.</p>
        </div>
    `;
}

// Function to submit a new comment
function submitComment() {
    const commentText = document.getElementById('comment-text').value.trim();
    
    if (!commentText) {
        alert('Please enter your comment');
        return;
    }
    
    const formData = new FormData();
    formData.append('action', 'add_comment');
    formData.append('post_id', getPostId());
    formData.append('content', commentText);
    
    fetch('comments.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Clear the form
            document.getElementById('comment-text').value = '';
            // Reload comments
            loadComments();
            alert('Comment posted successfully!');
        } else {
            alert('Error posting comment: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error submitting comment:', error);
        alert('An error occurred while posting your comment');
    });
}

// Function to get current post ID
function getPostId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || '1'; // Default to post 1 if no ID specified
}

// Function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Like comment functionality (existing functionality)
function likeComment(button) {
    const heartIcon = button.querySelector('i');
    const commentId = button.getAttribute('data-comment-id');
    
    // Toggle like state
    if (heartIcon.classList.contains('far')) {
        heartIcon.classList.remove('far');
        heartIcon.classList.add('fas');
        heartIcon.style.color = '#6A0DAD';
        
        // Update like count
        const currentCount = parseInt(button.textContent.match(/\d+/)?.[0] || '0');
        button.innerHTML = button.innerHTML.replace(/\d+/, currentCount + 1);
        
        // Save to server
        saveLikeToServer(commentId, true);
    } else {
        heartIcon.classList.remove('fas');
        heartIcon.classList.add('far');
        heartIcon.style.color = '';
        
        // Update like count
        const currentCount = parseInt(button.textContent.match(/\d+/)?.[0] || '1');
        button.innerHTML = button.innerHTML.replace(/\d+/, Math.max(0, currentCount - 1));
        
        // Remove from server
        saveLikeToServer(commentId, false);
    }
}

// Function to save like to server
function saveLikeToServer(commentId, isLiked) {
    const formData = new FormData();
    formData.append('action', 'toggle_like');
    formData.append('comment_id', commentId);
    formData.append('like', isLiked ? '1' : '0');
    
    fetch('comments.php', {
        method: 'POST',
        body: formData
    }).catch(error => {
        console.error('Error saving like:', error);
    });
}

// Reply to comment functionality (existing functionality)
function replyToComment(button) {
    const comment = button.closest('.comment');
    const replyForm = comment.querySelector('.reply-form');
    
    if (replyForm) {
        replyForm.remove();
        return;
    }
    
    const replyFormElement = document.createElement('div');
    replyFormElement.className = 'reply-form';
    replyFormElement.innerHTML = `
        <div class="form-group">
            <textarea placeholder="Write your reply..." rows="3" required></textarea>
        </div>
        <button type="submit" class="btn btn-secondary" onclick="submitReply(this)">Post Reply</button>
    `;
    
    comment.appendChild(replyFormElement);
}

// Function to submit reply
function submitReply(button) {
    const replyForm = button.closest('.reply-form');
    const replyText = replyForm.querySelector('textarea').value.trim();
    
    if (!replyText) {
        alert('Please enter your reply');
        return;
    }
    
    alert('Reply functionality coming soon!');
    replyForm.remove();
}

// Newsletter subscription for blog post page (existing functionality)
document.addEventListener('submit', function(e) {
    if (e.target.classList.contains('sidebar-newsletter-form') || 
        e.target.id === 'blog-newsletter-form') {
        const emailInput = e.target.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (!email) {
            e.preventDefault();
            alert('Please enter your email address');
            return;
        }
        
        if (!isValidEmail(email)) {
            e.preventDefault();
            alert('Please enter a valid email address');
            return;
        }
        
        alert('Thank you for subscribing to our blog!');
    }
});

// Helper function to validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Back to top functionality (existing functionality)
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

// Load post content based on URL parameters (existing functionality)
function initLoadPostContent() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    
    if (postId) {
        loadPostById(postId);
    } else {
        loadDefaultPost();
    }
}

function loadPostById(postId) {
    console.log('Loading post with ID:', postId);
}

function loadDefaultPost() {
    console.log('Loading default post content');
}
