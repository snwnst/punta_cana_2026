(function() {
// Registrar plugins
gsap.registerPlugin(ScrollTrigger);

// ========== CONFIGURACIÓN GLOBAL ==========
// Smooth scroll enhancement (opcional pero recomendado para mejor experiencia)
gsap.config({
    nullTargetWarn: false,
    trialWarn: false
});

// ========== ACCESSIBILITY: PREFERS REDUCED MOTION ==========
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const isReducedMotion = prefersReducedMotion.matches;
if (isReducedMotion) {
    document.documentElement.classList.add('reduced-motion');
}

// Scroll Progress Bar mejorado
if (!isReducedMotion) {
gsap.to('.scroll-progress', {
    width: '100%',
    ease: 'none',
    scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5
    }
});
}

// ========== UTILITY: SPLIT TEXT ==========
// Función helper para split text (si SplitType está disponible)
function splitTextAnimation(selector, options = {}) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        if (typeof SplitType !== 'undefined') {
            const split = new SplitType(el, { types: 'words,chars' });
            const words = split.words;
            
            gsap.from(words, {
                y: 100,
                opacity: 0,
                rotationX: -90,
                transformOrigin: 'bottom center',
                stagger: options.stagger || 0.05,
                duration: options.duration || 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: options.start || 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            });
        } else {
            // Fallback si SplitType no está disponible
            gsap.from(el, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: options.start || 'top 80%'
                }
            });
        }
    });
}

// ========== WRAPPED NEON: THEMES + RECAP RAIL ==========
function setNeonThemeFromSection(sectionEl) {
    if (!sectionEl) return;
    const a1 = sectionEl.dataset.a1;
    const a2 = sectionEl.dataset.a2;
    const a3 = sectionEl.dataset.a3;
    if (!a1 || !a2 || !a3) return;

    // Animate CSS variables so the background "crossfades" like Wrapped chapters
    gsap.to(document.documentElement, {
        '--accent-1': a1,
        '--accent-2': a2,
        '--accent-3': a3,
        duration: 0.9,
        ease: 'power2.out',
        overwrite: true
    });
}

// Highlight recap rail based on scroll position (non-scrub, just state)
document.querySelectorAll('.recap-rail a[href^="#"]').forEach(link => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    ScrollTrigger.create({
        trigger: target,
        start: 'top center',
        end: 'bottom center',
        toggleClass: { targets: link, className: 'is-active' }
    });
});

// Recap rail minimize / maximize (persisted)
const recapRail = document.getElementById('recapRail');
const recapToggle = recapRail?.querySelector('.recap-toggle');
const recapStorageKey = 'recapRailCollapsed';
function setRecapCollapsed(collapsed) {
    if (!recapRail || !recapToggle) return;
    recapRail.classList.toggle('is-collapsed', collapsed);
    recapToggle.setAttribute('aria-expanded', String(!collapsed));
    recapToggle.textContent = collapsed ? '▸' : '▾';
    recapToggle.title = collapsed ? 'Maximizar Recap' : 'Minimizar Recap';
    try { localStorage.setItem(recapStorageKey, collapsed ? '1' : '0'); } catch (e) {}
}
if (recapRail && recapToggle) {
    let initialCollapsed = false;
    try { initialCollapsed = localStorage.getItem(recapStorageKey) === '1'; } catch (e) {}
    setRecapCollapsed(initialCollapsed);
    recapToggle.addEventListener('click', () => setRecapCollapsed(!recapRail.classList.contains('is-collapsed')));
}

// Theme crossfade per chapter/section
gsap.utils.toArray('section[data-a1][data-a2][data-a3]').forEach(section => {
    ScrollTrigger.create({
        trigger: section,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => setNeonThemeFromSection(section),
        onEnterBack: () => setNeonThemeFromSection(section)
    });
});

// If reduced motion, stop here (content remains readable/static)
if (isReducedMotion) {
    return;
}

// ========== HERO SECTION (Mejorado estilo Graffico) ==========
// Parallax avanzado de imagen con múltiples capas
const heroMedia = '#hero .hero-image-container .hero-media, #hero .hero-image-container img, #hero .hero-image-container video';
gsap.set(heroMedia, { willChange: 'transform' });
gsap.to(heroMedia, {
    yPercent: -40,
    scale: 1.15,
    ease: 'none',
    scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
        onLeave: () => gsap.set(heroMedia, { willChange: 'auto' }),
        onLeaveBack: () => gsap.set(heroMedia, { willChange: 'transform' })
    }
});

