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

// --- Modal Functionality ---
const serviceCards = document.querySelectorAll('[data-modal-target]');
const closeButtons = document.querySelectorAll('.modal-overlay .close-btn');
const modalOverlays = document.querySelectorAll('.modal-overlay');

serviceCards.forEach(card => {
    card.addEventListener('click', () => {
        const modalId = card.getAttribute('data-modal-target');
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
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
        closeModal(button.closest('.modal-overlay'));
    });
});

modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            closeModal(overlay);
        }
    });
});

// --- Hamburger Menu Functionality ---
const hamburger = document.querySelector('.hamburger-menu');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}
