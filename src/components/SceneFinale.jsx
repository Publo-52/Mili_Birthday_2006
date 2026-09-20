import React, { useEffect } from 'react';

export default function SceneFinale({ onReplay }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.createNameExplosion) {
        window.createNameExplosion('MILI', window.innerWidth / 2, window.innerHeight * 0.28);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="content-wrapper pointer-events-none">
      <p className="kicker-text">Always & Forever</p>
      <h1 className="title-cinematic font-cinzel finale-title">
        May Your Life
        <br />
        Shine Brighter
        <br />
        Than These Stars ✨
      </h1>
      <p className="subtitle-elegant mt-2">Wishing you endless happiness, love and smiles!</p>
      <div className="pointer-events-auto">
        <button id="btn-replay" className="btn-luxury btn-replay" onClick={onReplay}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M1 4v6h6M23 20v-6h-6" />
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
          </svg>
          Replay Celebration
        </button>
      </div>
    </div>
  );
}
