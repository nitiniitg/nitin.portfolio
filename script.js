/**
 * Professional Portfolio Website - JavaScript Functionality
 * 
 * This script handles:
 * - Smooth scrolling for navigation
 * - Typing animation in hero section
 * - Navbar active link indicator
 * - Mobile hamburger menu toggle
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===== SMOOTH SCROLLING FOR NAVIGATION LINKS =====
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                const hamburger = document.querySelector('.hamburger');
                const navMenu = document.querySelector('.nav-menu');
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                
                // Calculate position accounting for fixed header
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    window.location.hash = targetId;
                }
            }
        });
    });

    // ===== TYPING ANIMATION IN HERO SECTION =====
    const typingTextElement = document.querySelector('.typing-text');
    const cursorElement = document.querySelector('.cursor');
    
    if (typingTextElement) {
        const professions = [
            'DSA/CP Enthusiast',
            'React Javascript',
            'Critical thinking',
            'Web Enthusiast'
        ];
        
        let professionIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isEnd = false;
        
        function type() {
            const currentProfession = professions[professionIndex];
            
            if (isDeleting) {
                // Delete character
                typingTextElement.textContent = currentProfession.substring(0, charIndex - 1);
                charIndex--;
            } else {
                // Add character
                typingTextElement.textContent = currentProfession.substring(0, charIndex + 1);
                charIndex++;
            }
            
            // Determine typing speed
            let typeSpeed = 150;
            
            if (isDeleting) {
                typeSpeed /= 2; // Faster when deleting
            }
            
            // Check if word is complete
            if (!isDeleting && charIndex === currentProfession.length) {
                isEnd = true;
                typeSpeed = 2000; // Pause at end
            } else if (isDeleting && charIndex === 0) {
                isEnd = true;
                typeSpeed = 500; // Pause at start
            }
            
            if (isEnd && !isDeleting) {
                isDeleting = true;
                isEnd = false;
            } else if (isEnd && isDeleting) {
                isDeleting = false;
                isEnd = false;
                professionIndex = (professionIndex + 1) % professions.length;
            }
            
            setTimeout(type, typeSpeed);
        }
        
        // Start typing animation after a brief delay
        setTimeout(type, 1000);
        
        // Blink cursor animation
        setInterval(() => {
            cursorElement.classList.toggle('active');
        }, 400);
    }

    // ===== NAVBAR ACTIVE LINK INDICATOR =====
    const sections = document.querySelectorAll('section[id]');
    
    function activateNavLink() {
        let scrollPosition = window.pageYOffset + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelector(`.nav-link[href="#${sectionId}"]`).classList.add('active');
            } else {
                document.querySelector(`.nav-link[href="#${sectionId}"]`).classList.remove('active');
            }
        });
    }
    
    // Run once on load and then on scroll
    activateNavLink();
    window.addEventListener('scroll', activateNavLink);

    // ===== MOBILE HAMBURGER MENU TOGGLE =====
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Toggle body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking on a nav link
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                if (navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });
    }

    // ===== HEADER SCROLL EFFECT =====
    const header = document.querySelector('.header');
    
    if (header) {
        let lastScroll = 0;
        
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll <= 0) {
                header.classList.remove('scrolled');
                return;
            }
            
            if (currentScroll > lastScroll && currentScroll > 100) {
                // Scrolling down
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                header.style.transform = 'translateY(0)';
            }
            
            // Add shadow when scrolled
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        });
    }
});
/**
 * Professional Portfolio Website - JavaScript Functionality (Part 2)
 * 
 * This script handles:
 * - Form validation for contact form
 * - Scroll-based reveal animations
 * - Back-to-top button functionality
 * - Performance optimizations
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===== FORM VALIDATION =====
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset previous error states
            resetErrors();
            
            // Validate inputs
            let isValid = true;
            
            // Name validation
            if (nameInput.value.trim() === '') {
                showError(nameInput, 'Name is required');
                isValid = false;
            } else if (nameInput.value.trim().length < 2) {
                showError(nameInput, 'Name must be at least 2 characters');
                isValid = false;
            }
            
            // Email validation
            if (emailInput.value.trim() === '') {
                showError(emailInput, 'Email is required');
                isValid = false;
            } else if (!isValidEmail(emailInput.value.trim())) {
                showError(emailInput, 'Please enter a valid email');
                isValid = false;
            }
            
            // Message validation
            if (messageInput.value.trim() === '') {
                showError(messageInput, 'Message is required');
                isValid = false;
            } else if (messageInput.value.trim().length < 10) {
                showError(messageInput, 'Message must be at least 10 characters');
                isValid = false;
            }
            
            // If form is valid, submit it (simulated)
            if (isValid) {
                simulateFormSubmission();
            }
        });
        
        // Helper function to show error messages
        function showError(input, message) {
            const formGroup = input.closest('.form-group');
            const errorElement = document.createElement('small');
            errorElement.className = 'error-message';
            errorElement.textContent = message;
            errorElement.style.color = '#ef4444'; // Red color for errors
            errorElement.style.display = 'block';
            errorElement.style.marginTop = '5px';
            errorElement.style.fontSize = '0.8rem';
            
            formGroup.appendChild(errorElement);
            input.style.borderColor = '#ef4444';
        }
        
        // Helper function to reset errors
        function resetErrors() {
            const errorMessages = document.querySelectorAll('.error-message');
            errorMessages.forEach(error => error.remove());
            
            [nameInput, emailInput, messageInput].forEach(input => {
                input.style.borderColor = '';
            });
        }
        
        // Email validation helper
        function isValidEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }
        
        // Simulate form submission (replace with actual AJAX call)
        function simulateFormSubmission() {
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            // Show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="bi bi-arrow-repeat animate-spin"></i> Sending...';
            
            // Simulate API call delay
            setTimeout(() => {
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = `
                    <i class="bi bi-check-circle-fill"></i>
                    <span>Your message has been sent successfully!</span>
                `;
                successMessage.style.display = 'flex';
                successMessage.style.alignItems = 'center';
                successMessage.style.gap = '0.5rem';
                successMessage.style.marginTop = '1rem';
                successMessage.style.color = '#10b981'; // Green color for success
                
                contactForm.appendChild(successMessage);
                
                // Reset form
                contactForm.reset();
                submitButton.disabled = false;
                submitButton.textContent = originalText;
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            }, 1500);
        }
    }

    // ===== SCROLL-BASED REVEAL ANIMATIONS =====
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.fade-in:not(.animated)');
        const windowHeight = window.innerHeight;
        const windowTop = window.scrollY;
        const windowBottom = windowTop + windowHeight;
        
        elements.forEach(element => {
            const elementHeight = element.offsetHeight;
            const elementTop = element.getBoundingClientRect().top + windowTop;
            const elementBottom = elementTop + elementHeight;
            
            // Check if element is in viewport
            if (elementBottom >= windowTop && elementTop <= windowBottom) {
                element.classList.add('animated');
            }
        });
    };
    
    // Initialize IntersectionObserver for more performant scroll detection
    const initScrollAnimations = function() {
        if ('IntersectionObserver' in window) {
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
            
            document.querySelectorAll('.fade-in').forEach(element => {
                observer.observe(element);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            window.addEventListener('scroll', animateOnScroll);
            window.addEventListener('load', animateOnScroll);
            animateOnScroll();
        }
    };
    
    initScrollAnimations();

    // ===== BACK-TO-TOP BUTTON =====
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('active');
            } else {
                backToTopButton.classList.remove('active');
            }
        });
        
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ===== CURRENT YEAR IN FOOTER =====
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // ===== PERFORMANCE OPTIMIZATIONS =====
    // Debounce scroll events for better performance
    const debounce = function(func, wait = 10, immediate = true) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };
    
    // Apply debouncing to scroll events
    const scrollEvents = ['scroll', 'resize'];
    scrollEvents.forEach(event => {
        window.addEventListener(event, debounce(function() {
            // Re-run functions that need to update on scroll
            activateNavLink();
            animateOnScroll();
        }));
    });

    // ===== PROJECT CARD HOVER EFFECTS =====
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const x = e.pageX - card.offsetLeft;
            const y = e.pageY - card.offsetTop;
            
            const centerX = card.offsetWidth / 2;
            const centerY = card.offsetHeight / 2;
            
            const angleX = (centerY - y) / 10;
            const angleY = (x - centerX) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
    
    // ===== PLATFORMS SECTION ANIMATION =====
const platformCards = document.querySelectorAll('.platform-card');
platformCards.forEach((card, index) => {
    // Add delay based on index for staggered animation
    card.style.animationDelay = `${index * 0.1}s`;
});

    // ===== SKILLS SECTION ANIMATION =====
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach((card, index) => {
        // Add delay based on index for staggered animation
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // ===== TOUCH DEVICE DETECTION =====
    function isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints;
    }
    
    if (isTouchDevice()) {
        document.body.classList.add('touch-device');
        // Disable hover effects on touch devices
        const hoverElements = document.querySelectorAll('[class*="hover:"], [class*="hover-"]');
        hoverElements.forEach(el => {
            el.classList.remove('hover-effect');
        });
    }
});