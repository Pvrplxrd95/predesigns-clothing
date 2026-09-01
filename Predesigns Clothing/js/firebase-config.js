/**
 * Firebase Configuration Module
 * 
 * This module initializes Firebase using environment variables.
 * Values are loaded through the ENV system in js/config.js
 */

const firebaseConfig = {
    apiKey: ENV.getEnv('FIREBASE_API_KEY', ''),
    authDomain: ENV.getEnv('FIREBASE_AUTH_DOMAIN', ''),
    projectId: ENV.getEnv('FIREBASE_PROJECT_ID', ''),
    storageBucket: ENV.getEnv('FIREBASE_STORAGE_BUCKET', ''),
    messagingSenderId: ENV.getEnv('FIREBASE_MESSAGING_SENDER_ID', ''),
    appId: ENV.getEnv('FIREBASE_APP_ID', ''),
    measurementId: ENV.getEnv('FIREBASE_MEASUREMENT_ID', '')
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
