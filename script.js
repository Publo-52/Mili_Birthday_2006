/**
 * =========================================================================
 * 💖 BIRTHDAY PROJECT CONFIGURATION (You can easily edit these values)
 * =========================================================================
 */
const CONFIG = {
    // Background Music
    bgmUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3',

    // Voice Note audio file
    voiceNoteUrl: 'voice.mp3',

    // Memories Gallery Photos, Real Dates & Romantic Messages
    galleryMemories: [
        {
            src: 'Images/img1.jpg',
            fallback: 'Images/img1.jpg',
            title: 'Where Our Story Shines ✨',
            date: '27 Feb, 2026',
            message: 'Under the shade of green trees, every quiet moment with you feels like home.'
        },
        {
            src: 'Images/WhatsApp Image 2026-08-30 at 11.06.04 AM (2).jpeg',
            fallback: 'Images/img1.jpg',
            title: 'Blessed Together 🌸',
            date: '19 Apr, 2026',
            message: 'With your bright smile and red tilak, you make every simple day feel sacred and special.'
        },
        {
            src: 'Images/WhatsApp Image 2026-08-30 at 11.06.04 AM (1).jpeg',
            fallback: 'Images/img1.jpg',
            title: 'Traditional Elegance 💜',
            date: '09 May, 2026',
            message: 'Adorned in ethnic grace and timeless beauty, you take my breath away every single time.'
        },
        {
            src: 'Images/WhatsApp Image 2026-08-30 at 11.06.21 AM.jpeg',
            fallback: 'Images/img1.jpg',
            title: 'Cute & Crazy Moments 🤪',
            date: '14 May, 2026',
            message: 'Your playful funny expressions and sweet tantrums are my absolute favorite thing in the world!'
        },
        {
            src: 'Images/WhatsApp Image 2026-08-30 at 11.06.04 AM.jpeg',
            fallback: 'Images/img1.jpg',
            title: 'Golden Sun & Sweet Smiles ☀️',
            date: '29 May, 2026',
            message: 'Sunlit days, gentle breeze, and the warmth of standing right beside the love of my life.'
        },
        {
            src: 'Images/WhatsApp Image 2026-08-30 at 11.06.05 AM.jpeg',
            fallback: 'Images/img1.jpg',
            title: 'By The Ocean Waves 🌊',
            date: 'Ocean Vacation',
            message: 'Standing strong on the rocks by the endless sea, just like our bond that weathers every tide.'
        },
        {
            src: 'Images/WhatsApp Image 2026-08-30 at 11.06.21 AM (1).jpeg',
            fallback: 'Images/img1.jpg',
            title: 'Queen Of The Night 🌟',
            date: 'Magical Evening',
            message: 'Glowing amidst flowers in the dark night — you are the brightest star in my entire universe.'
        },
        {
            src: 'Images/WhatsApp Image 2026-08-30 at 11.06.22 AM.jpeg',
            fallback: 'Images/img1.jpg',
            title: 'Precious & Innocent 🧸',
            date: 'Sweet Memories',
            message: 'Cuddling your cute bunny with that precious smile — you bring pure warmth and happiness to my soul.'
        }
    ],

    // Most complex & stunning night floral photoshoot image as the 3x3 Puzzle Challenge
    puzzleImage: 'Images/WhatsApp Image 2026-08-30 at 11.06.21 AM (1).jpeg',

    // Personal Letter for Mili (Typewriter Animation)
    letterText: `Dearest Mili,\n\nOn this very special day, I want to remind you how incredibly wonderful and precious you are to me. Your smile brings warmth, your laughter brings endless joy, and every single memory we created together—from quiet walks to beach days and all our sweet moments—is a treasure I hold close to my heart.\n\nMay this new year of your life be filled with boundless happiness, radiant health, endless success, and every dream your heart desires.\n\nThank you for being the amazing, shining soul that you are. I will always be right beside you, cheering for you and loving you.\n\nHappy Birthday once again, my dear Mili! 🎂💖✨\n\n— With all my love, Sukhen`
};

/**
 * =========================================================================
 * 🎬 GLOBAL STATE & SCENE MANAGEMENT
 * =========================================================================
 */
const SCENES = [
    'scene-intro',     // 0
    'scene-balloons',  // 1
    'scene-gallery',   // 2
    'scene-cake',      // 3
    'scene-puzzle',    // 4
    'scene-gift',      // 5
    'scene-finale'     // 6
];
let currentSceneIndex = 0;
let isTransitioning = false;

/**
 * =========================================================================
 * 🎵 AUDIO SYSTEM (SFX + BGM)
 * =========================================================================
 */
let bgmAudio = new Audio(CONFIG.bgmUrl);
bgmAudio.loop = true;
bgmAudio.volume = 0.5;
let isBgmPlaying = false;

const AudioSys = (() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let ctx = null;
    function init() {
        if (!ctx) ctx = new AudioContext();
        if (ctx.state === 'suspended') ctx.resume();
    }
    function playPop() {
        if (!ctx) return;
        const t = ctx.currentTime;
        const osc = ctx.createOscillator(); const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sine'; osc.frequency.setValueAtTime(160, t); osc.frequency.exponentialRampToValueAtTime(40, t + 0.1);
        gain.gain.setValueAtTime(0.8, t); gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        osc.start(t); osc.stop(t + 0.1);
    }
    function playChime(freq = 800) {
        if (!ctx) return;
        const t = ctx.currentTime;
        const osc = ctx.createOscillator(); const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sine'; osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(0.25, t + 0.05); gain.gain.exponentialRampToValueAtTime(0.001, t + 1.5);
        osc.start(t); osc.stop(t + 1.5);
    }
    function playBlow() {
        if (!ctx) return;
        const t = ctx.currentTime;
        const bufferSize = ctx.sampleRate * 0.8; const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0); for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const noise = ctx.createBufferSource(); noise.buffer = buffer;
        const filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.setValueAtTime(2000, t); filter.frequency.exponentialRampToValueAtTime(100, t + 0.8);
        const gain = ctx.createGain(); noise.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(0.5, t + 0.1); gain.gain.exponentialRampToValueAtTime(0.01, t + 0.8);
        noise.start(t);
    }
    function playExplosion() {
        if (!ctx) return;
        const t = ctx.currentTime;
        const bufferSize = ctx.sampleRate * 1.8; const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0); for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.4));
        const noise = ctx.createBufferSource(); noise.buffer = buffer;
        const filter = ctx.createBiquadFilter(); filter.type = 'bandpass'; filter.frequency.setValueAtTime(120, t); filter.frequency.linearRampToValueAtTime(50, t + 1.8);
        const gain = ctx.createGain(); noise.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0.8, t); gain.gain.exponentialRampToValueAtTime(0.01, t + 1.8);
        noise.start(t);
    }
    return { init, playPop, playChime, playBlow, playExplosion };
})();

