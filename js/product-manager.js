/**
 * Product Manager Module
 * Handles shop filtering, quick view modals, and wishlist functionality.
 */

class ProductManager {
    constructor() {
        this.init();
    }

    init() {
        // Shared UI elements
        this.quickViewModal = document.getElementById('quick-view-modal');
        this.setupQuickViewBackdrop();
    }

    /**
     * Prepare Snipcart-compatible data attributes for all product buttons
     */
    prepareSnipcartButtons() {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            const data = this.getProductData(card);
            if (!data) return;

            card.setAttribute('data-product-id', data.id);
            const buttons = card.querySelectorAll('.add-to-cart');
            buttons.forEach(btn => this.configureSnipcartButton(btn, data));
        });
    }

    /**
     * Extract product data from card
     */
    getProductData(card) {
        const titleEl = card.querySelector('.product-title');
        const priceAttr = card.getAttribute('data-price');
        const mainImage = card.querySelector('.main-image');

        const name = titleEl?.textContent?.trim();
        if (!name) return null;

        let id = card.getAttribute('data-product-id') ||
            name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        const price = parseFloat(priceAttr || card.querySelector('.product-price')?.textContent?.replace(/[^0-9.]/g, '') || '0');
        const img = mainImage?.getAttribute('data-src') || mainImage?.src || '';

        return {
            id, name, price,
            image: img,
            category: card.getAttribute('data-category') || '',
            description: card.querySelector('.product-description')?.textContent?.trim() || '',
            url: window.location.pathname
        };
    }

    /**
     * Apply Snipcart attributes to button
     */
    configureSnipcartButton(button, data) {
        button.classList.add('snipcart-add-item');
        button.setAttribute('data-item-id', data.id);
        button.setAttribute('data-item-name', data.name);
        button.setAttribute('data-item-price', data.price.toFixed(2));
        button.setAttribute('data-item-url', data.url);
        button.setAttribute('data-item-image', data.image);
        if (data.description) button.setAttribute('data-item-description', data.description);
        if (data.category) button.setAttribute('data-item-categories', data.category);
    }

    /**
     * Initialize product filtering for shop pages
     */
    initProductFiltering() {
        const filters = ['category-filter', 'price-filter', 'availability-filter'];
        filters.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('change', () => this.filterProducts());
        });

        this.handleUrlHashFiltering();
    }

    /**
     * Filter products based on selected dropdown values
     */
    filterProducts() {
        const categoryFilter = document.getElementById('category-filter');
        const priceFilter = document.getElementById('price-filter');
        const availabilityFilter = document.getElementById('availability-filter');

        const categoryVal = categoryFilter ? categoryFilter.value : 'all';
        const priceVal = priceFilter ? priceFilter.value : 'all';
        const availabilityVal = availabilityFilter ? availabilityFilter.value : 'all';

        let visibleCount = 0;
        document.querySelectorAll('.product-card').forEach(product => {
            const category = product.getAttribute('data-category');
            const price = parseInt(product.getAttribute('data-price'));
            const availability = product.getAttribute('data-availability');

            let show = (categoryVal === 'all' || category === categoryVal);

            if (show && priceVal !== 'all') {
                if (priceVal === '0-500') show = price <= 500;
                else if (priceVal === '500-1000') show = price > 500 && price <= 1000;
                else if (priceVal === '1000-2000') show = price > 1000 && price <= 2000;
                else if (priceVal === '2000+') show = price > 2000;
            }

            if (show && availabilityVal !== 'all') {
                show = (availability === availabilityVal);
            }

            product.style.display = show ? 'block' : 'none';
            if (show) visibleCount++;
        });

        const noResults = document.getElementById('no-results');
        if (noResults) noResults.style.display = visibleCount === 0 ? 'flex' : 'none';
    }

    handleUrlHashFiltering() {
        if (window.location.hash) {
            const category = window.location.hash.substring(1).toLowerCase();
            const filterSelect = document.getElementById('category-filter');
            if (filterSelect) {
                for (let option of filterSelect.options) {
                    if (option.value.toLowerCase() === category) {
                        filterSelect.value = option.value;
                        this.filterProducts();
                        break;
                    }
                }
            }
        }
    }

    /**
     * Initialize quick view modals
     */
    initQuickViewModals() {
        const btns = document.querySelectorAll('.quick-view-btn');
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                const card = btn.closest('.product-card');
                this.openQuickViewModal(card);
            });
        });

        const close = document.querySelector('.modal-close');
        if (close) close.addEventListener('click', () => this.closeQuickViewModal());
    }

    setupQuickViewBackdrop() {
        if (!this.quickViewModal) return;
        this.quickViewModal.addEventListener('click', (e) => {
            if (e.target === this.quickViewModal) this.closeQuickViewModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.quickViewModal.style.display === 'flex') {
                this.closeQuickViewModal();
            }
        });
    }

    openQuickViewModal(card) {
        if (!card || !this.quickViewModal) return;

        const data = this.getProductData(card);
        const modal = this.quickViewModal;

        const img = modal.querySelector('#modal-product-image');
        const title = modal.querySelector('#modal-product-title');
        const price = modal.querySelector('#modal-product-price');
        const desc = modal.querySelector('#modal-product-description');

        if (img) img.src = data.image;
        if (title) title.textContent = data.name;
        if (price) price.textContent = `R${data.price.toFixed(2)}`;
        if (desc) desc.textContent = data.description;

        const modalBtn = modal.querySelector('.add-to-cart-modal');
        if (modalBtn) this.configureSnipcartButton(modalBtn, data);

        const wishlistBtn = modal.querySelector('.add-to-wishlist-modal');
        if (wishlistBtn) {
            wishlistBtn.setAttribute('data-product-id', data.id);
            // Toggle state if already in wishlist (using localStorage or class)
            if (this.isInWishlist(data.id)) {
                wishlistBtn.classList.add('wishlisted');
                wishlistBtn.innerHTML = '<i class="fas fa-heart"></i> Added to Wishlist';
            } else {
                wishlistBtn.classList.remove('wishlisted');
                wishlistBtn.innerHTML = '<i class="far fa-heart"></i> Add to Wishlist';
            }
        }

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    closeQuickViewModal() {
        if (this.quickViewModal) {
            this.quickViewModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    /**
     * Initialize wishlist functionality with event delegation
     */
    initWishlist() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.add-to-wishlist, .add-to-wishlist-modal');
            if (!btn) return;

            e.preventDefault();
            const productId = btn.getAttribute('data-product-id') || 
                            btn.closest('.product-card')?.getAttribute('data-product-id');
            const name = btn.closest('.product-card')?.querySelector('.product-title')?.textContent || 
                        document.getElementById('modal-product-title')?.textContent || 'Product';

            const isAdded = btn.classList.toggle('wishlisted');
            this.toggleWishlist(productId, isAdded);

            if (btn.classList.contains('add-to-wishlist-modal')) {
                btn.innerHTML = isAdded ? '<i class="fas fa-heart"></i> Added to Wishlist' : '<i class="far fa-heart"></i> Add to Wishlist';
            } else {
                btn.innerHTML = isAdded ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
            }

            this.showMessage(`${name} ${isAdded ? 'added to' : 'removed from'} wishlist`, isAdded ? 'success' : 'info');
        });
    }

    isInWishlist(id) {
        if (!id) return false;
        const wishlist = JSON.parse(localStorage.getItem('predesigns_wishlist') || '[]');
        return wishlist.includes(id);
    }

    toggleWishlist(id, add) {
        if (!id) return;
        let wishlist = JSON.parse(localStorage.getItem('predesigns_wishlist') || '[]');
        if (add) {
            if (!wishlist.includes(id)) wishlist.push(id);
        } else {
            wishlist = wishlist.filter(itemId => itemId !== id);
        }
        localStorage.setItem('predesigns_wishlist', JSON.stringify(wishlist));
    }

    showMessage(message, type) {
        if (window.authManager && window.authManager.showMessage) {
            window.authManager.showMessage(message, type);
        } else if (window.uiManager && window.uiManager.showToast) {
            window.uiManager.showToast(message, type);
        } else {
            console.log(`[Wishlist ${type}]: ${message}`);
        }
    }
}

// Export for use in app-init.js
window.productManager = new ProductManager();
