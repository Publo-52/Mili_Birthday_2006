import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { SCENES, CONFIG } from './config';
import { soundCtrl } from './utils/audio';

import FilmBars from './components/FilmBars';
import GlobalCanvas from './components/GlobalCanvas';
import TopControls from './components/TopControls';

import SceneIntro from './components/SceneIntro';
import SceneBalloons from './components/SceneBalloons';
import SceneGallery from './components/SceneGallery';
import SceneCake from './components/SceneCake';
import ScenePuzzle from './components/ScenePuzzle';
import SceneGift from './components/SceneGift';
import SceneFinale from './components/SceneFinale';
import LightboxModal from './components/LightboxModal';

import './style.css';

export default function App() {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isBgmPlaying, setIsBgmPlaying] = useState(false);
  const [effectMode, setEffectMode] = useState('ambient');
  const [lightboxData, setLightboxData] = useState(null);

  const sceneRefs = useRef([]);
  const isTransitioning = useRef(false);

  // Background asset preloading during browser idle time
  useEffect(() => {
    const preloadAssets = () => {
      const assetsToPreload = [
        ...CONFIG.galleryMemories.map((m) => m.src),
        CONFIG.puzzleImage
      ];
      assetsToPreload.forEach((src) => {
        if (!src) return;
        const img = new Image();
        img.src = src;
        if (img.decode) {
          img.decode().catch(() => {});
        }
      });
    };

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(preloadAssets, { timeout: 2000 });
    } else {
      setTimeout(preloadAssets, 1000);
    }
  }, []);

  // Sound toggle handler
  const handleToggleBGM = () => {
    soundCtrl.toggleBGM((playing) => {
      setIsBgmPlaying(playing);
    });
  };

  // Scene transition handler with GSAP cinematic animation
  const goToScene = (targetIndex) => {
    if (targetIndex < 0 || targetIndex >= SCENES.length) return;
    if (targetIndex === currentSceneIndex || isTransitioning.current) return;

    isTransitioning.current = true;
    soundCtrl.triggerHaptic([20]);

    const oldIndex = currentSceneIndex;
    const currentEl = sceneRefs.current[oldIndex];
    const nextEl = sceneRefs.current[targetIndex];

    // Effect mode: fireworks on scene 6, ambient otherwise
    if (targetIndex === 6) {
      setEffectMode('fireworks');
    } else {
      setEffectMode('ambient');
    }

    if (!currentEl || !nextEl) {
      setCurrentSceneIndex(targetIndex);
      isTransitioning.current = false;
      return;
    }

    currentEl.style.pointerEvents = 'none';
    nextEl.style.display = 'flex';
    nextEl.style.pointerEvents = 'none';

    gsap
      .timeline({
        onComplete: () => {
          currentEl.classList.remove('active');
          currentEl.style.display = 'none';
          gsap.set(currentEl, { clearProps: 'all' });

          nextEl.classList.add('active');
          nextEl.style.pointerEvents = 'auto';
          gsap.set(nextEl, { clearProps: 'transform,filter' });

          setCurrentSceneIndex(targetIndex);
          isTransitioning.current = false;
        }
      })
      .to(currentEl, {
        opacity: 0,
        scale: 1.05,
        filter: 'blur(8px)',
        duration: 0.45,
        ease: 'power2.inOut'
      })
      .fromTo(
        nextEl,
        { scale: 0.96, opacity: 0, filter: 'blur(8px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.55, ease: 'power2.out' },
        '-=0.2'
      );

    const textEls = nextEl.querySelectorAll('.kicker-text, .title-cinematic, .subtitle-elegant');
    if (textEls.length > 0) {
      gsap.fromTo(
        textEls,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
      );
    }
  };

  // Parallax interaction
  useEffect(() => {
    let lastParallax = 0;
    const auroraEl = document.querySelector('.ambient-aurora');

    const handleMouseMove = (e) => {
      if (isTransitioning.current) return;
      const now = performance.now();
      if (now - lastParallax < 25) return;
      lastParallax = now;

      const x = (e.clientX / window.innerWidth - 0.5) * 14;
      const y = (e.clientY / window.innerHeight - 0.5) * 14;

      const activeWrapper = document.querySelector('.scene-container.active .content-wrapper');
      if (activeWrapper) {
        gsap.to(activeWrapper, { x: -x, y: -y, duration: 0.8, ease: 'power2.out' });
      }
      if (auroraEl) {
        gsap.to(auroraEl, { x: x * 1.2, y: y * 1.2, duration: 1.5, ease: 'power2.out' });
      }
    };

    if (window.matchMedia('(pointer: fine)').matches) {
      document.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      {/* 21:9 Film Bars, Vignette, Beam & Aurora */}
      <FilmBars />

      {/* Global Particle & Firework Canvas */}
      <GlobalCanvas effectMode={effectMode} />

      {/* Top HUD Tracker & EQ Sound Controls */}
      <TopControls
        currentSceneIndex={currentSceneIndex}
        goToScene={goToScene}
        isBgmPlaying={isBgmPlaying}
        toggleBGM={handleToggleBGM}
      />

      {/* Scene 0: Intro Prologue */}
      <section
        id="scene-intro"
        ref={(el) => (sceneRefs.current[0] = el)}
        className={`scene-container ${currentSceneIndex === 0 ? 'active' : ''}`}
        style={{
          display: currentSceneIndex === 0 ? 'flex' : 'none',
          opacity: currentSceneIndex === 0 ? 1 : 0
        }}
      >
        <SceneIntro
          onStart={() => {
            if (!isBgmPlaying) {
              handleToggleBGM();
            }
            goToScene(1);
          }}
        />
      </section>

      {/* Scene 1: Floating Balloons */}
      <section
        id="scene-balloons"
        ref={(el) => (sceneRefs.current[1] = el)}
        className={`scene-container ${currentSceneIndex === 1 ? 'active' : ''}`}
        style={{
          display: currentSceneIndex === 1 ? 'flex' : 'none',
          opacity: currentSceneIndex === 1 ? 1 : 0
        }}
      >
        <SceneBalloons
          isActive={currentSceneIndex === 1}
          onContinue={() => goToScene(2)}
        />
      </section>

      {/* Scene 2: Memories Gallery */}
      <section
        id="scene-gallery"
        ref={(el) => (sceneRefs.current[2] = el)}
        className={`scene-container ${currentSceneIndex === 2 ? 'active' : ''}`}
        style={{
          display: currentSceneIndex === 2 ? 'flex' : 'none',
          opacity: currentSceneIndex === 2 ? 1 : 0
        }}
      >
        <SceneGallery
          onContinue={() => goToScene(3)}
          onOpenLightbox={(item) => setLightboxData(item)}
        />
      </section>

      {/* Scene 3: 3D Cake & Candle Blow */}
      <section
        id="scene-cake"
        ref={(el) => (sceneRefs.current[3] = el)}
        className={`scene-container ${currentSceneIndex === 3 ? 'active' : ''}`}
        style={{
          display: currentSceneIndex === 3 ? 'flex' : 'none',
          opacity: currentSceneIndex === 3 ? 1 : 0
        }}
      >
        <SceneCake
          isActive={currentSceneIndex === 3}
          onContinue={() => goToScene(4)}
        />
      </section>

      {/* Scene 4: 3x3 Puzzle */}
      <section
        id="scene-puzzle"
        ref={(el) => (sceneRefs.current[4] = el)}
        className={`scene-container ${currentSceneIndex === 4 ? 'active' : ''}`}
        style={{
          display: currentSceneIndex === 4 ? 'flex' : 'none',
          opacity: currentSceneIndex === 4 ? 1 : 0
        }}
      >
        <ScenePuzzle
          onContinue={() => goToScene(5)}
          onPeekHint={(imgSrc) =>
            setLightboxData({
              src: imgSrc,
              title: 'Special Memory Picture',
              message: 'Match the tiles to complete this beautiful memory!'
            })
          }
        />
      </section>

      {/* Scene 5: Luxury Gift & Romantic Letter */}
      <section
        id="scene-gift"
        ref={(el) => (sceneRefs.current[5] = el)}
        className={`scene-container ${currentSceneIndex === 5 ? 'active' : ''}`}
        style={{
          display: currentSceneIndex === 5 ? 'flex' : 'none',
          opacity: currentSceneIndex === 5 ? 1 : 0
        }}
      >
        <SceneGift
          isActive={currentSceneIndex === 5}
          onProceedToFinale={() => goToScene(6)}
        />
      </section>

      {/* Scene 6: Grand Finale */}
      <section
        id="scene-finale"
        ref={(el) => (sceneRefs.current[6] = el)}
        className={`scene-container ${currentSceneIndex === 6 ? 'active' : ''}`}
        style={{
          display: currentSceneIndex === 6 ? 'flex' : 'none',
          opacity: currentSceneIndex === 6 ? 1 : 0
        }}
      >
        <SceneFinale
          onReplay={() => {
            setEffectMode('ambient');
            goToScene(0);
          }}
        />
      </section>

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={!!lightboxData}
        data={lightboxData}
        onClose={() => setLightboxData(null)}
      />
    </div>
  );
}