function toggleBGM() {
    AudioSys.init();
    const btn = document.getElementById('btn-sound-toggle');
    if (isBgmPlaying) {
        bgmAudio.pause();
        isBgmPlaying = false;
        btn.classList.remove('playing', 'active');
    } else {
        bgmAudio.play().then(() => {
            isBgmPlaying = true;
            btn.classList.add('playing', 'active');
        }).catch(() => { });
    }
}

document.getElementById('btn-sound-toggle').addEventListener('click', toggleBGM);

// Fullscreen Toggle
document.getElementById('btn-fullscreen-toggle').addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => { });
    } else {
        document.exitFullscreen().catch(() => { });
    }
});

/**
 * =========================================================================
 * 🎆 CANVAS EFFECTS (STARS, PARTICLES, FIREWORKS, "MILI" NAME FIREWORK)
 * =========================================================================
 */
const canvas = document.getElementById('global-canvas');
const ctxCanvas = canvas.getContext('2d');
let width, height;
let particles = [];
let fireworks = [];
let stars = [];
let bokehParticles = [];
let floatingHearts = [];
let effectMode = 'ambient';

function initStars() {
    stars = [];
    bokehParticles = [];
    floatingHearts = [];
    
    const isMobile = window.innerWidth < 768;
    const starCount = isMobile ? 35 : 75;
    const bokehCount = isMobile ? 6 : 18;
    
    for (let i = 0; i < starCount; i++) {
        stars.push({ x: Math.random() * width, y: Math.random() * height, s: Math.random() * 1.5, a: Math.random(), speed: Math.random() * 0.08 + 0.03 });
    }
    
    // Golden Bokeh Orbs for cinematic depth
    for (let i = 0; i < bokehCount; i++) {
        bokehParticles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * (isMobile ? 16 : 24) + 8,
            alpha: Math.random() * 0.2 + 0.04,
            speedY: Math.random() * 0.25 + 0.08,
            color: Math.random() > 0.5 ? 'rgba(212, 175, 55,' : 'rgba(255, 105, 180,'
        });
    }
}

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initStars();
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor(x, y, color, isConfetti = false, vx = null, vy = null) {
        this.x = x; this.y = y; this.color = color; this.isConfetti = isConfetti;
        const angle = Math.random() * Math.PI * 2; const speed = Math.random() * (isConfetti ? 7 : 4) + 1;
        this.vx = vx !== null ? vx : Math.cos(angle) * speed;
        this.vy = vy !== null ? vy : Math.sin(angle) * speed;
        this.life = 1.0; this.decay = Math.random() * 0.02 + (isConfetti ? 0.006 : 0.015);
        this.gravity = isConfetti ? 0.2 : 0.05; this.size = isConfetti ? Math.random() * 6 + 4 : Math.random() * 3 + 1;
        this.angle = Math.random() * 360; this.spin = (Math.random() - 0.5) * 10;
    }
    update() { this.x += this.vx; this.y += this.vy; this.vy += this.gravity; this.life -= this.decay; this.angle += this.spin; }
    draw() {
        ctxCanvas.globalAlpha = Math.max(0, this.life); ctxCanvas.fillStyle = this.color;
        if (this.isConfetti) {
            ctxCanvas.save(); ctxCanvas.translate(this.x, this.y); ctxCanvas.rotate(this.angle * Math.PI / 180);
            ctxCanvas.fillRect(-this.size / 2, -this.size / 2, this.size, this.size); ctxCanvas.restore();
        }
        else { ctxCanvas.beginPath(); ctxCanvas.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctxCanvas.fill(); }
        ctxCanvas.globalAlpha = 1.0;
    }
}

class Firework {
    constructor(isSpecial = false) {
        this.x = Math.random() * (width * 0.7) + (width * 0.15);
        this.y = height;
        this.targetY = Math.random() * (height * 0.3) + height * 0.12;
        this.speed = Math.random() * 4 + 7;
        this.color = `hsl(${Math.random() * 360}, 85%, 65%)`;
        this.exploded = false;
        this.isSpecial = isSpecial;
    }
    update() {
        if (!this.exploded) {
            this.y -= this.speed;
            if (this.y <= this.targetY) {
                this.exploded = true;
                if (this.isSpecial) {
                    createNameExplosion("MILI", this.x, this.y);
                } else {
                    createExplosion(this.x, this.y, this.color, 60);
                }
                AudioSys.playExplosion();
            }
        }
    }
    draw() {
        if (!this.exploded) {
            ctxCanvas.fillStyle = '#fff'; ctxCanvas.beginPath(); ctxCanvas.arc(this.x, this.y, 2.5, 0, Math.PI * 2); ctxCanvas.fill();
        }
    }
}

function createExplosion(x, y, color, count = 45, isConfetti = false) {
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y, isConfetti ? `hsl(${Math.random() * 360}, 85%, 60%)` : color, isConfetti));
    }
}

/**
 * Generates custom sparkling letters in the fireworks sky for MILI
 */