// Overlay gradient que se mueve (efecto profundidad)
const heroOverlay = document.createElement('div');
heroOverlay.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(180deg, rgba(15,15,15,0) 0%, rgba(15,15,15,0.3) 100%); pointer-events: none; z-index: 1;';
document.querySelector('#hero .hero-image-container').appendChild(heroOverlay);

gsap.to(heroOverlay, {
    opacity: 0.6,
    ease: 'none',
    scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    }
});

// Split text animation para título (estilo Graffico)
const heroTitle = document.querySelector('#hero .hero-title');
if (heroTitle && typeof SplitType !== 'undefined') {
    const splitTitle = new SplitType(heroTitle, { types: 'words,chars' });
    gsap.from(splitTitle.chars, {
        y: 120,
        opacity: 0,
        rotationX: -90,
        transformOrigin: 'bottom center',
        stagger: 0.03,
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: {
            trigger: '#hero',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
} else {
    gsap.from('#hero .hero-title', {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
}

// Barra de acento con draw animation mejorada
gsap.from('#hero .accent-bar', {
    scaleX: 0,
    transformOrigin: 'left',
    duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: {
        trigger: '#hero .accent-bar',
        start: 'top 90%'
    }
});

// Subtítulo con clip-path reveal (estilo Graffico)
gsap.from('#hero .hero-subtitle', {
    clipPath: 'inset(0 100% 0 0)',
    opacity: 0,
    duration: 1,
    ease: 'power2.inOut',
    delay: 0.3,
    scrollTrigger: {
        trigger: '#hero .hero-subtitle',
        start: 'top 85%'
    }
});

// Crew items con stagger mejorado
gsap.from('#hero .crew-item', {
    x: -50,
    opacity: 0,
    stagger: {
        amount: 0.6,
        from: 'start'
    },
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
        trigger: '#hero .crew-info',
        start: 'top 80%'
    }
});

// ========== PROBLEM SECTION (Mejorado) ==========
// Título con split text
splitTextAnimation('#problem .section-title', {
    stagger: 0.08,
    duration: 1,
    start: 'top 75%'
});

// Quote text con reveal mejorado
gsap.from('#problem .quote-text', {
    clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
    opacity: 0,
    duration: 1.5,
    ease: 'power2.inOut',
    scrollTrigger: {
        trigger: '#problem .quote-text',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
    }
});

// Cards con efecto flip 3D mejorado
gsap.utils.toArray('#problem .comparison-card').forEach((card, i) => {
    gsap.set(card, { perspective: 1000 });
    gsap.from(card, {
        y: 120,
        opacity: 0,
        rotateY: i % 2 === 0 ? -25 : 25,
        z: -100,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: card,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
        }
    });
});

// Tabla con filas que aparecen una por una
gsap.from('#problem .comparison-table tbody tr', {
    x: -80,
    opacity: 0,
    stagger: 0.1,
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: {
        trigger: '#problem .comparison-table',
        start: 'top 70%'
    }
});

// Benefit cards con scale y blur effect
gsap.from('#problem .benefit-card', {
    scale: 0.7,
    opacity: 0,
    stagger: {
        amount: 0.6,
        from: 'center'
    },
    duration: 1,
    ease: 'back.out(1.4)',
    scrollTrigger: {
        trigger: '#problem .benefits-grid',
        start: 'top 70%'
    }
});

// Video button con pulse continuo sutil
gsap.to('#problem .video-button', {
    scale: 1.02,
    repeat: -1,
    yoyo: true,
    duration: 2,
    ease: 'power1.inOut',
    scrollTrigger: {
        trigger: '#problem .video-button',
        start: 'top 80%'
    }
});

// ========== ECONOMIC SECTION (Mejorado estilo Graffico) ==========
// Split text para título
splitTextAnimation('#economic .section-title', {
    stagger: 0.06,
    start: 'top 75%'
});

// Cold open: fast editorial reveal + fade-out into hero
splitTextAnimation('#coldopen .coldopen-title', {
    stagger: 0.035,
    duration: 0.9,
    start: 'top 80%'
});

gsap.to('#coldopen .coldopen-wrap', {
    y: -28,
    opacity: 0,
    ease: 'none',
    scrollTrigger: {
        trigger: '#coldopen',
        start: 'center center',
        end: 'bottom top',
        scrub: 0.7
    }
});

// Economic: typography scene (pinned short, crossfade beats)
const econScene = document.querySelector('#economic .type-scene');
const econBeats = gsap.utils.toArray('#economic .type-beat');
if (econScene && econBeats.length) {
    // baseline
    gsap.set(econBeats, { autoAlpha: 0, y: 14 });
    gsap.set(econBeats[0], { autoAlpha: 1, y: 0 });

    const econTl = gsap.timeline({
        scrollTrigger: {
            trigger: '#economic',
            start: 'top top',
            end: '+=160%',
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true
        }
    });

    econBeats.forEach((beat, i) => {
        if (i === 0) {
            econTl.to(beat, { autoAlpha: 1, y: 0, duration: 0.18, ease: 'power2.out' }, 0);
        } else {
            const prev = econBeats[i - 1];
            econTl.to(prev, { autoAlpha: 0, y: -10, duration: 0.22, ease: 'power2.inOut' }, '+=0.45');
            econTl.to(beat, { autoAlpha: 1, y: 0, duration: 0.22, ease: 'power2.out' }, '<');
        }
    });
}

// ========== OPTIONS SECTION (Mejorado con Pin effect) ==========
// Split text para título
splitTextAnimation('#options .section-title', {
    stagger: 0.05,
    start: 'top 75%'
});

// Shared helpers for cycling image galleries (options + hotels)
function parseImagesCsv(raw) {
    return (raw || '').split(',').map(s => s.trim()).filter(Boolean);
}

function transitionFrameTo(frameEl, nextSrc) {
    const a = frameEl?.querySelector?.('.img-a');
    const b = frameEl?.querySelector?.('.img-b');
    if (!a || !b || !nextSrc) return;

    const show = frameEl.dataset.show || 'a';
    const visible = show === 'a' ? a : b;
    const hidden = show === 'a' ? b : a;

    if (hidden.getAttribute('src') !== nextSrc) hidden.setAttribute('src', nextSrc);

    // Optimize will-change during transition
    gsap.set([a, b], { willChange: 'opacity, transform' });
    gsap.set(hidden, { autoAlpha: 0, scale: 1.08 });
    
    const tl = gsap.timeline({
        onComplete: () => gsap.set([a, b], { willChange: 'auto' })
    });
    
    tl.to(hidden, { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'power2.out', overwrite: true }, 0);
    tl.to(visible, { autoAlpha: 0, scale: 1.02, duration: 0.8, ease: 'power2.out', overwrite: true }, 0);

    frameEl.dataset.show = show === 'a' ? 'b' : 'a';
}

// Wrapped-style pinned chapter: scrub through A → B → C
const optionCards = gsap.utils.toArray('#options .option-card-large');
const optionsTl = gsap.timeline({
    scrollTrigger: {
    trigger: '#options',
    start: 'top top',
        end: '+=200%',
    pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
            const idx = Math.min(optionCards.length - 1, Math.floor(self.progress * optionCards.length));
            optionCards.forEach((card, i) => card.classList.toggle('is-active', i === idx));
        }
    }
});

// Keep Top-3 visible on enter (demo-like). Add subtle motion beats while scrubbing.
gsap.set(optionCards, { opacity: 1 });
optionsTl.from(optionCards, {
    y: 34,
    scale: 0.985,
    stagger: 0.08,
    duration: 0.45,
    ease: 'power2.out',
    immediateRender: false
}, 0);

// Gentle emphasis beats (no heavy transforms; class handles glow)
optionsTl.to({}, { duration: 0.33 });
optionsTl.to({}, { duration: 0.33 });
optionsTl.to({}, { duration: 0.34 });

// Cycle through ALL images for each option card (only while #options is in view)
const optionGalleryTimelines = [];
function startOptionsGalleries() {
    if (optionGalleryTimelines.length) return;
    optionCards.forEach((card, idx) => {
        const images = parseImagesCsv(card.dataset.images);
        const frame = card.querySelector('.option-gallery .image-frame');
        if (!frame || images.length < 2) return;

        frame.dataset.show = frame.dataset.show || 'a';
        let step = idx % images.length;

        const tick = () => {
            const src = images[step % images.length];
            step = (step + 1) % images.length;
            transitionFrameTo(frame, src);
        };

        tick();
        const tl = gsap.timeline({ repeat: -1 });
        tl.to({}, { duration: 1.7, onRepeat: tick });
        optionGalleryTimelines.push(tl);
    });
}

function stopOptionsGalleries() {
    optionGalleryTimelines.forEach(tl => tl.kill());
    optionGalleryTimelines.length = 0;
}

ScrollTrigger.create({
    trigger: '#options',
    start: 'top 70%',
    end: 'bottom 30%',
    onEnter: startOptionsGalleries,
    onEnterBack: startOptionsGalleries,
    onLeave: stopOptionsGalleries,
    onLeaveBack: stopOptionsGalleries
});

// ========== BUDGET SECTION (visual clarity) ==========
const budgetRows = gsap.utils.toArray('#budget .budget-row');
if (budgetRows.length) {
    gsap.from('#budget .section-title, #budget .section-subtitle', {
        y: 18,
        autoAlpha: 0,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.08,
        scrollTrigger: {
            trigger: '#budget',
            start: 'top 75%'
        }
    });

    gsap.from('#budget .budget-table tbody tr', {
        y: 14,
        autoAlpha: 0,
        duration: 0.55,
        ease: 'power2.out',
        stagger: 0.06,
        scrollTrigger: {
            trigger: '#budget .budget-table',
            start: 'top 78%'
        }
    });

}

// ========== HOTELS CAROUSEL (Pinned + Transitions) ==========
const hotelSlides = gsap.utils.toArray('#hotels .hotel-slide');
const hotelDots = gsap.utils.toArray('#hotels .hotel-dot');
if (hotelSlides.length) {
    let currentHotelIndex = -1;
    const galleryTimelines = new Map();

    function startGalleryForSlide(slideEl) {
        if (!slideEl) return;
        if (galleryTimelines.has(slideEl)) return;

        const images = parseImagesCsv(slideEl?.dataset?.images);
        if (images.length < 2) return;

        const heroFrame = slideEl.querySelector('.image-frame[data-slot="hero"]');
        const sub1Frame = slideEl.querySelector('.image-frame[data-slot="sub1"]');
        const sub2Frame = slideEl.querySelector('.image-frame[data-slot="sub2"]');
        if (!heroFrame || !sub1Frame || !sub2Frame) return;

        // Build thumbnail strip once (so the user can see ALL images)
        const thumbs = slideEl.querySelector('.hotel-thumbs');
        if (thumbs && !thumbs.dataset.built) {
            thumbs.dataset.built = '1';
            thumbs.innerHTML = '';
            images.forEach((src, i) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'hotel-thumb' + (i === 0 ? ' is-active' : '');
                btn.dataset.index = String(i);
                btn.setAttribute('aria-label', `Foto ${i + 1}`);
                btn.innerHTML = `<img src="${src}" alt="" aria-hidden="true" loading="lazy" decoding="async">`;
                btn.addEventListener('click', () => {
                    const idx = Number(btn.dataset.index || 0);
                    if (!Number.isFinite(idx)) return;
                    // set the next hero image immediately
                    transitionFrameTo(heroFrame, images[idx % images.length]);
                    // highlight
                    thumbs.querySelectorAll('.hotel-thumb').forEach((el, j) => el.classList.toggle('is-active', j === idx));
                    // nudge the sequence so auto-cycle continues from here
                    step = idx;
                    lastManualAt = performance.now();
                });
                thumbs.appendChild(btn);
            });
        }

        // ensure baseline state
        [heroFrame, sub1Frame, sub2Frame].forEach(f => {
            if (!f.dataset.show) f.dataset.show = 'a';
            const a = f.querySelector('.img-a');
            const b = f.querySelector('.img-b');
            if (a) gsap.set(a, { autoAlpha: 1, scale: 1 });
            if (b) gsap.set(b, { autoAlpha: 0, scale: 1.08 });
        });

        let step = 0;
        let lastManualAt = 0;
        const tick = () => {
            // If user just clicked a thumb, pause auto-cycle briefly
            if (lastManualAt && (performance.now() - lastManualAt) < 5000) return;
            // stagger offsets so the 3 frames don't show the same image
            const heroSrc = images[(step) % images.length];
            const sub1Src = images[(step + 1) % images.length];
            const sub2Src = images[(step + 2) % images.length];
            step = (step + 1) % images.length;

            transitionFrameTo(heroFrame, heroSrc);
            transitionFrameTo(sub1Frame, sub1Src);
            transitionFrameTo(sub2Frame, sub2Src);

            // keep thumb highlight roughly in sync with the hero image
            if (thumbs) {
                const idx = (step - 1 + images.length) % images.length;
                thumbs.querySelectorAll('.hotel-thumb').forEach((el, j) => el.classList.toggle('is-active', j === idx));
            }
        };

        // Immediate first tick to align with the slide's image set
        tick();

        const tl = gsap.timeline({ repeat: -1 });
        tl.to({}, {
            duration: 2.2,
            onRepeat: tick
        });

        galleryTimelines.set(slideEl, tl);
    }

    function stopGalleriesExcept(activeSlide) {
        galleryTimelines.forEach((tl, slide) => {
            if (slide !== activeSlide) {
                tl.kill();
                galleryTimelines.delete(slide);
            }
        });
    }

    function activateHotel(index) {
        const idx = Math.max(0, Math.min(hotelSlides.length - 1, index));
        if (idx === currentHotelIndex) return;
        currentHotelIndex = idx;

        hotelSlides.forEach((slide, i) => slide.classList.toggle('is-active', i === idx));
        hotelDots.forEach((btn, i) => btn.classList.toggle('is-active', i === idx));

        // Theme shift per hotel
        setNeonThemeFromSection(hotelSlides[idx]);

        // Stagger reveal text + images for the active hotel
        const active = hotelSlides[idx];
        const textEls = active.querySelectorAll('.hotel-text > *');
        const frames = active.querySelectorAll('.hotel-image-grid .image-frame');
        const budgetCard = active.querySelector('.hotel-budget-card');

        gsap.fromTo(textEls,
            { y: 16, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.45, ease: 'power2.out', stagger: 0.03, overwrite: true }
        );

        gsap.fromTo(frames,
            { y: 18, autoAlpha: 0, scale: 1.03 },
            { y: 0, autoAlpha: 1, scale: 1, duration: 0.55, ease: 'power2.out', stagger: 0.06, overwrite: true }
        );

        // Animate budget card entrance
        if (budgetCard) {
            // Ensure budget card is visible for active hotel
            gsap.fromTo(budgetCard,
                { opacity: 0, y: 10, autoAlpha: 0 },
                { opacity: 1, y: 0, autoAlpha: 1, duration: 0.6, ease: 'power2.out', delay: 0.2, overwrite: true }
            );
        }
        
        // Hide budget cards from inactive hotels
        hotelSlides.forEach((slide, i) => {
            if (i !== idx) {
                const inactiveBudgetCard = slide.querySelector('.hotel-budget-card');
                if (inactiveBudgetCard) {
                    gsap.set(inactiveBudgetCard, { opacity: 0, autoAlpha: 0, y: 10 });
                }
            }
        });

        stopGalleriesExcept(active);
        startGalleryForSlide(active);
    }

    // Default active - Initialize first hotel's budget card immediately
    const firstSlide = hotelSlides[0];
    if (firstSlide) {
        const firstBudgetCard = firstSlide.querySelector('.hotel-budget-card');
        if (firstBudgetCard) {
            gsap.set(firstBudgetCard, { opacity: 1, autoAlpha: 1, y: 0 });
        }
    }
    
    activateHotel(0);

    const hotelsTl = gsap.timeline({
    scrollTrigger: {
            trigger: '#hotels',
            start: 'top top',
            end: () => `+=${hotelSlides.length * 120}%`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                const idx = Math.min(hotelSlides.length - 1, Math.floor(self.progress * hotelSlides.length));
                activateHotel(idx);
            }
        }
    });

    // Spacer beats so scrolling has "steps"
    hotelSlides.forEach(() => hotelsTl.to({}, { duration: 1 }));

    // Click-to-jump controls
    hotelDots.forEach((btn) => {
        btn.addEventListener('click', () => {
            const idx = Number(btn.dataset.index || 0);
            const st = hotelsTl.scrollTrigger;
            if (!st) return;
            const p = hotelSlides.length > 1 ? (idx / (hotelSlides.length - 1)) : 0;
            const y = st.start + (st.end - st.start) * p;
            window.scrollTo({ top: y, behavior: 'smooth' });
        });
    });
}

