// ITVE Website - JavaScript Implementation with Hide-on-Scroll Navigation

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initPagination();
    initSmoothScroll();
    initModal();
    initFormValidation();
    initAnimations();
    initScrollProgress();
    initHideOnScrollNav();
    
    console.log('ITVE Website initialized successfully');
});

// Hide-on-scroll navigation functionality
function initHideOnScrollNav() {
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    // Function to update navbar visibility
    function updateNavbar() {
        const currentScrollY = window.scrollY;
        
        // Show/hide based on scroll direction
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scrolling down - hide navbar
            navbar.classList.add('navbar-hidden');
            navbar.classList.remove('navbar-visible');
        } else {
            // Scrolling up - show navbar
            navbar.classList.remove('navbar-hidden');
            navbar.classList.add('navbar-visible');
        }
        
        // Always show navbar at the top
        if (currentScrollY < 100) {
            navbar.classList.remove('navbar-hidden');
            navbar.classList.add('navbar-visible');
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }
    
    // Throttle scroll events for performance
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateNavbar();
            });
            ticking = true;
        }
    });
    
    // Show navbar when mouse moves near top of screen
    let mouseTimeout;
    document.addEventListener('mousemove', function(e) {
        if (e.clientY < 100) {
            navbar.classList.remove('navbar-hidden');
            navbar.classList.add('navbar-visible');
            
            // Clear previous timeout
            if (mouseTimeout) clearTimeout(mouseTimeout);
            
            // Hide navbar again after 3 seconds if not at top
            mouseTimeout = setTimeout(function() {
                if (window.scrollY > 100) {
                    navbar.classList.add('navbar-hidden');
                    navbar.classList.remove('navbar-visible');
                }
            }, 3000);
        }
    });
    
    // Initialize navbar state
    updateNavbar();
}

// Scroll progress indicator
function initScrollProgress() {
    const scrollProgress = document.getElementById('scrollProgress');
    
    if (!scrollProgress) return;
    
    function updateScrollProgress() {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        scrollProgress.style.width = scrolled + '%';
    }
    
    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress(); // Initial call
}

// Navigation functionality
function initNavigation() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    // Toggle mobile menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            mobileMenu.classList.toggle('active');
            this.setAttribute('aria-expanded', mobileMenu.classList.contains('active'));
            
            // Toggle icon
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                if (mobileMenuBtn) {
                    mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                    mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.nav-container') && 
            !event.target.closest('.mobile-menu') && 
            mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            if (mobileMenuBtn) {
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        }
    });
    
    // Set active nav link based on scroll position
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('.page-section');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Update desktop nav links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// Pagination functionality
// Pagination functionality
function initPagination() {
    const paginationDots = document.querySelectorAll('.pagination-dot');
    const sections = document.querySelectorAll('.page-section');
    const paginationContainer = document.getElementById('paginationContainer');
    
    if (paginationDots.length === 0 || sections.length === 0) return;
    
    // Create Intersection Observer to track visible sections
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeSectionId = entry.target.id;
                updatePagination(activeSectionId);
                
                // Show pagination when scrolling
                if (paginationContainer) {
                    paginationContainer.style.opacity = '1';
                }
            }
        });
    }, observerOptions);
    
    // Observe all sections
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Update pagination dots based on active section
    function updatePagination(activeSectionId) {
        paginationDots.forEach(dot => {
            const dotSection = dot.getAttribute('data-section');
            dot.classList.toggle('active', dotSection === activeSectionId);
        });
    }
    
    // Add click event to pagination dots
    paginationDots.forEach(dot => {
        dot.addEventListener('click', function() {
            const targetSectionId = this.getAttribute('data-section');
            const targetSection = document.getElementById(targetSectionId);
            
            if (targetSection) {
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobileMenu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    const menuBtn = document.getElementById('mobileMenuBtn');
                    if (menuBtn) {
                        menuBtn.querySelector('i').classList.remove('fa-times');
                        menuBtn.querySelector('i').classList.add('fa-bars');
                    }
                }
                
                // Show navbar briefly when navigating
                const navbar = document.getElementById('navbar');
                if (navbar) {
                    navbar.classList.remove('navbar-hidden');
                    navbar.classList.add('navbar-visible');
                    
                    // Hide again after 3 seconds if not at top
                    setTimeout(function() {
                        if (window.scrollY > 100) {
                            navbar.classList.add('navbar-hidden');
                            navbar.classList.remove('navbar-visible');
                        }
                    }, 3000);
                }
                
                // Scroll to section
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Initialize with first section active
    updatePagination('home');
    
    // Hide pagination on initial load if at top
    if (paginationContainer && window.scrollY < 100) {
        paginationContainer.style.opacity = '0.7';
    }
}
// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobileMenu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    const menuBtn = document.getElementById('mobileMenuBtn');
                    if (menuBtn) {
                        menuBtn.querySelector('i').classList.remove('fa-times');
                        menuBtn.querySelector('i').classList.add('fa-bars');
                    }
                }
                
                // Show navbar when scrolling to section
                const navbar = document.getElementById('navbar');
                if (navbar) {
                    navbar.classList.remove('navbar-hidden');
                    navbar.classList.add('navbar-visible');
                }
                
                // Calculate scroll position accounting for navbar height
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                // Scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Hide navbar after scroll completes (if not at top)
                setTimeout(function() {
                    if (window.scrollY > 100 && navbar) {
                        navbar.classList.add('navbar-hidden');
                        navbar.classList.remove('navbar-visible');
                    }
                }, 1000);
                
                // Update URL hash without scrolling
                history.pushState(null, null, href);
            }
        });
    });
}

