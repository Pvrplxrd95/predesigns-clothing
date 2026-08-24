// Shop page functionality

// Quick View Modal
const quickViewModal = document.getElementById('quick-view-modal');
const modalClose = document.querySelector('.modal-close');
const quickViewBtns = document.querySelectorAll('.quick-view-btn');

// Add event listeners for quick view buttons
quickViewBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const productCard = this.closest('.product-card');
        openQuickViewModal(productCard);
    });
});

// Close modal when clicking the close button
modalClose.addEventListener('click', () => {
    quickViewModal.style.display = 'none';
});

// Close modal when clicking outside the content
quickViewModal.addEventListener('click', (e) => {
    if (e.target === quickViewModal) {
        quickViewModal.style.display = 'none';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && quickViewModal.style.display === 'flex') {
        quickViewModal.style.display = 'none';
    }
});

function openQuickViewModal(productCard) {
    // Get product information from data attributes
    const category = productCard.getAttribute('data-category');
    const title = productCard.querySelector('.product-title').textContent;
    const price = productCard.querySelector('.product-price').textContent;
    const description = productCard.querySelector('.product-description').textContent;
    const material = productCard.getAttribute('data-material') || 'Premium cotton blend';
    const care = productCard.getAttribute('data-care') || 'Machine wash cold, tumble dry low';
    const fit = productCard.getAttribute('data-fit') || 'Regular fit';
    const origin = productCard.getAttribute('data-origin') || 'Handcrafted in Hammanskraal, Pretoria';
    
    // Get the main image
    const mainImage = productCard.querySelector('.main-image');
    const imageUrl = mainImage ? mainImage.src : '';
    
    // Update modal content
    document.getElementById('modal-product-image').src = imageUrl;
    document.getElementById('modal-product-category').textContent = category.toUpperCase();
    document.getElementById('modal-product-title').textContent = title;
    document.getElementById('modal-product-price').textContent = price;
    document.getElementById('modal-product-description').textContent = description;
    
    // Update product details
    const detailsList = document.querySelector('.modal-product-details ul');
    detailsList.innerHTML = `
        <li><strong>Material:</strong> ${material}</li>
        <li><strong>Care:</strong> ${care}</li>
        <li><strong>Fit:</strong> ${fit}</li>
        <li><strong>Origin:</strong> ${origin}</li>
    `;
    
    // Show the modal
    quickViewModal.style.display = 'flex';
    
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
}

// Update modal display when closing
function closeQuickViewModal() {
    quickViewModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Add event listener for the close button
document.querySelector('.modal-close').addEventListener('click', closeQuickViewModal);

// Add event listener for clicking outside modal content
quickViewModal.addEventListener('click', function(e) {
    if (e.target === quickViewModal) {
        closeQuickViewModal();
    }
});

// Image Gallery Functionality
document.querySelectorAll('.product-card').forEach(card => {
    const mainImage = card.querySelector('.main-image');
    const secondaryImage = card.querySelector('.secondary-image');
    const indicators = card.querySelectorAll('.indicator');
    
    if (secondaryImage) {
        // Show secondary image on hover
        card.addEventListener('mouseenter', () => {
            if (mainImage && secondaryImage) {
                mainImage.style.opacity = '0';
                setTimeout(() => {
                    mainImage.src = secondaryImage.src;
                    mainImage.style.opacity = '1';
                }, 150);
            }
        });
        
        // Show main image on leave
        card.addEventListener('mouseleave', () => {
            if (mainImage && secondaryImage) {
                mainImage.style.opacity = '0';
                setTimeout(() => {
                    mainImage.src = mainImage.getAttribute('data-main-src') || mainImage.src;
                    mainImage.style.opacity = '1';
                }, 150);
            }
        });
    }
});

// Product Filtering
const categoryFilter = document.getElementById('category-filter');
const priceFilter = document.getElementById('price-filter');
const availabilityFilter = document.getElementById('availability-filter');
const productsGrid = document.getElementById('products-grid');
const noResults = document.getElementById('no-results');

function filterProducts() {
    const categoryValue = categoryFilter.value;
    const priceValue = priceFilter.value;
    const availabilityValue = availabilityFilter.value;
    
    let visibleCount = 0;
    
    document.querySelectorAll('.product-card').forEach(product => {
        const category = product.getAttribute('data-category');
        const price = parseInt(product.getAttribute('data-price'));
        const availability = product.getAttribute('data-availability');
        
        let showProduct = true;
        
        // Filter by category
        if (categoryValue !== 'all' && category !== categoryValue) {
            showProduct = false;
        }
        
        // Filter by price
        if (showProduct && priceValue !== 'all') {
            let priceMatch = false;
            switch (priceValue) {
                case '0-500':
                    priceMatch = price <= 500;
                    break;
                case '500-1000':
                    priceMatch = price > 500 && price <= 1000;
                    break;
                case '1000-2000':
                    priceMatch = price > 1000 && price <= 2000;
                    break;
                case '2000+':
                    priceMatch = price > 2000;
                    break;
            }
            if (!priceMatch) {
                showProduct = false;
            }
        }
        
        // Filter by availability
        if (showProduct && availabilityValue !== 'all' && availability !== availabilityValue) {
            showProduct = false;
        }
        
        // Show/hide product
        if (showProduct) {
            product.style.display = 'block';
            visibleCount++;
        } else {
            product.style.display = 'none';
        }
    });
    
    // Show/hide no results message
    if (visibleCount === 0) {
        noResults.style.display = 'flex';
    } else {
        noResults.style.display = 'none';
    }
}

// Add event listeners for filters
categoryFilter.addEventListener('change', filterProducts);
priceFilter.addEventListener('change', filterProducts);
availabilityFilter.addEventListener('change', filterProducts);

// Shopping Cart Functionality
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-count').textContent = cartCount;
}

