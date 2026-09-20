import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CONFIG } from '../config';
import { soundCtrl } from '../utils/audio';

export default function SceneGift({ onProceedToFinale, isActive = false }) {
  const [giftOpened, setGiftOpened] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [typewriterText, setTypewriterText] = useState('');

  // Voice player states
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [voiceDuration, setVoiceDuration] = useState(0);
  const [voiceCurrentTime, setVoiceCurrentTime] = useState(0);
  const [voiceSubtext, setVoiceSubtext] = useState('Click to listen to the special wish');

  const giftBoxRef = useRef(null);
  const giftLidRef = useRef(null);
  const tapHintRef = useRef(null);
  const voiceAudioRef = useRef(null);

  const formatVoiceTime = (secs) => {
    if (isNaN(secs) || !isFinite(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleOpenGift = () => {
    if (giftOpened) return;
    setGiftOpened(true);

    soundCtrl.triggerHaptic([40, 60, 80]);
    if (tapHintRef.current) {
      gsap.to(tapHintRef.current, { opacity: 0, scale: 0.85, duration: 0.4 });
    }

    soundCtrl.playChime(800);
    setTimeout(() => soundCtrl.playChime(1200), 200);

    if (giftBoxRef.current && window.createExplosion) {
      const rect = giftBoxRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      window.createExplosion(cx, cy, '#FFD700', 70, true);
      setTimeout(() => window.createExplosion(cx, cy - 40, '#FFA500', 50, true), 160);
      setTimeout(() => window.createExplosion(cx, cy - 80, '#FF69B4', 40, true), 320);
    }

    if (giftLidRef.current) {
      gsap.to(giftLidRef.current, {
        y: -140,
        rotateX: 55,
        rotateZ: 20,
        opacity: 0,
        duration: 1.3,
        ease: 'power3.out'
      });
    }

    setTimeout(() => {
      setShowLetter(true);
    }, 750);
  };

  // Typewriter effect
  useEffect(() => {
    if (!showLetter) return;
    const fullText = CONFIG.letterText;
    setTypewriterText('');
    let i = 0;
    let timer = null;

    function typeChar() {
      if (i < fullText.length) {
        setTypewriterText((prev) => prev + fullText.charAt(i));
        i++;
        timer = setTimeout(typeChar, 25);
      }
    }
    typeChar();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showLetter]);

  // Voice note setup
  useEffect(() => {
    const audio = new Audio(CONFIG.voiceNoteUrl);
    voiceAudioRef.current = audio;

    const handleLoadedMetadata = () => {
      if (audio.duration) setVoiceDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setVoiceCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsVoicePlaying(false);
      setVoiceSubtext('Tap to replay special voice note 🔄');
      setVoiceCurrentTime(0);
      soundCtrl.setBgmVolume(0.5, 0.8);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      soundCtrl.setBgmVolume(0.5, 0.5);
    };
  }, []);

  // Automatically pause voice note if user leaves Scene 5
  useEffect(() => {
    if (!isActive && voiceAudioRef.current) {
      voiceAudioRef.current.pause();
      setIsVoicePlaying(false);
      soundCtrl.setBgmVolume(0.5, 0.5);
    }
  }, [isActive]);

  const toggleVoicePlay = (e) => {
    if (e.target.closest('#voice-progress-wrap')) return;
    const audio = voiceAudioRef.current;
    if (!audio) return;

    if (isVoicePlaying) {
      audio.pause();
      setIsVoicePlaying(false);
      setVoiceSubtext('Paused • Tap to resume');
      soundCtrl.setBgmVolume(0.5, 0.8);
    } else {
      audio
        .play()
        .then(() => {
          setIsVoicePlaying(true);
          setVoiceSubtext('Playing personal voice message... 🎙️');
          soundCtrl.setBgmVolume(0.12, 0.8);
        })
        .catch((err) => {
          console.error('Voice playback error:', err);
        });
    }
  };

  const handleSeek = (e) => {
    e.stopPropagation();
    const audio = voiceAudioRef.current;
    if (!audio || !audio.duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * audio.duration;
    if (!isVoicePlaying) {
      audio.play().then(() => {
        setIsVoicePlaying(true);
        soundCtrl.setBgmVolume(0.12, 0.8);
      });
    }
  };

  const handleProceed = () => {
    if (voiceAudioRef.current) {
      voiceAudioRef.current.pause();
    }
    soundCtrl.setBgmVolume(0.5, 0.5);
    setShowLetter(false);
    onProceedToFinale();
  };

  const progressPercent = voiceDuration > 0 ? (voiceCurrentTime / voiceDuration) * 100 : 0;

  return (
    <>
      <div className="content-wrapper pointer-events-none">
        <p className="kicker-text">From The Heart</p>
        <h1 className="title-cinematic font-cinzel">A Special Gift For You</h1>
        <p className="subtitle-elegant">Because today is your day. Tap the gift box to open 🎁</p>
      </div>

      <div className="gift-container-wrapper mt-4 md:mt-6 relative flex flex-col items-center">
        <div className="gift-glow-aura"></div>

        <div className="gift-sparkles-container pointer-events-none">
          <span className="gift-sparkle sp1">✨</span>
          <span className="gift-sparkle sp2">💖</span>
          <span className="gift-sparkle sp3">⭐</span>
          <span className="gift-sparkle sp4">✨</span>
          <span className="gift-sparkle sp5">💫</span>
        </div>

        <div
          className="gift-stage"
          id="gift-box"
          ref={giftBoxRef}
          title="Tap to Open Your Special Surprise"
          onClick={handleOpenGift}
        >
          <div className="gift-base">
            <div className="gift-inner-glow"></div>
            <div className="ribbon ribbon-v"></div>
            <div className="ribbon ribbon-h"></div>
            <div className="gift-box-gloss"></div>
          </div>
          <div className="gift-lid" id="gift-lid" ref={giftLidRef}>
            <div className="ribbon ribbon-v"></div>
            <div className="ribbon ribbon-h"></div>
            <div className="gift-lid-rim"></div>

            <div className="gift-bow">
              <div className="bow-loop bow-left"></div>
              <div className="bow-loop bow-right"></div>
              <div className="bow-knot">
                <span className="bow-center-gem">💎</span>
              </div>
              <div className="bow-tail bow-tail-left"></div>
              <div className="bow-tail bow-tail-right"></div>
            </div>
          </div>
        </div>

        <div
          className="gift-tap-hint"
          ref={tapHintRef}
          onClick={handleOpenGift}
          style={{ display: giftOpened ? 'none' : 'flex' }}
        >
          <span className="tap-icon">🎁</span>
          <span className="tap-text">Tap The Gift Box To Open</span>
          <span className="tap-pulse-dot"></span>
        </div>
      </div>

      {/* Romantic Letter Modal */}
      <div id="letter-modal" className={`letter-card ${showLetter ? 'active' : ''}`}>
        <div className="letter-header">
          <p className="kicker-text mb-1">To My Favorite Person</p>
          <h2 className="font-cinzel text-2xl text-[var(--gold-primary)] font-bold">
            Happy Birthday, Mili! ❤️
          </h2>
        </div>

        <div className="typewriter-body font-serif" id="typewriter-text" style={{ whiteSpace: 'pre-line' }}>
          {typewriterText}
        </div>
        <span className="typewriter-cursor" id="typewriter-cursor"></span>

        {/* Voice Note Player */}
        <div
          id="voice-note-player"
          className={`voice-note-player ${isVoicePlaying ? 'is-playing' : ''}`}
          onClick={toggleVoicePlay}
        >
          <div className="voice-play-icon" id="voice-play-btn">
            {isVoicePlaying ? (
              <svg id="voice-play-svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg id="voice-play-svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-xs text-[var(--gold-light)] font-semibold">🎙️ A Voice Message For You</p>
              <span id="voice-time" className="text-[10px] text-gray-400 font-mono">
                {formatVoiceTime(voiceCurrentTime)} / {formatVoiceTime(voiceDuration)}
              </span>
            </div>
            <p id="voice-subtext" className="text-[11px] text-gray-400">
              {voiceSubtext}
            </p>
            <div
              className="voice-progress-container"
              id="voice-progress-wrap"
              title="Click to seek"
              onClick={handleSeek}
            >
              <div
                id="voice-progress-bar"
                className="voice-progress-bar"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 md:mt-10">
          <button id="btn-letter-continue" className="btn-luxury" onClick={handleProceed}>
            Proceed to Finale ✨
          </button>
        </div>
      </div>
    </>
  );
}