// ========== HOTEL SECTIONS (Mejorado con Counter Animations) ==========
gsap.utils.toArray('.hotel-section').forEach((section, index) => {
    // Título con split text
    const hotelTitle = section.querySelector('.hotel-title');
    if (hotelTitle && typeof SplitType !== 'undefined') {
        const split = new SplitType(hotelTitle, { types: 'words' });
        gsap.from(split.words, {
            y: 80,
            opacity: 0,
            rotationX: -45,
            stagger: 0.08,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 70%'
            }
        });
    } else {
        gsap.from(hotelTitle, {
            x: -50,
            opacity: 0,
            duration: 0.8,
            scrollTrigger: {
                trigger: section,
                start: 'top 70%'
            }
        });
    }

    // Counter animation para números (estilo Graffico)
    section.querySelectorAll('.stat-number').forEach(statNum => {
        const text = statNum.textContent;
        const numbers = text.match(/\d+/g);
        if (numbers) {
            numbers.forEach(num => {
                const numValue = parseInt(num.replace(/[^\d]/g, ''));
                if (numValue && numValue > 0) {
                    const originalText = statNum.textContent;
                    gsap.to({ value: 0 }, {
                        value: numValue,
                        duration: 2,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: statNum,
                            start: 'top 85%'
                        },
                        onUpdate: function() {
                            const rounded = Math.round(this.targets()[0].value);
                            statNum.textContent = originalText.replace(num, rounded);
                        }
                    });
                }
            });
        }
    });

    // Stats grid con stagger mejorado
    gsap.from(section.querySelectorAll('.stat-item'), {
        y: 40,
        opacity: 0,
        x: -20,
        stagger: {
            amount: 0.5,
            from: 'random'
        },
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: section.querySelector('.stats-section'),
            start: 'top 80%'
        }
    });

    // Imágenes con parallax y zoom ken burns
    gsap.utils.toArray(section.querySelectorAll('.hotel-image-grid img')).forEach((img, imgIndex) => {
        gsap.from(img, {
            scale: 1.4,
            opacity: 0,
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: img,
                start: 'top 80%'
            }
        });

        // Ken burns effect mientras se hace scroll
        gsap.to(img, {
            scale: 1.1,
            ease: 'none',
            scrollTrigger: {
                trigger: img,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.5
            }
        });
    });
});

