/**
 * Firestore-based Comments System for Predesigns Clothing
 * Replaces the legacy PHP/SQL comment system.
 */

document.addEventListener('DOMContentLoaded', function () {
    // Wait for Firebase to be ready before initializing
    const checkFirebase = setInterval(() => {
        if (window.firebaseManager && window.firebaseManager.isReady()) {
            clearInterval(checkFirebase);
            initComments();
        }
    }, 100);
});

function initComments() {
    const commentForm = document.getElementById('comment-form');

    // Load comments when page loads
    loadComments();

    // Monitor auth state to update form
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            showCommentForm(user);
        } else {
            showLoginRequiredMessage();
        }
    });

    // Handle form submission via delegation
    document.addEventListener('submit', function (e) {
        if (e.target.id === 'comment-form') {
            e.preventDefault();
            submitComment();
        }
    });
}

// Show comment form for logged in users
function showCommentForm(user) {
    const container = document.getElementById('comment-form-container') ||
        document.querySelector('.comment-form-section');
    if (container) {
        container.innerHTML = `
            <h4>Leave a Comment</h4>
            <div class="user-info-small">
                <img src="${user.photoURL || 'images/avatar-placeholder.jpg'}" alt="${user.displayName}" class="user-avatar-tiny">
                <span>Posting as <strong>${user.displayName || user.email.split('@')[0]}</strong></span>
            </div>
            <form id="comment-form">
                <div class="form-group">
                    <textarea id="comment-content" name="content" placeholder="Share your thoughts..." rows="4" required></textarea>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Post Comment</button>
                    <button type="button" class="btn btn-link" onclick="authManager.logout()">Logout</button>
                </div>
            </form>
        `;
    }
}

// Show login required message
function showLoginRequiredMessage() {
    const container = document.getElementById('comment-form-container') ||
        document.querySelector('.comment-form-section');
    if (container) {
        container.innerHTML = `
            <div class="login-prompt">
                <h4>Join the Conversation</h4>
                <p>Please sign in to share your thoughts on this post.</p>
                <button class="btn btn-primary" onclick="authManager.openAuthModal('login')">Sign In</button>
                <button class="btn btn-secondary" onclick="authManager.openAuthModal('register')">Create Account</button>
            </div>
        `;
    }
}

// Load comments from Firestore
async function loadComments() {
    const postId = getBlogPostId();
    const commentsList = document.querySelector('.comments-list') ||
        document.getElementById('comments-list');

    if (!commentsList) return;

    try {
        // Query Firestore for comments for this post
        const snapshot = await firebase.firestore().collection('comments')
            .where('postId', '==', postId)
            .orderBy('createdAt', 'desc')
            .limit(50)
            .get();

        const comments = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            comments.push({
                id: doc.id,
                ...data,
                date: data.createdAt ? data.createdAt.toDate() : new Date()
            });
        });

        displayComments(comments);
        updateCommentCount(comments.length);
    } catch (error) {
        console.error('Error loading comments:', error);
        // If index is missing, it might fail first time
        if (error.code === 'failed-precondition') {
            console.warn('Firestore index required for comments sorting.');
        }
        displayComments([]);
        updateCommentCount(0);
    }
}

// Display comments in the UI
function displayComments(comments) {
    const commentsList = document.querySelector('.comments-list') ||
        document.getElementById('comments-list');

    if (!commentsList) return;

    if (comments.length === 0) {
        commentsList.innerHTML = '<div class="no-comments">No comments yet. Be the first to share your thoughts!</div>';
        return;
    }

    const commentsHTML = comments.map(comment => `
        <div class="comment" id="comment-${comment.id}">
            <div class="comment-avatar">
                <img src="${comment.userAvatar || 'images/avatar-placeholder.jpg'}" alt="${comment.userName}">
            </div>
            <div class="comment-body">
                <div class="comment-header">
                    <span class="comment-author">${comment.userName}</span>
                    <span class="comment-date">${formatBlogDate(comment.date, true)}</span>
                </div>
                <div class="comment-content">
                    <p>${sanitizeHTML(comment.content)}</p>
                </div>
            </div>
        </div>
    `).join('');

    commentsList.innerHTML = commentsHTML;
}

// Update the visible comment count
function updateCommentCount(count) {
    const commentCountElements = document.querySelectorAll('.comment-count, #comment-count');
    commentCountElements.forEach(el => {
        el.textContent = count;
    });
}

// Submit a new comment to Firestore
async function submitComment() {
    const user = firebase.auth().currentUser;
    if (!user) {
        alert('You must be logged in to post a comment.');
        authManager.openAuthModal('login');
        return;
    }

    const commentContent = document.getElementById('comment-content');
    const content = commentContent.value.trim();
    const postId = getBlogPostId();

    if (!content) {
        return;
    }

    // Disable form to prevent double submission
    const submitBtn = document.querySelector('#comment-form .btn-primary');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Posting...';
    }

    try {
        // Add to Firestore
        await firebase.firestore().collection('comments').add({
            postId: postId,
            userId: user.uid,
            userName: user.displayName || user.email.split('@')[0],
            userAvatar: user.photoURL || 'images/avatar-placeholder.jpg',
            content: content,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Clear the form
        commentContent.value = '';

        // Reload comments
        await loadComments();

        // Success notification
        if (window.showMessage) {
            window.showMessage('Comment posted successfully!', 'success');
        } else {
            alert('Comment posted successfully!');
        }
    } catch (error) {
        console.error('Error submitting comment:', error);
        alert('Failed to post comment. Please try again.');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Post Comment';
        }
    }
}
