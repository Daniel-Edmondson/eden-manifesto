'use client';

import { useState, useEffect } from 'react';
import { OHero, SacredGeometry, OBreathing } from './components/OSymbol';

export default function Home() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <main className="min-h-screen bg-surface">

      {/* ===== HERO — THE DESTABILIZATION ===== */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        <SacredGeometry opacity={0.06} />

        <div className="relative max-w-4xl text-center z-10">
          <div className="mb-16 animate-fade-in">
            <OHero size={260} className="mx-auto" />
          </div>

          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl text-ink mb-8 animate-fade-in-up delay-2" style={{ letterSpacing: '-0.03em', fontWeight: 600, lineHeight: 1 }}>
            The Eden Project
          </h1>

          <p className="font-serif text-3xl md:text-5xl text-ink-secondary leading-tight mb-6 animate-fade-in-up delay-3" style={{ fontWeight: 400 }}>
            What would happen if you lost all control?
          </p>

          <p className="text-xl md:text-2xl text-ink-secondary leading-relaxed max-w-xl mx-auto mb-14 animate-fade-in-up delay-4">
            Even the thought of losing control is an act of control.
            That realization is the beginning of everything.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-fade-in-up delay-5">
            <a href="/mirror" className="btn btn-primary text-lg px-10 py-4">
              Enter the Mirror
            </a>
            <a href="#more" className="btn btn-secondary text-lg px-10 py-4">
              What Is This
            </a>
          </div>
        </div>

      </section>

      {/* ===== THE TENSION — NOT THE RESOLUTION ===== */}
      <section id="more" className="relative py-32 md:py-40 px-6">
        <div className="relative max-w-3xl mx-auto text-center">
          <p className="font-serif text-4xl md:text-6xl text-ink leading-tight mb-10">
            You are already what you're looking for.
          </p>

          <p className="text-2xl md:text-3xl text-ink-secondary leading-relaxed">
            There is a structure underneath enlightenment — not a feeling,
            not a vibe — a logical structure that every tradition has found
            and most people walk past every day. The Eden Project delivers
            that structure, tailored to your life.
          </p>
        </div>
      </section>

      {/* ===== THE PATH — SINGLE FLOW ===== */}
      <section className="relative py-32 px-6 border-t border-white/[0.12]">
        <div className="relative max-w-5xl mx-auto">
          <p className="text-sm md:text-base text-ink-secondary tracking-[0.3em] uppercase mb-16 text-center">
            How It Works
          </p>

          <div className="grid md:grid-cols-3 gap-16">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-surface-secondary flex items-center justify-center">
                <span className="text-ink text-xl font-semibold">01</span>
              </div>
              <h3 className="font-serif text-3xl text-ink mb-4">Talk to the Mirror</h3>
              <p className="text-xl text-ink-secondary leading-relaxed">
                A philosophical conversation that meets you where you are.
                Free. No commitment. Say whatever is on your mind.
              </p>
              <a href="/mirror" className="inline-block mt-5 text-base text-ink-secondary hover:text-ink transition-colors">
                Start here &rarr;
              </a>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-surface-secondary flex items-center justify-center">
                <span className="text-ink text-xl font-semibold">02</span>
              </div>
              <h3 className="font-serif text-3xl text-ink mb-4">Fifteen questions</h3>
              <p className="text-xl text-ink-secondary leading-relaxed">
                Open-ended. They adapt to what you say.
                No right answers. Just honesty. Your responses
                shape everything that follows.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-surface-secondary flex items-center justify-center">
                <span className="text-ink text-xl font-semibold">03</span>
              </div>
              <h3 className="font-serif text-3xl text-ink mb-4">A document written for you</h3>
              <p className="text-xl text-ink-secondary leading-relaxed">
                5,000+ words of genuine philosophical engagement —
                a conversation between your life, a framework,
                and the full landscape of human thought.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== THE TRADITIONS ===== */}
      <section className="relative py-32 px-6 bg-surface-secondary">
        <SacredGeometry opacity={0.05} />

        <div className="relative max-w-3xl mx-auto text-center">
          <p className="text-sm md:text-base text-ink-secondary tracking-[0.3em] uppercase mb-12">
            Wherever You're Coming From
          </p>

          <p className="text-2xl md:text-3xl text-ink-secondary leading-relaxed mb-12">
            Christian, Muslim, Buddhist, Hindu, Jewish, atheist, agnostic,
            spiritual, unsure, or something you can't name — the framework
            speaks your language. It draws from the full landscape of human
            thought and meets you where you are.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {['Philosophy', 'Theology', 'Science', 'Literature', 'Mysticism', 'Psychology'].map((tag, i) => (
              <span
                key={i}
                className="text-base md:text-lg tracking-[0.15em] uppercase text-ink-secondary border border-white/[0.2] rounded-full px-6 py-2.5"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT — THE REAL STORY ===== */}
      <section className="relative py-32 px-6">
        <div className="relative max-w-3xl mx-auto">
          <p className="text-sm md:text-base text-ink-secondary tracking-[0.3em] uppercase mb-10">
            Who Makes This
          </p>

          <p className="text-2xl md:text-3xl text-ink-secondary leading-relaxed mb-8">
            My name is Daniel Edmondson. I have a schizoaffective diagnosis, three
            psychotic episodes, a history with psychedelics, an English degree,
            and a decade of writing about consciousness, control, faith, and
            what happens when you stop pretending you have the answers.
          </p>

          <p className="text-2xl md:text-3xl text-ink-secondary leading-relaxed mb-8">
            Out of that came a formal logical framework — a triadic structure
            that maps onto every faith tradition, resolves the paradoxes that
            keep people stuck, and explains how people actually break through.
            Not a feeling. Not a platitude. A structure.
          </p>

          <p className="text-2xl md:text-3xl text-ink-secondary leading-relaxed">
            The Eden Project delivers that structure to anyone who wants it,
            tailored to their life. The philosophy is human.
            The AI is the delivery mechanism.
          </p>
        </div>
      </section>

      {/* ===== THE MIRROR CTA ===== */}
      <section className="relative py-32 px-6 bg-surface-secondary">
        <div className="relative max-w-2xl mx-auto text-center">
          <OBreathing size={80} className="mx-auto mb-10" />

          <p className="font-serif text-3xl md:text-4xl text-ink mb-8">
            Not sure yet? Talk to it.
          </p>

          <p className="text-xl md:text-2xl text-ink-secondary mb-12 leading-relaxed">
            The Mirror is a philosophical conversation — free, no signup,
            no obligation. It speaks in whatever language your belief system
            understands. Say what you're carrying and see what comes back.
          </p>

          <a href="/mirror" className="btn btn-secondary text-lg px-10 py-4">
            Enter the Mirror
          </a>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section className="relative py-24 px-6 border-t border-white/[0.12]">
        <div className="relative max-w-xl mx-auto text-center">
          <p className="text-xl md:text-2xl text-ink-secondary mb-6">
            Questions, doubts, pushback — all welcome.
          </p>

          <a
            href="mailto:danieledmondson45@gmail.com"
            className="text-lg md:text-xl text-ink hover:text-ink-secondary transition-colors"
          >
            danieledmondson45@gmail.com
          </a>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="relative py-28 px-6">
        <div className="relative max-w-md mx-auto text-center">
          <a href="/mirror" className="btn btn-primary text-lg px-10 py-4">
            Begin
          </a>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-8 px-6 border-t border-white/[0.12]">
        <div className="max-w-5xl mx-auto flex justify-between items-center text-base text-ink-secondary">
          <span>The Eden Project &copy; {new Date().getFullYear()}</span>
          <a href="mailto:danieledmondson45@gmail.com" className="hover:text-ink transition-colors">
            Contact
          </a>
        </div>
      </footer>
    </main>
  );
}
