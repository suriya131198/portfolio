/* ===== DUAL THEME PORTFOLIO JS ===== */

document.addEventListener('DOMContentLoaded', () => {

    // ======================================================
    // THEME TOGGLE
    // ======================================================
    const html = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    const toggleLabel = document.getElementById('toggleLabel');

    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('portfolioTheme') || 'onepiece';
    html.setAttribute('data-theme', savedTheme);
    themeToggle.checked = savedTheme === 'onepiece';
    updateToggleLabel(savedTheme);

    themeToggle.addEventListener('change', () => {
        const theme = themeToggle.checked ? 'onepiece' : 'professional';
        html.setAttribute('data-theme', theme);
        localStorage.setItem('portfolioTheme', theme);
        updateToggleLabel(theme);

        // Restart appropriate canvas
        if (theme === 'onepiece') {
            stopParticles();
            startOcean();
        } else {
            stopOcean();
            startParticles();
        }

        // Re-trigger stat counters
        resetCounters();
    });

    function updateToggleLabel(theme) {
        // When on One Piece page, show "Professional" (the other option)
        // When on Professional page, show "Personal" (the other option)
        toggleLabel.textContent = theme === 'onepiece' ? 'Professional' : 'Personal';
    }

    // ======================================================
    // TYPING ANIMATION — dual typed elements
    // ======================================================
    const opTitles = [
        'MLOps Grand Line Architect',
        'ML Pipeline Navigator',
        'GenAI Devil Fruit User',
        'Cloud Helmsman',
        'FastAPI Shipwright'
    ];
    const proTitles = [
        'MLOps Engineer',
        'ML Pipeline Architect',
        'GenAI Developer',
        'FastAPI Developer',
        'Cloud Infrastructure Engineer'
    ];

    const typedOP = document.getElementById('typedTextOP');
    const typedPro = document.getElementById('typedTextPro');

    function createTypeLoop(el, titles) {
        let titleIdx = 0, charIdx = 0, deleting = false;
        let timeoutId = null;

        function loop() {
            if (!el) return;
            const current = titles[titleIdx];
            if (!deleting) {
                el.textContent = current.slice(0, charIdx + 1);
                charIdx++;
                if (charIdx === current.length) {
                    deleting = true;
                    timeoutId = setTimeout(loop, 2000);
                    return;
                }
                timeoutId = setTimeout(loop, 75);
            } else {
                el.textContent = current.slice(0, charIdx - 1);
                charIdx--;
                if (charIdx === 0) {
                    deleting = false;
                    titleIdx = (titleIdx + 1) % titles.length;
                    timeoutId = setTimeout(loop, 450);
                    return;
                }
                timeoutId = setTimeout(loop, 38);
            }
        }
        loop();
    }

    createTypeLoop(typedOP, opTitles);
    createTypeLoop(typedPro, proTitles);

    // ======================================================
    // BOUNTY COUNTER (One Piece)
    // ======================================================
    const bountyEl = document.getElementById('bountyAmount');
    const bountyTarget = 4000000000;
    let bountyAnimated = false;

    function animateBounty() {
        if (bountyAnimated) return;
        bountyAnimated = true;
        const duration = 2500;
        const startTime = Date.now();
        function tick() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            bountyEl.textContent = '฿ ' + Math.floor(eased * bountyTarget).toLocaleString();
            if (progress < 1) requestAnimationFrame(tick);
        }
        tick();
    }

    const heroObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) setTimeout(animateBounty, 600);
        });
    }, { threshold: 0.3 });
    heroObs.observe(document.getElementById('hero'));

    // ======================================================
    // SCROLL REVEAL
    // ======================================================
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));

    // ======================================================
    // NAVBAR
    // ======================================================
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('.section, .hero');
    const navLinksAll = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
        let current = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 120;
            if (window.scrollY >= top) current = sec.getAttribute('id');
        });
        navLinksAll.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) link.classList.add('active');
        });
    });

    // Mobile nav toggle
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('open');
        navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('open');
            navLinks.classList.remove('open');
        });
    });

    // ======================================================
    // STAT COUNTER
    // ======================================================
    function resetCounters() {
        document.querySelectorAll('.stat-number').forEach(el => {
            el.textContent = '0';
            el._counted = false;
        });
        setupCounters();
    }

    function setupCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target._counted) {
                    const el = entry.target;
                    // Only count if visible (not hidden by theme)
                    if (el.offsetParent !== null) {
                        el._counted = true;
                        const target = parseInt(el.dataset.target, 10);
                        animateCounter(el, target);
                    }
                }
            });
        }, { threshold: 0.5 });
        statNumbers.forEach(el => counterObserver.observe(el));
    }

    function animateCounter(el, target) {
        let current = 0;
        const step = Math.max(1, Math.floor(target / 40));
        const interval = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(interval); }
            el.textContent = current;
        }, 40);
    }
    setupCounters();

    // ======================================================
    // OCEAN CANVAS (One Piece theme)
    // ======================================================
    const oceanCanvas = document.getElementById('oceanCanvas');
    const oceanCtx = oceanCanvas.getContext('2d');
    let bubbles = [];
    let trailParticles = [];
    let oceanAnimId;
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, active: false };
    let lastTrailTime = 0;

    function resizeOceanCanvas() {
        oceanCanvas.width = window.innerWidth;
        oceanCanvas.height = window.innerHeight;
    }
    resizeOceanCanvas();

    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true;
        // Gold trail
        const now = Date.now();
        if (now - lastTrailTime > 60 && html.getAttribute('data-theme') === 'onepiece') {
            trailParticles.push({ x: e.clientX, y: e.clientY, size: Math.random() * 3 + 1.5, life: 1, decay: Math.random() * 0.04 + 0.02, vx: (Math.random() - 0.5) * 1.5, vy: (Math.random() - 0.5) * 1.5 - 0.5, isGold: Math.random() > 0.3 });
            if (trailParticles.length > 15) trailParticles.shift();
            lastTrailTime = now;
        }
    });
    document.addEventListener('mouseleave', () => { mouse.active = false; });

    class OceanBubble {
        constructor(initial = false) { this.reset(initial); }
        reset(initial = false) {
            this.x = Math.random() * oceanCanvas.width;
            this.y = initial ? Math.random() * oceanCanvas.height : oceanCanvas.height + 20;
            this.size = Math.random() * 3 + 1;
            this.speedY = -(Math.random() * 0.4 + 0.15);
            this.speedX = (Math.random() - 0.5) * 0.2;
            this.opacity = Math.random() * 0.15 + 0.03;
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 0.01 + 0.003;
            const r = Math.random();
            this.color = r < 0.6 ? `rgba(42,100,150,${this.opacity})` : r < 0.85 ? `rgba(52,152,219,${this.opacity})` : `rgba(218,165,32,${this.opacity * 1.5})`;
        }
        update() {
            this.wobble += this.wobbleSpeed;
            this.x += this.speedX + Math.sin(this.wobble) * 0.4;
            this.y += this.speedY;
            if (mouse.active) {
                const dx = this.x - mouse.x, dy = this.y - mouse.y, dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    const force = (1 - dist / 120) * 1.5, angle = Math.atan2(dy, dx);
                    this.x += Math.cos(angle) * force; this.y += Math.sin(angle) * force;
                }
            }
            if (this.y < -20 || this.x < -20 || this.x > oceanCanvas.width + 20) this.reset();
        }
        draw() {
            oceanCtx.save(); oceanCtx.beginPath();
            oceanCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            oceanCtx.fillStyle = this.color; oceanCtx.fill();
            if (this.color.includes('218')) { oceanCtx.shadowBlur = 8; oceanCtx.shadowColor = 'rgba(218,165,32,0.3)'; oceanCtx.fill(); }
            oceanCtx.restore();
        }
    }

    function initBubbles() {
        const count = Math.min(50, Math.floor(oceanCanvas.width * oceanCanvas.height / 30000));
        bubbles = [];
        for (let i = 0; i < count; i++) bubbles.push(new OceanBubble(true));
    }

    function oceanLoop() {
        oceanCtx.clearRect(0, 0, oceanCanvas.width, oceanCanvas.height);
        bubbles.forEach(b => { b.update(); b.draw(); });
        for (let i = trailParticles.length - 1; i >= 0; i--) {
            const p = trailParticles[i];
            p.x += p.vx; p.y += p.vy; p.life -= p.decay; p.size *= 0.97;
            if (p.life > 0) {
                oceanCtx.save(); oceanCtx.beginPath();
                oceanCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                oceanCtx.fillStyle = p.isGold ? `rgba(218,165,32,${p.life * 0.5})` : `rgba(192,57,43,${p.life * 0.4})`;
                oceanCtx.fill(); oceanCtx.restore();
            } else { trailParticles.splice(i, 1); }
        }
        oceanAnimId = requestAnimationFrame(oceanLoop);
    }

    function startOcean() { resizeOceanCanvas(); initBubbles(); oceanLoop(); }
    function stopOcean() { cancelAnimationFrame(oceanAnimId); if (oceanCtx) oceanCtx.clearRect(0, 0, oceanCanvas.width, oceanCanvas.height); }

    // ======================================================
    // PARTICLE CANVAS (Professional theme)
    // ======================================================
    const partCanvas = document.getElementById('particleCanvas');
    const partCtx = partCanvas.getContext('2d');
    let particles = [];
    let partAnimId;

    function resizePartCanvas() {
        partCanvas.width = window.innerWidth; partCanvas.height = window.innerHeight;
    }
    resizePartCanvas();

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * partCanvas.width; this.y = Math.random() * partCanvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4; this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.4 + 0.1;
        }
        update() {
            this.x += this.speedX; this.y += this.speedY;
            if (this.x < 0 || this.x > partCanvas.width || this.y < 0 || this.y > partCanvas.height) this.reset();
        }
        draw() {
            partCtx.beginPath(); partCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            partCtx.fillStyle = `rgba(0,212,170,${this.opacity})`; partCtx.fill();
        }
    }

    function initParticles() {
        const count = Math.min(80, Math.floor(partCanvas.width * partCanvas.height / 15000));
        particles = [];
        for (let i = 0; i < count; i++) particles.push(new Particle());
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    partCtx.beginPath(); partCtx.moveTo(particles[i].x, particles[i].y);
                    partCtx.lineTo(particles[j].x, particles[j].y);
                    partCtx.strokeStyle = `rgba(0,212,170,${0.08 * (1 - dist / 120)})`;
                    partCtx.lineWidth = 0.5; partCtx.stroke();
                }
            }
        }
    }

    function particleLoop() {
        partCtx.clearRect(0, 0, partCanvas.width, partCanvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        drawConnections();
        partAnimId = requestAnimationFrame(particleLoop);
    }

    function startParticles() { resizePartCanvas(); initParticles(); particleLoop(); }
    function stopParticles() { cancelAnimationFrame(partAnimId); if (partCtx) partCtx.clearRect(0, 0, partCanvas.width, partCanvas.height); }

    // Start the right canvas based on initial theme
    if (savedTheme === 'onepiece') { startOcean(); } else { startParticles(); }

    window.addEventListener('resize', () => {
        resizeOceanCanvas(); resizePartCanvas();
        if (html.getAttribute('data-theme') === 'onepiece') { initBubbles(); }
        else { initParticles(); }
    });

    // ======================================================
    // OP CARD TILT — 3D on hover
    // ======================================================
    document.querySelectorAll('.op-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (html.getAttribute('data-theme') !== 'onepiece') return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left, y = e.clientY - rect.top;
            const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -5;
            const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 5;
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            const glowX = (x / rect.width) * 100, glowY = (y / rect.height) * 100;
            card.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(218,165,32,0.06) 0%, transparent 50%), rgba(18,34,64,0.6)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; card.style.background = ''; });
    });

    // Wanted Poster tilt
    const wantedPoster = document.getElementById('wantedPoster');
    if (wantedPoster) {
        wantedPoster.addEventListener('mousemove', (e) => {
            const rect = wantedPoster.getBoundingClientRect();
            const rotateX = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -3;
            const rotateY = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 3;
            wantedPoster.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        wantedPoster.addEventListener('mouseleave', () => { wantedPoster.style.transform = ''; });
    }

    // ======================================================
    // LOG POSE NEEDLE
    // ======================================================
    const logPoseNeedle = document.getElementById('logPoseNeedle');
    if (logPoseNeedle) {
        document.addEventListener('mousemove', (e) => {
            const angle = Math.atan2(e.clientY - window.innerHeight / 2, e.clientX - window.innerWidth / 2) * (180 / Math.PI) - 90;
            logPoseNeedle.style.transform = `rotate(${angle}deg)`;
        });
    }

    // ======================================================
    // CONQUEROR'S HAKI BURST — click (OP theme only)
    // ======================================================
    document.addEventListener('click', (e) => {
        if (html.getAttribute('data-theme') !== 'onepiece') return;
        // Don't burst on toggle clicks
        if (e.target.closest('.theme-toggle-wrapper') || e.target.closest('.nav-toggle') || e.target.closest('a')) return;

        const ring = document.createElement('div');
        ring.className = 'haki-burst'; ring.style.left = e.clientX + 'px'; ring.style.top = e.clientY + 'px';
        document.body.appendChild(ring);
        ring.addEventListener('animationend', () => ring.remove());

        for (let i = 0; i < 8; i++) {
            const spark = document.createElement('div');
            spark.className = 'haki-spark'; spark.style.left = e.clientX + 'px'; spark.style.top = e.clientY + 'px';
            const angle = (Math.PI * 2 / 8) * i, dist = Math.random() * 40 + 25;
            spark.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
            spark.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
            spark.style.background = Math.random() > 0.5 ? '#daa520' : '#c0392b';
            spark.style.boxShadow = `0 0 6px ${spark.style.background}`;
            document.body.appendChild(spark);
            spark.addEventListener('animationend', () => spark.remove());
        }
    });

    // ======================================================
    // WAVE PARALLAX
    // ======================================================
    const heroSection = document.getElementById('hero');
    const waves = document.querySelectorAll('.wave');
    heroSection.addEventListener('mousemove', (e) => {
        if (html.getAttribute('data-theme') !== 'onepiece') return;
        const rect = heroSection.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        waves.forEach((wave, i) => {
            wave.style.transform = `translateX(${x * (i + 1) * 6}px) scaleY(${1 + Math.abs(y) * 0.3})`;
        });
    });
    heroSection.addEventListener('mouseleave', () => {
        waves.forEach(wave => { wave.style.transform = ''; wave.style.transition = 'transform 0.5s ease'; setTimeout(() => { wave.style.transition = ''; }, 500); });
    });

    // ======================================================
    // SECTION BG EMBLEM PARALLAX
    // ======================================================
    const bgEmblems = document.querySelectorAll('.section-bg-emblem');
    window.addEventListener('scroll', () => {
        bgEmblems.forEach(emblem => {
            const rect = emblem.parentElement.getBoundingClientRect();
            const scrollProgress = -rect.top / window.innerHeight;
            emblem.style.transform = `translate(-50%, calc(-50% + ${scrollProgress * 40}px))`;
        });
    });

    // ======================================================
    // MAP ROUTE DIVIDER ANIMATION
    // ======================================================
    const mapRoutes = document.querySelectorAll('.map-route');
    mapRoutes.forEach(path => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length; path.style.strokeDashoffset = length;
        path.style.transition = 'stroke-dashoffset 2s ease-out';
    });
    const routeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const path = entry.target.querySelector('.map-route');
                if (path) path.style.strokeDashoffset = '0';
            }
        });
    }, { threshold: 0.3 });
    document.querySelectorAll('.map-divider').forEach(div => routeObserver.observe(div));

    // Skill chips staggered animation
    document.querySelectorAll('.skill-chip').forEach((chip, i) => { chip.style.animationDelay = (i * 0.06) + 's'; });
});
