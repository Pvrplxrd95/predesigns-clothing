// Main JavaScript file for Predesigns Clothing Website

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    console.log('Predesigns Clothing Website Loaded');
    
    // Initialize all functionality
    initPreloader();
    initNavigation();
    initMobileMenu();
    initSmoothScrolling();
    initFormValidation();
    initNewsletterForm();
    initCustomOrderForm();
    initBackToTop();
    initStickyHeader();
    initAnimationOnScroll();
    initContactLinks();
    initLookbook();
});

// Preloader Functionality
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                preloader.style.opacity = '0';
                setTimeout(function() {
                    preloader.style.display = 'none';
                }, 500);
            }, 500);
        });
    }
}

// Navigation
function initNavigation() {
    // Highlight active navigation link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') ||
            (linkHref !== 'index.html' && currentPage.includes(linkHref.replace('.html', '')))) {
            link.classList.add('active');
        }
    });
}

// Mobile Menu Toggle
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
}

// Smooth Scrolling for Anchor Links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100, // Adjust for header height
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const mobileMenu = document.querySelector('.mobile-menu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    document.querySelector('.mobile-menu-toggle').classList.remove('active');
                    mobileMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            }
        });
    });
}

// Form Validation
function initFormValidation() {
    const forms = document.querySelectorAll('form:not(.no-validate)');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            const requiredFields = this.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    
                    // Add error message if not already present
                    if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
                        const errorMsg = document.createElement('div');
                        errorMsg.className = 'error-message';
                        errorMsg.textContent = field.getAttribute('data-error') || 'This field is required';
                        field.parentNode.insertBefore(errorMsg, field.nextSibling);
                    }
                } else {
                    field.classList.remove('error');
                    const errorMsg = field.nextElementSibling;
                    if (errorMsg && errorMsg.classList.contains('error-message')) {
                        errorMsg.remove();
                    }
                }
            });
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    });
}

// Newsletter Form
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (validateEmail(email)) {
                // Here you would typically send the email to your server
                console.log('Subscribing email:', email);
                alert('Thank you for subscribing to our newsletter!');
                emailInput.value = '';
            } else {
                alert('Please enter a valid email address');
            }
        });
    }
}

// Custom Order Form
function initCustomOrderForm() {
    const customOrderForm = document.querySelector('.custom-order-form');
    if (customOrderForm) {
        customOrderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add custom order form submission logic here
            console.log('Custom order form submitted');
            alert('Thank you for your custom order request! We will contact you soon.');
            this.reset();
        });
    }
}

// Back to Top Button
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Sticky Header
function initStickyHeader() {
    const header = document.querySelector('.header');
    if (header) {
        let lastScroll = 0;
        
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll <= 0) {
                header.classList.remove('scroll-up');
                return;
            }
            
            if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
                // Scroll Down
                header.classList.remove('scroll-up');
                header.classList.add('scroll-down');
            } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
                // Scroll Up
                header.classList.remove('scroll-down');
                header.classList.add('scroll-up');
            }
            
            lastScroll = currentScroll;
            
            // Add/remove scrolled class for header background
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

// Animation on Scroll
function initAnimationOnScroll() {
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Contact Links
function initContactLinks() {
    // Phone number click handler
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (window.innerWidth >= 768) {
                e.preventDefault();
                const phoneNumber = this.getAttribute('href').replace('tel:', '');
                // You can add additional logic here, like copying to clipboard
                console.log('Calling:', phoneNumber);
            }
        });
    });
    
    // Email click handler
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            console.log('Emailing:', this.getAttribute('href').replace('mailto:', ''));
        });
    });
}

