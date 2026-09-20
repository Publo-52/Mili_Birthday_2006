import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CONFIG } from '../config';
import { soundCtrl } from '../utils/audio';

export default function SceneGallery({ onContinue, onOpenLightbox }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardRefs = useRef([]);
  const continueBtnRef = useRef(null);
  const touchStartX = useRef(0);

  const memories = CONFIG.galleryMemories;

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(memories.length - 1, prev + 1));
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  useEffect(() => {
    soundCtrl.playChime(600 + currentIndex * 50);

    const isMobile = window.innerWidth < 640;
    const spreadX = isMobile ? 45 : 54;
    const spreadZ = isMobile ? -95 : -120;

    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const offset = i - currentIndex;
      const tx = offset * spreadX;
      const tz = Math.abs(offset) * spreadZ;
      const rx = offset * -2.5;
      const scale = offset === 0 ? 1 : isMobile ? 0.82 : 0.86;
      const opacity =
        offset === 0
          ? 1
          : Math.abs(offset) === 1
          ? 0.65
          : Math.abs(offset) === 2
          ? 0.2
          : 0;
      const zIndex = 30 - Math.abs(offset);

      if (offset === 0) {
        card.classList.add('active-card');
      } else {
        card.classList.remove('active-card');
      }

      const animProps = {
        x: `${tx}%`,
        z: tz,
        rotateY: rx,
        scale: scale,
        opacity: opacity,
        zIndex: zIndex,
        duration: isMobile ? 0.38 : 0.65,
        ease: 'power2.out',
        overwrite: 'auto'
      };

      if (!isMobile) {
        animProps.filter =
          offset === 0 ? 'blur(0px) brightness(1)' : 'blur(4px) brightness(0.35)';
      }

      gsap.to(card, animProps);
    });
  }, [currentIndex, memories.length]);

  // Handle Card Hover 3D Tilt
  const handleMouseMove = (e, index) => {
    if (index !== currentIndex) return;
    const card = cardRefs.current[index];
    if (!card) return;
    const cardInner = card.querySelector('.gallery-card-inner');
    if (!cardInner) return;

    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(cardInner, {
      rotationY: x * 18,
      rotationX: -y * 18,
      duration: 0.35,
      ease: 'power1.out',
      transformPerspective: 900
    });
  };

  const handleMouseLeave = (index) => {
    const card = cardRefs.current[index];
    if (!card) return;
    const cardInner = card.querySelector('.gallery-card-inner');
    if (cardInner) {
      gsap.to(cardInner, {
        rotationY: 0,
        rotationX: 0,
        duration: 0.6,
        ease: 'power2.out'
      });
    }
  };

  // Continue button reveal
  useEffect(() => {
    const timer = setTimeout(() => {
      if (continueBtnRef.current) {
        gsap.to(continueBtnRef.current, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          pointerEvents: 'auto'
        });
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="content-wrapper relative z-30">
        <p className="kicker-text">Moments With You</p>
        <h1 className="title-cinematic font-cinzel">Our Beautiful Memories</h1>
        <p className="subtitle-elegant">Swipe or tap arrows to explore • Tap picture to enlarge ✨</p>
      </div>

      <div
        className="gallery-stage mt-4 md:mt-6 mb-2 relative w-full flex items-center justify-center"
        onTouchStart={(e) => {
          touchStartX.current = e.changedTouches[0].screenX;
        }}
        onTouchEnd={(e) => {
          const touchEndX = e.changedTouches[0].screenX;
          if (touchStartX.current - touchEndX > 45) {
            goToNext();
          } else if (touchEndX - touchStartX.current > 45) {
            goToPrev();
          }
        }}
      >
        <button
          className="nav-arrow absolute left-2 md:left-10"
          id="btn-prev"
          aria-label="Previous image"
          onClick={goToPrev}
          style={{
            opacity: currentIndex === 0 ? 0.25 : 1,
            pointerEvents: currentIndex === 0 ? 'none' : 'auto'
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="gallery-track" id="gallery-track">
          {memories.map((item, index) => (
            <div
              key={index}
              ref={(el) => (cardRefs.current[index] = el)}
              className="gallery-card"
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={() => handleMouseLeave(index)}
              onClick={() => {
                if (index === currentIndex) {
                  onOpenLightbox(item);
                } else {
                  setCurrentIndex(index);
                }
              }}
            >
              <div className="gallery-card-inner">
                <img
                  src={item.src}
                  alt={item.title}
                  loading={index < 2 ? 'eager' : 'lazy'}
                  decoding="async"
                  onError={(e) => {
                    e.target.src = item.fallback;
                  }}
                />
                <div className="gallery-card-gloss"></div>
                <div className="zoom-badge">🔍</div>
                <div className="gallery-card-info">
                  <div className="gallery-card-title font-cinzel">{item.title}</div>
                  <div className="gallery-card-date">{item.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          className="nav-arrow absolute right-2 md:right-10"
          id="btn-next"
          aria-label="Next image"
          onClick={goToNext}
          style={{
            opacity: currentIndex === memories.length - 1 ? 0.25 : 1,
            pointerEvents: currentIndex === memories.length - 1 ? 'none' : 'auto'
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="relative z-40 mt-8 md:mt-12">
        <button
          ref={continueBtnRef}
          id="btn-gallery-continue"
          className="btn-luxury opacity-0 pointer-events-none transform translate-y-4"
          onClick={onContinue}
        >
          Continue
        </button>
      </div>
    </>
  );
}
