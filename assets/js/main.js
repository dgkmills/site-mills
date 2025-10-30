// --- Service Worker Registration ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

// --- Intersection Observer for fade-in animations ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// --- General Modal Functionality ---
const serviceCards = document.querySelectorAll('[data-modal-target]');
const closeButtons = document.querySelectorAll('.modal-overlay .close-btn');
const modalOverlays = document.querySelectorAll('.modal-overlay');

serviceCards.forEach(card => {
    card.addEventListener('click', () => {
        const modalId = card.getAttribute('data-modal-target');
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex'; // Use flex to center content
        }
    });
});

const closeModal = (modal) => {
    if (modal) {
        modal.style.display = 'none';
    }
};

closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Find the closest parent modal overlay and close it
        closeModal(button.closest('.modal-overlay'));
    });
});

modalOverlays.forEach(overlay => {
    // Close modal if user clicks on the overlay background
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            closeModal(overlay);
        }
    });
});

// --- Specific Intake Modal Button (Added Fix) ---
const intakeModalButton = document.getElementById('open-modal-btn');
const intakeModal = document.getElementById('intake-modal');

if (intakeModalButton && intakeModal) {
    intakeModalButton.addEventListener('click', () => {
        intakeModal.style.display = 'flex'; // Use flex to show and center
    });
}


// --- Hamburger Menu Functionality ---
const hamburger = document.querySelector('.hamburger-menu');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Optional: Close menu when a link is clicked (useful for SPAs, but good here too)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });
}
