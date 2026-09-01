/**
 * Firebase Configuration Module
 * 
 * This module initializes Firebase using environment variables.
 * Values are loaded through the ENV system in js/config.js
 */

const firebaseConfig = {
    apiKey: ENV.firebase.apiKey,
    authDomain: ENV.firebase.authDomain,
    projectId: ENV.firebase.projectId,
    storageBucket: ENV.firebase.storageBucket,
    messagingSenderId: ENV.firebase.messagingSenderId,
    appId: ENV.firebase.appId,
    measurementId: ENV.firebase.measurementId
};

// Check if Firebase is minimally configured
const isFirebaseConfigured = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

class FirebaseManager {
    constructor() {
        this.app = null;
        this.auth = null;
        this.db = null;
        this.init();
    }

    init() {
        if (!isFirebaseConfigured) {
            console.warn('⚠️ Firebase is not configured. Some features may not work.');
            return;
        }

        try {
            // Initialize Firebase
            this.app = firebase.initializeApp(firebaseConfig);
            this.auth = firebase.auth();
            this.db = firebase.firestore();

            console.log('🔥 Firebase initialized successfully');
        } catch (error) {
            console.error('❌ Firebase initialization failed:', error);
        }
    }

    /**
     * Check if Firebase is ready
     */
    isReady() {
        return !!this.app;
    }
}

// Create singleton instance
window.firebaseManager = new FirebaseManager();