// Lookbook Data
const lookbookData = {
    'urban-elegance': {
        title: 'Urban Elegance',
        description: 'Where streetwear meets sophistication. Our Urban Elegance collection blends contemporary urban style with timeless sophistication, perfect for the modern individual who values both comfort and style.',
        images: [
            'images/ThuliFrontView.jpg',
            'images/ThuliSideView.jpg'
        ],
        featuredItems: [
            { name: 'Tailored Blazer', price: 'R1,299', image: 'images/blazer.jpg' },
            { name: 'Slim Fit Chinos', price: 'R899', image: 'images/chinos.jpg' },
            { name: 'Leather Loafers', price: 'R1,499', image: 'images/loafers.jpg' }
        ]
    },
    'traditional-fusion': {
        title: 'Traditional Fusion',
        description: 'A celebration of heritage in a modern context. Our Traditional Fusion collection reimagines cultural elements with contemporary silhouettes, creating pieces that honor tradition while embracing modern fashion.',
        images: [
            'images/crop top & blue cargo3.png',
            'images/cargo2.jpg'
        ],
        featuredItems: [
            { name: 'Ankara Print Shirt', price: 'R749', image: 'images/ankara-shirt.jpg' },
            { name: 'Kente Blazer', price: 'R1,899', image: 'images/kente-blazer.jpg' },
            { name: 'Beaded Accessories', price: 'R299', image: 'images/beaded-accessories.jpg' }
        ]
    },
    'evening-glamour': {
        title: 'Evening Glamour',
        description: 'Red carpet ready styles for your most memorable nights. The Evening Glamour collection features luxurious fabrics, intricate detailing, and impeccable tailoring for those special occasions that demand attention.',
        images: [
            'images/LarryLime.jpg',
            'images/evening-glamour-2.jpg'
        ],
        featuredItems: [
            { name: 'Sequined Gown', price: 'R3,999', image: 'images/sequin-gown.jpg' },
            { name: 'Tuxedo Jacket', price: 'R2,499', image: 'images/tuxedo-jacket.jpg' },
            { name: 'Crystal Clutch', price: 'R1,199', image: 'images/crystal-clutch.jpg' }
        ]
    },
    'business-chic': {
        title: 'Business Chic',
        description: 'Power dressing redefined for the modern professional. The Business Chic collection combines sharp tailoring with contemporary comfort, ensuring you look polished and feel confident in any professional setting.',
        images: [
            'images/pvrpimage.jpg',
            'images/business-chic-2.jpg'
        ],
        featuredItems: [
            { name: 'Wool Blend Suit', price: 'R3,299', image: 'images/wool-suit.jpg' },
            { name: 'Silk Blouse', price: 'R999', image: 'images/silk-blouse.jpg' },
            { name: 'Leather Portfolio', price: 'R1,799', image: 'images/leather-portfolio.jpg' }
        ]
    }
};

// Lookbook Modal Functionality
function initLookbook() {
    const viewLookbookBtns = document.querySelectorAll('.view-lookbook');
    
    viewLookbookBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const lookbookId = this.getAttribute('data-lookbook');
            openLookbookModal(lookbookId);
        });
    });
    
    // Close modal when clicking outside content or on close button
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('lookbook-modal') || e.target.classList.contains('modal-close')) {
            closeLookbookModal();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLookbookModal();
        }
    });
}

function openLookbookModal(lookbookId) {
    const modal = document.createElement('div');
    modal.className = 'lookbook-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <h2>Lookbook</h2>
            <div class="lookbook-content">
                <!-- Content will be loaded here -->
                <p>Loading lookbook content...</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Load lookbook content from our data object
    setTimeout(() => {
        const content = modal.querySelector('.lookbook-content');
        const lookbook = lookbookData[lookbookId];
        
        if (content && lookbook) {
            // Create image gallery HTML
            const galleryHTML = lookbook.images.map(img => 
                `<div class="lookbook-gallery-item">
                    <img src="${img}" alt="${lookbook.title}" class="img-fluid" loading="lazy">
                </div>`
            ).join('');
            
            // Create featured items HTML
            const featuredItemsHTML = lookbook.featuredItems ? 
                `<div class="featured-items">
                    <h4>Featured Items</h4>
                    <div class="featured-grid">
                        ${lookbook.featuredItems.map(item => 
                            `<div class="featured-item">
                                <img src="${item.image}" alt="${item.name}" loading="lazy">
                                <h5>${item.name}</h5>
                                <p class="price">${item.price}</p>
                            </div>`
                        ).join('')}
                    </div>
                </div>` : '';
            
            // Combine all the HTML
            content.innerHTML = `
                <div class="lookbook-header">
                    <h2>${lookbook.title}</h2>
                    <p class="lookbook-description">${lookbook.description}</p>
                </div>
                <div class="lookbook-gallery">${galleryHTML}</div>
                ${featuredItemsHTML}
                <div class="lookbook-actions">
                    <a href="#contact" class="btn btn-primary" onclick="closeLookbookModal()">Book a Consultation</a>
                    <button class="btn btn-secondary modal-close">Close</button>
                </div>
            `;
            
            // Add click handler for the close button
            const closeBtn = content.querySelector('.modal-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', closeLookbookModal);
            }
        } else {
            content.innerHTML = '<p>Error: Lookbook not found. Please try again later.</p>';
        }
    }, 100);
}

function closeLookbookModal() {
    const modal = document.querySelector('.lookbook-modal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

// Utility Functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Make functions available globally if needed
window.openLookbookModal = openLookbookModal;
window.closeLookbookModal = closeLookbookModal;