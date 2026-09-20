import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { soundCtrl } from '../utils/audio';

export default function SceneCake({ onContinue, isActive = false }) {
  const containerRef = useRef(null);
  const continueBtnRef = useRef(null);
  const [micStatusText, setMicStatusText] = useState('🎤 Click to Enable Mic Blow');
  const [isMicListening, setIsMicListening] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const isActiveRef = useRef(isActive);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isMounted = true;
    let animFrameId = null;
    let cakeTime = 0;
    let flames = [];
    let activeFlames = 3;

    let micStream = null;
    let micAudioContext = null;
    let micAnalyser = null;

    const isMobile = window.innerWidth < 640;
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 350;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 4.5, isMobile ? 16.5 : 14);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.shadowMap.enabled = !isMobile;
    if (!isMobile) renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.margin = '0 auto';
    container.appendChild(renderer.domElement);

    // Lighting
    const ambient = new THREE.AmbientLight(0x222233, 1.3);
    scene.add(ambient);
    const spotLight = new THREE.SpotLight(0xfff0dd, 2.2);
    spotLight.position.set(5, 15, 10);
    spotLight.castShadow = !isMobile;
    scene.add(spotLight);

    // Cake Group
    const cakeGroup = new THREE.Group();
    const segments = isMobile ? 32 : 64;

    // Base Plate
    const plateGeo = new THREE.CylinderGeometry(4.5, 4.8, 0.2, segments);
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0x111115,
      metalness: 0.8,
      roughness: 0.2
    });
    const plate = new THREE.Mesh(plateGeo, plateMat);
    cakeGroup.add(plate);

    // Tier 1
    const t1Geo = new THREE.CylinderGeometry(3.5, 3.5, 2, segments);
    const creamMat = new THREE.MeshStandardMaterial({ color: 0xfffcf5, roughness: 0.9 });
    const t1 = new THREE.Mesh(t1Geo, creamMat);
    t1.position.y = 1.1;
    cakeGroup.add(t1);

    // Tier 2
    const t2Geo = new THREE.CylinderGeometry(2.5, 2.5, 1.8, segments);
    const t2 = new THREE.Mesh(t2Geo, creamMat);
    t2.position.y = 3;
    cakeGroup.add(t2);

    // Gold Ribbon
    const ribbonGeo = new THREE.CylinderGeometry(2.52, 2.52, 0.2, segments);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 1,
      roughness: 0.3
    });
    const ribbon = new THREE.Mesh(ribbonGeo, goldMat);
    ribbon.position.y = 2.2;
    cakeGroup.add(ribbon);

    scene.add(cakeGroup);

    // Candles & Flames
    const candleOffsets = [
      [0, 0],
      [-1.2, 0.8],
      [1.2, 0.8]
    ];

    candleOffsets.forEach((pos, i) => {
      const cGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 12);
      const cMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const candle = new THREE.Mesh(cGeo, cMat);
      candle.position.set(pos[0], 4.3, pos[1]);
      scene.add(candle);

      const fGeo = new THREE.SphereGeometry(0.12, 12, 12);
      const fMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
      const flame = new THREE.Mesh(fGeo, fMat);
      flame.position.set(pos[0], 4.8, pos[1]);
      flame.userData = { active: true, index: i };
      scene.add(flame);
      flames.push(flame);

      const pLight = new THREE.PointLight(0xffaa00, 1.5, 6);
      pLight.position.set(pos[0], 4.9, pos[1]);
      scene.add(pLight);
      flame.userData.light = pLight;
    });

    const extinguishFlame = (flameObj, clientX = window.innerWidth / 2, clientY = window.innerHeight / 2) => {
      if (!flameObj.userData.active) return;
      flameObj.userData.active = false;
      soundCtrl.triggerHaptic([35]);
      gsap.to(flameObj.scale, { x: 0, y: 0, z: 0, duration: 0.3 });
      if (flameObj.userData.light) {
        gsap.to(flameObj.userData.light, { intensity: 0, duration: 0.5 });
      }
      soundCtrl.playBlow();
      if (window.createExplosion) {
        window.createExplosion(clientX, clientY, '#aaaaaa', 15);
      }

      activeFlames--;
      if (activeFlames === 0) {
        setTimeout(() => {
          if (!isMounted) return;
          soundCtrl.playChime(1500);
          soundCtrl.triggerHaptic([40, 60, 40]);
          if (window.createExplosion) {
            window.createExplosion(window.innerWidth / 2, window.innerHeight / 2, '#D4AF37', 50, true);
          }
          setShowContinue(true);
        }, 1000);
      }
    };

    // Tap/Click Detection via Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleCanvasClick = (event) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(flames);

      if (intersects.length > 0) {
        extinguishFlame(intersects[0].object, event.clientX, event.clientY);
      }
    };

    container.addEventListener('click', handleCanvasClick);

    let lastBlowTime = 0;

    // Highly Sensitive Microphone Blow Detection Loop
    const checkMicBlowLoop = () => {
      if (!isMounted || !micAnalyser || activeFlames === 0) return;

      const freqData = new Uint8Array(micAnalyser.frequencyBinCount);
      micAnalyser.getByteFrequencyData(freqData);

      const timeData = new Uint8Array(micAnalyser.fftSize);
      micAnalyser.getByteTimeDomainData(timeData);

      // 1. Time-domain RMS (breath pressure / volume)
      let sumSquares = 0;
      for (let i = 0; i < timeData.length; i++) {
        const norm = (timeData[i] - 128) / 128;
        sumSquares += norm * norm;
      }
      const rms = Math.sqrt(sumSquares / timeData.length); // 0.0 to 1.0

      // 2. Low-frequency turbulence energy (breath/wind rumble 20Hz-400Hz)
      let lowFreqSum = 0;
      const lowBins = Math.min(18, micAnalyser.frequencyBinCount);
      for (let i = 1; i < lowBins; i++) {
        lowFreqSum += freqData[i];
      }
      const lowFreqAvg = lowFreqSum / (lowBins - 1); // 0 to 255

      // 3. Overall frequency energy
      let totalSum = 0;
      for (let i = 0; i < freqData.length; i++) {
        totalSum += freqData[i];
      }
      const totalAvg = totalSum / freqData.length;

      // Composite blow score (ultra-responsive across all mic types)
      const blowScore = Math.max(rms * 100, lowFreqAvg * 0.75, totalAvg * 0.85);
      const now = performance.now();

      // Dynamic flame flickering in reaction to breath
      if (blowScore > 16) {
        flames.forEach((f) => {
          if (f.userData && f.userData.active) {
            const wind = 1 + (blowScore / 50) * Math.random();
            f.scale.set(0.6, wind * 1.6, 0.6);
            f.rotation.z = (Math.random() - 0.5) * 0.4;
          }
        });
      }

      // Detect strong blow (threshold: 28 for high sensitivity)
      if (blowScore > 28 && now - lastBlowTime > 260) {
        lastBlowTime = now;
        const activeOne = flames.find((f) => f.userData.active);
        if (activeOne) {
          setMicStatusText('💨 Blow Detected! Blowing out candle...');
          extinguishFlame(activeOne);
          setTimeout(() => {
            if (activeFlames > 0) {
              setMicStatusText('🎤 Keep blowing for next candle! 💨');
            } else {
              setMicStatusText('✨ Wish granted! 🎉');
            }
          }, 350);
        }
      }

      requestAnimationFrame(checkMicBlowLoop);
    };

    // Global listener setup for mic badge click
    window.startCakeMic = async () => {
      try {
        if (micStream) return;
        setMicStatusText('⏳ Accessing microphone...');

        // Try raw constraints first to disable browser noise reduction which cuts wind/breath
        try {
          micStream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: false,
              noiseSuppression: false,
              autoGainControl: false
            }
          });
        } catch (constraintErr) {
          // Fallback to standard audio constraint if hardware doesn't support raw
          micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        }

        micAudioContext = new (window.AudioContext || window.webkitAudioContext)();
        if (micAudioContext.state === 'suspended') {
          await micAudioContext.resume();
        }

        const source = micAudioContext.createMediaStreamSource(micStream);
        micAnalyser = micAudioContext.createAnalyser();
        micAnalyser.fftSize = 256;
        micAnalyser.smoothingTimeConstant = 0.3; // Responsive to fast breath bursts
        source.connect(micAnalyser);

        setIsMicListening(true);
        setMicStatusText('🎤 Listening... Blow now! 💨');
        checkMicBlowLoop();
      } catch (err) {
        console.warn('Microphone error:', err);
        setMicStatusText('👆 Tap flames directly to blow!');
      }
    };

    // Render loop - only render when active and visible
    const renderLoop = () => {
      if (!isMounted) return;
      if (!isActiveRef.current || document.hidden) {
        // Paused while user is on other scenes to save GPU and battery
        animFrameId = requestAnimationFrame(renderLoop);
        return;
      }

      cakeTime += 0.035;
      cakeGroup.rotation.y = Math.sin(cakeTime * 0.2) * 0.1;

      for (let i = 0; i < flames.length; i++) {
        const f = flames[i];
        if (f.userData && f.userData.active) {
          const s = 1 + Math.random() * 0.2;
          f.scale.set(s, s + Math.random() * 0.35, s);
          if (f.userData.light) {
            f.userData.light.intensity = 1.2 + Math.random() * 0.4;
          }
        }
      }

      renderer.render(scene, camera);
      animFrameId = requestAnimationFrame(renderLoop);
    };

    animFrameId = requestAnimationFrame(renderLoop);

    const handleResize = () => {
      if (container && container.clientWidth > 0 && container.clientHeight > 0) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.position.z = window.innerWidth < 640 ? 16.5 : 14;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    const shutdownMic = () => {
      if (micStream) {
        micStream.getTracks().forEach((track) => track.stop());
        micStream = null;
      }
      if (micAudioContext && micAudioContext.state !== 'closed') {
        micAudioContext.close();
        micAudioContext = null;
      }
      setIsMicListening(false);
    };

    window.cakeShutdownMic = shutdownMic;

    return () => {
      isMounted = false;
      if (animFrameId) cancelAnimationFrame(animFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('click', handleCanvasClick);
      shutdownMic();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      // Three.js cleanup
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
      delete window.startCakeMic;
      delete window.cakeShutdownMic;
    };
  }, []);

  // When scene becomes inactive, stop mic stream to save battery and turn off mic indicator
  useEffect(() => {
    if (!isActive && window.cakeShutdownMic) {
      window.cakeShutdownMic();
    }
  }, [isActive]);

  useEffect(() => {
    if (showContinue && continueBtnRef.current) {
      gsap.to(continueBtnRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        pointerEvents: 'auto'
      });
    }
  }, [showContinue]);

  return (
    <>
      <div className="content-wrapper relative z-20 pointer-events-none">
        <p className="kicker-text">Special Birthday Wish</p>
        <h1 className="title-cinematic font-cinzel">Make A Wish</h1>
        <p className="subtitle-elegant">
          Blow into your microphone 🎤 or tap the flames to blow out the candles!
        </p>
        <div
          id="mic-status"
          className="mic-badge pointer-events-auto"
          onClick={() => {
            if (window.startCakeMic) window.startCakeMic();
          }}
        >
          <span className="mic-pulse"></span>
          <span id="mic-text">{micStatusText}</span>
        </div>
      </div>

      <div id="cake-canvas-container" className="mt-3 md:mt-5" ref={containerRef}></div>

      <div className="relative z-40 mt-8 md:mt-12">
        <button
          ref={continueBtnRef}
          id="btn-cake-continue"
          className="btn-luxury opacity-0 pointer-events-none transform translate-y-4"
          onClick={onContinue}
        >
          Continue The Celebration
        </button>
      </div>
    </>
  );
}