function createNameExplosion(text, cx, cy) {
    const offCanvas = document.createElement('canvas');
    offCanvas.width = 300; offCanvas.height = 100;
    const offCtx = offCanvas.getContext('2d');
    offCtx.font = "bold 42px 'Montserrat', sans-serif";
    offCtx.fillStyle = "#ffffff";
    offCtx.textAlign = "center";
    offCtx.fillText(text, 150, 60);

    const imgData = offCtx.getImageData(0, 0, 300, 100).data;
    for (let y = 0; y < 100; y += 4) {
        for (let x = 0; x < 300; x += 4) {
            const index = (y * 300 + x) * 4;
            if (imgData[index + 3] > 128) {
                const px = cx + (x - 150) * 1.5;
                const py = cy + (y - 50) * 1.5;
                const p = new Particle(px, py, '#FFD700', false, (Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.6);
                p.life = 1.6;
                p.decay = 0.012;
                particles.push(p);
            }
        }
    }
}

function renderCanvas() {
    ctxCanvas.clearRect(0, 0, width, height);

    // 1. Draw Bokeh Glowing Ambient Orbs
    bokehParticles.forEach(b => {
        b.y -= b.speedY;
        if (b.y < -b.radius) { b.y = height + b.radius; b.x = Math.random() * width; }
        const grad = ctxCanvas.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
        grad.addColorStop(0, b.color + (b.alpha * 1.2) + ')');
        grad.addColorStop(1, b.color + '0)');
        ctxCanvas.fillStyle = grad;
        ctxCanvas.beginPath();
        ctxCanvas.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctxCanvas.fill();
    });

    // 2. Stars
    ctxCanvas.fillStyle = '#fff';
    stars.forEach(star => {
        star.y -= star.speed; if (star.y < 0) { star.y = height; star.x = Math.random() * width; }
        star.a += (Math.random() - 0.5) * 0.05; star.a = Math.max(0.1, Math.min(1, star.a));
        ctxCanvas.globalAlpha = star.a; ctxCanvas.beginPath(); ctxCanvas.arc(star.x, star.y, star.s, 0, Math.PI * 2); ctxCanvas.fill();
    });
    ctxCanvas.globalAlpha = 1.0;

    // 3. Particles
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update(); particles[i].draw();
        if (particles[i].life <= 0) particles.splice(i, 1);
    }

    // 4. Fireworks
    if (effectMode === 'fireworks') {
        if (Math.random() < 0.045) {
            const isSpecial = Math.random() < 0.35; // 35% chance for MILI text fireworks
            fireworks.push(new Firework(isSpecial));
        }
        for (let i = fireworks.length - 1; i >= 0; i--) {
            fireworks[i].update(); fireworks[i].draw();
            if (fireworks[i].exploded) fireworks.splice(i, 1);
        }
    }
    requestAnimationFrame(renderCanvas);
}
renderCanvas();

/**
 * =========================================================================
 * 🔄 GLOBAL NAVIGATION & 3D CINEMATIC SCENE TRANSITIONS
 * =========================================================================
 */
const CHAPTER_TITLES = [
    "Prologue",
    "Celebration 🎈",
    "Memories 📸",
    "Make a Wish 🎂",
    "Puzzle 🧩",
    "Gift Reveal 🎁",
    "Grand Finale 🎆"
];

