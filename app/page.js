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
    <main className="min-h-screen bg-midnight">

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 bg-void" />
        <div className="absolute inset-0 bg-stars" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] orb orb-gold" />
        <SacredGeometry opacity={0.03} />

        <div className="relative max-w-2xl text-center z-10">
          <div className="mb-16 animate-fade-in">
            <OHero size={260} className="mx-auto" />
          </div>

          <h1 className="font-serif text-display-sm md:text-display text-cream mb-8 animate-fade-in-up delay-2">
            The Eden Project
          </h1>

          <p className="text-lg text-cream/45 leading-relaxed max-w-md mx-auto mb-12 animate-fade-in-up delay-3">
            A philosophical experience, built around you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-4">
            <a href="/journey" className="btn btn-primary">
              Begin
            </a>
            <a href="#more" className="btn btn-secondary">
              Learn More
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-5 h-8 rounded-full border border-gold/30 flex items-start justify-center p-1.5">
            <div className="w-1 h-2 rounded-full bg-gold/50 animate-pulse-soft" />
          </div>
        </div>
      </section>

      {/* ===== THE QUESTION ===== */}
      <section id="more" className="relative py-32 md:py-40 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gold-glow opacity-20" />

        <div className="relative max-w-xl mx-auto text-center">
          <p className="font-serif text-heading text-cream leading-tight mb-10">
            What if the thing you're looking for
            <span className="text-gold-gradient"> is already here?</span>
          </p>

          <p className="text-base text-cream/45 leading-relaxed">
            Not as a feeling. Not as a metaphor.
            As a structure — one that every tradition has found
            and most people walk past every day.
          </p>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="relative py-32 px-6 border-t border-gold/10">
        <div className="absolute inset-0 bg-deep" />

        <div className="relative max-w-4xl mx-auto">
          <p className="text-[11px] text-gold/60 tracking-[0.3em] uppercase mb-16 text-center">
            How It Works
          </p>

          <div className="grid md:grid-cols-3 gap-16">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                <span className="text-gold text-sm font-semibold">01</span>
              </div>
              <h3 className="font-serif text-lg text-cream mb-3">Fifteen questions</h3>
              <p className="text-sm text-cream/40 leading-relaxed">
                Open-ended. They adapt to what you say.
                No right answers. Just honesty.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                <span className="text-gold text-sm font-semibold">02</span>
              </div>
              <h3 className="font-serif text-lg text-cream mb-3">A framework meets your words</h3>
              <p className="text-sm text-cream/40 leading-relaxed">
                Your responses are woven through a philosophical system
                with references drawn from across traditions, science,
                and literature.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                <span className="text-gold text-sm font-semibold">03</span>
              </div>
              <h3 className="font-serif text-lg text-cream mb-3">A document written for you</h3>
              <p className="text-sm text-cream/40 leading-relaxed">
                A 5,000+ word PDF. Not a template. Not generic.
                A philosophical conversation with your life at the center.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== THE TRADITIONS ===== */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gold-glow opacity-15" />
        <SacredGeometry opacity={0.02} />

        <div className="relative max-w-2xl mx-auto text-center">
          <p className="text-[11px] text-gold/60 tracking-[0.3em] uppercase mb-12">
            Wherever You're Coming From
          </p>

          <p className="text-base text-cream/50 leading-relaxed mb-12">
            Christian, Muslim, Buddhist, Hindu, Jewish, atheist, agnostic,
            spiritual, unsure, or something you can't name — the framework
            speaks your language. It draws from the full landscape of human
            thought and meets you where you are.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {['Philosophy', 'Theology', 'Science', 'Literature', 'Mysticism', 'Psychology'].map((tag, i) => (
              <span
                key={i}
                className="text-[10px] tracking-[0.15em] uppercase text-gold/40 border border-gold/10 rounded-full px-4 py-1.5"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section className="relative py-32 px-6 border-t border-gold/10">
        <div className="absolute inset-0 bg-deep" />

        <div className="relative max-w-2xl mx-auto">
          <p className="text-[11px] text-gold/60 tracking-[0.3em] uppercase mb-10">
            Who Makes This
          </p>

          <p className="text-base text-cream/55 leading-relaxed mb-6">
            My name is Daniel Edmondson. I have an English degree and a decade of
            writing about consciousness, faith, control, and what happens when you
            stop pretending you have the answers.
          </p>

          <p className="text-base text-cream/55 leading-relaxed">
            What I found is a structure — not a feeling, not a vibe —
            that I think explains how people actually break through. The Eden Project
            delivers that structure to anyone who wants it, tailored
            to their life.
          </p>
        </div>
      </section>

      {/* ===== THE MIRROR ===== */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gold-glow opacity-10" />

        <div className="relative max-w-xl mx-auto text-center">
          <OBreathing size={60} className="mx-auto mb-10" />

          <p className="font-serif text-subheading text-cream mb-6">
            Not ready? Talk to it first.
          </p>

          <p className="text-sm text-cream/40 mb-10 leading-relaxed">
            The Mirror is a philosophical conversation. Ask it anything.
            Challenge it. It speaks in whatever language
            your belief system understands.
          </p>

          <a href="/mirror" className="btn btn-secondary">
            Enter the Mirror
          </a>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section className="relative py-24 px-6 border-t border-gold/10">
        <div className="relative max-w-xl mx-auto text-center">
          <p className="text-sm text-cream/40 mb-6">
            Questions, doubts, pushback — all welcome.
          </p>

          <a
            href="mailto:danieledmondson45@gmail.com"
            className="text-sm text-gold hover:text-gold-light transition-colors"
          >
            danieledmondson45@gmail.com
          </a>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="relative py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gold-glow opacity-15" />

        <div className="relative max-w-md mx-auto text-center">
          <a href="/journey" className="btn btn-primary">
            Begin the Experience
          </a>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-8 px-6 border-t border-gold/10">
        <div className="max-w-5xl mx-auto flex justify-between items-center text-xs text-cream/25">
          <span>The Eden Project &copy; {new Date().getFullYear()}</span>
          <a href="mailto:danieledmondson45@gmail.com" className="hover:text-gold transition-colors">
            Contact
          </a>
        </div>
      </footer>
    </main>
  );
}
