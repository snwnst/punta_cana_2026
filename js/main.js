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

// ========== BUDGET SECTION (Enhanced Animations) ==========
const budgetRows = gsap.utils.toArray('#budget .budget-row');
const budgetTable = document.querySelector('#budget .budget-table');
const budgetTableHead = document.querySelector('#budget .budget-table thead');
const budgetFootnote = document.querySelector('#budget .budget-footnote');

if (budgetRows.length) {
    // Ensure all elements are visible initially (fallback if ScrollTrigger doesn't fire)
    gsap.set('#budget .section-title, #budget .section-subtitle', { 
        autoAlpha: 1,
        opacity: 1,
        visibility: 'visible'
    });
    
    if (budgetTableHead) {
        gsap.set(budgetTableHead, { 
            autoAlpha: 1,
            opacity: 1,
            visibility: 'visible',
            x: 0
        });
    }
    
    gsap.set('#budget .budget-table tbody tr', { 
        autoAlpha: 1,
        opacity: 1,
        visibility: 'visible',
        y: 0,
        scale: 1
    });
    
    if (budgetFootnote) {
        gsap.set(budgetFootnote, { 
            autoAlpha: 1,
            opacity: 1,
            visibility: 'visible',
            y: 0
        });
    }

    // Create master timeline for Budget section
    const budgetTL = gsap.timeline({
        scrollTrigger: {
            trigger: '#budget',
            start: 'top 80%',
            once: true
        }
    });

    // 1. Title and subtitle with enhanced entrance
    budgetTL.from('#budget .section-title', {
        y: 30,
        autoAlpha: 0,
        scale: 0.95,
        duration: 0.9,
        ease: 'power3.out'
    })
    .from('#budget .section-subtitle', {
        y: 20,
        autoAlpha: 0,
        duration: 0.7,
        ease: 'power2.out'
    }, '-=0.4');

    // 2. Table header with slide-in effect
    if (budgetTableHead) {
        budgetTL.from(budgetTableHead, {
            x: -30,
        autoAlpha: 0,
        duration: 0.6,
            ease: 'power2.out'
        }, '-=0.2');
    }

    // 3. Table rows with enhanced stagger and scale effect
    budgetTL.from('#budget .budget-table tbody tr', {
        y: 20,
        autoAlpha: 0,
        scale: 0.98,
        duration: 0.65,
        ease: 'back.out(1.1)',
        stagger: {
            amount: 0.4,
            from: 'start'
        }
    }, '-=0.3');

    // 4. Highlight premium rows with a subtle glow effect
    const premiumRows = gsap.utils.toArray('#budget .budget-row.is-premium');
    if (premiumRows.length) {
        budgetTL.to(premiumRows, {
            boxShadow: '0 0 20px rgba(255, 43, 214, 0.3)',
        duration: 0.8,
            ease: 'power2.inOut',
            stagger: 0.1
        }, '-=0.2');
    }

    // 5. Footnote fade in
    if (budgetFootnote) {
        budgetTL.from(budgetFootnote, {
            y: 10,
            autoAlpha: 0,
            duration: 0.5,
            ease: 'power2.out'
        }, '-=0.1');
    }
}

// ========== QUICK DECISION GUIDE (Enhanced Animations) ==========
const decisionCards = gsap.utils.toArray('.decision-card');
const quickDecisionGuide = document.querySelector('.quick-decision-guide');