function addToCart(productId, productName, productPrice, quantity = 1) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: quantity
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show success message
    showCartNotification(`${productName} added to cart!`, 'success');
}

function showCartNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `cart-notification cart-notification-${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add to cart buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const productCard = this.closest('.product-card');
        const productId = productCard.getAttribute('data-id') || productCard.querySelector('.product-title').textContent;
        const productName = productCard.querySelector('.product-title').textContent;
        const productPriceText = productCard.querySelector('.product-price').textContent;
        const productPrice = parseInt(productPriceText.replace('R', '').replace(',', ''));
        
        addToCart(productId, productName, productPrice);
    });
});

// Add to wishlist buttons
document.querySelectorAll('.add-to-wishlist').forEach(button => {
    button.addEventListener('click', function() {
        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('.product-title').textContent;
        
        // Toggle wishlist state
        const isWishlisted = this.classList.contains('wishlisted');
        if (isWishlisted) {
            this.classList.remove('wishlisted');
            this.innerHTML = '<i class="far fa-heart"></i>';
            showCartNotification(`${productName} removed from wishlist`, 'info');
        } else {
            this.classList.add('wishlisted');
            this.innerHTML = '<i class="fas fa-heart"></i>';
            showCartNotification(`${productName} added to wishlist`, 'success');
        }
    });
});

// Quick view modal add to cart
document.querySelector('.add-to-cart-modal').addEventListener('click', function() {
    const productName = document.getElementById('modal-product-title').textContent;
    const productPriceText = document.getElementById('modal-product-price').textContent;
    const productPrice = parseInt(productPriceText.replace('R', '').replace(',', ''));
    const productId = productName;
    
    addToCart(productId, productName, productPrice);
    closeQuickViewModal();
});

// Quick view modal add to wishlist
document.querySelector('.add-to-wishlist-modal').addEventListener('click', function() {
    const productName = document.getElementById('modal-product-title').textContent;
    const isWishlisted = this.classList.contains('wishlisted');
    
    if (isWishlisted) {
        this.classList.remove('wishlisted');
        this.innerHTML = '<i class="far fa-heart"></i> Add to Wishlist';
        showCartNotification(`${productName} removed from wishlist`, 'info');
    } else {
        this.classList.add('wishlisted');
        this.innerHTML = '<i class="fas fa-heart"></i> Remove from Wishlist';
        showCartNotification(`${productName} added to wishlist`, 'success');
    }
});

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});

// Mobile menu toggle
document.querySelector('.mobile-menu-toggle').addEventListener('click', function() {
    document.querySelector('.mobile-menu').classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        mobileMenu.classList.remove('active');
    }
});

// Smooth scrolling for navigation links
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

// Back to top button
const backToTopButton = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.style.display = 'block';
    } else {
        backToTopButton.style.display = 'none';
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Newsletter form submission
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('newsletter-email').value;
        
        if (email) {
            // Simulate form submission
            showCartNotification('Thank you for subscribing to our newsletter!', 'success');
            newsletterForm.reset();
        } else {
            showCartNotification('Please enter a valid email address', 'error');
        }
    });
}

// Custom order and consultation forms
function openCustomOrderForm() {
    showCartNotification('Custom order form would open here', 'info');
}

function openConsultationForm() {
    showCartNotification('Consultation form would open here', 'info');
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart count
    updateCartCount();
    
    // Set up image galleries
    setupImageGalleries();
    
    console.log('Shop page functionality initialized');
});

function setupImageGalleries() {
    document.querySelectorAll('.product-card').forEach(card => {
        const mainImage = card.querySelector('.main-image');
        const secondaryImage = card.querySelector('.secondary-image');
        
        if (mainImage && secondaryImage) {
            // Store original main image source
            mainImage.setAttribute('data-main-src', mainImage.src);
            
            // Set up hover functionality
            card.addEventListener('mouseenter', () => {
                mainImage.style.transition = 'opacity 0.3s';
                mainImage.style.opacity = '0';
                setTimeout(() => {
                    mainImage.src = secondaryImage.src;
                    mainImage.style.opacity = '1';
                }, 150);
            });
            
            card.addEventListener('mouseleave', () => {
                mainImage.style.transition = 'opacity 0.3s';
                mainImage.style.opacity = '0';
                setTimeout(() => {
                    mainImage.src = mainImage.getAttribute('data-main-src');
                    mainImage.style.opacity = '1';
                }, 150);
            });
        }
    });
}

// Export functions for global use
window.openQuickViewModal = openQuickViewModal;
window.closeQuickViewModal = closeQuickViewModal;
window.filterProducts = filterProducts;
window.updateCartCount = updateCartCount;
window.addToCart = addToCart;
window.openCustomOrderForm = openCustomOrderForm;
window.openConsultationForm = openConsultationForm;
