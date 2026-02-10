/* ===== ONE PIECE GRAND LINE PORTFOLIO JS ===== */
/* Nautical interactions, Conqueror's Haki effects, Log Pose navigation */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Typing Animation (Wanted Poster A.K.A.) ----
    const titles = [
        'MLOps Grand Line Architect',
        'ML Pipeline Navigator',
        'GenAI Devil Fruit User',
        'Cloud Helmsman',
        'FastAPI Shipwright'
    ];
    const typedEl = document.getElementById('typedText');
    let titleIdx = 0, charIdx = 0, deleting = false;

    function typeLoop() {
        const current = titles[titleIdx];
        if (!deleting) {
            typedEl.textContent = current.slice(0, charIdx + 1);
            charIdx++;
            if (charIdx === current.length) {
                deleting = true;
                setTimeout(typeLoop, 2200);
                return;
            }
            setTimeout(typeLoop, 70);
        } else {
            typedEl.textContent = current.slice(0, charIdx - 1);
            charIdx--;
            if (charIdx === 0) {
                deleting = false;
                titleIdx = (titleIdx + 1) % titles.length;
                setTimeout(typeLoop, 400);
                return;
            }
            setTimeout(typeLoop, 35);
        }
    }
    typeLoop();

    // ---- Bounty Counter Animation ----
    const bountyEl = document.getElementById('bountyAmount');
    const bountyTarget = 4000000000; // 4 Billion Beri!
    let bountyAnimated = false;

    function animateBounty() {
        if (bountyAnimated) return;
        bountyAnimated = true;
        let current = 0;
        const duration = 2500;
        const startTime = Date.now();

        function tick() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            current = Math.floor(eased * bountyTarget);
            bountyEl.textContent = '฿ ' + current.toLocaleString();
            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        }
        tick();
    }

    // Trigger bounty animation when hero is visible
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(animateBounty, 600);
            }
        });
    }, { threshold: 0.3 });
    heroObserver.observe(document.getElementById('hero'));

    // ---- Scroll Reveal ----
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));

    // ---- Navbar Scroll ----
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('.section, .hero');
    const navLinksAll = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
        let current = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 120;
            if (window.scrollY >= top) {
                current = sec.getAttribute('id');
            }
        });
        navLinksAll.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // ---- Mobile Nav Toggle ----
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

    // ---- Stat Counter Animation ----
    const statNumbers = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target, 10);
                animateCounter(el, target);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    statNumbers.forEach(el => counterObserver.observe(el));

    function animateCounter(el, target) {
        let current = 0;
        const step = Math.max(1, Math.floor(target / 40));
        const interval = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(interval);
            }
            el.textContent = current;
        }, 40);
    }

    // ======================================================
    // OCEAN WAVES CANVAS — bubbles & floating particles
    // ======================================================
    const canvas = document.getElementById('oceanCanvas');
    const ctx = canvas.getContext('2d');
    let bubbles = [];
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, active: false };
    let animId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    });

    document.addEventListener('mouseleave', () => {
        mouse.active = false;
    });

    // Ocean Bubble class
    class OceanBubble {
        constructor(initial = false) {
            this.reset(initial);
        }

        reset(initial = false) {
            this.x = Math.random() * canvas.width;
            this.y = initial ? Math.random() * canvas.height : canvas.height + 20;
            this.size = Math.random() * 3 + 1;
            this.speedY = -(Math.random() * 0.4 + 0.15); // float upward
            this.speedX = (Math.random() - 0.5) * 0.2;
            this.opacity = Math.random() * 0.15 + 0.03;
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 0.01 + 0.003;

            // Colors: ocean blues and gold sparkles
            const colorRoll = Math.random();
            if (colorRoll < 0.6) {
                this.color = `rgba(42, 100, 150, ${this.opacity})`; // ocean blue
            } else if (colorRoll < 0.85) {
                this.color = `rgba(52, 152, 219, ${this.opacity})`; // marine blue
            } else {
                this.color = `rgba(218, 165, 32, ${this.opacity * 1.5})`; // gold sparkle
            }
        }

        update() {
            this.wobble += this.wobbleSpeed;
            this.x += this.speedX + Math.sin(this.wobble) * 0.4;
            this.y += this.speedY;

            // Mouse interaction: bubbles drift away
            if (mouse.active) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const influenceRadius = 120;

                if (dist < influenceRadius) {
                    const force = (1 - dist / influenceRadius) * 1.5;
                    const angle = Math.atan2(dy, dx);
                    this.x += Math.cos(angle) * force;
                    this.y += Math.sin(angle) * force;
                }
            }

            if (this.y < -20 || this.x < -20 || this.x > canvas.width + 20) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();

            // Subtle glow for gold particles
            if (this.color.includes('218')) {
                ctx.shadowBlur = 8;
                ctx.shadowColor = 'rgba(218, 165, 32, 0.3)';
                ctx.fill();
            }

            ctx.restore();
        }
    }

    function initBubbles() {
        const count = Math.min(50, Math.floor(canvas.width * canvas.height / 30000));
        bubbles = [];
        for (let i = 0; i < count; i++) {
            bubbles.push(new OceanBubble(true));
        }
    }
    initBubbles();
    window.addEventListener('resize', () => {
        resizeCanvas();
        initBubbles();
    });

    // ======================================================
    // GOLDEN TRAIL — treasure sparkle following cursor
    // ======================================================
    const trailParticles = [];
    const maxTrail = 15;
    let lastTrailTime = 0;

    class GoldSparkle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 3 + 1.5;
            this.life = 1;
            this.decay = Math.random() * 0.04 + 0.02;
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = (Math.random() - 0.5) * 1.5 - 0.5; // slight upward drift
            this.isGold = Math.random() > 0.3;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life -= this.decay;
            this.size *= 0.97;
        }

        draw() {
            if (this.life <= 0) return;
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

            if (this.isGold) {
                ctx.fillStyle = `rgba(218, 165, 32, ${this.life * 0.5})`;
                ctx.shadowBlur = 6;
                ctx.shadowColor = `rgba(218, 165, 32, ${this.life * 0.3})`;
            } else {
                ctx.fillStyle = `rgba(192, 57, 43, ${this.life * 0.4})`;
                ctx.shadowBlur = 4;
                ctx.shadowColor = `rgba(192, 57, 43, ${this.life * 0.2})`;
            }
            ctx.fill();
            ctx.restore();
        }
    }

    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastTrailTime > 60) {
            trailParticles.push(new GoldSparkle(e.clientX, e.clientY));
            if (trailParticles.length > maxTrail) {
                trailParticles.shift();
            }
            lastTrailTime = now;
        }
    });

    // ===== MAIN ANIMATION LOOP =====
    function mainLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw ocean bubbles
        bubbles.forEach(b => {
            b.update();
            b.draw();
        });

        // Draw gold trail
        for (let i = trailParticles.length - 1; i >= 0; i--) {
            trailParticles[i].update();
            trailParticles[i].draw();
            if (trailParticles[i].life <= 0) {
                trailParticles.splice(i, 1);
            }
        }

        animId = requestAnimationFrame(mainLoop);
    }
    mainLoop();

    // ======================================================
    // OP CARD TILT – 3D Parallax on hover
    // ======================================================
    const opCards = document.querySelectorAll('.op-card');

    opCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;

            // Golden light highlight
            const glowX = (x / rect.width) * 100;
            const glowY = (y / rect.height) * 100;
            card.style.background = `
                radial-gradient(circle at ${glowX}% ${glowY}%, rgba(218, 165, 32, 0.06) 0%, transparent 50%),
                rgba(18, 34, 64, 0.6)
            `;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.background = '';
        });
    });

    // ======================================================
    // WANTED POSTER TILT — special 3D effect
    // ======================================================
    const wantedPoster = document.getElementById('wantedPoster');

    if (wantedPoster) {
        wantedPoster.addEventListener('mousemove', (e) => {
            const rect = wantedPoster.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -3;
            const rotateY = ((x - centerX) / centerX) * 3;

            wantedPoster.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        wantedPoster.addEventListener('mouseleave', () => {
            wantedPoster.style.transform = '';
        });
    }

    // ======================================================
    // LOG POSE NEEDLE — points toward scroll direction
    // ======================================================
    const logPoseNeedle = document.getElementById('logPoseNeedle');
    let lastScrollY = window.scrollY;

    if (logPoseNeedle) {
        window.addEventListener('scroll', () => {
            const delta = window.scrollY - lastScrollY;
            const angle = Math.max(-45, Math.min(45, delta * 3));
            logPoseNeedle.style.transform = `rotate(${angle}deg)`;
            lastScrollY = window.scrollY;
        });

        // Also react to mouse position
        document.addEventListener('mousemove', (e) => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI) - 90;
            logPoseNeedle.style.transform = `rotate(${angle}deg)`;
        });
    }

    // ======================================================
    // CONQUEROR'S HAKI BURST — on click
    // ======================================================
    document.addEventListener('click', (e) => {
        createHakiBurst(e.clientX, e.clientY);
    });

    function createHakiBurst(x, y) {
        // Expanding ring
        const ring = document.createElement('div');
        ring.className = 'haki-burst';
        ring.style.left = x + 'px';
        ring.style.top = y + 'px';
        document.body.appendChild(ring);
        ring.addEventListener('animationend', () => ring.remove());

        // Sparks
        const sparkCount = 8;
        for (let i = 0; i < sparkCount; i++) {
            const spark = document.createElement('div');
            spark.className = 'haki-spark';
            spark.style.left = x + 'px';
            spark.style.top = y + 'px';

            const angle = (Math.PI * 2 / sparkCount) * i;
            const dist = Math.random() * 40 + 25;
            spark.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
            spark.style.setProperty('--ty', Math.sin(angle) * dist + 'px');

            // Gold and red sparks
            spark.style.background = Math.random() > 0.5 ? '#daa520' : '#c0392b';
            spark.style.boxShadow = `0 0 6px ${spark.style.background}`;

            document.body.appendChild(spark);
            spark.addEventListener('animationend', () => spark.remove());
        }
    }

    // ======================================================
    // OCEAN WAVES — hero parallax
    // ======================================================
    const heroSection = document.getElementById('hero');
    const waves = document.querySelectorAll('.wave');

    heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

        waves.forEach((wave, i) => {
            const factor = (i + 1) * 6;
            wave.style.transform = `translateX(${x * factor}px) scaleY(${1 + Math.abs(y) * 0.3})`;
        });
    });

    heroSection.addEventListener('mouseleave', () => {
        waves.forEach(wave => {
            wave.style.transform = '';
            wave.style.transition = 'transform 0.5s ease';
            setTimeout(() => { wave.style.transition = ''; }, 500);
        });
    });

    // ======================================================
    // PARALLAX on scroll for section bg emblems
    // ======================================================
    const bgEmblems = document.querySelectorAll('.section-bg-emblem');

    window.addEventListener('scroll', () => {
        bgEmblems.forEach(emblem => {
            const section = emblem.parentElement;
            const rect = section.getBoundingClientRect();
            const scrollProgress = -rect.top / window.innerHeight;
            emblem.style.transform = `translate(-50%, calc(-50% + ${scrollProgress * 40}px))`;
        });
    });

    // ======================================================
    // MAP ROUTE DIVIDER ANIMATION — draw on scroll
    // ======================================================
    const mapRoutes = document.querySelectorAll('.map-route');

    mapRoutes.forEach(path => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        path.style.transition = 'stroke-dashoffset 2s ease-out';
    });

    const routeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const path = entry.target.querySelector('.map-route');
                if (path) {
                    path.style.strokeDashoffset = '0';
                }
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.map-divider').forEach(div => {
        routeObserver.observe(div);
    });

    // ======================================================
    // SKILL CHIPS — staggered entrance animation
    // ======================================================
    const skillChips = document.querySelectorAll('.skill-chip');
    skillChips.forEach((chip, i) => {
        chip.style.animationDelay = (i * 0.06) + 's';
    });

});
