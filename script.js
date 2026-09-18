document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll-triggered reveal animations via IntersectionObserver
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                // Once revealed, no need to keep observing
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('is-open');
        });
    }

    // 2. Header dynamic styling on scroll
    const header = document.querySelector('header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 30) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    // 3. Interactive Favorite Heart Button
    const favButtons = document.querySelectorAll('.dish-fav');
    favButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isFav = btn.classList.toggle('is-favorited');
            btn.setAttribute('aria-pressed', isFav);
            btn.innerHTML = isFav ? '&#9829;' : '&#9825;';
            
            // Re-trigger animation on toggle
            btn.style.animation = 'none';
            btn.offsetHeight; // Trigger reflow
            btn.style.animation = '';
        });
    });

    // 4. Navigation logic
    const navItems = document.querySelectorAll('nav ul li');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const text = item.textContent.trim().toLowerCase();
            let targetSection = null;
            
            const isMenuPage = window.location.pathname.endsWith('menu.html');
            const isGalleryPage = window.location.pathname.endsWith('gallery.html');
            const isOtherPage = isMenuPage || isGalleryPage;

            if (text === 'home') {
                if (isOtherPage) {
                    window.location.href = 'index.html';
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            } else if (text === 'menu') {
                if (!isMenuPage) {
                    window.location.href = 'menu.html';
                }
            } else if (text === 'gallery') {
                if (!isGalleryPage) {
                    window.location.href = 'gallery.html';
                }
            } else if (text === 'about us') {
                if (isOtherPage) {
                    window.location.href = 'index.html#about';
                } else {
                    targetSection = document.querySelector('.about');
                }
            } else if (text === 'contact') {
                if (isOtherPage) {
                    window.location.href = 'index.html#contact';
                } else {
                    targetSection = document.querySelector('.info-strip') || document.querySelector('footer');
                }
            }

            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            if (navMenu && navMenu.classList.contains('is-open')) {
                navMenu.classList.remove('is-open');
            }
        });
    });

    // 5. Reservation / Book a Table Modal Handling
    const modal = document.getElementById('booking-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const bookingForm = document.getElementById('booking-form');
    const bookingFormWrapper = document.getElementById('booking-form-wrapper');
    const bookingSuccess = document.getElementById('booking-success');
    const successCloseBtn = document.getElementById('success-close-btn');
    const successDetails = document.getElementById('success-details');
    const bookDateInput = document.getElementById('book-date');

    // Pre-populate date input with today's date and set minimum to today
    if (bookDateInput) {
        const today = new Date().toISOString().split('T')[0];
        bookDateInput.min = today;
        bookDateInput.value = today;
    }

    const openModal = () => {
        if (!modal) return;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // prevent background scrolling
        // Reset form & state if needed
        if (bookingFormWrapper) bookingFormWrapper.style.display = 'block';
        if (bookingSuccess) bookingSuccess.style.display = 'none';
    };

    const closeModal = () => {
        if (!modal) return;
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    // Attach open handler to "BOOK A TABLE" and "RESERVE NOW" buttons
    const bookButtons = document.querySelectorAll('.btn-book, .hero-actions .btn-outline');
    bookButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (successCloseBtn) successCloseBtn.addEventListener('click', closeModal);

    // Close on backdrop click (click outside card)
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
            closeModal();
        }
    });

    // Form submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('book-name')?.value || 'Guest';
            const date = document.getElementById('book-date')?.value || '';
            const time = document.getElementById('book-time')?.value || '';
            const guests = document.getElementById('book-guests')?.value || '2 People';
            const seating = document.getElementById('book-seating')?.value || 'Standard';

            if (successDetails) {
                successDetails.innerHTML = `Thank you, <strong>${name}</strong>! Your table for <strong>${guests}</strong> (${seating}) is reserved for <strong>${date}</strong> at <strong>${time}</strong>. A confirmation has been sent!`;
            }

            if (bookingFormWrapper) bookingFormWrapper.style.display = 'none';
            if (bookingSuccess) bookingSuccess.style.display = 'block';
            bookingForm.reset();
        });
    }
});