function updateHUD(index) {
    const titleEl = document.getElementById('hud-chapter-title');
    if (titleEl && CHAPTER_TITLES[index]) {
        gsap.to(titleEl, { opacity: 0, y: -4, duration: 0.15, onComplete: () => {
            titleEl.textContent = CHAPTER_TITLES[index];
            gsap.to(titleEl, { opacity: 1, y: 0, duration: 0.25 });
        }});
    }
    const dots = document.querySelectorAll('.hud-dot');
    dots.forEach((dot, i) => {
        if (i === index) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function triggerHaptic(pattern = [15]) {
    if ('vibrate' in navigator) {
        try {
            navigator.vibrate(pattern);
        } catch (e) {}
    }
}

function preloadAssets() {
    const urls = [
        CONFIG.puzzleImage,
        ...CONFIG.galleryMemories.map(m => m.src)
    ];
    urls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}
if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', preloadAssets);
} else {
    preloadAssets();
}

document.querySelectorAll('.hud-dot').forEach(dot => {
    dot.addEventListener('click', () => {
        const target = parseInt(dot.dataset.scene);
        if (!isNaN(target) && target !== currentSceneIndex) {
            goToScene(target);
        }
    });
});

function goToScene(index) {
    if (index < 0 || index >= SCENES.length) return;
    if (isTransitioning) return;
    isTransitioning = true;

    const oldIndex = currentSceneIndex;
    currentSceneIndex = index;
    updateHUD(index);
    triggerHaptic([20]);

    const currentEl = document.getElementById(SCENES[oldIndex]);
    const nextEl = document.getElementById(SCENES[index]);

    if (!currentEl || !nextEl) {
        isTransitioning = false;
        return;
    }

    // Hide any other scenes
    SCENES.forEach((sId, i) => {
        const el = document.getElementById(sId);
        if (el && i !== oldIndex && i !== index) {
            el.classList.remove('active');
            el.style.display = 'none';
        }
    });

    currentEl.style.pointerEvents = 'none';
    nextEl.style.display = 'flex';
    nextEl.classList.add('active');
    nextEl.style.pointerEvents = 'none';

    // Initialize target scene immediately
    if (SCENES[index] === 'scene-balloons') initBalloons();
    if (SCENES[index] === 'scene-gallery') initGallery();
    if (SCENES[index] === 'scene-cake') initCakeScene();
    if (SCENES[index] === 'scene-puzzle') initPuzzle();
    if (SCENES[index] === 'scene-gift') initGiftScene();
    if (SCENES[index] === 'scene-finale') {
        effectMode = 'fireworks';
        setTimeout(() => {
            createNameExplosion("MILI", window.innerWidth / 2, window.innerHeight * 0.28);
        }, 500);
    }

    gsap.timeline({
        onComplete: () => {
            currentEl.classList.remove('active');
            currentEl.style.display = 'none';
            gsap.set(currentEl, { clearProps: "all" });

            nextEl.style.pointerEvents = 'auto';
            gsap.set(nextEl, { clearProps: "transform,filter" });
            isTransitioning = false;
        }
    })
    .to(currentEl, { opacity: 0, scale: 1.05, filter: 'blur(8px)', duration: 0.45, ease: "power2.inOut" })
    .fromTo(nextEl, { scale: 0.96, opacity: 0, filter: 'blur(8px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.55, ease: "power2.out" }, "-=0.2");

    const textEls = nextEl.querySelectorAll('.kicker-text, .title-cinematic, .subtitle-elegant');
    if (textEls.length > 0) {
        gsap.fromTo(textEls, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power2.out" });
    }

    setTimeout(() => { isTransitioning = false; }, 800);
}

/**
 * =========================================================================
 * 0. INTRO SCENE
 * =========================================================================
 */
window.handleStartExperience = function() {
    try {
        AudioSys.init();
    } catch (err) {}
    
    if (!isBgmPlaying) {
        toggleBGM();
    }
    
    try {
        AudioSys.playChime(1200);
    } catch (err) {}
    
    goToScene(1);
};

const btnStart = document.getElementById('btn-start');
if (btnStart) {
    btnStart.addEventListener('click', (e) => {
        e.preventDefault();
        window.handleStartExperience();
    });
}

/**
 * =========================================================================
 * 1. BALLOONS SCENE
 * =========================================================================
 */
let balloonInterval;
let hasStartedPopping = false;
const balloonColors = [
    { bg: 'radial-gradient(circle at 30% 30%, #ff4579, #b0003a, #4a0018)', base: '#ff4579' },
    { bg: 'radial-gradient(circle at 30% 30%, #00f0ff, #007bb5, #002d4a)', base: '#00f0ff' },
    { bg: 'radial-gradient(circle at 30% 30%, #e0aaff, #7b2cbf, #240046)', base: '#e0aaff' },
    { bg: 'radial-gradient(circle at 30% 30%, #ffd700, #b8860b, #4a3600)', base: '#ffd700' }
];

function initBalloons() {
    const stage = document.getElementById('balloon-stage');
    if (!stage) return;
    stage.innerHTML = '';
    hasStartedPopping = false;

    const continueBtn = document.getElementById('btn-continue-balloons');
    if (continueBtn) {
        gsap.set(continueBtn, { opacity: 0, y: 20, pointerEvents: 'none' });
        continueBtn.onclick = () => {
            clearInterval(balloonInterval);
            goToScene(2);
        };
        // Automatically reveal continue button after 2.5s
        setTimeout(() => {
            gsap.to(continueBtn, { opacity: 1, y: 0, duration: 1, ease: "power2.out", pointerEvents: 'auto' });
        }, 2500);
    }

    // Spawn initial balloons across different heights so screen is immediately filled with celebration
    const initialSpread = [
        { x: 15, y: 15 },
        { x: 35, y: 40 },
        { x: 55, y: 10 },
        { x: 75, y: 35 },
        { x: 88, y: 55 },
        { x: 25, y: 65 },
        { x: 48, y: 50 },
        { x: 68, y: 70 }
    ];

    initialSpread.forEach((pos, idx) => {
        setTimeout(() => {
            spawnBalloon(pos.x, pos.y);
        }, idx * 80);
    });

    if (balloonInterval) clearInterval(balloonInterval);
    balloonInterval = setInterval(() => {
        if (currentSceneIndex === 1) {
            spawnBalloon(Math.random() * 90 + 5, -15);
        }
    }, 700);
}

function spawnBalloon(startX = Math.random() * 90 + 5, startYPercent = -15) {
    if (currentSceneIndex !== 1) return;
    const stage = document.getElementById('balloon-stage');
    if (!stage) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'balloon-wrapper';

    const colorObj = balloonColors[Math.floor(Math.random() * balloonColors.length)];
    const sizeScale = 0.7 + Math.random() * 0.55;
    const floatDuration = 8 + Math.random() * 5;

    wrapper.style.left = `${startX}%`;
    wrapper.style.bottom = `${startYPercent}%`;
    wrapper.style.transform = `scale(${sizeScale})`;

    const body = document.createElement('div'); body.className = 'balloon-body'; body.style.background = colorObj.bg;
    const knot = document.createElement('div'); knot.className = 'balloon-knot'; knot.style.borderBottomColor = colorObj.base;
    const string = document.createElement('div'); string.className = 'balloon-string';

    body.appendChild(knot); wrapper.appendChild(body); wrapper.appendChild(string); stage.appendChild(wrapper);

    const tl = gsap.to(wrapper, {
        bottom: '125%', x: `+=${(Math.random() - 0.5) * 120}`, rotationZ: (Math.random() - 0.5) * 20,
        duration: floatDuration, ease: "none",
        onComplete: () => { if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper); }
    });

    gsap.to(wrapper, {
        x: `+=${(Math.random() - 0.5) * 40}`, rotationZ: (Math.random() - 0.5) * 12,
        duration: Math.random() * 2 + 2, yoyo: true, repeat: -1, ease: "sine.inOut"
    });

    const popHandler = (e) => {
        if (e) e.preventDefault();
        if (wrapper.style.pointerEvents === 'none') return;
        wrapper.style.pointerEvents = 'none';
        tl.kill();
        try { AudioSys.playPop(); } catch(err){}
        triggerHaptic([25]);
        const rect = body.getBoundingClientRect();
        createExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2, colorObj.base, 25, true);

        gsap.to(wrapper, {
            scale: 1.35, opacity: 0, duration: 0.12,
            onComplete: () => { if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper); }
        });

        const btn = document.getElementById('btn-continue-balloons');
        if (btn) {
            gsap.to(btn, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", pointerEvents: 'auto' });
        }
    };
    wrapper.addEventListener('click', popHandler);
    wrapper.addEventListener('touchstart', popHandler, { passive: false });
}

/**
 * =========================================================================
 * 2. MEMORIES GALLERY (3D CAROUSEL + MOBILE SWIPE + LIGHTBOX)
 * =========================================================================
 */
let currentGalleryIndex = 0;
let cards = [];
let touchStartX = 0;
let touchEndX = 0;

function initGallery() {
    const track = document.getElementById('gallery-track');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const btnContinue = document.getElementById('btn-gallery-continue');

    if (track.children.length === 0) {
        CONFIG.galleryMemories.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'gallery-card';

            const cardInner = document.createElement('div');
            cardInner.className = 'gallery-card-inner';

            const img = document.createElement('img');
            img.src = item.src;
            img.alt = item.title;
            img.onerror = () => { img.src = item.fallback; };

            const zoomBadge = document.createElement('div');
            zoomBadge.className = 'zoom-badge';
            zoomBadge.innerHTML = '🔍';

            const info = document.createElement('div');
            info.className = 'gallery-card-info';
            info.innerHTML = `
                <div class="gallery-card-title font-cinzel">${item.title}</div>
                <div class="gallery-card-date">${item.date}</div>
            `;

            const gloss = document.createElement('div');
            gloss.className = 'gallery-card-gloss';

            cardInner.appendChild(img);
            cardInner.appendChild(gloss);
            cardInner.appendChild(zoomBadge);
            cardInner.appendChild(info);
            card.appendChild(cardInner);
            track.appendChild(card);
            cards.push(card);

            // 3D Card Tilt Interaction on Hover
            card.addEventListener('mousemove', (e) => {
                if (index !== currentGalleryIndex) return;
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                gsap.to(cardInner, {
                    rotationY: x * 18,
                    rotationX: -y * 18,
                    duration: 0.35,
                    ease: "power1.out",
                    transformPerspective: 900
                });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(cardInner, { rotationY: 0, rotationX: 0, duration: 0.6, ease: "power2.out" });
            });

            // Clicking active card opens Lightbox
            card.addEventListener('click', () => {
                if (index === currentGalleryIndex) {
                    openLightbox(item.src, item.title, item.message, item.date);
                } else {
                    currentGalleryIndex = index;
                    updateGallery();
                }
            });
        });

        btnPrev.addEventListener('click', () => {
            currentGalleryIndex = Math.max(0, currentGalleryIndex - 1);
            updateGallery();
        });
        btnNext.addEventListener('click', () => {
            currentGalleryIndex = Math.min(cards.length - 1, currentGalleryIndex + 1);
            updateGallery();
        });
        btnContinue.addEventListener('click', () => {
            goToScene(3);
        });

        // Touch Swipe on mobile
        const stage = document.querySelector('.gallery-stage');
        stage.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
        stage.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 45) {
                currentGalleryIndex = Math.min(cards.length - 1, currentGalleryIndex + 1);
                updateGallery();
            } else if (touchEndX - touchStartX > 45) {
                currentGalleryIndex = Math.max(0, currentGalleryIndex - 1);
                updateGallery();
            }
        }, { passive: true });
    }

    currentGalleryIndex = 0;
    gsap.set(btnContinue, { opacity: 0, y: 20, pointerEvents: 'none' });
    updateGallery();

    setTimeout(() => {
        gsap.to(btnContinue, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", pointerEvents: 'auto' });
    }, 2500);
}

