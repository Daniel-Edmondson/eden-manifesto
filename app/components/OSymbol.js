'use client';

import { useEffect, useState } from 'react';

// ============================================
// THE O — Gold breathing symbol with glow
// ============================================
export function OBreathing({ size = 120, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      {/* Glow backdrop */}
      <div
        className="absolute inset-0 rounded-full animate-breathe-glow"
        style={{
          background: 'radial-gradient(circle, rgba(201, 162, 39, 0.15) 0%, transparent 70%)',
          transform: 'scale(1.8)',
        }}
      />
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="relative">
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e4c85c" />
            <stop offset="50%" stopColor="#c9a227" />
            <stop offset="100%" stopColor="#a8892a" />
          </linearGradient>
          <filter id="goldGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 2}
          fill="none"
          stroke="url(#goldGrad)"
          strokeWidth="1.5"
          filter="url(#goldGlow)"
          className="animate-breathe"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 3}
          fill="none"
          stroke="#c9a227"
          strokeWidth="0.75"
          opacity="0.4"
          className="animate-breathe"
          style={{ animationDelay: '1.5s' }}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 5}
          fill="none"
          stroke="#c9a227"
          strokeWidth="0.5"
          opacity="0.2"
          className="animate-breathe"
          style={{ animationDelay: '3s' }}
        />
      </svg>
    </div>
  );
}

// ============================================
// HERO O — Large, dramatic, with drawing animation
// ============================================
export function OHero({ size = 280, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      {/* Deep glow */}
      <div
        className="absolute inset-0 rounded-full animate-breathe-glow"
        style={{
          background: 'radial-gradient(circle, rgba(201, 162, 39, 0.12) 0%, rgba(201, 162, 39, 0.04) 40%, transparent 70%)',
          transform: 'scale(2.5)',
        }}
      />
      <svg width={size} height={size} viewBox="0 0 280 280" className="relative">
        <defs>
          <linearGradient id="heroGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e4c85c" />
            <stop offset="30%" stopColor="#c9a227" />
            <stop offset="70%" stopColor="#a8892a" />
            <stop offset="100%" stopColor="#e4c85c" />
          </linearGradient>
          <filter id="heroGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outermost ring — draws in */}
        <circle
          cx="140"
          cy="140"
          r="135"
          fill="none"
          stroke="url(#heroGoldGrad)"
          strokeWidth="1.5"
          filter="url(#heroGlow)"
          className="o-draw"
        />

        {/* Middle ring */}
        <circle
          cx="140"
          cy="140"
          r="95"
          fill="none"
          stroke="#c9a227"
          strokeWidth="0.75"
          opacity="0.5"
          filter="url(#softGlow)"
          className="o-draw"
          style={{ animationDelay: '0.8s' }}
        />

        {/* Inner ring */}
        <circle
          cx="140"
          cy="140"
          r="55"
          fill="none"
          stroke="#c9a227"
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
          fill="#c9a227"
          opacity="0.6"
          className="animate-pulse-gold"
        />

        {/* Sacred geometry — triangle (the triad) */}
        <polygon
          points="140,45 55,185 225,185"
          fill="none"
          stroke="#c9a227"
          strokeWidth="0.4"
          opacity="0.15"
          className="sacred-draw"
          style={{ animationDelay: '2s' }}
        />

        {/* Inverted triangle */}
        <polygon
          points="140,235 55,95 225,95"
          fill="none"
          stroke="#c9a227"
          strokeWidth="0.4"
          opacity="0.1"
          className="sacred-draw"
          style={{ animationDelay: '2.5s' }}
        />
      </svg>
    </div>
  );
}

