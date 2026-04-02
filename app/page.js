'use client';

import { useState, useEffect } from 'react';

function OGraphic({ className = '' }) {
  return (
    <svg width="200" height="200" viewBox="0 0 200 200" className={className}>
      <circle
        cx="100"
        cy="100"
        r="90"
        fill="none"
        stroke="#e5e5e5"
        strokeWidth="1"
        className="o-draw"
      />
      <circle
        cx="100"
        cy="100"
        r="60"
        fill="none"
        stroke="#d4d4d4"
        strokeWidth="0.5"
        className="o-draw"
        style={{ animationDelay: '0.8s' }}
      />
    </svg>
  );
}

function TriadGraphic({ className = '' }) {
  return (
    <svg width="120" height="104" viewBox="0 0 120 104" className={className}>
      <line x1="60" y1="4" x2="4" y2="100" stroke="#d4d4d4" strokeWidth="0.75" />
      <line x1="4" y1="100" x2="116" y2="100" stroke="#d4d4d4" strokeWidth="0.75" />
      <line x1="116" y1="100" x2="60" y2="4" stroke="#d4d4d4" strokeWidth="0.75" />
      <circle cx="60" cy="4" r="4" fill="#1a1a1a" />
      <circle cx="4" cy="100" r="4" fill="#a3a3a3" />
      <circle cx="116" cy="100" r="4" fill="#a3a3a3" />
    </svg>
  );
}

