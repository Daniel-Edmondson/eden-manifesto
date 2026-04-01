'use client';

import { useEffect, useState } from 'react';

// The O — animated, breathing, alive
export function OBreathing({ size = 120, color = 'rgba(200, 185, 140, 0.08)', strokeWidth = 1, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - strokeWidth}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          className="animate-breathe-gold"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 3}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth * 0.6}
          className="animate-breathe"
          style={{ animationDelay: '1s' }}
        />
      </svg>
    </div>
  );
}

// The O as progress indicator — draws itself as the user progresses
export function OProgress({ progress = 0, size = 60, className = '' }) {
  const radius = (size / 2) - 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress * circumference);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}>
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(200, 185, 140, 0.1)"
        strokeWidth="1.5"
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(200, 185, 140, 0.6)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="progress-circle"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

// The O drawing itself on scroll or entrance
export function ODrawing({ size = 200, className = '' }) {
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDrawn(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const radius = (size / 2) - 3;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(200, 185, 140, 0.12)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={drawn ? 0 : circumference}
        style={{ transition: 'stroke-dashoffset 3s ease-out' }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

// Particle field — floating golden particles
export function ParticleField({ count = 30, className = '' }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const p = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 20,
      duration: 15 + Math.random() * 20,
      size: 1 + Math.random() * 2,
      opacity: 0.1 + Math.random() * 0.3,
    }));
    setParticles(p);
  }, [count]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            bottom: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}

// Triad dots
export function TriadDots({ className = '', dark = false }) {
  const textColor = dark ? 'text-white/40' : 'text-gray-600';
  const dotBg = dark ? 'bg-gold/70' : 'bg-black';

  return (
    <div className={`flex items-center justify-center gap-12 md:gap-20 ${className}`}>
      <div className="flex flex-col items-center gap-3">
        <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full ${dotBg} triad-dot-1`} />
        <span className={`text-xs md:text-sm tracking-[0.2em] uppercase ${textColor}`}>Being</span>
      </div>
      <div className="flex flex-col items-center gap-3">
        <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full ${dotBg} triad-dot-2`} />
        <span className={`text-xs md:text-sm tracking-[0.2em] uppercase ${textColor}`}>Paradox</span>
      </div>
      <div className="flex flex-col items-center gap-3">
        <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full ${dotBg} triad-dot-3`} />
        <span className={`text-xs md:text-sm tracking-[0.2em] uppercase ${textColor}`}>Transcendence</span>
      </div>
    </div>
  );
}
