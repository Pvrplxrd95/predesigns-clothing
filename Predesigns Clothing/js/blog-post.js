// Blog Post JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeCommonBlogPostFeatures();

    // Initialize blog post functionality
    console.log('Blog post page loaded');
    
    // The comment functionality is now handled by comments.js
    // This file contains additional blog-specific functionality
});

function initializeCommonBlogPostFeatures() {
    if (typeof initPreloader === 'function') {
        initPreloader();
    }

    if (typeof initNavigation === 'function') {
        initNavigation();
    }

    if (typeof initMobileMenu === 'function') {
        initMobileMenu();
    }

    if (typeof initSmoothScrolling === 'function') {
        initSmoothScrolling();
    }
}


// Like comment functionality
function likeComment(button) {
    const heartIcon = button.querySelector('i');
    const commentId = button.getAttribute('data-comment-id');
    
    // Check if user is logged in
    if (!isUserLoggedIn()) {
        alert('You must be logged in to like a comment.');
        return;
    }
    
    // Toggle like state temporarily
    if (heartIcon.classList.contains('far')) {
        heartIcon.classList.remove('far');
        heartIcon.classList.add('fas');
        heartIcon.style.color = '#6A0DAD';
        
        // Update like count
        const currentCount = parseInt(button.textContent.match(/\d+/)?.[0] || '0');
        button.innerHTML = button.innerHTML.replace(/\d+/, currentCount + 1);
        
        // Save to server
        saveLikeToServer(commentId, true, button);
    } else {
        heartIcon.classList.remove('fas');
        heartIcon.classList.add('far');
        heartIcon.style.color = '';
        
        // Update like count
        const currentCount = parseInt(button.textContent.match(/\d+/)?.[0] || '1');
        button.innerHTML = button.innerHTML.replace(/\d+/, Math.max(0, currentCount - 1));
        
        // Remove from server
        saveLikeToServer(commentId, false, button);
    }
}

// Function to save like to server
function saveLikeToServer(commentId, isLiked, button) {
    const formData = new FormData();
    formData.append('op', 'like');
    formData.append('comment_id', commentId);
    
    fetch('comments.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Update the button with the actual server count
            if (button) {
                const heartIcon = button.querySelector('i');
                const currentCount = data.likes || 0;
                button.innerHTML = button.innerHTML.replace(/\d+/, currentCount);
            }
        } else {
            // Revert the like if server update failed
            revertLikeState(button);
            alert('Error updating like: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error saving like:', error);
        revertLikeState(button);
        alert('An error occurred while updating the like');
    });
}

// Function to check if user is logged in
function isUserLoggedIn() {
    // This would check the session - for now we'll assume user is logged in
    // In a real implementation, you'd check the PHP session
    return true;
}

// Function to revert like state if server update fails
function revertLikeState(button) {
    const heartIcon = button.querySelector('i');
    if (heartIcon.classList.contains('fas')) {
        heartIcon.classList.remove('fas');
        heartIcon.classList.add('far');
        heartIcon.style.color = '';
    } else {
        heartIcon.classList.remove('far');
        heartIcon.classList.add('fas');
        heartIcon.style.color = '#6A0DAD';
    }
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

// Newsletter subscription for blog post page
document.addEventListener('submit', function(e) {
    if (e.target.classList.contains('sidebar-newsletter-form') || 
        e.target.id === 'blog-newsletter-form') {
        e.preventDefault();
        const emailInput = e.target.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (!email) {
            alert('Please enter your email address');
            return;
        }
        
        if (!isValidEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        subscribeToNewsletter(email, e.target);
    }
});

// Function to subscribe to newsletter
function subscribeToNewsletter(email, form) {
    const formData = new FormData();
    formData.append('email', email);
    
    fetch('newsletter.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Show success message
            showNewsletterSuccessMessage(form, data.message);
            // Clear the form
            form.reset();
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error subscribing to newsletter:', error);
        alert('An error occurred while processing your subscription');
    });
}

// Function to show success message for newsletter
function showNewsletterSuccessMessage(form, message) {
    // Find the form container
    const container = form.closest('.sidebar-widget') || form.closest('.newsletter-form');
    if (container) {
        const successMessage = document.createElement('div');
        successMessage.className = 'newsletter-success';
        successMessage.textContent = message;
        container.appendChild(successMessage);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    }
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
