// CartStorage Module - Unified cart storage management
// Provides centralized cart storage operations with error handling and fallbacks

class CartStorage {
    constructor() {
        this.config = window.CONFIG || this.getDefaultConfig();
    }

    getDefaultConfig() {
        return {
            CART_KEY: 'predesigns-cart',
            CART_VERSION: '1.0',
            MAX_QUANTITY: 10
        };
    }

    /**
     * Get the cart from localStorage with error handling
     * @returns {Array} The cart array or empty array if error occurs
     */
    getCart() {
        try {
            const cartKey = this.config.CART_KEY;
            const storedCart = localStorage.getItem(cartKey);

            if (!storedCart) {
                return [];
            }

            const cart = JSON.parse(storedCart);

            // Validate cart structure
            if (!Array.isArray(cart)) {
                console.warn('CartStorage: Invalid cart structure, returning empty cart');
                return [];
            }

            // Validate each cart item
            const validatedCart = cart.filter(item => this.isValidCartItem(item));

            // If cart was invalid, save the cleaned version
            if (validatedCart.length !== cart.length) {
                this.setCart(validatedCart);
            }

            return validatedCart;
        } catch (error) {
            console.error('CartStorage: Error loading cart from localStorage:', error);
            return [];
        }
    }

    /**
     * Save cart to localStorage with error handling
     * @param {Array} cart - The cart array to save
     * @returns {boolean} True if successful, false otherwise
     */
    setCart(cart) {
        try {
            // Validate input
            if (!Array.isArray(cart)) {
                console.error('CartStorage: Invalid cart data provided');
                return false;
            }

            const cartKey = this.config.CART_KEY;
            const cartData = JSON.stringify(cart);

            localStorage.setItem(cartKey, cartData);
            return true;
        } catch (error) {
            console.error('CartStorage: Error saving cart to localStorage:', error);
            return false;
        }
    }

    /**
     * Clear the cart from localStorage
     * @returns {boolean} True if successful, false otherwise
     */
    clearCart() {
        try {
            const cartKey = this.config.CART_KEY;
            localStorage.removeItem(cartKey);
            return true;
        } catch (error) {
            console.error('CartStorage: Error clearing cart from localStorage:', error);
            return false;
        }
    }

    /**
     * Add an item to the cart
     * @param {Object} item - The item to add
     * @returns {boolean} True if successful, false otherwise
     */
    addItem(item) {
        try {
            const cart = this.getCart();

            // Validate item
            if (!this.isValidCartItem(item)) {
                console.error('CartStorage: Invalid item provided:', item);
                return false;
            }

            cart.push(item);
            return this.setCart(cart);
        } catch (error) {
            console.error('CartStorage: Error adding item to cart:', error);
            return false;
        }
    }

    /**
     * Update an item's quantity in the cart
     * @param {string} itemId - The item ID to update
     * @param {number} quantity - The new quantity
     * @returns {boolean} True if successful, false otherwise
     */
    updateItemQuantity(itemId, quantity) {
        try {
            const cart = this.getCart();
            const itemIndex = cart.findIndex(item => item.id === itemId);

            if (itemIndex === -1) {
                console.warn('CartStorage: Item not found in cart:', itemId);
                return false;
            }

            // Validate quantity
            if (quantity < 1 || quantity > this.config.MAX_QUANTITY) {
                console.warn('CartStorage: Invalid quantity:', quantity);
                return false;
            }

            cart[itemIndex].quantity = quantity;
            return this.setCart(cart);
        } catch (error) {
            console.error('CartStorage: Error updating item quantity:', error);
            return false;
        }
    }

    /**
     * Remove an item from the cart
     * @param {string} itemId - The item ID to remove
     * @returns {boolean} True if successful, false otherwise
     */
    removeItem(itemId) {
        try {
            const cart = this.getCart();
            const filteredCart = cart.filter(item => item.id !== itemId);

            // Check if item was actually removed
            if (filteredCart.length === cart.length) {
                console.warn('CartStorage: Item not found in cart:', itemId);
                return false;
            }

            return this.setCart(filteredCart);
        } catch (error) {
            console.error('CartStorage: Error removing item from cart:', error);
            return false;
        }
    }

    /**
     * Get cart total count
     * @returns {number} Total number of items in cart
     */
    getCartCount() {
        try {
            const cart = this.getCart();
            return cart.reduce((total, item) => total + item.quantity, 0);
        } catch (error) {
            console.error('CartStorage: Error calculating cart count:', error);
            return 0;
        }
    }

    /**
     * Get cart total value
     * @returns {number} Total value of cart in ZAR
     */
    getCartTotal() {
        try {
            const cart = this.getCart();
            return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        } catch (error) {
            console.error('CartStorage: Error calculating cart total:', error);
            return 0;
        }
    }

    /**
     * Validate cart item structure
     * @param {Object} item - The item to validate
     * @returns {boolean} True if valid, false otherwise
     */
    isValidCartItem(item) {
        return (
            item &&
            typeof item === 'object' &&
            typeof item.id === 'string' &&
            typeof item.name === 'string' &&
            typeof item.price === 'number' &&
            typeof item.quantity === 'number' &&
            item.price >= 0 &&
            item.quantity >= 1 &&
            item.quantity <= this.config.MAX_QUANTITY &&
            (item.image ? typeof item.image === 'string' : true)
        );
    }

    /**
     * Migrate cart data if needed (for future version upgrades)
     * @returns {boolean} True if migration successful, false otherwise
     */
    migrateCartIfNeeded() {
        try {
            const cartKey = this.config.CART_KEY;
            const storedCart = localStorage.getItem(cartKey);

            if (!storedCart) {
                return true; // No cart to migrate
            }

            // Future migration logic can be added here
            // For now, just validate the existing cart
            const cart = JSON.parse(storedCart);

            if (!Array.isArray(cart)) {
                // Clear invalid cart
                localStorage.removeItem(cartKey);
                return true;
            }

            return true;
        } catch (error) {
            console.error('CartStorage: Error during cart migration:', error);
            // Clear corrupted cart
            try {
                localStorage.removeItem(this.config.CART_KEY);
            } catch (clearError) {
                console.error('CartStorage: Error clearing corrupted cart:', clearError);
            }
            return false;
        }
    }
}

// Initialize CartStorage instance
const cartStorage = new CartStorage();

// Export for global use
window.CartStorage = cartStorage;

// Auto-migrate cart on initialization
cartStorage.migrateCartIfNeeded();

console.log('CartStorage initialized successfully');
