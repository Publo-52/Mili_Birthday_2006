import React from 'react';
import { soundCtrl } from '../utils/audio';

export default function SceneIntro({ onStart }) {
  const handleStart = () => {
    soundCtrl.init();
    soundCtrl.playChime(1200);
    onStart();
  };

  return (
    <div className="content-wrapper glass-panel">
      <p className="kicker-text">A Special Surprise Awaits</p>
      <h1 className="title-cinematic font-cinzel">Tonight Is All About You</h1>
      <p className="subtitle-elegant">
        An unforgettable cinematic birthday experience for Mili.
      </p>

      <div className="mt-10 md:mt-12">
        <button id="btn-start" className="btn-luxury" onClick={handleStart}>
          Begin Experience ✨
        </button>
      </div>
    </div>
  );
}
