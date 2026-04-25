/**
 * Particle Wave Animation
 */
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: -1000, y: -1000 };
        this.resize();
        this.init();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.init();
    }

    init() {
        this.particles = [];
        const spacing = 40;
        const rows = Math.floor(this.height / spacing) + 2;
        const cols = Math.floor(this.width / spacing) + 2;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                this.particles.push({
                    baseX: c * spacing,
                    baseY: r * spacing,
                    x: c * spacing,
                    y: r * spacing,
                    vx: 0,
                    vy: 0,
                    size: 1,
                    angle: (c + r) * 0.2
                });
            }
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.63)';

        const time = Date.now() * 0.001;

        this.particles.forEach(p => {
            // Wave motion
            const waveX = Math.sin(time + p.angle) * 5;
            const waveY = Math.cos(time + p.angle) * 5;

            // Mouse interaction
            const dx = this.mouse.x - (p.baseX + waveX);
            const dy = this.mouse.y - (p.baseY + waveY);
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxDist = 150;

            let forceX = 0;
            let forceY = 0;

            if (dist < maxDist) {
                const force = (maxDist - dist) / maxDist;
                forceX = (dx / dist) * force * -50;
                forceY = (dy / dist) * force * -50;
            }

            p.x = p.baseX + waveX + forceX;
            p.y = p.baseY + waveY + forceY;

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.animate());
    }
}

/**
 * Unique Cursor Trail
 */
class CursorTrail {
    constructor() {
        this.canvas = document.getElementById('cursorCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: -100, y: -100 };
        this.resize();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.addParticles(e.clientX, e.clientY);
        });
    }

    addParticles(x, y) {
        for (let i = 0; i < 2; i++) {
            this.particles.push({
                x,
                y,
                size: Math.random() * 3 + 1,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                life: 1,
                color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.02;

            if (p.life <= 0) {
                this.particles.splice(i, 1);
                i--;
                continue;
            }

            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.life;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        }

        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Particle Systems
    new ParticleSystem();
    new CursorTrail();

    // Scroll Reveal Animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing once it's revealed
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach(el => observer.observe(el));

    // Universal 3D Tilt Effect
    const applyTilt = (elements) => {
        elements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = -(y - centerY) / 10;
                const rotateY = -(centerX - x) / 10;

                el.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(0)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = `rotateX(0deg) rotateY(0deg) translateY(0)`;
                el.style.transition = 'transform 0.5s ease';
            });

            el.addEventListener('mouseenter', () => {
                el.style.transition = 'transform 0.1s ease-out';
            });
        });
    };

    applyTilt(document.querySelectorAll('.product-card'));
    applyTilt(document.querySelectorAll('.why-card'));

    // Button Spotlight Effect
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            btn.style.setProperty('--x', x + '%');
            btn.style.setProperty('--y', y + '%');
        });
    });

    // Hero Model Mouse Interaction (Parallax)
    const heroVisual = document.querySelector('.hero-visual');
    const floatingModel = document.querySelector('.floating-model');

    if (heroVisual && floatingModel) {
        document.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25;

            floatingModel.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg) translateY(-20px)`;
        });

        // Reset on mouse leave
        heroVisual.addEventListener('mouseleave', () => {
            floatingModel.style.transform = `rotateY(0deg) rotateX(0deg) translateY(0)`;
            floatingModel.style.transition = 'all 0.5s ease';
        });

        heroVisual.addEventListener('mouseenter', () => {
            floatingModel.style.transition = 'none';
        });
    }

    // Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form Submission Handling (Mockup)
    const inquiryForm = document.getElementById('inquiryForm');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = inquiryForm.querySelector('button');
            const originalText = submitBtn.innerText;

            submitBtn.innerText = 'SENDING...';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                alert('Thank you for your inquiry. YUSAKA team will contact you shortly.');
                inquiryForm.reset();
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // Navbar Scroll Background & Back to Top & Scroll Progress
    const backToTop = document.querySelector('.back-to-top');
    const scrollProgress = document.getElementById('scrollProgress');

    window.addEventListener('scroll', () => {
        // Progress Calculation
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        if (scrollProgress) scrollProgress.style.width = scrolled + '%';

        const nav = document.querySelector('.nav-container');
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(0, 0, 0, 0.95)';
            nav.style.padding = '20px 5%';
        } else {
            nav.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)';
            nav.style.padding = '30px 5%';
        }

        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
});
