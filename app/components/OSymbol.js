'use client';

import { useEffect, useState } from 'react';

// ============================================
// THE O — Clean breathing symbol
// ============================================
export function OBreathing({ size = 120, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="relative">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 2}
          fill="none"
          stroke="#1d1d1f"
          strokeWidth="1.5"
          className="animate-breathe"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 3}
          fill="none"
          stroke="#1d1d1f"
          strokeWidth="0.75"
          opacity="0.45"
          className="animate-breathe"
          style={{ animationDelay: '1.5s' }}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 5}
          fill="none"
          stroke="#1d1d1f"
          strokeWidth="0.5"
          opacity="0.25"
          className="animate-breathe"
          style={{ animationDelay: '3s' }}
        />
      </svg>
    </div>
  );
}

// ============================================
// HERO O — Large, clean, with drawing animation
// ============================================
export function OHero({ size = 280, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <svg width={size} height={size} viewBox="0 0 280 280" className="relative">
        {/* Outermost ring — draws in */}
        <circle
          cx="140"
          cy="140"
          r="135"
          fill="none"
          stroke="#1d1d1f"
          strokeWidth="1.5"
          className="o-draw"
        />

        {/* Middle ring */}
        <circle
          cx="140"
          cy="140"
          r="95"
          fill="none"
          stroke="#1d1d1f"
          strokeWidth="0.75"
          opacity="0.5"
          className="o-draw"
          style={{ animationDelay: '0.8s' }}
        />

        {/* Inner ring */}
        <circle
          cx="140"
          cy="140"
          r="55"
          fill="none"
          stroke="#1d1d1f"
          strokeWidth="0.5"
          opacity="0.3"
          className="o-draw"
          style={{ animationDelay: '1.6s' }}
        />

        {/* Center dot */}
        <circle
          cx="140"
          cy="140"
          r="3"
          fill="#1d1d1f"
          opacity="0.7"
          className="animate-pulse-ink"
        />

        {/* Triangle (the triad) */}
        <polygon
          points="140,45 55,185 225,185"
          fill="none"
          stroke="#1d1d1f"
          strokeWidth="0.5"
          opacity="0.2"
          className="sacred-draw"
          style={{ animationDelay: '2s' }}
        />

        {/* Inverted triangle */}
        <polygon
          points="140,235 55,95 225,95"
          fill="none"
          stroke="#1d1d1f"
          strokeWidth="0.5"
          opacity="0.12"
          className="sacred-draw"
          style={{ animationDelay: '2.5s' }}
        />
      </svg>
    </div>
  );
}

// ============================================
// Progress indicator — dark arc
// ============================================
export function OProgress({ progress = 0, size = 48, className = '' }) {
  const radius = (size / 2) - 3;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress * circumference);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(0, 0, 0, 0.1)"
        strokeWidth="2"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#1d1d1f"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-500 ease-out"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