// Modal functionality
function initModal() {
    const applyButtons = document.querySelectorAll('a[href="#apply"], .btn-primary');
    const modal = document.getElementById('applyModal');
    const closeButton = document.querySelector('.modal-close');
    
    if (!modal) return;
    
    // Filter only buttons that should open modal
    applyButtons.forEach(button => {
        if (button.getAttribute('href') === '#apply' || 
            button.classList.contains('modal-trigger') ||
            button.textContent.toLowerCase().includes('apply')) {
            
            button.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href === '#apply') {
                    e.preventDefault();
                    openModal();
                }
            });
        }
    });
    
    // Close modal when close button is clicked
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Show navbar when modal opens
        const navbar = document.getElementById('navbar');
        if (navbar) {
            navbar.classList.remove('navbar-hidden');
            navbar.classList.add('navbar-visible');
        }
    }
    
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Form validation
function initFormValidation() {
    const inquiryForm = document.getElementById('inquiryForm');
    const applicationForm = document.getElementById('applicationForm');
    
    // Inquiry form validation
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('input[type="text"]').value.trim();
            const email = this.querySelector('input[type="email"]').value.trim();
            const message = this.querySelector('textarea').value.trim();
            
            // Simple validation
            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            if (!isValidEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // In a real application, you would submit the form data to a server here
            console.log('Inquiry form submitted:', { name, email, message });
            alert('Thank you for your message! We will contact you soon.');
            this.reset();
        });
    }
    
    // Application form validation
    if (applicationForm) {
        applicationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const program = document.getElementById('program').value;
            
            // Validation
            if (!firstName || !lastName || !email || !phone || !program) {
                alert('Please fill in all required fields.');
                return;
            }
            
            if (!isValidEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            if (!isValidPhone(phone)) {
                alert('Please enter a valid phone number.');
                return;
            }
            
            // In a real application, you would submit the form data to a server here
            console.log('Application form submitted:', { 
                firstName, 
                lastName, 
                email, 
                phone, 
                program 
            });
            
            alert('Thank you for your application! Our admissions team will contact you within 2 business days.');
            
            // Close modal and reset form
            const modal = document.getElementById('applyModal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
            this.reset();
        });
    }
    
    // Helper functions for validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function isValidPhone(phone) {
        // Simple phone validation - accepts numbers, spaces, dashes, parentheses
        const phoneRegex = /^[\d\s\-\(\)\+]+$/;
        return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
    }
}

// Animations on scroll
function initAnimations() {
    // Add animation classes to elements when they come into view
    const animatedElements = document.querySelectorAll('.feature-card, .program-card, .testimonial-card, .process-step');
    
    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        
        animatedElements.forEach(element => {
            animationObserver.observe(element);
        });
    } else {
        // Fallback for browsers without IntersectionObserver support
        animatedElements.forEach(element => {
            element.classList.add('animate-fade-in-up');
        });
    }
    
    // Add scroll-based animation for hero section
    window.addEventListener('scroll', function() {
        const heroSection = document.querySelector('.hero-section');
        const scrollPosition = window.scrollY;
        
        if (heroSection && scrollPosition < window.innerHeight) {
            const opacity = 1 - (scrollPosition / (window.innerHeight * 0.5));
            heroSection.style.opacity = Math.max(opacity, 0.7);
        }
    });
}

// Utility function for debouncing (performance optimization)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle window resize events with debouncing
window.addEventListener('resize', debounce(function() {
    // Adjust pagination position on resize
    const paginationContainer = document.getElementById('paginationContainer');
    if (paginationContainer && window.innerWidth <= 768) {
        paginationContainer.style.right = '10px';
    } else if (paginationContainer) {
        paginationContainer.style.right = '20px';
    }
    
    // Update navbar visibility
    const navbar = document.getElementById('navbar');
    if (navbar && window.scrollY < 100) {
        navbar.classList.remove('navbar-hidden');
        navbar.classList.add('navbar-visible');
    }
}, 250));

// Add keyboard navigation for pagination dots
document.addEventListener('keydown', function(e) {
    const activeDot = document.querySelector('.pagination-dot.active');
    if (!activeDot) return;
    
    const dots = Array.from(document.querySelectorAll('.pagination-dot'));
    const currentIndex = dots.indexOf(activeDot);
    
    if (e.key === 'ArrowUp' && currentIndex > 0) {
        e.preventDefault();
        dots[currentIndex - 1].click();
    } else if (e.key === 'ArrowDown' && currentIndex < dots.length - 1) {
        e.preventDefault();
        dots[currentIndex + 1].click();
    }
});

// Initialize any lazy loading for images (if needed in the future)
function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback to IntersectionObserver for lazy loading
        // This would be implemented if we had many images to optimize
    }
}

// Show navbar when user tries to scroll up quickly
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const navbar = document.getElementById('navbar');
    
    if (scrollTop > lastScrollTop) {
        // Scrolling down
        if (navbar && scrollTop > 100) {
            navbar.classList.add('navbar-hidden');
            navbar.classList.remove('navbar-visible');
        }
    } else {
        // Scrolling up - show navbar
        if (navbar && scrollTop > 50) {
            navbar.classList.remove('navbar-hidden');
            navbar.classList.add('navbar-visible');
        }
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}, false);