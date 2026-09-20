import React from 'react';

export default function LightboxModal({ isOpen, data, onClose }) {
  if (!isOpen || !data) return null;

  return (
    <div
      id="lightbox-modal"
      className="lightbox-modal active"
      onClick={(e) => {
        if (e.target.id === 'lightbox-modal') onClose();
      }}
    >
      <button className="lightbox-close" id="lightbox-close" onClick={onClose}>
        ✕
      </button>
      <div className="lightbox-content">
        <img
          id="lightbox-img"
          src={data.src}
          alt={data.title || 'Memory Photo'}
          decoding="async"
          loading="lazy"
        />
      </div>
      <div className="lightbox-caption">
        <h3 id="lightbox-title" className="font-cinzel text-xl text-[var(--gold-primary)] mb-1">
          {data.title}
        </h3>
        <div id="lightbox-desc">
          {data.date && (
            <span className="inline-block bg-[rgba(212,175,55,0.15)] border border-[rgba(212,175,55,0.3)] text-[var(--gold-light)] text-xs px-3 py-1 rounded-full mb-2 tracking-widest">
              📅 {data.date}
            </span>
          )}
          <br />
          <span className="text-sm text-gray-200 leading-relaxed font-light">
            {data.message || data.desc}
          </span>
        </div>
      </div>
    </div>
  );
}
