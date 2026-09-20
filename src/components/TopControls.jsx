import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CHAPTER_TITLES } from '../config';

export default function TopControls({
  currentSceneIndex,
  goToScene,
  isBgmPlaying,
  toggleBGM
}) {
  const chapterTitleRef = useRef(null);

  useEffect(() => {
    if (chapterTitleRef.current && CHAPTER_TITLES[currentSceneIndex]) {
      gsap.to(chapterTitleRef.current, {
        opacity: 0,
        y: -4,
        duration: 0.15,
        onComplete: () => {
          if (chapterTitleRef.current) {
            chapterTitleRef.current.textContent = CHAPTER_TITLES[currentSceneIndex];
            gsap.to(chapterTitleRef.current, { opacity: 1, y: 0, duration: 0.25 });
          }
        }
      });
    }
  }, [currentSceneIndex]);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="top-controls">
      {/* Cinematic Chapter Tracker */}
      <div className="cinematic-hud" id="cinematic-hud">
        <span className="hud-label" id="hud-chapter-title" ref={chapterTitleRef}>
          {CHAPTER_TITLES[currentSceneIndex] || 'Prologue'}
        </span>
        <div className="hud-dots">
          {CHAPTER_TITLES.map((title, idx) => (
            <span
              key={idx}
              className={`hud-dot ${idx === currentSceneIndex ? 'active' : ''}`}
              data-scene={idx}
              title={title}
              onClick={() => goToScene(idx)}
            ></span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          id="btn-sound-toggle"
          className={`ctrl-btn ${isBgmPlaying ? 'playing active' : ''}`}
          title="Toggle Music"
          onClick={toggleBGM}
        >
          <div className="eq-bars">
            <span className="eq-bar"></span>
            <span className="eq-bar"></span>
            <span className="eq-bar"></span>
          </div>
        </button>

        <button
          id="btn-fullscreen-toggle"
          className="ctrl-btn"
          title="Fullscreen"
          onClick={handleFullscreen}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
