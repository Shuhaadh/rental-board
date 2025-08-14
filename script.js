// Global variables
let currentBoard = null;

// Mobile Menu Functions
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    
    mobileMenu.classList.toggle('active');
    menuBtn.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (mobileMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    
    mobileMenu.classList.remove('active');
    menuBtn.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    setupFilterTabs();
    setupBookingForm();
    setupSmoothScrolling();
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('rental-date').setAttribute('min', today);
});

// Setup filter tabs
function setupFilterTabs() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            filterTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterSurfboards(filter);
        });
    });
}

// Filter surfboards
function filterSurfboards(filter) {
    const cards = document.querySelectorAll('.surfboard-card');
    
    cards.forEach(card => {
        if (filter === 'all') {
            card.style.display = 'block';
            card.classList.remove('hidden');
        } else {
            if (card.classList.contains(filter)) {
                card.style.display = 'block';
                card.classList.remove('hidden');
            } else {
                card.style.display = 'none';
                card.classList.add('hidden');
            }
        }
    });
}

// Open booking modal
function openBookingModal(boardId, boardName) {
    currentBoard = {
        id: boardId,
        name: boardName
    };
    
    if (currentBoard) {
        document.getElementById('modal-title').textContent = `Book ${currentBoard.name}`;
        document.getElementById('booking-modal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Close booking modal
function closeModal() {
    document.getElementById('booking-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
    document.getElementById('booking-form').reset();
}

// Setup booking form with EmailJS integration
function setupBookingForm() {
    const form = document.getElementById('booking-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const bookingData = {
            board: currentBoard.name,
            customer: formData.get('customerName'),
            email: formData.get('customerEmail'),
            phone: formData.get('customerPhone'),
            date: formData.get('rentalDate'),
            duration: formData.get('rentalDuration'),
            experience: formData.get('experienceLevel')
        };
        
        // Send email notification via EmailJS
        sendEmailNotification(bookingData);
    });
}

// Send email notification using EmailJS
function sendEmailNotification(bookingData) {
    // Initialize EmailJS with your public key
    emailjs.init("OIg3XqQox8JJR8n4P"); // Replace with your actual EmailJS public key
    
    const templateParams = {
        customer_name: bookingData.customer,
        customer_email: bookingData.email,
        customer_phone: bookingData.phone,
        board_name: bookingData.board,
        rental_date: bookingData.date,
        duration: bookingData.duration,
        experience: bookingData.experience,
        booking_time: new Date().toLocaleString()
    };
    
    // Send email using your EmailJS service and template IDs
    emailjs.send("service_ze41a1i", "template_m2hhxo2", templateParams)
        .then(function(response) {
            console.log('Email sent successfully:', response);
            showSuccessMessage(bookingData);
        })
        .catch(function(error) {
            console.error('Email failed:', error);
            // Still show success message to user even if email fails
            showSuccessMessage(bookingData);
        });
}

// Show success message to user
function showSuccessMessage(bookingData) {
    const form = document.getElementById('booking-form');
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <strong>Booking Submitted!</strong><br>
        Thank you ${bookingData.customer}! Your ${bookingData.board} booking request has been sent.
        We'll contact you within 24 hours to confirm availability.
    `;
    
    form.insertBefore(successMessage, form.firstChild);
    
    // Clear form and close modal after 3 seconds
    setTimeout(() => {
        closeModal();
        // Remove success message after modal closes
        setTimeout(() => {
            if (successMessage.parentNode) {
                successMessage.remove();
            }
        }, 300);
    }, 3000);
}

// Setup smooth scrolling
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('booking-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(0, 51, 102, 0.98)';
    } else {
        header.style.background = 'rgba(0, 51, 102, 0.95)';
    }
});

// Close mobile menu when clicking on links
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-links a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
});

// Handle window resize
window.addEventListener('resize', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    
    // Close mobile menu if window is resized to desktop size
    if (window.innerWidth > 768) {
        mobileMenu.classList.remove('active');
        menuBtn.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Image error handling for fallback icons
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.card-image img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            this.parentElement.classList.remove('has-image');
        });
    });
});

// Add loading animation for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.card-image img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '0';
            this.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 100);
        });
    });
});

// Keyboard navigation for accessibility
document.addEventListener('keydown', function(e) {
    // Close modal with Escape key
    if (e.key === 'Escape') {
        const modal = document.getElementById('booking-modal');
        if (modal.style.display === 'flex') {
            closeModal();
        }
        
        // Close mobile menu with Escape key
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    }
});

// Intersection Observer for scroll animations
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe surfboard cards for scroll animations
    const cards = document.querySelectorAll('.surfboard-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// Performance optimization: Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
});

// Touch gesture support for mobile menu
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipeGesture();
});

function handleSwipeGesture() {
    const swipeThreshold = 100;
    const swipeDistance = touchStartY - touchEndY;
    
    // Swipe up to close mobile menu
    if (swipeDistance > swipeThreshold) {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    }
}