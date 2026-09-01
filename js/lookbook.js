// Lookbook JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initLookbookGallery();
    
    // Check if there's a category in the URL hash
    const hash = window.location.hash;
    if (hash) {
        const category = hash.substring(1); // Remove the # symbol
        const categoryBtn = document.querySelector(`.category-btn[data-category="${category}"]`);
        if (categoryBtn) {
            // Slight delay to ensure DOM is ready
            setTimeout(() => {
                categoryBtn.click();
                // Smooth scroll to the gallery
                document.querySelector('.lookbook-gallery').scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }
});

function initLookbookGallery() {
    // Category filtering
    const categoryButtons = document.querySelectorAll('.category-btn');
    const stories = document.querySelectorAll('.lookbook-story');

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const category = button.dataset.category;

            stories.forEach(story => {
                if (category === 'all' || story.dataset.category === category) {
                    story.style.display = 'grid';
                    setTimeout(() => {
                        story.style.opacity = '1';
                    }, 100);
                } else {
                    story.style.opacity = '0';
                    setTimeout(() => {
                        story.style.display = 'none';
                    }, 500);
                }
            });
        });
    });

    // Image gallery functionality for each story
    stories.forEach(story => {
        const imageGallery = story.querySelector('.story-images');
        const images = imageGallery.querySelectorAll('img');
        
        if (images.length > 0) {
            // Show first image initially
            images[0].classList.add('active');
            
            // Create navigation buttons
            const prevBtn = document.createElement('button');
            const nextBtn = document.createElement('button');
            prevBtn.className = 'nav-btn prev';
            nextBtn.className = 'nav-btn next';
            
            imageGallery.appendChild(prevBtn);
            imageGallery.appendChild(nextBtn);
            
            // Create dots navigation
            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'image-dots';
            
            images.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'dot' + (index === 0 ? ' active' : '');
                dot.addEventListener('click', () => showImage(index));
                dotsContainer.appendChild(dot);
            });
            
            imageGallery.appendChild(dotsContainer);
            
            let currentIndex = 0;
            
            function showImage(index) {
                images.forEach(img => img.classList.remove('active'));
                const dots = dotsContainer.querySelectorAll('.dot');
                dots.forEach(dot => dot.classList.remove('active'));
                
                images[index].classList.add('active');
                dots[index].classList.add('active');
                currentIndex = index;
            }
            
            // Navigation button click handlers
            prevBtn.addEventListener('click', () => {
                const newIndex = (currentIndex - 1 + images.length) % images.length;
                showImage(newIndex);
            });
            
            nextBtn.addEventListener('click', () => {
                const newIndex = (currentIndex + 1) % images.length;
                showImage(newIndex);
            });
            
            // Auto-advance slides every 5 seconds
            let slideInterval = setInterval(() => {
                const newIndex = (currentIndex + 1) % images.length;
                showImage(newIndex);
            }, 5000);
            
            // Pause auto-advance on hover
            imageGallery.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });
            
            // Resume auto-advance when mouse leaves
            imageGallery.addEventListener('mouseleave', () => {
                slideInterval = setInterval(() => {
                    const newIndex = (currentIndex + 1) % images.length;
                    showImage(newIndex);
                }, 5000);
            });
        }
    });

    // Check for hash in URL and show appropriate category
    if (window.location.hash) {
        const category = window.location.hash.substring(1);
        const categoryBtn = document.querySelector(`.category-btn[data-category="${category}"]`);
        if (categoryBtn) {
            categoryBtn.click();
        }
    }
}

// Update lookbook links in the main navigation when clicked
document.querySelectorAll('a[href^="lookbook.html#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        const category = this.getAttribute('href').split('#')[1];
        if (window.location.pathname.includes('lookbook.html')) {
            e.preventDefault();
            const categoryBtn = document.querySelector(`.category-btn[data-category="${category}"]`);
            if (categoryBtn) {
                categoryBtn.click();
            }
        }
    });
});