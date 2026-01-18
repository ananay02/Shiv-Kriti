// ==========================================
// MANDALA BIOSCOPE - Interactive JavaScript
// ==========================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initCategoryFilter();
    initLightbox();
    initScrollEffects();
    initNavbar();
    initContactPanel();
    initEmailPopup();
});

// ==========================================
// Category Filter Functionality
// ==========================================
function initCategoryFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Get selected category
            const category = button.getAttribute('data-category');

            // Filter gallery items
            galleryItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');

                if (category === 'all' || itemCategory === category) {
                    item.classList.remove('hidden');
                    // Add fade-in animation
                    item.style.animation = 'fadeIn 0.6s ease';
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
}

// ==========================================
// Lightbox Modal
// ==========================================
function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');

    // Open lightbox on gallery item click
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    // Close lightbox
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    };

    lightboxClose.addEventListener('click', closeLightbox);

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

// ==========================================
// Scroll Effects & Reveal Animations
// ==========================================
function initScrollEffects() {
    const revealElements = document.querySelectorAll('.reveal');

    // Intersection Observer for scroll reveal
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    revealElements.forEach(element => {
        observer.observe(element);
    });
}

// ==========================================
// Navbar Scroll Effect
// ==========================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add 'scrolled' class when user scrolls down
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.nav-links a, .cta-button');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Check if it's an internal anchor link
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);

                // Skip scrolling for contact - it opens the panel instead
                if (targetId === 'contact') {
                    return;
                }

                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    const navbarHeight = navbar.offsetHeight;
                    const sectionHeight = targetSection.offsetHeight;
                    const windowHeight = window.innerHeight;

                    let targetPosition;

                    // Center the About section in viewport
                    if (targetId === 'about') {
                        targetPosition = targetSection.offsetTop - (windowHeight - sectionHeight) / 2;
                    } else {
                        targetPosition = targetSection.offsetTop - navbarHeight;
                    }

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ==========================================
// Utility: Debounce function for performance
// ==========================================
function debounce(func, wait = 10, immediate = true) {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// ==========================================
// Contact Panel
// ==========================================
function initContactPanel() {
    const contactBtn = document.getElementById('contactBtn');
    const contactPanel = document.getElementById('contactPanel');
    const contactOverlay = document.getElementById('contactOverlay');
    const contactClose = document.getElementById('contactPanelClose');
    const contactForm = document.getElementById('contactForm');

    if (!contactBtn || !contactPanel) return;

    // Open panel
    contactBtn.addEventListener('click', (e) => {
        e.preventDefault();
        contactPanel.classList.add('active');
        contactOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Close panel
    const closePanel = () => {
        contactPanel.classList.remove('active');
        contactOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    contactClose.addEventListener('click', closePanel);
    contactOverlay.addEventListener('click', closePanel);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && contactPanel.classList.contains('active')) {
            closePanel();
        }
    });


    // Form submission - opens user's email provider
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('contactName').value;
        const email = document.getElementById('contactEmail').value;
        const message = document.getElementById('contactMessage').value;

        // Create email content
        const subject = encodeURIComponent(`Inquiry from ${name} - Shiv Kriti Website`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        const toEmail = 'shivkritibysangya@gmail.com';

        // Detect email provider from user's email address
        const emailDomain = email.split('@')[1]?.toLowerCase() || '';
        let composeLink;

        if (emailDomain.includes('gmail')) {
            // Gmail
            composeLink = `https://mail.google.com/mail/?view=cm&to=${toEmail}&su=${subject}&body=${body}`;
        } else if (emailDomain.includes('outlook') || emailDomain.includes('hotmail') || emailDomain.includes('live')) {
            // Outlook/Hotmail/Live
            composeLink = `https://outlook.live.com/mail/0/deeplink/compose?to=${toEmail}&subject=${subject}&body=${body}`;
        } else if (emailDomain.includes('yahoo')) {
            // Yahoo
            composeLink = `https://compose.mail.yahoo.com/?to=${toEmail}&subject=${subject}&body=${body}`;
        } else {
            // Default: use mailto for other providers
            composeLink = `mailto:${toEmail}?subject=${subject}&body=${body}`;
        }

        // Open email client
        window.open(composeLink, '_blank');

        // Reset form and close panel
        contactForm.reset();
        closePanel();
    });
}

// ==========================================
// Email Popup with Copy to Clipboard
// ==========================================
function initEmailPopup() {
    const emailBtn = document.getElementById('emailBtn');
    const emailPopup = document.getElementById('emailPopup');

    if (!emailBtn || !emailPopup) return;

    // Toggle popup on button click
    emailBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        emailPopup.classList.toggle('active');
    });

    // Copy email on popup click
    emailPopup.addEventListener('click', (e) => {
        e.stopPropagation();
        const email = 'shivkritibysangya@gmail.com';

        // Copy to clipboard
        navigator.clipboard.writeText(email).then(() => {
            emailPopup.classList.add('copied');

            // Show copied feedback, then hide popup
            setTimeout(() => {
                emailPopup.classList.remove('copied');
                emailPopup.classList.remove('active');
            }, 1500);
        }).catch(err => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = email;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);

            emailPopup.classList.add('copied');
            setTimeout(() => {
                emailPopup.classList.remove('copied');
                emailPopup.classList.remove('active');
            }, 1500);
        });
    });

    // Close popup when clicking outside
    document.addEventListener('click', () => {
        emailPopup.classList.remove('active');
    });
}