if (decisionCards.length && quickDecisionGuide) {
    // Ensure all cards are visible initially
    gsap.set('.decision-card', { 
        autoAlpha: 1, 
        opacity: 1, 
        visibility: 'visible',
        y: 0,
        scale: 1,
        rotation: 0
    });
    
    // Create timeline for Quick Decision Guide
    const decisionTL = gsap.timeline({
        scrollTrigger: {
            trigger: quickDecisionGuide,
            start: 'top 75%',
            once: true
        }
    });

    // 1. Title with enhanced entrance
    decisionTL.from('.quick-decision-title', {
        y: 35,
            autoAlpha: 0,
        scale: 0.92,
        rotationX: -15,
        duration: 1,
        ease: 'power3.out',
        transformOrigin: 'center bottom'
    });

    // 2. Cards with sophisticated entrance animation
    decisionCards.forEach((card, index) => {
        const isFirst = index === 0; // Lopesan card gets special treatment
        
        decisionTL.fromTo(card, 
            {
                y: 50,
                autoAlpha: 0,
                scale: 0.85,
                rotationY: -10,
                opacity: 0,
                filter: 'blur(8px)'
            },
            {
                y: 0,
                autoAlpha: 1,
                opacity: 1,
                scale: 1,
                rotationY: 0,
                filter: 'blur(0px)',
                duration: isFirst ? 0.9 : 0.75,
                delay: index * 0.08,
                ease: isFirst ? 'back.out(1.4)' : 'back.out(1.2)',
                transformOrigin: 'center center',
                onComplete: () => {
                    // Ensure visibility
                    gsap.set(card, { autoAlpha: 1, opacity: 1, visibility: 'visible' });
                }
            },
            isFirst ? '-=0.3' : '-=0.2'
        );

        // Add subtle glow pulse to first card (Lopesan)
        if (isFirst) {
            decisionTL.to(card, {
                boxShadow: '0 0 30px rgba(255, 43, 214, 0.4)',
            duration: 0.6,
                ease: 'power2.inOut',
                yoyo: true,
                repeat: 1
            }, '-=0.4');
        }
    });
    
    // Enhanced interactive hover effects with GSAP
    decisionCards.forEach((card, index) => {
        const isFirst = index === 0; // Lopesan card
        
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: isFirst ? 1.05 : 1.03,
                y: -6,
                rotationY: isFirst ? 2 : 1,
                boxShadow: isFirst 
                    ? '0 12px 40px rgba(255, 43, 214, 0.4), 0 0 60px rgba(255, 43, 214, 0.2)' 
                    : '0 10px 30px rgba(43, 231, 255, 0.3)',
                duration: 0.4,
                ease: 'power2.out'
            });
            
            // Animate emoji
            const emoji = card.querySelector('.decision-emoji');
            if (emoji) {
                gsap.to(emoji, {
                    scale: 1.2,
                    rotation: isFirst ? 10 : 5,
                    duration: 0.4,
                    ease: 'back.out(1.5)'
                });
            }
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                y: 0,
                rotationY: 0,
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.45)',
                duration: 0.35,
                ease: 'power2.out'
            });
            
            // Reset emoji
            const emoji = card.querySelector('.decision-emoji');
            if (emoji) {
                gsap.to(emoji, {
                    scale: 1,
                    rotation: 0,
                    duration: 0.35,
                    ease: 'power2.out'
                });
            }
        });
    });
}

