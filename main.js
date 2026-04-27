document.addEventListener('DOMContentLoaded', () => {

    // 1. Initial Page Load Animations
    setTimeout(() => {
        document.querySelectorAll('.fade-up, .fade-in').forEach(el => {
            el.classList.add('visible');
        });
    }, 100);

    // 2. Button Spotlight Effect Tracking
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline');
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            btn.style.setProperty('--x', `${x}px`);
            btn.style.setProperty('--y', `${y}px`);
        });
    });

    // 2. Scroll Reveal Animations using Intersection Observer
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // 3. 3D Hover Effect for Product Cards
    const cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top;  // y position within the element

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg rotation
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
        });
    });

    // 4. Parallax effect for the hero image on mousemove (desktop only)
    const heroSection = document.querySelector('.hero');
    const heroImage = document.querySelector('.floating-model');

    if (heroSection && heroImage && window.innerWidth > 1024) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5; // Max 5 deg
            const rotateY = ((x - centerX) / centerX) * 5;
            
            const moveX = ((x - centerX) / centerX) * 8; // Move 8px towards cursor
            const moveY = ((y - centerY) / centerY) * 8;
            
            heroImage.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.transform = `translate(${moveX}px, ${moveY}px)`;
            }
        });

        heroSection.addEventListener('mouseleave', () => {
            heroImage.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.transform = `translate(0, 0)`;
            }
        });
    }

    // 5. Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 6. Scroll Progress Bar logic
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";
    });

    // 7. Particle Background System
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 150;
        let mouse = { x: null, y: null, radius: 150 };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        });

        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
                this.originX = x;
                this.originY = y;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = '#ffffff';
                ctx.fill();
            }

            update() {
                // Check if particle is within mouse radius
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;

                // Max distance for interaction
                const maxDistance = mouse.radius;
                let force = (maxDistance - distance) / maxDistance;

                if (distance < mouse.radius) {
                    // White hole / Repulsion effect
                    this.x -= forceDirectionX * force * 5;
                    this.y -= forceDirectionY * force * 5;
                } else {
                    // Return to origin
                    if (this.x !== this.originX) {
                        let dxOrigin = this.x - this.originX;
                        this.x -= dxOrigin / 20;
                    }
                    if (this.y !== this.originY) {
                        let dyOrigin = this.y - this.originY;
                        this.y -= dyOrigin / 20;
                    }
                }

                this.draw();
            }
        }

        function init() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles = [];

            const spacing = 50; // Distance between dots
            const rows = Math.floor(canvas.height / spacing);
            const cols = Math.floor(canvas.width / spacing);

            // Center the grid
            const offsetX = (canvas.width % spacing) / 2;
            const offsetY = (canvas.height % spacing) / 2;

            for (let y = 0; y <= rows; y++) {
                for (let x = 0; x <= cols; x++) {
                    let posX = offsetX + (x * spacing);
                    let posY = offsetY + (y * spacing);
                    let size = 1; // Standardized small dot size
                    let directionX = 0; // No random drift for a clean grid
                    let directionY = 0;
                    let color = '#ffffff';
                    particles.push(new Particle(posX, posY, directionX, directionY, size, color));
                }
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
            }
        }

        init();
        animate();
    }
});