function updateGallery() {
    if (AudioSys && AudioSys.playChime) AudioSys.playChime(600 + (currentGalleryIndex * 50));

    const isMobile = window.innerWidth < 640;
    const spreadX = isMobile ? 45 : 54;
    const spreadZ = isMobile ? -95 : -120;

    cards.forEach((card, i) => {
        let offset = i - currentGalleryIndex;
        let tx = offset * spreadX;
        let tz = Math.abs(offset) * spreadZ;
        let rx = offset * -2.5;
        let scale = offset === 0 ? 1 : (isMobile ? 0.82 : 0.86);
        let opacity = offset === 0 ? 1 : (Math.abs(offset) === 1 ? 0.65 : (Math.abs(offset) === 2 ? 0.2 : 0));
        let zIndex = 30 - Math.abs(offset);
        let filter = offset === 0 ? 'blur(0px) brightness(1)' : 'blur(4px) brightness(0.35)';

        if (offset === 0) {
            card.classList.add('active-card');
        } else {
            card.classList.remove('active-card');
        }

        gsap.to(card, {
            x: `${tx}%`, z: tz, rotateY: rx, scale: scale,
            opacity: opacity, zIndex: zIndex, filter: filter,
            duration: 0.75, ease: "power3.out"
        });
    });

    document.getElementById('btn-prev').style.opacity = currentGalleryIndex === 0 ? '0.25' : '1';
    document.getElementById('btn-prev').style.pointerEvents = currentGalleryIndex === 0 ? 'none' : 'auto';
    document.getElementById('btn-next').style.opacity = currentGalleryIndex === cards.length - 1 ? '0.25' : '1';
    document.getElementById('btn-next').style.pointerEvents = currentGalleryIndex === cards.length - 1 ? 'none' : 'auto';
}

// Lightbox functions
function openLightbox(src, title, desc, date = '') {
    const modal = document.getElementById('lightbox-modal');
    const img = document.getElementById('lightbox-img');
    const titleEl = document.getElementById('lightbox-title');
    const descEl = document.getElementById('lightbox-desc');

    img.src = src;
    titleEl.textContent = title;
    descEl.innerHTML = (date ? `<span class="inline-block bg-[rgba(212,175,55,0.15)] border border-[rgba(212,175,55,0.3)] text-[var(--gold-light)] text-xs px-3 py-1 rounded-full mb-2 tracking-widest">📅 ${date}</span><br>` : '') + `<span class="text-sm text-gray-200 leading-relaxed font-light">${desc}</span>`;
    modal.classList.add('active');
    AudioSys.playChime(1400);
}

