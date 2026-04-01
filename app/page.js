'use client';

import { useState, useEffect } from 'react';
import { ODrawing, OBreathing, ParticleField, TriadDots } from './components/OSymbol';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setEntered(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="min-h-screen relative overflow-hidden">
      <ParticleField count={25} />

      {/* ============================================
          HERO — THE FIRST ENCOUNTER
          ============================================ */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        {/* Background O */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <ODrawing size={Math.min(500, typeof window !== 'undefined' ? window.innerWidth * 0.7 : 400)} />
        </div>

        <div className="relative z-10 max-w-3xl text-center">
          {entered && (
            <>
              <p className="text-xs tracking-[0.4em] uppercase text-gold/50 mb-8 animate-fade-in">
                The Eden Project
              </p>

              <h1 className="font-serif text-4xl md:text-7xl font-light leading-tight mb-8 animate-fade-in-d1">
                Did you choose<br />
                <span className="text-gold-gradient">to come here?</span>
              </h1>

              <p className="text-lg md:text-xl text-white/50 leading-relaxed max-w-xl mx-auto mb-12 animate-fade-in-d2">
                Think about it. The thought that brought you here. Did you
                control that thought? What about the thought before it?
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-d3">
                <a
                  href="/journey"
                  className="px-10 py-4 bg-gold/10 border border-gold/30 text-gold tracking-wider text-sm hover:bg-gold/20 hover:border-gold/50 transition-all btn-glow"
                >
                  Begin the Journey
                </a>
                <a
                  href="#discover"
                  className="px-10 py-4 text-white/30 text-sm tracking-wider hover:text-white/60 transition-colors"
                >
                  What is this?
                </a>
              </div>

              {/* Scroll indicator */}
              <div className="mt-20 animate-fade-in-d5">
                <div className="scroll-indicator text-white/15">
                  <svg width="20" height="30" viewBox="0 0 20 30" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="1" y="1" width="18" height="28" rx="9" />
                    <circle cx="10" cy="8" r="2" fill="currentColor" className="animate-float" />
                  </svg>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ============================================
          DISCOVERY SECTION — WHAT IS THIS?
          ============================================ */}
      <section id="discover" className="relative py-32 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="gradient-divider-gold w-full mb-20" />

          <p className="font-serif text-2xl md:text-4xl font-light leading-snug mb-10 text-white/80">
            There is something true sitting just past what you can say.
            You have felt it. Everyone has.
          </p>

          <div className="space-y-8 text-base md:text-lg text-white/45 leading-relaxed">
            <p>
              That feeling where the answer to every question seems like it might be the same answer.
              Most people spend years circling it without ever pinning it down.
            </p>

            <p>
              This is a guided experience. Not a lecture, not a quiz, not a self-help program.
              You walk through it. It walks through you. And at the end, what you discover gets
              rendered into a philosophical guidebook written for your life alone.
            </p>

            <p className="text-white/70 text-lg md:text-xl font-serif">
              The language of psychedelics is realizing the complete loss of control is complete control.
              Think about it.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================
          THE TRIAD — VISUAL
          ============================================ */}
      <section className="py-24 px-6">
        <TriadDots dark className="mb-16" />

        <div className="max-w-2xl mx-auto text-center">
          <p className="text-white/30 text-base md:text-lg leading-relaxed mb-6">
            Every conflict you carry has three sides, not two. You think you are stuck between
            two forces, but there is always a third position — the one where the fight dissolves.
          </p>
          <p className="text-gold/60 text-sm tracking-wider">
            Being. Paradox. Transcendence.
          </p>
        </div>
      </section>

      {/* ============================================
          THE EXPERIENCE — WHAT YOU GET
          ============================================ */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.02] to-transparent pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10">
          <p className="text-xs tracking-[0.3em] uppercase text-gold/40 mb-16 text-center">
            The Experience
          </p>

          <div className="grid md:grid-cols-3 gap-12 md:gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-6 rounded-full border border-gold/20 flex items-center justify-center">
                <span className="text-gold/60 text-sm font-serif">1</span>
              </div>
              <h3 className="text-white/70 text-sm tracking-wider mb-3">The Journey</h3>
              <p className="text-white/30 text-sm leading-relaxed">
                An interactive experience that maps the terrain of your inner world. Not a questionnaire.
                A mirror.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-6 rounded-full border border-gold/20 flex items-center justify-center">
                <span className="text-gold/60 text-sm font-serif">2</span>
              </div>
              <h3 className="text-white/70 text-sm tracking-wider mb-3">The Mirror</h3>
              <p className="text-white/30 text-sm leading-relaxed">
                A live philosophical conversation. Ask anything. The framework responds in real time.
                It sees connections you have not seen.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-6 rounded-full border border-gold/20 flex items-center justify-center">
                <span className="text-gold/60 text-sm font-serif">3</span>
              </div>
              <h3 className="text-white/70 text-sm tracking-wider mb-3">The Guidebook</h3>
              <p className="text-white/30 text-sm leading-relaxed">
                Everything collapses into a personalized PDF — your theory of everything.
                Written from scratch, for one mind. Yours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          WHO WRITES THIS
          ============================================ */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase text-gold/40 mb-12">Who writes this</p>

          <div className="space-y-6 text-base md:text-lg text-white/40 leading-relaxed">
            <p>
              My name is Daniel Edmondson. I am a writer, not a guru. I have an English degree,
              a decade of experience with psychedelics, and hundreds of pages of writing that
              nobody asked me to produce.
            </p>

            <p>
              What I found in all of that is a pattern — not a feeling, not a vibe, but an
              actual structure — that I think explains how people break through.
            </p>

            <p className="text-gold/70 font-serif text-xl md:text-2xl">
              The Eden Project is the idea that heaven is already here, and the only thing
              between you and it is a way of seeing you have not found yet.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================
          PRICING PREVIEW
          ============================================ */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.03] to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-gold/40 mb-6">
            The Philosophical Guidebook
          </p>
          <p className="text-white/30 text-base mb-16 max-w-xl mx-auto">
            Three depths. One framework. Your life.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Essential */}
            <div className="tier-card glass p-8 rounded-lg text-left">
              <p className="text-xs tracking-[0.2em] uppercase text-white/30 mb-2">Essential</p>
              <p className="text-3xl font-light text-white/80 mb-1">$20</p>
              <p className="text-xs text-white/20 mb-6">4,000–5,000 words</p>
              <ul className="space-y-2 text-sm text-white/30">
                <li className="flex items-start gap-2">
                  <span className="text-gold/40 mt-0.5">·</span>
                  Personalized triadic analysis
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold/40 mt-0.5">·</span>
                  Faith-specific integration
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold/40 mt-0.5">·</span>
                  The control argument
                </li>
              </ul>
              <a
                href="/offering?tier=essential"
                className="block mt-8 py-3 text-center text-sm border border-white/10 text-white/40 hover:border-gold/30 hover:text-gold/60 transition-all rounded"
              >
                Choose Essential
              </a>
            </div>

            {/* Deep — featured */}
            <div className="tier-card tier-card-featured glass p-8 rounded-lg text-left relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gold/20 text-gold text-[10px] tracking-[0.2em] uppercase rounded-full">
                Most Popular
              </div>
              <p className="text-xs tracking-[0.2em] uppercase text-gold/60 mb-2">Deep</p>
              <p className="text-3xl font-light text-gold mb-1">$50</p>
              <p className="text-xs text-gold/30 mb-6">7,000–9,000 words</p>
              <ul className="space-y-2 text-sm text-white/40">
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-0.5">·</span>
                  Everything in Essential
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-0.5">·</span>
                  Multiple life tensions explored
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-0.5">·</span>
                  The psychedelic thesis
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-0.5">·</span>
                  Novel cross-tradition connections
                </li>
              </ul>
              <a
                href="/offering?tier=deep"
                className="block mt-8 py-3 text-center text-sm bg-gold/20 border border-gold/40 text-gold hover:bg-gold/30 transition-all rounded btn-glow"
              >
                Choose Deep
              </a>
            </div>

            {/* Complete */}
            <div className="tier-card glass p-8 rounded-lg text-left">
              <p className="text-xs tracking-[0.2em] uppercase text-white/30 mb-2">Complete</p>
              <p className="text-3xl font-light text-white/80 mb-1">$100</p>
              <p className="text-xs text-white/20 mb-6">10,000–12,000 words</p>
              <ul className="space-y-2 text-sm text-white/30">
                <li className="flex items-start gap-2">
                  <span className="text-gold/40 mt-0.5">·</span>
                  Everything in Deep
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold/40 mt-0.5">·</span>
                  Full theory of everything
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold/40 mt-0.5">·</span>
                  All framework elements applied
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold/40 mt-0.5">·</span>
                  The O: your symbol of completion
                </li>
              </ul>
              <a
                href="/offering?tier=complete"
                className="block mt-8 py-3 text-center text-sm border border-white/10 text-white/40 hover:border-gold/30 hover:text-gold/60 transition-all rounded"
              >
                Choose Complete
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          THE CALL — FINAL CTA
          ============================================ */}
      <section className="py-32 px-6 text-center relative">
        <OBreathing size={200} className="mx-auto mb-12" />

        <p className="font-serif text-2xl md:text-4xl font-light text-white/60 max-w-xl mx-auto leading-snug mb-8">
          When you make a decision, the decision has already been made.
        </p>

        <a
          href="/journey"
          className="inline-block px-12 py-5 bg-gold/10 border border-gold/30 text-gold tracking-wider text-sm hover:bg-gold/20 transition-all btn-glow"
        >
          Enter
        </a>
      </section>

      {/* ============================================
          FOOTER
          ============================================ */}
      <footer className="py-12 px-6">
        <div className="gradient-divider-gold w-full max-w-2xl mx-auto mb-12" />
        <div className="max-w-2xl mx-auto flex justify-between items-center text-xs text-white/20">
          <span>The Eden Project &copy; {new Date().getFullYear()}</span>
          <a href="mailto:danieledmondson45@gmail.com" className="hover:text-gold/60 transition-colors">
            Contact
          </a>
        </div>
      </footer>
    </main>
  );
}
