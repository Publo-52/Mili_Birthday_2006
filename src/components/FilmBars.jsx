import React from 'react';

export default function FilmBars() {
  return (
    <>
      {/* Cinematic 21:9 Film Aspect Bars */}
      <div className="cinematic-film-bar top"></div>
      <div className="cinematic-film-bar bottom"></div>

      {/* Cinematic Vignette & Anamorphic Light Beam */}
      <div className="cinematic-vignette"></div>
      <div className="anamorphic-beam"></div>

      {/* Global Ambient Aurora */}
      <div className="ambient-aurora"></div>
    </>
  );
}
