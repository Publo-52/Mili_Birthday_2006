import { CONFIG } from '../config';

class SoundController {
  constructor() {
    this.ctx = null;
    this.bgmAudio = null;
    this.isBgmPlaying = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (!this.bgmAudio) {
      this.bgmAudio = new Audio(CONFIG.bgmUrl);
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = 0.5;
    }
  }

  playPop() {
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, t);
      osc.frequency.exponentialRampToValueAtTime(40, t + 0.1);
      gain.gain.setValueAtTime(0.8, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
      osc.start(t);
      osc.stop(t + 0.1);
    } catch (e) {
      console.warn("Audio pop error:", e);
    }
  }

  playChime(freq = 800) {
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.25, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.5);
      osc.start(t);
      osc.stop(t + 1.5);
    } catch (e) {
      console.warn("Audio chime error:", e);
    }
  }

  playBlow() {
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.8;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2000, t);
      filter.frequency.exponentialRampToValueAtTime(100, t + 0.8);
      const gain = this.ctx.createGain();
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.5, t + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.8);
      noise.start(t);
    } catch (e) {
      console.warn("Audio blow error:", e);
    }
  }

  playExplosion() {
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 1.8;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.4));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(120, t);
      filter.frequency.linearRampToValueAtTime(50, t + 1.8);
      const gain = this.ctx.createGain();
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      gain.gain.setValueAtTime(0.8, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 1.8);
      noise.start(t);
    } catch (e) {
      console.warn("Audio explosion error:", e);
    }
  }

  toggleBGM(callback) {
    this.init();
    if (!this.bgmAudio) return;

    if (this.isBgmPlaying) {
      this.bgmAudio.pause();
      this.isBgmPlaying = false;
      if (callback) callback(false);
    } else {
      this.bgmAudio.play().then(() => {
        this.isBgmPlaying = true;
        if (callback) callback(true);
      }).catch((e) => {
        console.warn("BGM play error:", e);
        if (callback) callback(false);
      });
    }
  }

  setBgmVolume(volume, duration = 0) {
    if (!this.bgmAudio) return;
    if (duration === 0) {
      this.bgmAudio.volume = volume;
    } else {
      const step = (volume - this.bgmAudio.volume) / (duration * 20);
      const interval = setInterval(() => {
        if (!this.bgmAudio) {
          clearInterval(interval);
          return;
        }
        let nextVol = this.bgmAudio.volume + step;
        if ((step > 0 && nextVol >= volume) || (step < 0 && nextVol <= volume)) {
          this.bgmAudio.volume = volume;
          clearInterval(interval);
        } else {
          this.bgmAudio.volume = Math.max(0, Math.min(1, nextVol));
        }
      }, 50);
    }
  }

  triggerHaptic(pattern = [15]) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {}
    }
  }
}

export const soundCtrl = new SoundController();