export default function Home() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <main className="min-h-screen bg-white">

      {/* ===== HERO ===== */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-6">
        <div className="max-w-2xl text-center">
          <div className="mb-12 animate-fade-in">
            <OGraphic className="mx-auto" />
          </div>

          <h1 className="font-serif text-display text-eden-900 mb-6 animate-fade-in-up delay-2">
            The Eden Project
          </h1>

          <p className="text-lg text-eden-500 leading-relaxed max-w-lg mx-auto mb-10 animate-fade-in-up delay-3">
            A personalized philosophical document built from your answers,
            a framework, and the idea that you might already have what
            you're looking for.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up delay-4">
            <a href="/journey" className="btn btn-primary">
              Start
            </a>
            <a href="#how-it-works" className="btn btn-secondary">
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-eden-400 tracking-wide uppercase mb-12 text-center">
            How it works
          </p>

          <div className="grid md:grid-cols-3 gap-16">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-eden-100 flex items-center justify-center">
                <span className="text-eden-600 text-sm font-medium">1</span>
              </div>
              <h3 className="text-base font-medium text-eden-800 mb-2">Answer fifteen questions</h3>
              <p className="text-sm text-eden-500 leading-relaxed">
                The questions adapt to what you say. They're designed to find
                where you are in your search — or why you stopped searching.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-eden-100 flex items-center justify-center">
                <span className="text-eden-600 text-sm font-medium">2</span>
              </div>
              <h3 className="text-base font-medium text-eden-800 mb-2">Your answers meet a framework</h3>
              <p className="text-sm text-eden-500 leading-relaxed">
                Your responses are woven through a philosophical system — with
                references, citations, and connections drawn from across traditions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-eden-100 flex items-center justify-center">
                <span className="text-eden-600 text-sm font-medium">3</span>
              </div>
              <h3 className="text-base font-medium text-eden-800 mb-2">Receive your document</h3>
              <p className="text-sm text-eden-500 leading-relaxed">
                A PDF written for you. Not a template, not a summary — a genuine
                philosophical conversation with your life at the center.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== THE IDEA ===== */}
      <section className="py-32 px-6 bg-eden-50">
        <div className="max-w-2xl mx-auto">
          <TriadGraphic className="mx-auto mb-16" />

          <p className="font-serif text-heading text-eden-800 text-center mb-8">
            The premise is simple.
          </p>

          <div className="space-y-6 text-base text-eden-600 leading-relaxed">
            <p>
              Everything you've ever done has been an act of control. Even losing
              control is something you're doing. Even the thought of losing control
              is a controlled thought.
            </p>

            <p>
              This isn't a trick. It's the structure of consciousness. And once you
              see it clearly enough, something shifts — not because you've learned
              something new, but because you've recognized what was already there.
            </p>

            <p>
              The Eden Project takes this idea and runs it through whatever you believe,
              whatever you're going through, whatever questions you carry. The document
              you receive isn't advice. It's a mirror built from your own words and a
              framework designed to show you what you might already know.
            </p>
          </div>
        </div>
      </section>

      {/* ===== WHAT YOU GET ===== */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm text-eden-400 tracking-wide uppercase mb-12 text-center">
            What you receive
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="card p-8">
              <h3 className="text-base font-medium text-eden-800 mb-3">Personalized philosophy</h3>
              <p className="text-sm text-eden-500 leading-relaxed">
                Not generic inspiration. A document that engages with your specific
                tensions, your faith tradition or lack of one, and the questions
                you actually carry.
              </p>
            </div>

            <div className="card p-8">
              <h3 className="text-base font-medium text-eden-800 mb-3">Real references</h3>
              <p className="text-sm text-eden-500 leading-relaxed">
                The PDF draws from philosophy, theology, science, and literature.
                It cites sources, makes connections across traditions, and introduces
                you to thinkers who've wrestled with the same things.
              </p>
            </div>

            <div className="card p-8">
              <h3 className="text-base font-medium text-eden-800 mb-3">Your framework applied</h3>
              <p className="text-sm text-eden-500 leading-relaxed">
                The triadic logic — the idea that every tension has a third position
                where the fight dissolves — is applied directly to whatever you're
                working through.
              </p>
            </div>

            <div className="card p-8">
              <h3 className="text-base font-medium text-eden-800 mb-3">Sliding scale pricing</h3>
              <p className="text-sm text-eden-500 leading-relaxed">
                Pay what feels right, starting at $15. This isn't a product with a
                markup — it's a framework meeting a person. Promo codes available.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section className="py-32 px-6 bg-eden-50">
        <div className="max-w-2xl mx-auto">
          <p className="text-sm text-eden-400 tracking-wide uppercase mb-8">
            Who makes this
          </p>

          <p className="text-base text-eden-600 leading-relaxed mb-6">
            My name is Daniel Edmondson. I have an English degree and a decade of
            writing about consciousness, faith, control, and what happens when you
            stop pretending you have the answers.
          </p>

          <p className="text-base text-eden-600 leading-relaxed">
            What I found in all of that is a structure — not a feeling, not a vibe —
            that I think explains how people actually break through. The Eden Project
            is an attempt to deliver that structure to anyone who wants it, tailored
            to their life.
          </p>
        </div>
      </section>

      {/* ===== ASK ME ANYTHING ===== */}
      <section className="py-32 px-6">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-sm text-eden-400 tracking-wide uppercase mb-8">
            Ask me anything
          </p>

          <p className="font-serif text-subheading text-eden-800 mb-6">
            Questions, doubts, pushback — all welcome.
          </p>

          <p className="text-sm text-eden-500 mb-10">
            If you've gone through the experience and want to talk about what came up,
            or if you're skeptical and want to challenge the framework — reach out.
          </p>

          <a
            href="mailto:danieledmondson45@gmail.com"
            className="btn btn-primary"
          >
            danieledmondson45@gmail.com
          </a>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24 px-6 border-t border-eden-100">
        <div className="max-w-xl mx-auto text-center">
          <p className="font-serif text-xl text-eden-600 mb-8">
            What would your life look like if you realized you're already
            enlightened — right now, with no further prerequisite?
          </p>

          <a href="/journey" className="btn btn-primary">
            Start the experience
          </a>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-8 px-6 border-t border-eden-100">
        <div className="max-w-5xl mx-auto flex justify-between items-center text-xs text-eden-400">
          <span>The Eden Project &copy; {new Date().getFullYear()}</span>
          <a href="mailto:danieledmondson45@gmail.com" className="hover:text-eden-700 transition-colors">
            Contact
          </a>
        </div>
      </footer>
    </main>
  );
}
