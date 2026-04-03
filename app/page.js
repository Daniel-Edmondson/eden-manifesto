'use client';

import { useState, useEffect } from 'react';
import { OHero, TriadGraphic, SacredGeometry, TriadDots } from './components/OSymbol';

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
        {/* Background atmosphere */}
        <div className="absolute inset-0 bg-void" />
        <div className="absolute inset-0 bg-stars" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] orb orb-gold" />

        {/* Sacred geometry backdrop */}
        <SacredGeometry opacity={0.03} />

        <div className="relative max-w-3xl text-center z-10">
          <div className="mb-16 animate-fade-in">
            <OHero size={280} className="mx-auto" />
          </div>

          <h1 className="font-serif text-display text-cream mb-8 animate-fade-in-up delay-2">
            <span className="text-gold-gradient">You are already</span>
            <br />
            <span className="text-cream">enlightened.</span>
          </h1>

          <p className="text-lg text-cream/50 leading-relaxed max-w-lg mx-auto mb-4 animate-fade-in-up delay-3">
            You just don't know it yet.
          </p>

          <p className="text-base text-cream/35 leading-relaxed max-w-md mx-auto mb-12 animate-fade-in-up delay-4">
            A personalized philosophical document built from your answers,
            a framework, and the recognition that was always there.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-5">
            <a href="/journey" className="btn btn-primary">
              Begin the Experience
            </a>
            <a href="#the-idea" className="btn btn-secondary">
              The Idea
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

      {/* ===== THE CORE IDEA ===== */}
      <section id="the-idea" className="relative py-32 md:py-40 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gold-glow opacity-30" />
        <SacredGeometry opacity={0.02} />

        <div className="relative max-w-2xl mx-auto text-center">
          <div className="mb-16">
            <TriadDots />
          </div>

          <p className="font-serif text-heading text-cream mb-10">
            The opposite of paradox is
            <span className="text-gold-gradient"> transcendence.</span>
          </p>

          <div className="space-y-8 text-base text-cream/60 leading-relaxed max-w-xl mx-auto">
            <p>
              Do you control your thoughts? If yes — try to stop thinking.
              If no — who is the one noticing they can't stop?
            </p>

            <p>
              The thought of losing control is itself an act of control.
              The concept of noncontrol is something control is doing.
              This isn't wordplay. It is the structure of consciousness itself.
            </p>

            <p className="text-cream/80 font-serif text-lg">
              Control is control. Noncontrol is the control of noncontrol.
              Control is never the noncontrol of control.
            </p>

            <p>
              Every spiritual tradition has found this same structure.
              Every paradox resolves the same way. The Eden Project takes
              this idea and runs it through whatever you believe, whatever
              you're going through, whatever questions you carry — and gives
              you back a document that shows you what was already there.
            </p>
          </div>
        </div>
      </section>

      {/* ===== THE THREE POSITIONS — Visual ===== */}
      <section className="relative py-32 px-6 border-t border-gold/10 overflow-hidden">
        <div className="absolute inset-0 bg-deep" />

        <div className="relative max-w-5xl mx-auto">
          <p className="text-[11px] text-gold/60 tracking-[0.3em] uppercase mb-16 text-center">
            The Triadic Structure
          </p>

          <div className="grid md:grid-cols-3 gap-12 md:gap-8">
            {/* Position 1 */}
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-8 rounded-full border border-gold/40 flex items-center justify-center group-hover:border-gold group-hover:shadow-[0_0_20px_rgba(201,162,39,0.2)] transition-all duration-500">
                <span className="text-gold text-lg font-serif">I</span>
              </div>
              <h3 className="font-serif text-xl text-cream mb-3">Being</h3>
              <p className="text-[11px] text-gold/50 tracking-[0.2em] uppercase mb-4">
                A is A
              </p>
              <p className="text-sm text-cream/45 leading-relaxed">
                The self-evident ground. Truth is truth. Love is love.
                The primordial fact antecedent to all logic.
                Existence sustaining itself.
              </p>
            </div>

            {/* Position 2 */}
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-8 rounded-full border border-gold/20 flex items-center justify-center group-hover:border-gold/50 transition-all duration-500">
                <span className="text-gold-muted text-lg font-serif">II</span>
              </div>
              <h3 className="font-serif text-xl text-cream/70 mb-3">Paradox</h3>
              <p className="text-[11px] text-gold/40 tracking-[0.2em] uppercase mb-4">
                Non-A is the A of Non-A
              </p>
              <p className="text-sm text-cream/35 leading-relaxed">
                The negation participates in what it negates. Hate is the love
                of hate. The liar's paradox: a statement telling the truth about
                its own lying. Infinite regression. The drain.
              </p>
            </div>

            {/* Position 3 */}
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-8 rounded-full border border-gold-light/30 flex items-center justify-center group-hover:border-gold-light group-hover:shadow-[0_0_24px_rgba(228,200,92,0.15)] transition-all duration-500">
                <span className="text-gold-light text-lg font-serif">III</span>
              </div>
              <h3 className="font-serif text-xl text-gold-light mb-3">Transcendence</h3>
              <p className="text-[11px] text-gold-light/50 tracking-[0.2em] uppercase mb-4">
                A is never the Non-A of A
              </p>
              <p className="text-sm text-cream/45 leading-relaxed">
                The pure positive can never be reduced to its negation.
                Love is never the hate of love. The infinite tautology.
                The direction is upward. Always upward.
              </p>
            </div>
          </div>

          {/* Connecting line */}
          <div className="hidden md:block mt-8">
            <div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
          </div>
        </div>
      </section>

      {/* ===== EVERY TRADITION ===== */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gold-glow opacity-20" />

        <div className="relative max-w-3xl mx-auto">
          <p className="text-[11px] text-gold/60 tracking-[0.3em] uppercase mb-16 text-center">
            One Structure. Every Tradition.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { tradition: 'Christianity', term: '"I AM that I AM"', source: 'Exodus 3:14' },
              { tradition: 'Islam', term: 'La ilaha illallah', source: 'Shahadah' },
              { tradition: 'Buddhism', term: 'Form is emptiness', source: 'Heart Sutra' },
              { tradition: 'Hinduism', term: 'Tat tvam asi', source: 'Chandogya Upanishad' },
              { tradition: 'Judaism', term: 'Ein Sof', source: 'Kabbalah' },
              { tradition: 'Taoism', term: 'The Tao that can be told', source: 'Tao Te Ching' },
              { tradition: 'Science', term: 'The hard problem', source: 'Chalmers' },
              { tradition: 'Philosophy', term: 'Cogito ergo sum', source: 'Descartes' },
            ].map((item, i) => (
              <div
                key={i}
                className="card p-5 text-center border-gold-glow"
              >
                <p className="text-[10px] text-gold/50 tracking-[0.2em] uppercase mb-2">{item.tradition}</p>
                <p className="font-serif text-sm text-cream/80 italic mb-1">{item.term}</p>
                <p className="text-[10px] text-cream/30">{item.source}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-base text-cream/50 leading-relaxed max-w-lg mx-auto">
            The same truth wears different clothes in every culture.
            Your document speaks in the language you already know —
            and connects it to the languages you don't.
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
              <h3 className="font-serif text-lg text-cream mb-3">Answer fifteen questions</h3>
              <p className="text-sm text-cream/40 leading-relaxed">
                Open-ended. No right answers. They adapt to what you say,
                finding where you are in your search — and what you're
                actually looking for.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                <span className="text-gold text-sm font-semibold">02</span>
              </div>
              <h3 className="font-serif text-lg text-cream mb-3">Your answers meet a framework</h3>
              <p className="text-sm text-cream/40 leading-relaxed">
                Your responses are woven through a philosophical system — with
                references, citations, and connections drawn from across
                every tradition that has ever grappled with the same questions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                <span className="text-gold text-sm font-semibold">03</span>
              </div>
              <h3 className="font-serif text-lg text-cream mb-3">Receive your document</h3>
              <p className="text-sm text-cream/40 leading-relaxed">
                A 5,000+ word PDF written for you. Not a template. Not a summary.
                A genuine philosophical conversation with your life at the center,
                designed to show you what you already know.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHAT YOU GET ===== */}
      <section className="relative py-32 px-6 overflow-hidden">
        <SacredGeometry opacity={0.015} />

        <div className="relative max-w-3xl mx-auto">
          <p className="text-[11px] text-gold/60 tracking-[0.3em] uppercase mb-16 text-center">
            What You Receive
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-8 border-gold-glow">
              <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center mb-5">
                <div className="w-2 h-2 rounded-full bg-gold" />
              </div>
              <h3 className="font-serif text-lg text-cream mb-3">Personalized philosophy</h3>
              <p className="text-sm text-cream/40 leading-relaxed">
                Not generic inspiration. A document that engages with your specific
                tensions — your faith tradition or productive absence of one —
                and the questions you actually carry.
              </p>
            </div>

            <div className="card p-8 border-gold-glow">
              <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center mb-5">
                <div className="w-2 h-2 rounded-full bg-gold" />
              </div>
              <h3 className="font-serif text-lg text-cream mb-3">Real references</h3>
              <p className="text-sm text-cream/40 leading-relaxed">
                The PDF draws from philosophy, theology, science, and literature.
                It cites sources, makes connections across traditions, and introduces
                you to thinkers who've wrestled with the same things you have.
              </p>
            </div>

            <div className="card p-8 border-gold-glow">
              <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center mb-5">
                <div className="w-2 h-2 rounded-full bg-gold" />
              </div>
              <h3 className="font-serif text-lg text-cream mb-3">The triadic framework applied</h3>
              <p className="text-sm text-cream/40 leading-relaxed">
                The logic of transcendence — every tension has a third position
                where the fight dissolves — applied directly to whatever
                you're working through.
              </p>
            </div>

            <div className="card p-8 border-gold-glow">
              <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center mb-5">
                <div className="w-2 h-2 rounded-full bg-gold" />
              </div>
              <h3 className="font-serif text-lg text-cream mb-3">Sliding scale pricing</h3>
              <p className="text-sm text-cream/40 leading-relaxed">
                Pay what feels right, starting at $15. This isn't a product with a
                markup. It's a framework meeting a person. Promo codes available.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== THE RECOGNITION ===== */}
      <section className="relative py-32 md:py-40 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gold-glow opacity-30" />

        <div className="relative max-w-2xl mx-auto text-center">
          <p className="font-serif text-heading text-cream mb-10 leading-tight">
            There is no enlightenment
            <span className="text-gold-gradient"> to achieve.</span>
          </p>

          <div className="space-y-6 text-base text-cream/55 leading-relaxed max-w-lg mx-auto">
            <p>
              Think of the grace of God. Think of the Buddhist recognition that
              the seeker is the sought. Think of what every mystic in every
              tradition has ever said the moment they stopped trying.
            </p>

            <p>
              You can be enlightened and still suffer — if you don't realize
              you're enlightened. The recognition is the release. That's all
              this is. A mirror held up to what's already there.
            </p>
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
            What I found in all of that is a structure — not a feeling, not a vibe —
            that I think explains how people actually break through. The Eden Project
            is an attempt to deliver that structure to anyone who wants it, tailored
            to their life.
          </p>
        </div>
      </section>

      {/* ===== THE MIRROR PREVIEW ===== */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gold-glow opacity-15" />

        <div className="relative max-w-xl mx-auto text-center">
          <p className="text-[11px] text-gold/60 tracking-[0.3em] uppercase mb-10">
            Not Ready for the Document?
          </p>

          <p className="font-serif text-subheading text-cream mb-6">
            Talk to the framework first.
          </p>

          <p className="text-sm text-cream/40 mb-10 leading-relaxed">
            The Mirror is a philosophical conversation partner. Ask it anything.
            Challenge it. Push back. It sees connections you haven't seen —
            and it speaks in whatever language your belief system understands.
          </p>

          <a href="/mirror" className="btn btn-secondary">
            Enter the Mirror
          </a>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section className="relative py-24 px-6 border-t border-gold/10">
        <div className="relative max-w-xl mx-auto text-center">
          <p className="text-[11px] text-gold/60 tracking-[0.3em] uppercase mb-8">
            Questions, Doubts, Pushback
          </p>

          <p className="text-sm text-cream/40 mb-8">
            If you've gone through the experience and want to talk about what came up,
            or if you're skeptical and want to challenge the framework — reach out.
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
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gold-glow opacity-20" />

        <div className="relative max-w-xl mx-auto text-center">
          <p className="font-serif text-xl text-cream/70 mb-10 leading-relaxed">
            What would your life look like if you realized — right now,
            with no further prerequisite — that you are already what
            you've been looking for?
          </p>

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
