import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CONFIG } from '../config';
import { soundCtrl } from '../utils/audio';

export default function ScenePuzzle({ onContinue, onPeekHint }) {
  const [pieces, setPieces] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isSolved, setIsSolved] = useState(false);
  const gridRef = useRef(null);
  const continueBtnRef = useRef(null);

  useEffect(() => {
    // Initial easy 2-piece swap setup (tile 1 and tile 4 swapped)
    const initialIndices = [0, 4, 2, 3, 1, 5, 6, 7, 8];
    const initialPieces = initialIndices.map((val) => ({
      correctVal: val
    }));
    setPieces(initialPieces);
    setSelectedIdx(null);
    setIsSolved(false);
  }, []);

  const handleTileClick = (index) => {
    if (isSolved) return;

    if (selectedIdx === null) {
      setSelectedIdx(index);
      soundCtrl.playChime(1300);
    } else {
      if (selectedIdx === index) {
        setSelectedIdx(null);
        return;
      }

      // Swap tiles
      const newPieces = [...pieces];
      const temp = newPieces[selectedIdx];
      newPieces[selectedIdx] = newPieces[index];
      newPieces[index] = temp;

      soundCtrl.playPop();
      soundCtrl.triggerHaptic([15]);
      setSelectedIdx(null);
      setPieces(newPieces);

      // Check win
      checkWin(newPieces);
    }
  };

  const autoSolve = () => {
    if (isSolved) return;
    soundCtrl.triggerHaptic([30, 40]);
    const solvedPieces = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((val) => ({
      correctVal: val
    }));
    setPieces(solvedPieces);
    checkWin(solvedPieces);
  };

  const checkWin = (currentPieces) => {
    const won = currentPieces.every((p, i) => p.correctVal === i);
    if (won && !isSolved) {
      setIsSolved(true);
      soundCtrl.triggerHaptic([40, 70, 90]);
      soundCtrl.playExplosion();

      if (window.createExplosion) {
        window.createExplosion(window.innerWidth / 2, window.innerHeight * 0.45, '#D4AF37', 80, true);
        setTimeout(() => {
          window.createExplosion(window.innerWidth / 2, window.innerHeight * 0.45, '#FF69B4', 60, true);
        }, 200);
      }

      if (gridRef.current) {
        gsap.to(gridRef.current, { gap: 0, duration: 0.8, ease: 'power2.inOut' });
      }

      setTimeout(() => {
        if (continueBtnRef.current) {
          gsap.to(continueBtnRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            pointerEvents: 'auto'
          });
        }
      }, 400);
    }
  };

  return (
    <>
      <div className="content-wrapper relative z-20">
        <p className="kicker-text">A Little Fun</p>
        <h1 className="title-cinematic font-cinzel text-4xl">Solve The Puzzle</h1>
        <p className="subtitle-elegant">Swap pieces to complete the picture and unlock the surprise 🧩</p>
      </div>

      <div className="puzzle-stage mt-4 md:mt-6 relative flex flex-col items-center">
        <div
          className="puzzle-grid"
          id="puzzle-grid"
          ref={gridRef}
          style={{ gap: isSolved ? 0 : '4px' }}
        >
          {pieces.map((piece, index) => {
            const row = Math.floor(piece.correctVal / 3);
            const col = piece.correctVal % 3;
            const bgPos = `${col * 50}% ${row * 50}%`;
            const isSelected = selectedIdx === index;

            return (
              <div
                key={index}
                className={`puzzle-piece ${isSelected ? 'selected' : ''}`}
                style={{
                  backgroundImage: `url("${encodeURI(CONFIG.puzzleImage)}")`,
                  backgroundPosition: bgPos,
                  borderRadius: isSolved ? 0 : undefined,
                  border: isSolved ? 'none' : undefined,
                  pointerEvents: isSolved ? 'none' : 'auto'
                }}
                onClick={() => handleTileClick(index)}
              >
                {!isSolved && <span className="tile-num">{piece.correctVal + 1}</span>}
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 mt-4 items-center justify-center">
          <button
            id="btn-hint"
            className="btn-hint"
            onClick={() => onPeekHint(CONFIG.puzzleImage)}
          >
            💡 Peek Original Image
          </button>
          <button
            id="btn-auto-solve"
            className="btn-hint"
            style={{
              borderColor: 'rgba(212, 175, 55, 0.45)',
              color: 'var(--gold-light)'
            }}
            onClick={autoSolve}
          >
            ✨ Auto Solve
          </button>
        </div>
      </div>

      <div className="relative z-40 mt-8 md:mt-12">
        <button
          ref={continueBtnRef}
          id="btn-puzzle-continue"
          className="btn-luxury opacity-0 pointer-events-none transform translate-y-4"
          onClick={onContinue}
        >
          Unlock Surprise ✨
        </button>
      </div>
    </>
  );
}
