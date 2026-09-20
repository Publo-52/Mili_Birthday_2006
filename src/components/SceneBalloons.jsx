import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { soundCtrl } from '../utils/audio';

const balloonColors = [
  { bg: 'radial-gradient(circle at 30% 30%, #ff4579, #b0003a, #4a0018)', base: '#ff4579' },
  { bg: 'radial-gradient(circle at 30% 30%, #00f0ff, #007bb5, #002d4a)', base: '#00f0ff' },
  { bg: 'radial-gradient(circle at 30% 30%, #e0aaff, #7b2cbf, #240046)', base: '#e0aaff' },
  { bg: 'radial-gradient(circle at 30% 30%, #ffd700, #b8860b, #4a3600)', base: '#ffd700' }
];

export default function SceneBalloons({ onContinue, isActive = false }) {
  const stageRef = useRef(null);
  const continueBtnRef = useRef(null);
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const stage = stageRef.current;
    if (!stage) return;

    let isMounted = true;
    let balloonInterval = null;
    const activeTweens = [];

    const spawnBalloon = (startX = Math.random() * 90 + 5, initialY = null) => {
      if (!isMounted || !stage) return;
      const isMobile = window.innerWidth < 768;
      if (stage.children.length >= (isMobile ? 8 : 12)) return;

      const wrapper = document.createElement('div');
      wrapper.className = 'balloon-wrapper';

      const colorObj = balloonColors[Math.floor(Math.random() * balloonColors.length)];
      const sizeScale = 0.7 + Math.random() * 0.5;
      const floatDuration = 8 + Math.random() * 5;

      wrapper.style.left = `${startX}%`;
      wrapper.style.top = initialY !== null ? `${initialY}vh` : '100vh';
      wrapper.style.transform = `translate3d(0, 0, 0) scale(${sizeScale})`;

      const body = document.createElement('div');
      body.className = 'balloon-body';
      body.style.background = colorObj.bg;

      const knot = document.createElement('div');
      knot.className = 'balloon-knot';
      knot.style.borderBottomColor = colorObj.base;

      const string = document.createElement('div');
      string.className = 'balloon-string';

      body.appendChild(knot);
      wrapper.appendChild(body);
      wrapper.appendChild(string);
      stage.appendChild(wrapper);

      const targetY = initialY !== null
        ? -(window.innerHeight * 1.2)
        : -(window.innerHeight * 1.35);

      const duration = initialY !== null ? floatDuration * 0.65 : floatDuration;

      const tl = gsap.to(wrapper, {
        y: targetY,
        x: `+=${(Math.random() - 0.5) * 80}`,
        rotationZ: (Math.random() - 0.5) * 15,
        duration: duration,
        ease: 'none',
        onComplete: () => {
          if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
        }
      });
      activeTweens.push(tl);

      const popHandler = (e) => {
        if (e) e.preventDefault();
        if (wrapper.style.pointerEvents === 'none') return;
        wrapper.style.pointerEvents = 'none';
        tl.kill();
        soundCtrl.playPop();
        soundCtrl.triggerHaptic([25]);

        const rect = body.getBoundingClientRect();
        if (window.createExplosion) {
          window.createExplosion(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            colorObj.base,
            25,
            true
          );
        }

        gsap.to(wrapper, {
          scale: 1.35,
          opacity: 0,
          duration: 0.12,
          onComplete: () => {
            if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
          }
        });

        setShowContinue(true);
      };

      wrapper.addEventListener('click', popHandler);
      wrapper.addEventListener('touchstart', popHandler, { passive: false });
    };

    // Initial spread so the screen looks immediately vibrant
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
        if (isMounted) spawnBalloon(pos.x, pos.y);
      }, idx * 80);
    });

    balloonInterval = setInterval(() => {
      if (isMounted) spawnBalloon(Math.random() * 90 + 5);
    }, 700);

    // Auto-reveal continue button after 2.5s
    const autoRevealTimer = setTimeout(() => {
      setShowContinue(true);
    }, 2500);

    return () => {
      isMounted = false;
      if (balloonInterval) clearInterval(balloonInterval);
      clearTimeout(autoRevealTimer);
      activeTweens.forEach((t) => t.kill());
      if (stage) stage.innerHTML = '';
    };
  }, [isActive]);

  useEffect(() => {
    if (showContinue && continueBtnRef.current) {
      gsap.to(continueBtnRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        pointerEvents: 'auto'
      });
    }
  }, [showContinue]);

  return (
    <>
      <div className="content-wrapper relative z-20 pointer-events-none">
        <p className="kicker-text">Celebration Starts</p>
        <h1 className="title-cinematic font-cinzel">Happy Birthday Dear Mili</h1>
        <p className="subtitle-elegant">Tap or pop the floating balloons to release the joy 🎈</p>
        <div className="mt-10 md:mt-14 pointer-events-auto">
          <button
            ref={continueBtnRef}
            id="btn-continue-balloons"
            className="btn-luxury opacity-0 pointer-events-none transform translate-y-4"
            onClick={onContinue}
          >
            Continue The Celebration
          </button>
        </div>
      </div>

      <div className="balloon-stage" id="balloon-stage" ref={stageRef}></div>
    </>
  );
}