// ========== COMPARISON TABLE (Mejorado con más impacto visual) ==========
// Header con slide down + imágenes que aparecen escalonadas
gsap.from('#comparison .comparison-table-large thead', {
    y: -80,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
        trigger: '#comparison .comparison-table-large',
        start: 'top 75%'
    }
});

// Imágenes de hoteles aparecen con scale y glow
gsap.from('#comparison .hotel-header-image', {
    scale: 0.6,
    opacity: 0,
    rotation: -5,
    stagger: {
        amount: 0.4,
        from: 'start'
    },
    duration: 0.8,
    ease: 'back.out(1.4)',
    scrollTrigger: {
        trigger: '#comparison .comparison-table-large',
        start: 'top 75%'
    }
});

// Filas con reveal desde izquierda + badges que aparecen después
gsap.from('#comparison .comparison-table-large tbody tr', {
    x: -150,
    opacity: 0,
    clipPath: 'inset(0 100% 0 0)',
    stagger: {
        amount: 0.8,
        from: 'start'
    },
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
        trigger: '#comparison .comparison-table-large',
        start: 'top 65%'
    }
});

// Badges aparecen con bounce después de las filas
gsap.from('#comparison .comparison-badge', {
    scale: 0,
    opacity: 0,
    rotation: -10,
    stagger: {
        amount: 0.3,
        from: 'random'
    },
    duration: 0.5,
    ease: 'back.out(1.6)',
    scrollTrigger: {
        trigger: '#comparison .comparison-table-large',
        start: 'top 60%'
    }
});

