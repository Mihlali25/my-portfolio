// js/animation.js
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const animationContainer = document.getElementById('background-animation');

    if (!animationContainer) return; // Exit if container not found

    let particles = [];
    const particleCount = 100; // Number of particles
    const maxParticleSize = 3;
    const minParticleSize = 0.5;
    const particleSpeed = 0.2; // How fast particles move

    function resizeCanvas() {
        canvas.width = animationContainer.offsetWidth;
        canvas.height = animationContainer.offsetHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * (maxParticleSize - minParticleSize) + minParticleSize;
            this.speedX = (Math.random() - 0.5) * 2 * particleSpeed; // -0.5 to 0.5, then scaled
            this.speedY = (Math.random() - 0.5) * 2 * particleSpeed;
            this.color = `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`; // Varying transparency
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Wrap particles around the canvas
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1; // Bounce off walls if preferred, or wrap
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

        // Draw connections between nearby particles (optional, but adds to the effect)
        for (let i = 0; i < particles.length; i++) {
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) { // Connect if particles are within 100px
                    ctx.strokeStyle = `rgba(255, 255, 255, ${1 - (distance / 100)})`; // Fades with distance
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        requestAnimationFrame(animateParticles);
    }

    // Append canvas to the animation container
    animationContainer.appendChild(canvas);
    resizeCanvas(); // Initial size
    initParticles(); // Create particles
    animateParticles(); // Start animation loop

    window.addEventListener('resize', resizeCanvas);
});