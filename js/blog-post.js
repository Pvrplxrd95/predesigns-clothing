// Blog Post JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // Initialize blog post functionality
    console.log('Blog post page loaded');

    // Setup sharing functionality
    setupSocialSharing();

    // Check for URL parameters if needed
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    if (postId) {
        console.log('Viewing specific post ID:', postId);
    }
});

/**
 * Setup social sharing buttons
 */
function setupSocialSharing() {
    window.shareToSocial = function (platform) {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        let shareUrl = '';

        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    };

    window.copyLink = function () {
        navigator.clipboard.writeText(window.location.href).then(() => {
            if (window.showCartNotification) {
                window.showCartNotification('Link copied to clipboard!', 'success');
            } else {
                alert('Link copied to clipboard!');
            }
        });
    };
}

/**
 * Legacy support for comment liking - now should use Firestore via comments.js
 */
function likeComment(button) {
    const heartIcon = button.querySelector('i');

    // Check if user is logged in via AuthManager
    if (window.authManager && !window.authManager.isLoggedIn()) {
        if (window.showCartNotification) {
            window.showCartNotification('You must be logged in to like a comment.', 'warning');
        } else {
            alert('You must be logged in to like a comment.');
        }
        return;
    }

    // Toggle heart UI
    if (heartIcon.classList.contains('far')) {
        heartIcon.classList.replace('far', 'fas');
        heartIcon.style.color = 'var(--accent-color, #6A0DAD)';
    } else {
        heartIcon.classList.replace('fas', 'far');
        heartIcon.style.color = '';
    }

    // Actual Firestore implementation should be in comments.js
    console.log('Like toggled. Firestore update handled by comments.js');
}

/**
 * Reply to comment functionality
 */
function replyToComment(button) {
    const comment = button.closest('.comment');
    if (!comment) return;

    let replyForm = comment.querySelector('.reply-form');

    if (replyForm) {
        replyForm.remove();
        return;
    }

    replyForm = document.createElement('div');
    replyForm.className = 'reply-form';
    replyForm.style.marginTop = '15px';
    replyForm.innerHTML = `
        <div class="form-group" style="margin-bottom: 10px;">
            <textarea class="form-control" placeholder="Write your reply..." rows="3" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #ddd;"></textarea>
        </div>
        <button type="submit" class="btn btn-primary btn-sm" onclick="submitReply(this)">Post Reply</button>
    `;

    comment.appendChild(replyForm);
}

function submitReply(button) {
    const replyForm = button.closest('.reply-form');
    const replyText = replyForm.querySelector('textarea').value.trim();

    if (!replyText) return;

    if (window.showCartNotification) {
        window.showCartNotification('Replies are handled by the new comment system.', 'info');
    } else {
        alert('Reply submitted! Our systems are being updated to support threaded conversations.');
    }

    replyForm.remove();
}