// ============================================
// Progress indicator — gold arc
// ============================================
export function OProgress({ progress = 0, size = 48, className = '' }) {
  const radius = (size / 2) - 3;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress * circumference);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}>
      <defs>
        <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e4c85c" />
          <stop offset="100%" stopColor="#c9a227" />
        </linearGradient>
      </defs>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(201, 162, 39, 0.1)"
        strokeWidth="2"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="url(#progressGrad)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-500 ease-out"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ filter: 'drop-shadow(0 0 4px rgba(201, 162, 39, 0.4))' }}
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
        <defs>
          <filter id="triadGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connecting lines */}
        <line x1="100" y1="30" x2="30" y2="170" stroke="#c9a227" strokeWidth="0.5" opacity="0.3" className={animated ? 'sacred-draw' : ''} />
        <line x1="30" y1="170" x2="170" y2="170" stroke="#c9a227" strokeWidth="0.5" opacity="0.3" className={animated ? 'sacred-draw' : ''} style={animated ? { animationDelay: '0.5s' } : {}} />
        <line x1="170" y1="170" x2="100" y2="30" stroke="#c9a227" strokeWidth="0.5" opacity="0.3" className={animated ? 'sacred-draw' : ''} style={animated ? { animationDelay: '1s' } : {}} />

        {/* Position 1 — Being (top) */}
        <circle cx="100" cy="30" r="6" fill="#c9a227" filter="url(#triadGlow)" className={animated ? 'animate-pulse-gold' : ''} />

        {/* Position 2 — Paradox (bottom-left) */}
        <circle cx="30" cy="170" r="5" fill="#a8892a" opacity="0.6" className={animated ? 'animate-pulse-gold' : ''} style={animated ? { animationDelay: '1.5s' } : {}} />

        {/* Position 3 — Transcendence (bottom-right) */}
        <circle cx="170" cy="170" r="5" fill="#e4c85c" opacity="0.8" className={animated ? 'animate-pulse-gold' : ''} style={animated ? { animationDelay: '3s' } : {}} />
      </svg>

      {/* Labels */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2">
        <span className="text-[10px] tracking-[0.2em] uppercase text-gold font-medium">Being</span>
      </div>
      <div className="absolute bottom-0 left-0 -translate-x-2">
        <span className="text-[10px] tracking-[0.2em] uppercase text-gold-muted">Paradox</span>
      </div>
      <div className="absolute bottom-0 right-0 translate-x-2">
        <span className="text-[10px] tracking-[0.2em] uppercase text-gold-light">Transcendence</span>
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
        {/* Flower of life pattern — subtle */}
        <circle cx="400" cy="400" r="200" fill="none" stroke="#c9a227" strokeWidth="0.5" />
        <circle cx="400" cy="200" r="200" fill="none" stroke="#c9a227" strokeWidth="0.3" />
        <circle cx="400" cy="600" r="200" fill="none" stroke="#c9a227" strokeWidth="0.3" />
        <circle cx="227" cy="300" r="200" fill="none" stroke="#c9a227" strokeWidth="0.3" />
        <circle cx="573" cy="300" r="200" fill="none" stroke="#c9a227" strokeWidth="0.3" />
        <circle cx="227" cy="500" r="200" fill="none" stroke="#c9a227" strokeWidth="0.3" />
        <circle cx="573" cy="500" r="200" fill="none" stroke="#c9a227" strokeWidth="0.3" />
      </svg>
    </div>
  );
}

// ============================================
// Awakening Sequence — for generation wait
// ============================================
export function AwakeningSequence({ phase = 0, className = '' }) {
  // phase 0 = beginning, 1 = building, 2 = peak, 3 = resolution
  const phaseOpacity = [0.3, 0.6, 1, 0.8];
  const phaseScale = [0.8, 1, 1.2, 1];

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Expanding rings */}
      <div className="absolute">
        <div
          className="w-64 h-64 rounded-full border border-gold/20 awaken-ring-1"
          style={{ animationDuration: `${4 - phase * 0.5}s` }}
        />
      </div>
      <div className="absolute">
        <div
          className="w-48 h-48 rounded-full border border-gold/30 awaken-ring-2"
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
              <circle cx="100" cy="20" r="3" fill="#c9a227" className="animate-pulse-gold" />
              <circle cx="30" cy="170" r="3" fill="#a8892a" className="animate-pulse-gold" style={{ animationDelay: '0.5s' }} />
              <circle cx="170" cy="170" r="3" fill="#e4c85c" className="animate-pulse-gold" style={{ animationDelay: '1s' }} />
              <line x1="100" y1="20" x2="30" y2="170" stroke="#c9a227" strokeWidth="0.5" opacity="0.3" />
              <line x1="30" y1="170" x2="170" y2="170" stroke="#c9a227" strokeWidth="0.5" opacity="0.3" />
              <line x1="170" y1="170" x2="100" y2="20" stroke="#c9a227" strokeWidth="0.5" opacity="0.3" />
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
        <div className="w-3 h-3 rounded-full bg-gold" style={{ boxShadow: '0 0 8px rgba(201, 162, 39, 0.4)' }} />
        <span className="text-[10px] text-gold-muted tracking-[0.2em] uppercase">Being</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-gold-muted opacity-60" />
        <span className="text-[10px] text-gold-muted tracking-[0.2em] uppercase">Paradox</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-gold-light" style={{ boxShadow: '0 0 8px rgba(228, 200, 92, 0.3)' }} />
        <span className="text-[10px] text-gold-muted tracking-[0.2em] uppercase">Transcendence</span>
      </div>
    </div>
  );
}
