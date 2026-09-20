import React, { useEffect, useRef } from 'react';
import { soundCtrl } from '../utils/audio';

class Particle {
  constructor(x, y, color, isConfetti = false, vx = null, vy = null) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.isConfetti = isConfetti;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * (isConfetti ? 7 : 4) + 1;
    this.vx = vx !== null ? vx : Math.cos(angle) * speed;
    this.vy = vy !== null ? vy : Math.sin(angle) * speed;
    this.life = 1.0;
    this.decay = Math.random() * 0.02 + (isConfetti ? 0.006 : 0.015);
    this.gravity = isConfetti ? 0.2 : 0.05;
    this.size = isConfetti ? Math.random() * 6 + 4 : Math.random() * 3 + 1;
    this.angle = Math.random() * 360;
    this.spin = (Math.random() - 0.5) * 10;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.life -= this.decay;
    this.angle += this.spin;
  }
  draw(ctx) {
    ctx.globalAlpha = Math.max(0, this.life);
    ctx.fillStyle = this.color;
    if (this.isConfetti) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.angle * Math.PI) / 180);
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
      ctx.restore();
    } else {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
  }
}

class Firework {
  constructor(width, height, isSpecial = false, onExplode) {
    this.x = Math.random() * (width * 0.7) + width * 0.15;
    this.y = height;
    this.targetY = Math.random() * (height * 0.3) + height * 0.12;
    this.speed = Math.random() * 4 + 7;
    this.color = `hsl(${Math.random() * 360}, 85%, 65%)`;
    this.exploded = false;
    this.isSpecial = isSpecial;
    this.onExplode = onExplode;
  }
  update() {
    if (!this.exploded) {
      this.y -= this.speed;
      if (this.y <= this.targetY) {
        this.exploded = true;
        if (this.onExplode) {
          this.onExplode(this.x, this.y, this.color, this.isSpecial);
        }
      }
    }
  }
  draw(ctx) {
    if (!this.exploded) {
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

export default function GlobalCanvas({ effectMode = 'ambient' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles = [];
    let fireworks = [];
    let stars = [];
    let bokehParticles = [];
    let animId = null;

    const initStars = () => {
      stars = [];
      bokehParticles = [];
      const isMobile = window.innerWidth < 768;
      const starCount = isMobile ? 35 : 75;
      const bokehCount = isMobile ? 6 : 16;

      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          s: Math.random() * 1.5,
          a: Math.random(),
          speed: Math.random() * 0.08 + 0.03
        });
      }

      for (let i = 0; i < bokehCount; i++) {
        const isGold = Math.random() > 0.5;
        const alpha = (Math.random() * 0.18 + 0.04).toFixed(3);
        bokehParticles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * (isMobile ? 16 : 24) + 8,
          speedY: Math.random() * 0.25 + 0.08,
          fillStyle: isGold
            ? `rgba(212, 175, 55, ${alpha})`
            : `rgba(255, 105, 180, ${alpha})`
        });
      }
    };

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };
    window.addEventListener('resize', resize, { passive: true });
    initStars();

    // Precompute MILI text particle offsets once to avoid DOM canvas allocation during fireworks
    const miliPoints = [];
    (() => {
      try {
        const offCanvas = document.createElement('canvas');
        offCanvas.width = 300;
        offCanvas.height = 100;
        const offCtx = offCanvas.getContext('2d');
        offCtx.font = "bold 42px 'Montserrat', sans-serif";
        offCtx.fillStyle = '#ffffff';
        offCtx.textAlign = 'center';
        offCtx.fillText('MILI', 150, 60);
        const imgData = offCtx.getImageData(0, 0, 300, 100).data;
        for (let y = 0; y < 100; y += 4) {
          for (let x = 0; x < 300; x += 4) {
            const index = (y * 300 + x) * 4;
            if (imgData[index + 3] > 128) {
              miliPoints.push({
                ox: (x - 150) * 1.5,
                oy: (y - 50) * 1.5
              });
            }
          }
        }
      } catch (err) {
        console.warn('Canvas precompute notice:', err);
      }
    })();

    const isMobileDevice = window.innerWidth < 768;
    const maxParticles = isMobileDevice ? 220 : 380;

    const addExplosion = (x, y, color, count = 45, isConfetti = false) => {
      const allowedCount = Math.min(count, Math.max(10, maxParticles - particles.length));
      for (let i = 0; i < allowedCount; i++) {
        particles.push(
          new Particle(
            x,
            y,
            isConfetti ? `hsl(${Math.random() * 360}, 85%, 60%)` : color,
            isConfetti
          )
        );
      }
    };

    const addNameExplosion = (text, cx, cy) => {
      if (miliPoints.length > 0) {
        // Fast precomputed path
        for (let i = 0; i < miliPoints.length; i++) {
          if (particles.length >= maxParticles) break;
          const pt = miliPoints[i];
          const p = new Particle(
            cx + pt.ox,
            cy + pt.oy,
            '#FFD700',
            false,
            (Math.random() - 0.5) * 0.6,
            (Math.random() - 0.5) * 0.6
          );
          p.life = 1.6;
          p.decay = 0.012;
          particles.push(p);
        }
      } else {
        addExplosion(cx, cy, '#FFD700', 60, true);
      }
    };

    // Attach global helper triggers
    window.createExplosion = addExplosion;
    window.createNameExplosion = addNameExplosion;

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;

      ctx.clearRect(0, 0, width, height);

      // 1. Bokeh Orbs
      for (let i = 0; i < bokehParticles.length; i++) {
        const b = bokehParticles[i];
        b.y -= b.speedY;
        if (b.y < -b.radius) {
          b.y = height + b.radius;
          b.x = Math.random() * width;
        }
        ctx.fillStyle = b.fillStyle;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Stars
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }
        star.a += (Math.random() - 0.5) * 0.04;
        star.a = Math.max(0.1, Math.min(0.9, star.a));
        ctx.globalAlpha = star.a;
        ctx.fillRect(star.x, star.y, star.s, star.s);
      }
      ctx.globalAlpha = 1.0;

      // 3. Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw(ctx);
        if (particles[i].life <= 0) {
          particles.splice(i, 1);
        }
      }

      // 4. Fireworks (in finale mode)
      if (effectMode === 'fireworks') {
        if (Math.random() < 0.04) {
          const isSpecial = Math.random() < 0.35;
          fireworks.push(
            new Firework(width, height, isSpecial, (fx, fy, col, special) => {
              if (special) {
                addNameExplosion('MILI', fx, fy);
              } else {
                addExplosion(fx, fy, col, 60);
              }
              soundCtrl.playExplosion();
            })
          );
        }
        for (let i = fireworks.length - 1; i >= 0; i--) {
          fireworks[i].update();
          fireworks[i].draw(ctx);
          if (fireworks[i].exploded) {
            fireworks.splice(i, 1);
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isRunning = false;
        if (animId) cancelAnimationFrame(animId);
      } else {
        if (!isRunning) {
          isRunning = true;
          animId = requestAnimationFrame(render);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animId) cancelAnimationFrame(animId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', resize);
      delete window.createExplosion;
      delete window.createNameExplosion;
    };
  }, [effectMode]);

  return <canvas id="global-canvas" ref={canvasRef}></canvas>;
}