// ============================================
// Triad visualization — three positions
// ============================================
export function TriadGraphic({ className = '', size = 200, animated = true }) {
  return (
    <div className={`relative ${className}`}>
      <svg width={size} height={size} viewBox="0 0 200 200">
        {/* Connecting lines */}
        <line x1="100" y1="30" x2="30" y2="170" stroke="#1d1d1f" strokeWidth="0.7" opacity="0.35" className={animated ? 'sacred-draw' : ''} />
        <line x1="30" y1="170" x2="170" y2="170" stroke="#1d1d1f" strokeWidth="0.7" opacity="0.35" className={animated ? 'sacred-draw' : ''} style={animated ? { animationDelay: '0.5s' } : {}} />
        <line x1="170" y1="170" x2="100" y2="30" stroke="#1d1d1f" strokeWidth="0.7" opacity="0.35" className={animated ? 'sacred-draw' : ''} style={animated ? { animationDelay: '1s' } : {}} />

        {/* Position 1 — Being (top) */}
        <circle cx="100" cy="30" r="5" fill="#1d1d1f" className={animated ? 'animate-pulse-ink' : ''} />

        {/* Position 2 — Paradox (bottom-left) */}
        <circle cx="30" cy="170" r="4" fill="#1d1d1f" opacity="0.6" className={animated ? 'animate-pulse-ink' : ''} style={animated ? { animationDelay: '1.5s' } : {}} />

        {/* Position 3 — Transcendence (bottom-right) */}
        <circle cx="170" cy="170" r="4" fill="#1d1d1f" opacity="0.8" className={animated ? 'animate-pulse-ink' : ''} style={animated ? { animationDelay: '3s' } : {}} />
      </svg>

      {/* Labels */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2">
        <span className="text-xs tracking-[0.2em] uppercase text-ink font-medium">Being</span>
      </div>
      <div className="absolute bottom-0 left-0 -translate-x-2">
        <span className="text-xs tracking-[0.2em] uppercase text-ink-secondary">Paradox</span>
      </div>
      <div className="absolute bottom-0 right-0 translate-x-2">
        <span className="text-xs tracking-[0.2em] uppercase text-ink-secondary">Transcendence</span>
      </div>
    </div>
  );
}

// ============================================
// Sacred geometry background decoration
// ============================================
export function SacredGeometry({ className = '', opacity = 0.06 }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 800 800"
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity }}
      >
        <circle cx="400" cy="400" r="200" fill="none" stroke="#1d1d1f" strokeWidth="0.7" />
        <circle cx="400" cy="200" r="200" fill="none" stroke="#1d1d1f" strokeWidth="0.5" />
        <circle cx="400" cy="600" r="200" fill="none" stroke="#1d1d1f" strokeWidth="0.5" />
        <circle cx="227" cy="300" r="200" fill="none" stroke="#1d1d1f" strokeWidth="0.5" />
        <circle cx="573" cy="300" r="200" fill="none" stroke="#1d1d1f" strokeWidth="0.5" />
        <circle cx="227" cy="500" r="200" fill="none" stroke="#1d1d1f" strokeWidth="0.5" />
        <circle cx="573" cy="500" r="200" fill="none" stroke="#1d1d1f" strokeWidth="0.5" />
      </svg>
    </div>
  );
}

// ============================================
// Awakening Sequence — for generation wait
// ============================================
export function AwakeningSequence({ phase = 0, className = '' }) {
  const phaseOpacity = [0.4, 0.7, 1, 0.85];
  const phaseScale = [0.8, 1, 1.2, 1];

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Expanding rings */}
      <div className="absolute">
        <div
          className="w-64 h-64 rounded-full border border-ink/20 awaken-ring-1"
          style={{ animationDuration: `${4 - phase * 0.5}s` }}
        />
      </div>
      <div className="absolute">
        <div
          className="w-48 h-48 rounded-full border border-ink/25 awaken-ring-2"
          style={{ animationDuration: `${3.5 - phase * 0.3}s` }}
        />
      </div>

      {/* Core O */}
      <div
        className="relative transition-all duration-1000"
        style={{
          opacity: phaseOpacity[phase],
          transform: `scale(${phaseScale[phase]})`,
        }}
      >
        <OBreathing size={100} />
      </div>

      {/* Triad points at peak */}
      {phase >= 2 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-fade-in">
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle cx="100" cy="20" r="3" fill="#1d1d1f" className="animate-pulse-ink" />
              <circle cx="30" cy="170" r="3" fill="#1d1d1f" opacity="0.6" className="animate-pulse-ink" style={{ animationDelay: '0.5s' }} />
              <circle cx="170" cy="170" r="3" fill="#1d1d1f" opacity="0.8" className="animate-pulse-ink" style={{ animationDelay: '1s' }} />
              <line x1="100" y1="20" x2="30" y2="170" stroke="#1d1d1f" strokeWidth="0.7" opacity="0.3" />
              <line x1="30" y1="170" x2="170" y2="170" stroke="#1d1d1f" strokeWidth="0.7" opacity="0.3" />
              <line x1="170" y1="170" x2="100" y2="20" stroke="#1d1d1f" strokeWidth="0.7" opacity="0.3" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// Triad dots — simple inline version
// ============================================
export function TriadDots({ className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-16 ${className}`}>
      <div className="flex flex-col items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-ink" />
        <span className="text-xs text-ink-secondary tracking-[0.2em] uppercase">Being</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-ink opacity-50" />
        <span className="text-xs text-ink-secondary tracking-[0.2em] uppercase">Paradox</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-ink opacity-70" />
        <span className="text-xs text-ink-secondary tracking-[0.2em] uppercase">Transcendence</span>
      </div>
    </div>
  );
}