document.getElementById('lightbox-close').addEventListener('click', () => {
    document.getElementById('lightbox-modal').classList.remove('active');
});
document.getElementById('lightbox-modal').addEventListener('click', (e) => {
    if (e.target.id === 'lightbox-modal') {
        document.getElementById('lightbox-modal').classList.remove('active');
    }
});

/**
 * =========================================================================
 * 3. 3D CAKE SCENE (THREE.JS + MICROPHONE BLOW DETECTION)
 * =========================================================================
 */
let cakeInitialized = false;
let micAudioContext = null;
let micStream = null;
let micAnalyser = null;
let isMicListening = false;
let flames = [];
let activeFlames = 3;

function initCakeScene() {
    const container = document.getElementById('cake-canvas-container');
    const continueBtn = document.getElementById('btn-cake-continue');
    continueBtn.addEventListener('click', () => {
        stopMicListening();
        goToScene(4);
    });

    if (cakeInitialized) return;
    cakeInitialized = true;

    // Three.js Setup
    const isMobile = window.innerWidth < 640;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 4.5, isMobile ? 16.5 : 14);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile, powerPreference: "high-performance" });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.shadowMap.enabled = !isMobile;
    if (!isMobile) renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambient = new THREE.AmbientLight(0x222233, 1.3);
    scene.add(ambient);
    const spotLight = new THREE.SpotLight(0xfff0dd, 2.2);
    spotLight.position.set(5, 15, 10);
    spotLight.castShadow = !isMobile;
    scene.add(spotLight);

    // Cake Group
    const cakeGroup = new THREE.Group();

    // Base Plate
    const plateGeo = new THREE.CylinderGeometry(4.5, 4.8, 0.2, 64);
    const plateMat = new THREE.MeshStandardMaterial({ color: 0x111115, metalness: 0.8, roughness: 0.2 });
    const plate = new THREE.Mesh(plateGeo, plateMat);
    cakeGroup.add(plate);

    // Tier 1
    const t1Geo = new THREE.CylinderGeometry(3.5, 3.5, 2, 64);
    const creamMat = new THREE.MeshStandardMaterial({ color: 0xfffcf5, roughness: 0.9 });
    const t1 = new THREE.Mesh(t1Geo, creamMat);
    t1.position.y = 1.1;
    cakeGroup.add(t1);

    // Tier 2
    const t2Geo = new THREE.CylinderGeometry(2.5, 2.5, 1.8, 64);
    const t2 = new THREE.Mesh(t2Geo, creamMat);
    t2.position.y = 3;
    cakeGroup.add(t2);

    // Gold Ribbon
    const ribbonGeo = new THREE.CylinderGeometry(2.52, 2.52, 0.2, 64);
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 1, roughness: 0.3 });
    const ribbon = new THREE.Mesh(ribbonGeo, goldMat);
    ribbon.position.y = 2.2;
    cakeGroup.add(ribbon);

    scene.add(cakeGroup);

    // Candles & Flames
    flames = [];
    activeFlames = 3;
    const candleOffsets = [[0, 0], [-1.2, 0.8], [1.2, 0.8]];

    candleOffsets.forEach((pos, i) => {
        const cGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 16);
        const cMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const candle = new THREE.Mesh(cGeo, cMat);
        candle.position.set(pos[0], 4.3, pos[1]);
        scene.add(candle);

        const fGeo = new THREE.SphereGeometry(0.12, 16, 16);
        const fMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
        const flame = new THREE.Mesh(fGeo, fMat);
        flame.position.set(pos[0], 4.8, pos[1]);
        flame.userData = { active: true, index: i };
        scene.add(flame);
        flames.push(flame);

        const pLight = new THREE.PointLight(0xffaa00, 1.5, 6);
        pLight.position.set(pos[0], 4.9, pos[1]);
        scene.add(pLight);
        flame.userData.light = pLight;
    });

    // Tap/Click Blow Fallback
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    container.addEventListener('click', (event) => {
        const rect = container.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(flames);

        if (intersects.length > 0) {
            extinguishFlame(intersects[0].object, event.clientX, event.clientY);
        }
    });

    // Setup Microphone Blow Detection
    setupMicBlow();

    // Animation Loop
    let time = 0;
    function animateCake() {
        if (currentSceneIndex !== 3) return requestAnimationFrame(animateCake);

        time += 0.04;
        cakeGroup.rotation.y = Math.sin(time * 0.2) * 0.1;

        flames.forEach(f => {
            if (f.userData.active) {
                const s = 1 + Math.random() * 0.2;
                f.scale.set(s, s + Math.random() * 0.4, s);
                f.userData.light.intensity = 1.2 + Math.random() * 0.4;
            }
        });

        renderer.render(scene, camera);
        requestAnimationFrame(animateCake);
    }
    animateCake();

    window.addEventListener('resize', () => {
        if (container.clientWidth > 0 && container.clientHeight > 0) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.position.z = window.innerWidth < 640 ? 16.5 : 14;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }
    });
}

function extinguishFlame(flameObj, clientX = window.innerWidth / 2, clientY = window.innerHeight / 2) {
    if (!flameObj.userData.active) return;
    flameObj.userData.active = false;
    triggerHaptic([35]);
    gsap.to(flameObj.scale, { x: 0, y: 0, z: 0, duration: 0.3 });
    gsap.to(flameObj.userData.light, { intensity: 0, duration: 0.5 });
    AudioSys.playBlow();
    createExplosion(clientX, clientY, '#aaaaaa', 15);

    activeFlames--;
    if (activeFlames === 0) {
        setTimeout(() => {
            AudioSys.playChime(1500);
            triggerHaptic([40, 60, 40]);
            createExplosion(window.innerWidth / 2, window.innerHeight / 2, '#D4AF37', 50, true);
            const continueBtn = document.getElementById('btn-cake-continue');
            gsap.to(continueBtn, { opacity: 1, y: 0, duration: 1, pointerEvents: 'auto' });
        }, 1000);
    }
}

