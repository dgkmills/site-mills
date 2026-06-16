// Builds the homepage hero's crossfading project showcase. The cursor-reactive
// wallpaper is handled globally in main.js. Progressive enhancement: if this
// fails, the showcase frame just stays empty and the rest of the hero is fine.
(function () {
    const stage = document.getElementById('hero-showcase');
    if (!stage) return;

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

    const slides = thumbnails.map((name, i) => {
        const slide = document.createElement('div');
        slide.className = 'hero-slide';
        slide.style.backgroundImage = "url('/assets/images/" + name + "')";
        if (i === 0) slide.classList.add('is-active');
        stage.appendChild(slide);
        return slide;
    });

    // Crossfade through the projects (static if the user prefers reduced motion).
    if (!reduceMotion && slides.length > 1) {
        let current = 0;
        setInterval(function () {
            slides[current].classList.remove('is-active');
            current = (current + 1) % slides.length;
            slides[current].classList.add('is-active');
        }, 3500);
    }
})();
