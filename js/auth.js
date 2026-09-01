// Client-Side Authentication System for Predesigns Clothing
// Replaces PHP/SQL authentication with modern client-side solution

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.sessionTimeout = 3600000; // 1 hour in milliseconds
        this.init();
    }

    init() {
        // Monitor Firebase auth state
        this.monitorAuthState();

        // Set up event listeners for auth modals
        this.setupAuthModals();

        // Set up tab switching (once, not per modal open)
        this.setupTabSwitching();

        // Initialize Google Sign-In
        this.initializeGoogleSignIn();

        // Set up session timeout monitoring (now handled by Firebase persistence)
        // this.setupSessionTimeout();
    }

    // Monitor Firebase auth state
    monitorAuthState() {
        if (!window.firebaseManager || !window.firebaseManager.isReady()) {
            console.warn('AuthManager: Firebase not ready, monitoring disabled');
            return;
        }

        firebase.auth().onAuthStateChanged((firebaseUser) => {
            if (firebaseUser) {
                console.log('AuthManager: User is signed in', firebaseUser.uid);

                // Map Firebase user to app user
                const user = {
                    id: firebaseUser.uid,
                    fullname: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                    email: firebaseUser.email,
                    avatar: firebaseUser.photoURL || 'images/avatar-placeholder.jpg',
                    role: 'customer', // Default role
                    provider: firebaseUser.providerData[0]?.providerId || 'local'
                };

                this.currentUser = user;
                this.updateAuthUI(user);

                // Sync with localStorage for compatibility with non-firebase modules
                localStorage.setItem('predesigns_user', JSON.stringify(user));
            } else {
                console.log('AuthManager: No user signed in');
                this.currentUser = null;
                this.updateAuthUI(null);
                localStorage.removeItem('predesigns_user');
                localStorage.removeItem('predesigns_session');
            }
        });
    }

    // checkSession is now handled by monitorAuthState

    // Set up auth modals
    setupAuthModals() {
        // Add event listeners for auth buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action="open-login"]') ||
                e.target.closest('[data-action="open-login"]')) {
                e.preventDefault();
                this.openAuthModal('login');
            }

            if (e.target.matches('[data-action="open-register"]') ||
                e.target.closest('[data-action="open-register"]')) {
                e.preventDefault();
                this.openAuthModal('register');
            }
        });
    }

    // Initialize Google Sign-In
    initializeGoogleSignIn() {
        // Add Google Identity Services script
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => this.setupGoogleSignIn();
        document.head.appendChild(script);
    }

    setupGoogleSignIn() {
        if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
            const clientId = ENV.firebase.googleClientId || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
            google.accounts.id.initialize({
                client_id: clientId,
                callback: (response) => this.handleGoogleCallback(response)
            });
        }
    }

    // Handle Google Sign-In callback
    async handleGoogleCallback(response) {
        try {
            if (!window.firebaseManager || !window.firebaseManager.isReady()) {
                throw new Error('Firebase not initialized');
            }

            const credential = firebase.auth.GoogleAuthProvider.credential(response.credential);
            await firebase.auth().signInWithCredential(credential);

            this.closeAuthModal();
        } catch (error) {
            console.error('Google Sign-In error:', error);
            this.showMessage('Google Sign-In failed. Please try again.', 'error');
        }
    }


    // Open auth modal
    openAuthModal(activeTab = 'login') {
        // Remove existing modal if any
        this.closeAuthModal();

        const modal = document.createElement('div');
        modal.className = 'auth-modal';
        modal.innerHTML = this.getAuthModalHTML(activeTab);

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        // Set up form event listeners
        this.setupFormListeners();

        // Initialize Google Sign-In in modal
        this.renderGoogleButton();
    }

    // Render Google Sign-In button
    renderGoogleButton() {
        if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
            const btnContainer = document.getElementById('google-signin-btn');
            if (btnContainer) {
                google.accounts.id.renderButton(
                    btnContainer,
                    { theme: 'outline', size: 'large', type: 'standard' }
                );
            }
        }
    }

    // Get auth modal HTML
    getAuthModalHTML(activeTab) {
        return `
            <div class="modal-content">
                <span class="modal-close" onclick="authManager.closeAuthModal()">&times;</span>
                <div class="auth-tabs">
                    <button class="tab-btn ${activeTab === 'login' ? 'active' : ''}" 
                            data-action="switch-to-login">Sign In</button>
                    <button class="tab-btn ${activeTab === 'register' ? 'active' : ''}" 
                            data-action="switch-to-register">Sign Up</button>
                </div>
                
                <div id="auth-content">
                    ${activeTab === 'login' ? this.getLoginFormHTML() : this.getRegisterFormHTML()}
                </div>
            </div>
        `;
    }

    // Get login form HTML only
    getLoginFormHTML() {
        return `
            <form id="auth-login-form" class="auth-form">
                <h3>Sign In to Your Account</h3>
                <div class="form-group">
                    <input type="email" name="email" placeholder="Email Address" required>
                </div>
                <div class="form-group">
                    <input type="password" name="password" placeholder="Password" required>
                </div>
                <button type="submit" class="btn btn-primary">Sign In</button>
                
                <div class="google-signin-container">
                    <div id="google-signin-btn"></div>
                </div>
                
                <p class="auth-switch">
                    Don't have an account? 
                    <a href="#" data-action="switch-to-register">Sign Up</a>
                </p>
            </form>
        `;
    }

    // Get register form HTML only
    getRegisterFormHTML() {
        return `
            <form id="auth-register-form" class="auth-form">
                <h3>Create New Account</h3>
                <div class="form-group">
                    <input type="text" name="fullname" placeholder="Full Name" required>
                </div>
                <div class="form-group">
                    <input type="email" name="email" placeholder="Email Address" required>
                </div>
                <div class="form-group">
                    <input type="password" name="password" placeholder="Password" required>
                </div>
                <div class="form-group">
                    <input type="password" name="confirm_password" placeholder="Confirm Password" required>
                </div>
                <button type="submit" class="btn btn-primary">Sign Up</button>
                
                <div class="google-signin-container">
                    <div id="google-signin-btn"></div>
                </div>
                
                <p class="auth-switch">
                    Already have an account? 
                    <a href="#" data-action="switch-to-login">Sign In</a>
                </p>
            </form>
        `;
    }

    // Set up form listeners
    setupFormListeners() {
        // Login form
        const loginForm = document.getElementById('auth-login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(new FormData(loginForm));
            });
        }

        // Register form
        const registerForm = document.getElementById('auth-register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister(new FormData(registerForm));
            });
        }
    }

    // Set up tab switching (called once)
    setupTabSwitching() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action="switch-to-login"]') ||
                e.target.closest('[data-action="switch-to-login"]')) {
                e.preventDefault();
                this.showLoginTab();
            }

            if (e.target.matches('[data-action="switch-to-register"]') ||
                e.target.closest('[data-action="switch-to-register"]')) {
                e.preventDefault();
                this.showRegisterTab();
            }
        });
    }

    // Show login tab
    showLoginTab() {
        const authContent = document.getElementById('auth-content');
        if (authContent) {
            authContent.innerHTML = this.getLoginFormHTML();
        }
        this.updateTabButtons('login');
        this.setupFormListeners();
        this.renderGoogleButton();
    }

    // Show register tab
    showRegisterTab() {
        const authContent = document.getElementById('auth-content');
        if (authContent) {
            authContent.innerHTML = this.getRegisterFormHTML();
        }
        this.updateTabButtons('register');
        this.setupFormListeners();
        this.renderGoogleButton();
    }

    // Update tab buttons
    updateTabButtons(activeTab) {
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            if (activeTab === 'login' && tab.textContent.trim() === 'Sign In') {
                tab.classList.add('active');
            } else if (activeTab === 'register' && tab.textContent.trim() === 'Sign Up') {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    }

    // Handle login
    async handleLogin(formData) {
        const email = formData.get('email');
        const password = formData.get('password');

        // Basic validation
        if (!this.validateEmail(email)) {
            this.showMessage('Please enter a valid email address.', 'error');
            return;
        }

        if (!password || password.length < 6) {
            this.showMessage('Password must be at least 6 characters long.', 'error');
            return;
        }

        if (!window.firebaseManager || !window.firebaseManager.isReady()) {
            this.showMessage('Authentication service unavailable. Please try again later.', 'error');
            return;
        }

        try {
            // Sign in with Firebase
            await firebase.auth().signInWithEmailAndPassword(email, password);
            this.closeAuthModal();
            // Note: UI update is handled by monitorAuthState
        } catch (error) {
            console.error('Firebase Login Error:', error);
            this.showMessage(this.getFirebaseErrorMessage(error), 'error');
        }
    }

    // Handle registration
    async handleRegister(formData) {
        const fullname = formData.get('fullname');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirm_password');

        // Validation
        if (!fullname || fullname.length < 2) {
            this.showMessage('Please enter a valid full name.', 'error');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showMessage('Please enter a valid email address.', 'error');
            return;
        }

        if (!password || password.length < 6) {
            this.showMessage('Password must be at least 6 characters long.', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showMessage('Passwords do not match.', 'error');
            return;
        }

        if (!window.firebaseManager || !window.firebaseManager.isReady()) {
            this.showMessage('Authentication service unavailable. Please try again later.', 'error');
            return;
        }

        try {
            // Register with Firebase
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);

            // Update profile with fullname
            await userCredential.user.updateProfile({
                displayName: fullname
            });

            this.closeAuthModal();
            this.showMessage('Account created successfully!', 'success');
        } catch (error) {
            console.error('Firebase Registration Error:', error);
            this.showMessage(this.getFirebaseErrorMessage(error), 'error');
        }
    }

    // Login user
    async loginUser(user, isSocialLogin = false) {
        this.currentUser = user;

        // Save to localStorage
        localStorage.setItem('predesigns_user', JSON.stringify(user));
        localStorage.setItem('predesigns_session', JSON.stringify({
            loginTime: Date.now(),
            isSocialLogin: isSocialLogin
        }));

        this.updateAuthUI(user);
        this.resetSessionTimeout();

        const action = isSocialLogin ? 'signed in with Google' : 'signed in';
        this.showMessage(`Welcome back, ${user.fullname}! You have successfully ${action}.`, 'success');
    }

    // Logout user
    async logout() {
        try {
            if (window.firebaseManager && window.firebaseManager.isReady()) {
                await firebase.auth().signOut();
            } else {
                // Fallback if firebase is down
                this.currentUser = null;
                localStorage.removeItem('predesigns_user');
                localStorage.removeItem('predesigns_session');
                this.updateAuthUI(null);
            }
            this.showMessage('You have been logged out.', 'info');
        } catch (error) {
            console.error('Firebase Logout Error:', error);
            this.showMessage('Logout failed. Please try again.', 'error');
        }
    }

    /**
     * Translate Firebase error codes to user-friendly messages
     */
    getFirebaseErrorMessage(error) {
        switch (error.code) {
            case 'auth/invalid-email':
                return 'The email address is badly formatted.';
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                return 'Invalid email or password.';
            case 'auth/email-already-in-use':
                return 'The email address is already in use by another account.';
            case 'auth/weak-password':
                return 'The password is too weak.';
            case 'auth/operation-not-allowed':
                return 'This sign-in method is not enabled.';
            case 'auth/too-many-requests':
                return 'Too many failed attempts. Please try again later.';
            default:
                return error.message || 'An unexpected error occurred.';
        }
    }

    // Update authentication UI
    updateAuthUI(user) {
        const authContainer = document.querySelector('[data-auth-container]');
        const cartContainer = document.querySelector('[data-cart-container]');

        if (authContainer) {
            // Clear existing content
            authContainer.innerHTML = '';

            if (user) {
                // Show user menu using safe DOM manipulation
                const userMenu = document.createElement('div');
                userMenu.className = 'user-menu';

                const userAvatar = document.createElement('div');
                userAvatar.className = 'user-avatar';

                const avatarImg = document.createElement('img');
                avatarImg.src = user.avatar || 'images/avatar-placeholder.jpg';
                avatarImg.alt = this.escapeHtml(user.fullname);
                avatarImg.onerror = () => { avatarImg.src = 'images/avatar-placeholder.jpg'; };

                const userInfo = document.createElement('div');
                userInfo.className = 'user-info';

                const userName = document.createElement('span');
                userName.className = 'user-name';
                userName.textContent = this.escapeHtml(user.fullname);

                const userActions = document.createElement('div');
                userActions.className = 'user-actions';

                const logoutLink = document.createElement('a');
                logoutLink.href = '#';
                logoutLink.className = 'user-link';
                logoutLink.textContent = 'Logout';
                logoutLink.onclick = (e) => {
                    e.preventDefault();
                    this.logout();
                };

                // Build the structure
                userAvatar.appendChild(avatarImg);
                userMenu.appendChild(userAvatar);

                userActions.appendChild(logoutLink);
                userInfo.appendChild(userName);
                userInfo.appendChild(userActions);
                userMenu.appendChild(userInfo);

                authContainer.appendChild(userMenu);
            } else {
                // Show sign-in button using safe DOM manipulation
                const authButtons = document.createElement('div');
                authButtons.className = 'auth-buttons';

                const signInButton = document.createElement('button');
                signInButton.className = 'btn btn-outline';
                signInButton.setAttribute('data-action', 'open-login');

                const icon = document.createElement('i');
                icon.className = 'fas fa-sign-in-alt';

                signInButton.appendChild(icon);
                signInButton.appendChild(document.createTextNode(' Sign In'));

                authButtons.appendChild(signInButton);
                authContainer.appendChild(authButtons);
            }
        }

        // Update cart container position if needed
        if (cartContainer && user) {
            cartContainer.style.marginLeft = '1rem';
        }
    }

    // Set up session timeout monitoring
    setupSessionTimeout() {
        setInterval(() => {
            if (this.currentUser) {
                const sessionData = localStorage.getItem('predesigns_session');
                if (sessionData) {
                    const session = JSON.parse(sessionData);
                    if (Date.now() - session.loginTime > this.sessionTimeout) {
                        this.logout();
                        this.showMessage('Your session has expired. Please log in again.', 'info');
                    }
                }
            }
        }, 60000); // Check every minute
    }

    // Reset session timeout
    resetSessionTimeout() {
        const sessionData = localStorage.getItem('predesigns_session');
        if (sessionData) {
            const session = JSON.parse(sessionData);
            session.loginTime = Date.now();
            localStorage.setItem('predesigns_session', JSON.stringify(session));
        }
    }

    // Utility functions
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.auth-message');
        existingMessages.forEach(msg => msg.remove());

        // Create message element using safe DOM manipulation
        const messageElement = document.createElement('div');
        messageElement.className = `auth-message message-${type}`;

        // Create message content
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';

        // Add icon
        const icon = document.createElement('i');
        icon.className = `fas fa-${type === 'success' ? 'check-circle' :
            type === 'error' ? 'exclamation-circle' :
                'info-circle'}`;

        // Add text span
        const textSpan = document.createElement('span');
        textSpan.textContent = this.escapeHtml(message);

        // Build the structure
        messageContent.appendChild(icon);
        messageContent.appendChild(textSpan);
        messageElement.appendChild(messageContent);

        // Add to DOM
        document.body.appendChild(messageElement);

        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5000);
    }

    // Close auth modal
    closeAuthModal() {
        const modal = document.querySelector('.auth-modal');
        if (modal) {
            modal.remove();
            document.body.style.overflow = 'auto';
        }
    }
}

// Initialize auth manager
const authManager = new AuthManager();

// Make authManager available globally
window.authManager = authManager;

// Expose global helper functions for onclick events
window.openLoginModal = () => authManager.openAuthModal('login');
window.openRegisterModal = () => authManager.openAuthModal('register');

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}