// ========== PERFORMANCE CURVE - DYNAMIC DATA VISUALIZATION ==========
function initPerformanceCurve() {
    const curveSvg = document.querySelector('.curve-svg');
    const curveChart = document.querySelector('#performanceCurveChart');

    if (!curveSvg || !curveChart) {
        console.warn('Performance curve elements not found, retrying...');
        // Retry after a short delay
        setTimeout(initPerformanceCurve, 100);
        return;
    }

    // Continue with initialization
    (function(curveSvg, curveChart) {
    // Resort data with real prices and scores
    const resortsData = [
          { 
            name: 'Dreams Onyx', 
            price: 102798, 
            score: 95, 
            stars: 5,
            color: '#8A5CFF',
            hotel: 'onyx',
            monthly: 3807
        },
        { 
            name: 'Serenade Punta Cana', 
            price: 109954, 
            score: 92, 
            stars: 5,
            color: '#2BE7FF',
            hotel: 'serenade',
            monthly: 4072, 
        },
        { 
            name: 'Iberostar Waves Dominicana', 
            price: 41460, 
            score: 74, 
            stars: 4,
            color: '#B7FF2B',
            hotel: 'iberostar',
            monthly: 1536
        },
        { 
            name: 'Barceló Bávaro Palace', 
            price: 46920, 
            score: 80, 
            stars: 5,
            color: '#FFB020',
            hotel: 'barcelo',
            monthly: 1738
        },
        { 
            name: 'Lopesan Costa Bávaro', 
            price: 116585, 
            score: 100, 
            stars: 5,
            color: '#FF2BD6',
            hotel: 'lopesan',
            monthly: 4318,
        },
        { 
            name: 'Nickelodeon Hotels & Resorts Punta Cana', 
            price: 155000, 
            score: 103, 
            stars: 5,
            color: '#FF6B9D',
            hotel: 'nickelodeon',
            monthly: 5741,
            isUltraLuxury: true
        },
        { 
            name: 'Hard Rock Hotel & Casino Punta Cana', 
            price: 165000, 
            score: 104, 
            stars: 5,
            color: '#FF8C42',
            hotel: 'hardrock',
            monthly: 6111,
            isUltraLuxury: true
        },
        { 
            name: 'W Punta Cana (Adult All-Inclusive)', 
            price: 180000, 
            score: 108, 
            stars: 5,
            color: '#C084FC',
            hotel: 'wpunta',
            monthly: 6667,
            isUltraLuxury: true
        },
        { 
            name: 'Eden Roc Cap Cana (Ultra Luxury)', 
            price: 280000, 
            score: 112, 
            stars: 5,
            color: '#FF6B9D',
            hotel: 'edenroc',
            monthly: 10370,
            isUltraLuxury: true
        }
    ];

    // Calculate value index (score/price ratio)
    resortsData.forEach(resort => {
        resort.valueIndex = (resort.score / resort.price) * 10000; // Scale for readability
    });

    // Sort data by price (ascending) - required for scatter plot
    resortsData.sort((a, b) => a.price - b.price);

    // SVG dimensions - more compact to fit in viewport
    const svgWidth = 900;
    const svgHeight = 400;
    const padding = { top: 50, right: 70, bottom: 60, left: 70 };
    const chartWidth = svgWidth - padding.left - padding.right;
    const chartHeight = svgHeight - padding.top - padding.bottom;

    // Calculate scales
    const minPrice = Math.min(...resortsData.map(r => r.price));
    const maxPrice = Math.max(...resortsData.map(r => r.price));
    const minScore = Math.min(...resortsData.map(r => r.score));
    const maxScore = Math.max(...resortsData.map(r => r.score));
    const minStars = Math.min(...resortsData.map(r => r.stars));
    const maxStars = Math.max(...resortsData.map(r => r.stars));
    
    // Calculate circle radius based on price, score, and stars
    // Formula: weighted combination of normalized values
    function calculateCircleRadius(resort) {
        // Normalize values to 0-1 range
        const normalizedPrice = (resort.price - minPrice) / (maxPrice - minPrice);
        const normalizedScore = (resort.score - minScore) / (maxScore - minScore);
        const normalizedStars = (resort.stars - minStars) / (maxStars - minStars);
        
        // Weighted combination (score and stars more important than price)
        // Higher score/stars = larger circle, but price also contributes
        const combinedValue = (normalizedScore * 0.5) + (normalizedStars * 0.3) + (normalizedPrice * 0.2);
        
        // Scale to radius range: 6px (min) to 18px (max)
        const minRadius = 6;
        const maxRadius = 18;
        const radius = minRadius + (combinedValue * (maxRadius - minRadius));
        
        // Sweet Spot gets a slight boost for visibility
        if (resort.isSweetSpot) {
            return Math.max(radius, 14); // Minimum 14px for Sweet Spot
        }
        
        return radius;
    }

    const priceScale = (price) => {
        return padding.left + ((price - minPrice) / (maxPrice - minPrice)) * chartWidth;
    };

    const scoreScale = (score) => {
        return padding.top + chartHeight - ((score - minScore) / (maxScore - minScore)) * chartHeight;
    };

    // Use already sorted data (resortsData is already sorted by price)
    const sortedResorts = [...resortsData];

    // Generate smoothed curve using Catmull-Rom spline interpolation
    // This curve shows diminishing returns - flattens after Lopesan (Sweet Spot)
    function generateSmoothedCurve() {
        if (sortedResorts.length < 2) {
            return '';
        }

        // Convert to SVG coordinates
        const points = sortedResorts.map(resort => ({
            x: priceScale(resort.price),
            y: scoreScale(resort.score),
            price: resort.price,
            score: resort.score,
            isSweetSpot: resort.isSweetSpot
        }));

        // Find Lopesan index (Sweet Spot)
        const sweetSpotIndex = points.findIndex(p => p.isSweetSpot);
        
        // Generate smooth curve using Catmull-Rom spline
        const smoothPoints = [];
        const numPoints = 300; // High resolution for smooth curve
        
        // Helper function for Catmull-Rom interpolation
        function catmullRom(p0, p1, p2, p3, t) {
            const t2 = t * t;
            const t3 = t2 * t;
            return {
                x: 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
                y: 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3)
            };
        }
        
        // Generate points for each segment
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = i > 0 ? points[i - 1] : points[i];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = i < points.length - 2 ? points[i + 2] : points[i + 1];
            
            const segmentPoints = Math.ceil(numPoints / (points.length - 1));
            
            for (let j = 0; j <= segmentPoints; j++) {
                let t = j / segmentPoints;
                
                // Apply diminishing returns effect after Sweet Spot
                if (i >= sweetSpotIndex && sweetSpotIndex >= 0) {
                    // After Sweet Spot: apply strong easing to flatten curve
                    // This creates the visual effect of diminishing returns
                    t = 1 - Math.pow(1 - t, 2.5); // Stronger easing for more flattening
                } else if (i < sweetSpotIndex && sweetSpotIndex >= 0) {
                    // Before Sweet Spot: slight ease-in for steeper growth
                    t = Math.pow(t, 0.8);
                }
                
                const point = catmullRom(p0, p1, p2, p3, t);
                
                // Additional flattening after Sweet Spot for Y values
                if (i >= sweetSpotIndex && sweetSpotIndex >= 0) {
                    // Reduce the score increase rate (diminishing returns)
                    const expectedY = p1.y + (p2.y - p1.y) * t;
                    const diminishingFactor = 0.3 + 0.7 * (1 - Math.pow(t, 1.5)); // Stronger flattening
                    point.y = p1.y + (expectedY - p1.y) * diminishingFactor;
                }
                
                smoothPoints.push(point);
            }
        }
        
        // Add the last point
        smoothPoints.push(points[points.length - 1]);

        // Build SVG path using smooth curve with cubic bezier
        if (smoothPoints.length < 2) return '';
        
        let path = `M ${smoothPoints[0].x.toFixed(2)} ${smoothPoints[0].y.toFixed(2)}`;
        
        // Use cubic bezier for smoother transitions
        for (let i = 1; i < smoothPoints.length - 1; i++) {
            const prev = smoothPoints[i - 1];
            const curr = smoothPoints[i];
            const next = smoothPoints[i + 1];
            
            // Calculate control points for smooth bezier curve
            const cp1x = prev.x + (curr.x - prev.x) * 0.3;
            const cp1y = prev.y + (curr.y - prev.y) * 0.3;
            const cp2x = curr.x - (next.x - curr.x) * 0.3;
            const cp2y = curr.y - (next.y - curr.y) * 0.3;
            
            path += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${curr.x.toFixed(2)} ${curr.y.toFixed(2)}`;
        }
        
        // Add final point
        const lastPoint = smoothPoints[smoothPoints.length - 1];
        path += ` L ${lastPoint.x.toFixed(2)} ${lastPoint.y.toFixed(2)}`;
        
        return path;
    }

    // Draw zones - only vertical division (Value Zone vs Diminishing Returns)
    function drawZones() {
        const zonesGroup = curveSvg.querySelector('#zones');
        if (!zonesGroup) return;

        // Find Lopesan position to define vertical zones dynamically
        const lopesanIndex = sortedResorts.findIndex(r => r.isSweetSpot);
        let sweetSpotX = padding.left + chartWidth * 0.4; // Default
        
        if (lopesanIndex >= 0) {
            const lopesan = sortedResorts[lopesanIndex];
            sweetSpotX = priceScale(lopesan.price);
        }
        
        const valueZoneWidth = sweetSpotX - padding.left;
        const diminishingZoneX = sweetSpotX;
        const diminishingZoneWidth = chartWidth - valueZoneWidth;
        
        // Zones with improved labels
        zonesGroup.innerHTML = `
            <!-- Value Zone - very subtle -->
            <rect x="${padding.left}" y="${padding.top}" width="${valueZoneWidth}" height="${chartHeight}" 
                  fill="url(#valueZone)" opacity="0.08"/>
            
            <!-- Value Zone Label -->
            <text x="${padding.left + valueZoneWidth / 2}" y="${padding.top + 20}" 
                  text-anchor="middle" fill="rgba(43, 231, 255, 0.6)" font-size="10" font-weight="700" letter-spacing="0.05em">
                  🟢 VALUE ZONE
            </text>
            
            <!-- Diminishing Returns Zone - very subtle -->
            <rect x="${diminishingZoneX}" y="${padding.top}" width="${diminishingZoneWidth}" height="${chartHeight}" 
                  fill="url(#diminishingZone)" opacity="0.08"/>
            
            <!-- Diminishing Returns Zone Label -->
            <text x="${diminishingZoneX + diminishingZoneWidth / 2}" y="${padding.top + 20}" 
                  text-anchor="middle" fill="rgba(255, 43, 214, 0.6)" font-size="10" font-weight="700" letter-spacing="0.05em">
                  🔴 DIMINISHING RETURNS
            </text>
            
            <!-- Sweet Spot divider line -->
            <line x1="${sweetSpotX}" y1="${padding.top}" x2="${sweetSpotX}" y2="${padding.top + chartHeight}" 
                  stroke="rgba(255, 43, 214, 0.3)" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.5"/>
        `;
    }

    // Draw data points and labels
    function drawDataPoints() {
        const dataPointsGroup = curveSvg.querySelector('#dataPoints');
        const labelsGroup = curveSvg.querySelector('#labels');
        const sweetSpotGroup = curveSvg.querySelector('#sweetSpotHighlight');
        
        if (!dataPointsGroup || !labelsGroup || !sweetSpotGroup) return;

        dataPointsGroup.innerHTML = '';
        labelsGroup.innerHTML = '';
        sweetSpotGroup.innerHTML = '';

        sortedResorts.forEach((resort) => {
            const x = priceScale(resort.price);
            const y = scoreScale(resort.score);
            const isSweetSpot = resort.isSweetSpot;

            // Sweet spot highlight - prominent visual emphasis
            if (isSweetSpot) {
                sweetSpotGroup.innerHTML = `
                    <!-- Multiple glow rings for dramatic effect -->
                    <circle cx="${x}" cy="${y}" r="50" fill="none" stroke="${resort.color}" stroke-width="1.5" opacity="0.2" stroke-dasharray="3 3"/>
                    <circle cx="${x}" cy="${y}" r="40" fill="none" stroke="${resort.color}" stroke-width="2" opacity="0.3"/>
                    <circle cx="${x}" cy="${y}" r="30" fill="none" stroke="${resort.color}" stroke-width="2.5" opacity="0.4"/>
                    <circle cx="${x}" cy="${y}" r="20" fill="none" stroke="${resort.color}" stroke-width="3" opacity="0.5"/>
                    
                    <!-- Highlight background circle -->
                    <circle cx="${x}" cy="${y}" r="22" fill="${resort.color}" opacity="0.15"/>
                    
                    <!-- Label badge -->
                    <rect x="${x - 75}" y="${y - 45}" width="150" height="28" rx="14" fill="rgba(0, 0, 0, 0.8)" opacity="0.9" stroke="${resort.color}" stroke-width="1.5"/>
                    <text x="${x}" y="${y - 28}" text-anchor="middle" fill="${resort.color}" font-size="11" font-weight="900" letter-spacing="0.1em">
                        ⭐ MEJOR OPCIÓN
                    </text>
                `;
            }

            // Data point with size based on price, score, and stars
            const point = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            const radius = calculateCircleRadius(resort);
            point.setAttribute('cx', x);
            point.setAttribute('cy', y);
            point.setAttribute('r', radius);
            point.setAttribute('fill', resort.color);
            point.setAttribute('stroke', isSweetSpot ? resort.color : 'rgba(255, 255, 255, 0.4)');
            point.setAttribute('stroke-width', isSweetSpot ? '3.5' : '2.5');
            point.setAttribute('class', `curve-point ${isSweetSpot ? 'is-sweetspot' : ''} ${resort.isUltraLuxury ? 'is-ultra-luxury' : ''}`);
            point.setAttribute('data-hotel', resort.hotel);
            point.setAttribute('data-name', resort.name);
            point.setAttribute('data-price', resort.price);
            point.setAttribute('data-score', resort.score);
            point.setAttribute('data-value-index', resort.valueIndex.toFixed(2));
            point.setAttribute('data-monthly', resort.monthly);
            point.setAttribute('filter', isSweetSpot ? 'url(#glow)' : '');
            point.style.cursor = 'pointer';
            dataPointsGroup.appendChild(point);

            // No labels - clean scatter plot (information shown only on hover via tooltip)
        });
    }

    // Draw grid lines for better readability
    function drawGrid() {
        const gridLinesGroup = curveSvg.querySelector('#gridLines');
        if (!gridLinesGroup) return;

        gridLinesGroup.innerHTML = '';
        gridLinesGroup.setAttribute('opacity', '0.2');

        // Vertical grid lines (based on price ticks)
        const priceRange = maxPrice - minPrice;
        let tickValues = [];
        
        if (priceRange > 200000) {
            tickValues = [minPrice, 50000, 100000, 150000, 200000, maxPrice];
        } else {
            const step = Math.ceil(priceRange / 5);
            for (let i = 0; i <= 5; i++) {
                const value = minPrice + (i * step);
                tickValues.push(Math.round(value / 1000) * 1000);
            }
            tickValues[tickValues.length - 1] = maxPrice;
        }
        
        const uniqueTicks = [...new Set(tickValues)].sort((a, b) => a - b);
        
        uniqueTicks.forEach(priceValue => {
            const x = priceScale(priceValue);
            if (x < padding.left || x > padding.left + chartWidth) return;
            
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x);
            line.setAttribute('y1', padding.top);
            line.setAttribute('x2', x);
            line.setAttribute('y2', padding.top + chartHeight);
            line.setAttribute('stroke', 'rgba(255, 255, 255, 0.15)');
            line.setAttribute('stroke-width', '1');
            line.setAttribute('stroke-dasharray', '2 2');
            gridLinesGroup.appendChild(line);
        });

        // Horizontal grid lines (based on score ticks) - improved contrast
        const numYTicks = 5;
        for (let i = 0; i <= numYTicks; i++) {
            const scoreValue = minScore + (i / numYTicks) * (maxScore - minScore);
            const y = scoreScale(scoreValue);
            
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', padding.left);
            line.setAttribute('y1', y);
            line.setAttribute('x2', padding.left + chartWidth);
            line.setAttribute('y2', y);
            line.setAttribute('stroke', 'rgba(255, 255, 255, 0.18)'); // Increased from 0.15 to 0.18
            line.setAttribute('stroke-width', '1');
            line.setAttribute('stroke-dasharray', '2 3'); // Slightly adjusted dash pattern
            gridLinesGroup.appendChild(line);
        }

        // Main axes (thicker and more visible) - improved hierarchy
        const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        yAxis.setAttribute('x1', padding.left);
        yAxis.setAttribute('y1', padding.top);
        yAxis.setAttribute('x2', padding.left);
        yAxis.setAttribute('y2', padding.top + chartHeight);
        yAxis.setAttribute('stroke', 'rgba(255, 255, 255, 0.4)'); // Increased from 0.3 to 0.4
        yAxis.setAttribute('stroke-width', '2'); // Increased from 1.5 to 2
        gridLinesGroup.appendChild(yAxis);

        const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        xAxis.setAttribute('x1', padding.left);
        xAxis.setAttribute('y1', padding.top + chartHeight);
        xAxis.setAttribute('x2', padding.left + chartWidth);
        xAxis.setAttribute('y2', padding.top + chartHeight);
        xAxis.setAttribute('stroke', 'rgba(255, 255, 255, 0.3)');
        xAxis.setAttribute('stroke-width', '1.5');
        gridLinesGroup.appendChild(xAxis);
    }

    // Draw axis labels with ticks and values
    function drawAxisLabels() {
        const axisLabelsGroup = curveSvg.querySelector('#axisLabels');
        if (!axisLabelsGroup) return;

        axisLabelsGroup.innerHTML = '';

        // X-axis: Price ticks and labels with better spacing (avoid crowding on left)
        // Use smart tick values that are evenly distributed visually
        const priceRange = maxPrice - minPrice;
        const tickValues = [];
        
        // Generate smart tick values for better visual distribution
        if (priceRange > 200000) {
            // For large ranges, use round numbers
            tickValues.push(minPrice);
            tickValues.push(50000);
            tickValues.push(100000);
            tickValues.push(150000);
            tickValues.push(200000);
            tickValues.push(maxPrice);
        } else {
            // For smaller ranges, use more ticks but with better spacing
            const step = Math.ceil(priceRange / 5);
            for (let i = 0; i <= 5; i++) {
                const value = minPrice + (i * step);
                tickValues.push(Math.round(value / 1000) * 1000); // Round to nearest 1000
            }
            tickValues[tickValues.length - 1] = maxPrice; // Ensure last value is exact max
        }
        
        // Remove duplicates and sort
        const uniqueTicks = [...new Set(tickValues)].sort((a, b) => a - b);
        
        uniqueTicks.forEach(priceValue => {
            const x = priceScale(priceValue);
            const y = padding.top + chartHeight;
            
            // Skip if outside chart bounds
            if (x < padding.left || x > padding.left + chartWidth) return;
            
            // Tick line - improved contrast
            const tickLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            tickLine.setAttribute('x1', x);
            tickLine.setAttribute('y1', y);
            tickLine.setAttribute('x2', x);
            tickLine.setAttribute('y2', y + 6); // Increased from 5 to 6
            tickLine.setAttribute('stroke', 'rgba(255, 255, 255, 0.5)'); // Increased from 0.4 to 0.5
            tickLine.setAttribute('stroke-width', '1.5'); // Increased from 1 to 1.5
            axisLabelsGroup.appendChild(tickLine);
            
            // Price label - improved contrast and readability
            const priceLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            priceLabel.setAttribute('x', x);
            priceLabel.setAttribute('y', y + 22); // Increased from 20 to 22
            priceLabel.setAttribute('text-anchor', 'middle');
            priceLabel.setAttribute('fill', 'rgba(255, 255, 255, 0.85)'); // Increased from 0.7 to 0.85
            priceLabel.setAttribute('font-size', '12'); // Increased from 11 to 12
            priceLabel.setAttribute('font-weight', '700'); // Increased from 600 to 700
            priceLabel.setAttribute('font-family', 'Inter, -apple-system, BlinkMacSystemFont, sans-serif');
            
            // Format price: show in thousands if > 1000
            let priceText;
            if (priceValue >= 100000) {
                priceText = `$${(priceValue / 1000).toFixed(0)}k`;
            } else if (priceValue >= 10000) {
                priceText = `$${(priceValue / 1000).toFixed(1)}k`;
            } else {
                priceText = `$${priceValue.toLocaleString('es-MX')}`;
            }
            priceLabel.textContent = priceText;
            axisLabelsGroup.appendChild(priceLabel);
        });

        // Y-axis: Score ticks and labels
        const numYTicks = 5;
        for (let i = 0; i <= numYTicks; i++) {
            const scoreValue = minScore + (i / numYTicks) * (maxScore - minScore);
            const x = padding.left;
            const y = scoreScale(scoreValue);
            
            // Tick line
            const tickLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            tickLine.setAttribute('x1', x);
            tickLine.setAttribute('y1', y);
            tickLine.setAttribute('x2', x - 5);
            tickLine.setAttribute('y2', y);
            tickLine.setAttribute('stroke', 'rgba(255, 255, 255, 0.4)');
            tickLine.setAttribute('stroke-width', '1');
            axisLabelsGroup.appendChild(tickLine);
            
            // Score label
            const scoreLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            scoreLabel.setAttribute('x', x - 10);
            scoreLabel.setAttribute('y', y + 4);
            scoreLabel.setAttribute('text-anchor', 'end');
            scoreLabel.setAttribute('fill', 'rgba(255, 255, 255, 0.7)');
            scoreLabel.setAttribute('font-size', '11');
            scoreLabel.setAttribute('font-weight', '600');
            scoreLabel.textContent = Math.round(scoreValue);
            axisLabelsGroup.appendChild(scoreLabel);
        }

        // X-axis title
        const xAxisTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        xAxisTitle.setAttribute('x', padding.left + chartWidth / 2);
        xAxisTitle.setAttribute('y', padding.top + chartHeight + 45);
        xAxisTitle.setAttribute('text-anchor', 'middle');
        xAxisTitle.setAttribute('fill', 'rgba(255, 255, 255, 0.8)');
        xAxisTitle.setAttribute('font-size', '13');
        xAxisTitle.setAttribute('font-weight', '700');
        xAxisTitle.textContent = 'Precio Total (MXN)';
        axisLabelsGroup.appendChild(xAxisTitle);

        // Y-axis title
        const yAxisTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        yAxisTitle.setAttribute('x', padding.left - 20);
        yAxisTitle.setAttribute('y', padding.top + chartHeight / 2);
        yAxisTitle.setAttribute('text-anchor', 'middle');
        yAxisTitle.setAttribute('fill', 'rgba(255, 255, 255, 0.8)');
        yAxisTitle.setAttribute('font-size', '13');
        yAxisTitle.setAttribute('font-weight', '700');
        yAxisTitle.setAttribute('transform', `rotate(-90 ${padding.left - 20} ${padding.top + chartHeight / 2})`);
        yAxisTitle.textContent = 'Score de Experiencia';
        axisLabelsGroup.appendChild(yAxisTitle);
    }

    // Initialize chart (Scatter Plot)
    function initCurveChart() {
        try {
            // Validate data
            if (!resortsData || resortsData.length === 0) {
                console.error('No resort data available');
                return;
            }

            // Verify SVG is ready
            if (!curveSvg || !curveSvg.querySelector) {
                console.error('SVG not ready');
                return;
            }

            // Draw zones first
            drawZones();
            
            // Draw grid lines for better readability
            drawGrid();
            
            // No curve line - clean scatter plot with only points
            
            // Draw data points (main focus of scatter plot)
            drawDataPoints();
            
            // Draw axis labels with ticks and values
            drawAxisLabels();
            
            // Verify elements were created
            const points = getCurvePoints();
            if (points.length === 0) {
                console.warn('No data points were created. Resorts data:', resortsData.length);
            } else {
                console.log(`Successfully created ${points.length} data points for scatter plot`);
            }
        } catch (error) {
            console.error('Error in initCurveChart:', error);
            console.error('Stack:', error.stack);
        }
    }

    // Tooltip functionality
    const tooltip = document.getElementById('curveTooltip');
    const getCurvePoints = () => curveSvg.querySelectorAll('.curve-point');

    function showTooltip(point, event) {
        if (!tooltip) return;
        
        const name = point.getAttribute('data-name');
        const price = parseFloat(point.getAttribute('data-price'));
        const score = parseFloat(point.getAttribute('data-score'));
        const valueIndex = parseFloat(point.getAttribute('data-value-index'));
        const monthly = parseFloat(point.getAttribute('data-monthly'));
        const isSweetSpot = point.classList.contains('is-sweetspot');

        tooltip.querySelector('.tooltip-name').textContent = name;
        tooltip.querySelector('.tooltip-price').textContent = `$${price.toLocaleString()} ($${monthly.toLocaleString()}/mes)`;
        tooltip.querySelector('.tooltip-score').textContent = `${score}/100`;
        tooltip.querySelector('.tooltip-value-index').textContent = valueIndex.toFixed(2);
        
        const badge = tooltip.querySelector('.tooltip-badge');
        if (isSweetSpot) {
            badge.textContent = '⭐ Best Value Sweet Spot';
            badge.style.display = 'inline-block';
        } else if (point.classList.contains('is-ultra-luxury')) {
            badge.textContent = '⚠️ Diminishing Returns';
            badge.style.display = 'inline-block';
            badge.style.color = '#FF6B9D';
        } else {
            badge.style.display = 'none';
        }

        // Position tooltip
        const rect = curveChart.getBoundingClientRect();
        const pointRect = point.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        let left = pointRect.left - rect.left + (pointRect.width / 2) - (tooltipRect.width / 2);
        let top = pointRect.top - rect.top - tooltipRect.height - 15;
        
        if (left < 0) left = 10;
        if (left + tooltipRect.width > rect.width) left = rect.width - tooltipRect.width - 10;
        if (top < 0) top = pointRect.bottom - rect.top + 15;
        
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
        tooltip.classList.add('is-visible');
    }

    function hideTooltip() {
        if (tooltip) {
            tooltip.classList.remove('is-visible');
        }
    }

    // Event listeners for tooltips (completely static circles, no animations)
    function attachTooltipEvents() {
        const points = getCurvePoints();
        points.forEach(point => {
            // Kill any existing GSAP animations on this point
            gsap.killTweensOf(point);
            
            // Remove any transform that might be applied
            gsap.set(point, { clearProps: 'all' });
            
            point.addEventListener('mouseenter', (e) => {
                // Kill any animations before showing tooltip
                gsap.killTweensOf(point);
                showTooltip(point, e);
                // Absolutely no circle animation
            });
            
            point.addEventListener('mouseleave', () => {
                // Kill any animations before hiding tooltip
                gsap.killTweensOf(point);
                hideTooltip();
                // Absolutely no circle animation
        });
    });
}

    // Initialize chart when DOM is ready
    function setupCurveChart() {
        try {
            // Initialize chart first
            initCurveChart();
            
            // Wait a bit for DOM to update, then attach events
            setTimeout(() => {
                attachTooltipEvents();
                setupAnimations();
            }, 100);
        } catch (error) {
            console.error('Error initializing curve chart:', error);
        }
    }

    // Setup animations after chart is rendered
    function setupAnimations() {
        // Animate on scroll
    gsap.from('.performance-curve-title, .performance-curve-subtitle', {
        y: 30,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.performance-curve',
            start: 'top 75%'
        }
    });

        // No curve animation - scatter plot without connecting line

        // Animate data points with storytelling sequence
        const points = getCurvePoints();
        if (points.length > 0) {
            // Animate regular points first
            const regularPoints = points.filter(p => !p.classList.contains('is-sweetspot'));
            const sweetSpotPoint = points.find(p => p.classList.contains('is-sweetspot'));
            
            // Animate regular points (fade in only, no scale to avoid conflicts)
            gsap.from(regularPoints, {
                autoAlpha: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out',
            scrollTrigger: {
                trigger: '.curve-chart',
                start: 'top 70%',
                once: true
                },
                onComplete: () => {
                    // Ensure all points are fully visible and at normal state
                    regularPoints.forEach(p => {
                        gsap.set(p, { autoAlpha: 1, clearProps: 'all' });
                    });
                }
            });

            // Animate Sweet Spot (fade in only, no scale)
            if (sweetSpotPoint) {
                gsap.from(sweetSpotPoint, {
        autoAlpha: 0,
                    duration: 0.8,
                    ease: 'power2.out',
                    delay: 0.5,
        scrollTrigger: {
            trigger: '.curve-chart',
            start: 'top 70%',
            once: true
                    },
                    onComplete: () => {
                        // Ensure Sweet Spot is fully visible and at normal state
                        gsap.set(sweetSpotPoint, { autoAlpha: 1, clearProps: 'all' });
                    }
                });

                // Animate Sweet Spot highlight rings (fade in only)
                const sweetSpotRings = curveSvg.querySelectorAll('#sweetSpotHighlight circle');
                if (sweetSpotRings.length > 0) {
                    gsap.from(sweetSpotRings, {
                        opacity: 0,
                        duration: 1,
                        stagger: 0.1,
        ease: 'power2.out',
                        delay: 1,
        scrollTrigger: {
            trigger: '.curve-chart',
            start: 'top 70%',
            once: true
        }
    });
                }
            }
        }

    // No label animations - clean scatter plot (labels removed)

    // Animate insight box
    gsap.from('.curve-insight', {
        y: 30,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.curve-insight',
            start: 'top 80%'
        }
    });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupCurveChart);
    } else {
        // DOM already ready
        setupCurveChart();
    }

    // Recalculate on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            initCurveChart();
            attachTooltipEvents();
            ScrollTrigger.refresh();
        }, 250);
    });
    })(curveSvg, curveChart);
}

// Initialize performance curve
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPerformanceCurve);
} else {
    // Small delay to ensure DOM is fully parsed
    setTimeout(initPerformanceCurve, 50);
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