// Iconos de categoría con pulse inicial
gsap.from('#comparison .category-icon', {
    scale: 0,
    rotation: 180,
    opacity: 0,
    duration: 0.6,
    ease: 'elastic.out(1, 0.5)',
    stagger: 0.1,
    scrollTrigger: {
        trigger: '#comparison .comparison-table-large',
        start: 'top 70%'
    }
});

// Highlight text con pulse sutil mejorado
gsap.utils.toArray('#comparison .highlight-text').forEach(highlight => {
    gsap.to(highlight, {
        scale: 1.02,
        repeat: -1,
        yoyo: true,
        duration: 2.5,
        ease: 'power1.inOut',
        scrollTrigger: {
            trigger: highlight,
            start: 'top 80%'
        }
    });
});

// Badges con hover effect mejorado (glow)
document.querySelectorAll('#comparison .comparison-badge').forEach(badge => {
    badge.addEventListener('mouseenter', () => {
        gsap.to(badge, {
            scale: 1.08,
            boxShadow: '0 0 20px rgba(43, 231, 255, 0.4)',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    badge.addEventListener('mouseleave', () => {
        gsap.to(badge, {
            scale: 1,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// ========== VERDICT SECTION (Mejorado estilo Graffico) ==========
// Split text para título
splitTextAnimation('#verdict .section-title', {
    stagger: 0.06,
    start: 'top 75%'
});

// Cards normales con entrada desde diferentes direcciones
gsap.utils.toArray('#verdict .verdict-card:not(.featured)').forEach((card, index) => {
    const angle = (index % 3) * 120; // Distribución circular
    const radius = 150;
    const x = Math.cos(angle * Math.PI / 180) * radius;
    const y = Math.sin(angle * Math.PI / 180) * radius;
    
    gsap.from(card, {
        x: x,
        y: y,
        scale: 0.7,
        opacity: 0,
        rotation: angle / 10,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: card,
            start: 'top 80%'
        }
    });
});

// Card destacada con animación especial mejorada
const featuredCard = document.querySelector('#verdict .verdict-card.featured');
if (featuredCard) {
    gsap.from(featuredCard, {
        scale: 0,
        rotation: 360,
        opacity: 0,
        z: -200,
        duration: 1.5,
        ease: 'elastic.out(1, 0.6)',
        scrollTrigger: {
            trigger: featuredCard,
            start: 'top 85%'
        }
    });

    // Pulse continuo mejorado con glow effect
    gsap.to(featuredCard, {
        boxShadow: '0 0 40px rgba(15, 15, 15, 0.3)',
        repeat: -1,
        yoyo: true,
        duration: 2.5,
        ease: 'power1.inOut',
        scrollTrigger: {
            trigger: featuredCard,
            start: 'top 85%'
        }
    });
}

// ========== COMMITMENT SECTION (Mejorado) ==========
// Split text para título
splitTextAnimation('#commitment .section-title', {
    stagger: 0.05,
    start: 'top 75%'
});

// Iconos con animación mejorada (estilo Graffico)
gsap.from('#commitment .icon-circle', {
    scale: 0,
    rotation: 720,
    opacity: 0,
    y: 50,
    duration: 1.2,
    ease: 'elastic.out(1, 0.5)',
    stagger: {
        amount: 0.8,
        from: 'random'
    },
    scrollTrigger: {
        trigger: '#commitment .commitment-grid',
        start: 'top 70%'
    }
});

// Items con entrada desde diferentes direcciones
gsap.utils.toArray('#commitment .commitment-item').forEach((item, index) => {
    const direction = index % 2 === 0 ? -100 : 100;
    gsap.from(item, {
        x: direction,
        y: 60,
        opacity: 0,
        scale: 0.9,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: item,
            start: 'top 75%'
        }
    });
});

// Signature con typewriter effect (opcional)
gsap.from('#commitment .signature-text', {
    opacity: 0,
    y: 30,
    duration: 1.2,
    ease: 'power2.out',
    scrollTrigger: {
        trigger: '#commitment .signature-section',
        start: 'top 80%'
    }
});

// Línea con draw animation mejorada
gsap.from('#commitment .accent-line', {
    scaleX: 0,
    transformOrigin: 'center',
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: {
        trigger: '#commitment .accent-line',
        start: 'top 85%'
    }
});

// ========== FINAL SECTION (Mejorado estilo Graffico) ==========
// Título con split text dramático
const finalTitle = document.querySelector('#final .final-title');
if (finalTitle && typeof SplitType !== 'undefined') {
    const split = new SplitType(finalTitle, { types: 'words,chars' });
    gsap.from(split.chars, {
        y: 150,
        opacity: 0,
        rotationX: -90,
        transformOrigin: 'bottom center',
        stagger: 0.04,
        duration: 1.5,
        ease: 'power4.out',
        scrollTrigger: {
            trigger: '#final',
            start: 'top 80%'
        }
    });
} else {
    gsap.from('#final .final-title', {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '#final',
            start: 'top 80%'
        }
    });
}

// Texto emocional con reveal mejorado (sin clipPath que puede ocultar texto)
gsap.from('#final .emotional-text', {
    opacity: 0,
    y: 60,
    duration: 1.5,
    ease: 'power2.inOut',
    delay: 0.4,
    scrollTrigger: {
        trigger: '#final .emotional-text',
        start: 'top 80%',
        toggleActions: 'play none none reverse' // Asegura que se muestre siempre
    }
});

// Comparison items con entrada desde lados opuestos
gsap.from('#final .comparison-item:first-child', {
    x: -200,
    opacity: 0,
    rotation: -5,
    duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: {
        trigger: '#final .comparison-box',
        start: 'top 75%',
        toggleActions: 'play none none reverse' // Asegura que se muestre siempre
    }
});

gsap.from('#final .comparison-item:last-child', {
    x: 200,
    opacity: 0,
    rotation: 5,
    duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: {
        trigger: '#final .comparison-box',
        start: 'top 75%',
        toggleActions: 'play none none reverse' // Asegura que se muestre siempre
    }
});

// CTA con animación mejorada + efecto persuasivo
gsap.from('#final .cta-text', {
    scale: 0.6,
    opacity: 0,
    duration: 1.5,
    ease: 'elastic.out(1, 0.5)',
    scrollTrigger: {
        trigger: '#final .cta-text',
        start: 'top 85%',
        toggleActions: 'play none none reverse' // Asegura que se muestre siempre
    }
});

// Pulse continuo mejorado con glow effect
gsap.to('#final .cta-text', {
    scale: 1.08,
    repeat: -1,
    yoyo: true,
    duration: 2.5,
    ease: 'power1.inOut',
    scrollTrigger: {
        trigger: '#final .cta-text',
        start: 'top 85%'
    }
});

// Reforzar mensaje persuasivo: comparación visual más impactante
// NOTA: Esta animación está comentada porque entra en conflicto con las animaciones individuales de arriba
// Las animaciones individuales (first-child y last-child) ya cubren ambos items con efectos más específicos
// gsap.from('#final .comparison-item', {
//     y: 60,
//     opacity: 0,
//     scale: 0.9,
//     stagger: {
//         amount: 0.4,
//         from: 'start'
//     },
//     duration: 1,
//     ease: 'power3.out',
//     scrollTrigger: {
//         trigger: '#final .comparison-box',
//         start: 'top 75%',
//         toggleActions: 'play none none reverse'
//     }
// });

// Efecto de "llamada a la acción" más fuerte en el texto emocional (sin hacer transparente)
const emotionalText = document.querySelector('#final .emotional-text');
if (emotionalText) {
    // En lugar de hacer transparente, mejoramos el color gradualmente
    gsap.to(emotionalText, {
        color: 'var(--text-0)', // Cambia a color más brillante
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: emotionalText,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
}

// ========== EFECTOS GLOBALES (Estilo Graffico) ==========
// Parallax sutil en todas las secciones (excluyendo final para evitar problemas de overlay)
gsap.utils.toArray('.section').forEach((section, index) => {
    // Avoid transforms on pinned chapters (transform + pin can cause visual overlap)
    // También excluimos la sección final para evitar problemas de overlay
    if (index > 0 && !section.matches('#options, #hotels, #economic, #final')) {
        gsap.to(section, {
            yPercent: -4,
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.5
            }
        });
    }
});

// ========== REFRESH Y CLEANUP ==========
// Refresh ScrollTrigger después de cargar todo
window.addEventListener('load', () => {
    ScrollTrigger.refresh();
    // Forzar recálculo después de un breve delay
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 100);
});

// Cleanup al salir de la página
window.addEventListener('beforeunload', () => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
});
})();
