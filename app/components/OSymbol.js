'use client';

import { useEffect, useState } from 'react';

// The O — subtle breathing animation for light backgrounds
export function OBreathing({ size = 120, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 1}
          fill="none"
          stroke="#d4d4d4"
          strokeWidth="1"
          className="animate-breathe"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 3}
          fill="none"
          stroke="#e5e5e5"
          strokeWidth="0.5"
          className="animate-breathe"
          style={{ animationDelay: '1s' }}
        />
      </svg>
    </div>
  );
}

// Progress indicator — draws as user advances
export function OProgress({ progress = 0, size = 48, className = '' }) {
  const radius = (size / 2) - 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress * circumference);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#f0f0f0"
        strokeWidth="2"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#1a1a1a"
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

// Triad dots — three positions
export function TriadDots({ className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-16 ${className}`}>
      <div className="flex flex-col items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-eden-900" />
        <span className="text-xs text-eden-400 tracking-wider">Truth</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-eden-400" />
        <span className="text-xs text-eden-400 tracking-wider">Paradox</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-eden-400" />
        <span className="text-xs text-eden-400 tracking-wider">Transcendence</span>
      </div>
    </div>
  );
}
