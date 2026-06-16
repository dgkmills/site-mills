// Builds the hero's crossfading project-thumbnail slideshow and drives the
// cursor-following spotlight. Progressive enhancement: if this script fails,
// the hero still shows the CSS aurora + dot grid.
(function () {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Project thumbnails (kept in sync with screenshot.js). Missing files just
    // don't paint, since these are CSS background-images.
    const thumbnails = [
        'tdanthumb.png',
        'portalthumb.png',
        'drkhathumb.png',
        'stocktoolthumb.png',
        'almanac-thumb.png',
        'dialogue-thumb.png',
        'pronunciation-thumb.png',
        'email-assist-thumb.png',
        'mattsworld-thumb.png',
        'areethumb.png',
        'yumwabanpong-thumb.png'
    ];

    // Build the slideshow layer behind everything else in the hero.
    const slideshow = document.createElement('div');
    slideshow.className = 'hero-slideshow';
    slideshow.setAttribute('aria-hidden', 'true');

    const slides = thumbnails.map((name, i) => {
        const slide = document.createElement('div');
        slide.className = 'hero-slide';
        slide.style.backgroundImage = "url('/assets/images/" + name + "')";
        if (i === 0) slide.classList.add('is-active');
        slideshow.appendChild(slide);
        return slide;
    });

    hero.prepend(slideshow);

    // Crossfade through the thumbnails (static if the user prefers reduced motion).
    if (!reduceMotion && slides.length > 1) {
        let current = 0;
        setInterval(function () {
            slides[current].classList.remove('is-active');
            current = (current + 1) % slides.length;
            slides[current].classList.add('is-active');
        }, 5000);
    }

    // Cursor-following spotlight via CSS custom properties (rAF-throttled).
    if (!reduceMotion) {
        let pending = false;
        let lastX = 50;
        let lastY = 50;

        hero.addEventListener('pointermove', function (e) {
            const rect = hero.getBoundingClientRect();
            lastX = ((e.clientX - rect.left) / rect.width) * 100;
            lastY = ((e.clientY - rect.top) / rect.height) * 100;
            if (!pending) {
                pending = true;
                requestAnimationFrame(function () {
                    hero.style.setProperty('--mx', lastX + '%');
                    hero.style.setProperty('--my', lastY + '%');
                    pending = false;
                });
            }
        });
    }
})();