// Microphone Blow Detection
function setupMicBlow() {
    const micBadge = document.getElementById('mic-status');
    const micText = document.getElementById('mic-text');

    micBadge.addEventListener('click', async () => {
        try {
            if (isMicListening) return;
            micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            micAudioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = micAudioContext.createMediaStreamSource(micStream);
            micAnalyser = micAudioContext.createAnalyser();
            micAnalyser.fftSize = 256;
            source.connect(micAnalyser);
            isMicListening = true;

            micText.textContent = "🎤 Listening: Blow into Mic!";
            checkMicBlowLoop();
        } catch (err) {
            micText.textContent = "👆 Tap flames directly to blow!";
        }
    });
}

function checkMicBlowLoop() {
    if (!isMicListening || activeFlames === 0) return;
    const dataArray = new Uint8Array(micAnalyser.frequencyBinCount);
    micAnalyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
    let avg = sum / dataArray.length;

    // Detect blow threshold
    if (avg > 55) {
        const activeOne = flames.find(f => f.userData.active);
        if (activeOne) {
            extinguishFlame(activeOne);
        }
    }
    requestAnimationFrame(checkMicBlowLoop);
}

function stopMicListening() {
    isMicListening = false;
    if (micStream) micStream.getTracks().forEach(track => track.stop());
    if (micAudioContext && micAudioContext.state !== 'closed') micAudioContext.close();
}

/**
 * =========================================================================
 * 4. PUZZLE GAME (3x3 SLIDING / SWAP PUZZLE + PEEK HINT + AUTO SOLVE)
 * =========================================================================
 */
let puzzlePieces = [];
let selectedPiece = null;
let puzzleSolved = false;

function initPuzzle() {
    const grid = document.getElementById('puzzle-grid');
    const btnContinue = document.getElementById('btn-puzzle-continue');
    const btnHint = document.getElementById('btn-hint');
    const btnAutoSolve = document.getElementById('btn-auto-solve');

    if (btnContinue) {
        btnContinue.onclick = () => { goToScene(5); };
    }
    
    if (btnHint) {
        btnHint.onclick = () => {
            openLightbox(CONFIG.puzzleImage, 'Special Memory Picture', 'Match the tiles to complete this beautiful memory!');
        };
    }

    if (btnAutoSolve) {
        btnAutoSolve.onclick = () => {
            autoSolvePuzzle();
        };
    }

    if (puzzlePieces.length > 0 && !puzzleSolved) return;
    puzzleSolved = false;

    // Super Easy 2-piece swap setup (7 out of 9 pieces already solved!)
    let indices = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    // Swap only 2 tiles (tile 1 and tile 4)
    indices[1] = 4;
    indices[4] = 1;

    grid.innerHTML = '';
    grid.style.gap = '4px';
    puzzlePieces = [];
    selectedPiece = null;

    indices.forEach((val, index) => {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.style.backgroundImage = `url("${encodeURI(CONFIG.puzzleImage)}")`;

        const row = Math.floor(val / 3);
        const col = val % 3;
        piece.style.backgroundPosition = `${col * 50}% ${row * 50}%`;
        piece.dataset.index = index;
        piece.dataset.correct = val;

        const numBadge = document.createElement('span');
        numBadge.className = 'tile-num';
        numBadge.textContent = val + 1;
        piece.appendChild(numBadge);

        piece.addEventListener('click', () => handlePieceClick(piece));
        puzzlePieces.push({ el: piece, targetVal: index });
        grid.appendChild(piece);
    });
}

function handlePieceClick(piece) {
    if (puzzleSolved) return;

    if (!selectedPiece) {
        selectedPiece = piece;
        piece.classList.add('selected');
        AudioSys.playChime(1300);
    } else {
        if (selectedPiece === piece) {
            piece.classList.remove('selected');
            selectedPiece = null;
            return;
        }

        const tempPos = selectedPiece.style.backgroundPosition;
        const tempCorrect = selectedPiece.dataset.correct;

        selectedPiece.style.backgroundPosition = piece.style.backgroundPosition;
        selectedPiece.dataset.correct = piece.dataset.correct;

        piece.style.backgroundPosition = tempPos;
        piece.dataset.correct = tempCorrect;

        // Update tile number badges
        const numA = selectedPiece.querySelector('.tile-num');
        const numB = piece.querySelector('.tile-num');
        if (numA) numA.textContent = parseInt(selectedPiece.dataset.correct) + 1;
        if (numB) numB.textContent = parseInt(piece.dataset.correct) + 1;

        // Smooth swap animation
        triggerHaptic([15]);
        gsap.fromTo([selectedPiece, piece], { scale: 0.92 }, { scale: 1, duration: 0.25, ease: "back.out(2)" });

        selectedPiece.classList.remove('selected');
        selectedPiece = null;

        AudioSys.playPop();
        checkPuzzleWin();
    }
}

function autoSolvePuzzle() {
    if (puzzleSolved) return;
    triggerHaptic([30, 40]);
    puzzlePieces.forEach((p, i) => {
        const row = Math.floor(i / 3);
        const col = i % 3;
        p.el.style.backgroundPosition = `${col * 50}% ${row * 50}%`;
        p.el.dataset.correct = i;
        const badge = p.el.querySelector('.tile-num');
        if (badge) badge.textContent = i + 1;
    });
    checkPuzzleWin();
}

