'use client';

import { useEffect, useState } from 'react';
import { OBreathing, SacredGeometry } from '../components/OSymbol';

export default function SupportPage() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <main className="min-h-screen bg-white relative overflow-hidden">
      <SacredGeometry opacity={0.05} />

      <div className={`relative z-10 max-w-2xl mx-auto px-6 py-24 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

        {/* Symbol */}
        <div className="flex justify-center mb-16">
          <OBreathing size={60} />
        </div>

        {/* Heading */}
        <h1 className="font-serif text-3xl md:text-4xl text-ink text-center mb-6 leading-relaxed">
          The fire has to be tended.
        </h1>

        <div className="divider mx-auto max-w-[120px] mb-12" />

        {/* Philosophy — mystical-alluring */}
        <div className="space-y-6 text-base md:text-lg text-ink-secondary leading-relaxed font-serif">
          <p>
            There is a logic underneath everything. Beneath the noise of the world,
            beneath the arguments and the anxiety, beneath even the silence — a structure
            that holds. It says: what makes sense, makes sense. And what unmakes sense
            unmakes itself.
          </p>

          <p>
            The Eden Project exists because someone followed that thread to its end
            and came back with something to show for it. A framework that speaks every
            faith language. A triadic logic that maps suffering to its own dissolution.
            A recognition — not a teaching — that you are already what you are looking for.
          </p>

          <p>
            This is not a self-help project. It is an attempt to replicate the unrepeatable:
            the moment the mind sees through its own paradox and discovers that
            transcendence was never elsewhere. That the Kingdom was always within.
            That the opposite of paradox is not a solution — it is you.
          </p>

          <p className="text-ink-tertiary text-center italic">
            Control is control. Noncontrol is the control of noncontrol.
            <br />
            Control is never the noncontrol of control.
          </p>

          <p>
            Every document generated here is a real philosophical conversation —
            written live, from your answers, through a framework that has taken years
            to build. The traditions speak. The logic holds. And something shifts.
          </p>
        </div>

        <div className="divider mx-auto max-w-[120px] my-12" />

        {/* The ask */}
        <div className="text-center space-y-6">
          <h2 className="font-serif text-xl md:text-2xl text-ink">
            If this reached you — help it reach others.
          </h2>

          <p className="text-base md:text-lg text-ink-secondary max-w-lg mx-auto leading-relaxed">
            The Eden Project is independent. No institution, no investors, no algorithm
            deciding who gets to encounter this. Every contribution keeps the framework
            alive and accessible — and funds the work still being written.
          </p>

          <div className="pt-4">
            <a
              href="https://ko-fi.com/danieledmondson"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary text-base"
            >
              Support on Ko-Fi
            </a>
          </div>

          <p className="text-sm text-ink-tertiary pt-2">
            One-time or recurring. Every amount matters.
          </p>
        </div>

        <div className="divider mx-auto max-w-[120px] my-12" />

        {/* Closing */}
        <div className="text-center space-y-4">
          <p className="font-serif text-ink-secondary text-base italic">
            What would happen if you lost all control?
          </p>

          <div className="flex justify-center gap-8 pt-4">
            <a href="/" className="text-base text-ink-secondary hover:text-ink transition-colors">
              Return home
            </a>
            <a href="/mirror" className="text-base text-ink-secondary hover:text-ink transition-colors">
              Enter the Mirror
            </a>
          </div>
        </div>

      </div>
    </main>
  );
}