function checkPuzzleWin() {
    let win = true;
    puzzlePieces.forEach((p, i) => {
        if (parseInt(p.el.dataset.correct) !== i) win = false;
    });

    if (win && !puzzleSolved) {
        puzzleSolved = true;
        triggerHaptic([40, 70, 90]);
        puzzlePieces.forEach(p => {
            p.el.style.pointerEvents = 'none';
            p.el.classList.remove('selected');
        });

        // Hide number badges smoothly on win
        gsap.to('.tile-num', { opacity: 0, duration: 0.5 });

        AudioSys.playExplosion();
        createExplosion(window.innerWidth / 2, window.innerHeight * 0.45, '#D4AF37', 80, true);
        setTimeout(() => createExplosion(window.innerWidth / 2, window.innerHeight * 0.45, '#FF69B4', 60, true), 200);

        const grid = document.getElementById('puzzle-grid');
        if (grid) {
            gsap.to(grid, { gap: 0, duration: 0.8, ease: "power2.inOut" });
        }
        gsap.to('.puzzle-piece', { borderRadius: 0, border: 'none', duration: 0.8, ease: "power2.inOut" });

        const btn = document.getElementById('btn-puzzle-continue');
        if (btn) {
            gsap.to(btn, { opacity: 1, y: 0, duration: 1, ease: "power3.out", pointerEvents: 'auto', delay: 0.3 });
        }
    }
}

/**
 * =========================================================================
 * 5. GIFT REVEAL & ROMANTIC TYPEWRITER LETTER
 * =========================================================================
 */
let giftOpened = false;
let voiceAudio = null;
let isVoicePlaying = false;

function initGiftScene() {
    const giftBox = document.getElementById('gift-box');
    const giftLid = document.getElementById('gift-lid');
    const letterModal = document.getElementById('letter-modal');
    const btnLetterContinue = document.getElementById('btn-letter-continue');
    const tapHint = document.querySelector('.gift-tap-hint');

    giftOpened = false;
    if (tapHint) gsap.set(tapHint, { opacity: 1, scale: 1 });

    const openGiftAction = () => {
        if (giftOpened || currentSceneIndex !== 5) return;
        giftOpened = true;

        triggerHaptic([40, 60, 80]);
        if (tapHint) gsap.to(tapHint, { opacity: 0, scale: 0.85, duration: 0.4 });

        AudioSys.playChime(800);
        setTimeout(() => AudioSys.playChime(1200), 200);

        const rect = giftBox.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        
        createExplosion(cx, cy, '#FFD700', 70, true);
        setTimeout(() => createExplosion(cx, cy - 40, '#FFA500', 50, true), 160);
        setTimeout(() => createExplosion(cx, cy - 80, '#FF69B4', 40, true), 320);

        gsap.to(giftLid, { y: -140, rotateX: 55, rotateZ: 20, opacity: 0, duration: 1.3, ease: "power3.out" });

        // Open Romantic Letter with Typewriter
        setTimeout(() => {
            letterModal.classList.add('active');
            startTypewriter();
        }, 750);
    };

    if (giftBox) giftBox.onclick = openGiftAction;
    if (tapHint) tapHint.onclick = openGiftAction;

    btnLetterContinue.onclick = () => {
        letterModal.classList.remove('active');
        if (isVoicePlaying && voiceAudio) {
            voiceAudio.pause();
            isVoicePlaying = false;
        }
        goToScene(6);
    };

    // Voice Note Player
    const voicePlayBtn = document.getElementById('voice-note-player');
    if (voicePlayBtn) {
        voicePlayBtn.onclick = () => {
            if (!voiceAudio) {
                voiceAudio = new Audio(CONFIG.voiceNoteUrl);
                voiceAudio.onended = () => {
                    isVoicePlaying = false;
                    document.getElementById('voice-play-svg').innerHTML = '<polygon points="5 3 19 12 5 21 5 3" />';
                };
            }
            if (isVoicePlaying) {
                voiceAudio.pause();
                isVoicePlaying = false;
                document.getElementById('voice-play-svg').innerHTML = '<polygon points="5 3 19 12 5 21 5 3" />';
            } else {
                voiceAudio.play().then(() => {
                    isVoicePlaying = true;
                    document.getElementById('voice-play-svg').innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
                }).catch(() => {
                    alert("Please add your 'voice.mp3' file into the project folder to play your personal voice wish! 🎙️");
                });
            }
        };
    }
}

function startTypewriter() {
    const textEl = document.getElementById('typewriter-text');
    const fullText = CONFIG.letterText;
    textEl.textContent = "";
    let i = 0;

    function typeChar() {
        if (i < fullText.length) {
            textEl.textContent += fullText.charAt(i);
            i++;
            setTimeout(typeChar, 25);
        }
    }
    typeChar();
}

/**
 * =========================================================================
 * 6. FINALE & REPLAY CELEBRATION
 * =========================================================================
 */
document.getElementById('btn-replay').addEventListener('click', () => {
    effectMode = 'ambient';
    hasStartedPopping = false;
    currentGalleryIndex = 0;
    giftOpened = false;
    
    const giftLid = document.getElementById('gift-lid');
    if (giftLid) gsap.set(giftLid, { y: 0, rotateX: 0, rotateZ: 0, opacity: 1 });
    
    const letterModal = document.getElementById('letter-modal');
    if (letterModal) letterModal.classList.remove('active');
    
    // Reset candle flames
    if (flames && flames.length > 0) {
        activeFlames = flames.length;
        flames.forEach(f => {
            f.userData.active = true;
            gsap.set(f.scale, { x: 1, y: 1, z: 1 });
            if (f.userData.light) f.userData.light.intensity = 1.5;
        });
        const cakeBtn = document.getElementById('btn-cake-continue');
        if (cakeBtn) gsap.set(cakeBtn, { opacity: 0, y: 20, pointerEvents: 'none' });
    }

    goToScene(0);
});

/**
 * =========================================================================
 * 🖱️ SMOOTH PARALLAX EFFECT
 * =========================================================================
 */
let lastParallax = 0;
if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
        if (isTransitioning) return;
        const now = performance.now();
        if (now - lastParallax < 20) return;
        lastParallax = now;

        const x = (e.clientX / window.innerWidth - 0.5) * 14;
        const y = (e.clientY / window.innerHeight - 0.5) * 14;

        gsap.to('.scene-container.active .content-wrapper', { x: -x, y: -y, duration: 0.8, ease: "power2.out" });
        gsap.to('.ambient-aurora', { x: x * 1.2, y: y * 1.2, duration: 1.5, ease: "power2.out" });
    });
}
