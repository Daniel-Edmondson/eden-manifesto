'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { OBreathing, SacredGeometry } from '../components/OSymbol';

function OfferingContent() {
  const searchParams = useSearchParams();
  const fromJourney = searchParams.get('from') === 'journey';

  const [amount, setAmount] = useState(25);
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [hasAnswers, setHasAnswers] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('eden_answers');
      if (saved) setHasAnswers(true);
    }
  }, []);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amount * 100 }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handlePromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoError('');
    try {
      const res = await fetch('/api/verify-promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode.trim() }),
      });
      const data = await res.json();
      if (data.valid) {
        window.location.href = `/questionnaire?promo=${encodeURIComponent(promoCode.trim())}`;
      } else {
        setPromoError('Invalid code.');
      }
    } catch (err) {
      setPromoError('Something went wrong.');
    }
    setPromoLoading(false);
  };

  return (
    <main className="min-h-screen bg-white relative overflow-hidden">
      <SacredGeometry opacity={0.04} />

      <section className="relative py-24 md:py-32 px-6 z-10">
        <div className="max-w-lg mx-auto text-center page-enter">
          <div className="mb-10">
            <OBreathing size={80} className="mx-auto" />
          </div>

          <h1 className="font-serif text-heading text-ink mb-4">
            Your document.
          </h1>

          <p className="text-lg text-ink-secondary leading-relaxed mb-12">
            {fromJourney
              ? 'Your answers are ready. Choose what feels right and your philosophical document will be generated from everything you said.'
              : 'A personalized philosophical document built from your answers and a framework designed to show you what was always there.'
            }
          </p>

          {!hasAnswers && !fromJourney && (
            <div className="mb-12 p-6 bg-surface-secondary rounded-2xl text-center">
              <p className="text-base text-ink-secondary mb-4">
                You haven't answered the questions yet.
              </p>
              <a href="/journey" className="btn btn-secondary text-base">
                Start with the questions &rarr;
              </a>
            </div>
          )}

          {/* Sliding scale */}
          <div className="mb-10">
            <p className="text-xs text-ink-secondary tracking-[0.2em] uppercase mb-6">Pay what feels right</p>

            <div className="relative mb-4">
              <input
                type="range"
                min="15"
                max="100"
                step="5"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-ink-tertiary mt-2">
                <span>$15</span>
                <span>$100</span>
              </div>
            </div>

            <p className="text-4xl font-light text-ink mb-1">
              ${amount}
            </p>
            <p className="text-sm text-ink-secondary">
              Every document is the same depth and quality regardless of amount.
            </p>
          </div>

          {/* Checkout button */}
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="btn btn-primary w-full mb-4 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {loading ? 'Redirecting...' : `Continue — $${amount}`}
          </button>

          <p className="text-sm text-ink-tertiary mb-8">
            Secure payment via Stripe. You'll complete the questionnaire after checkout.
          </p>

          {/* Promo code */}
          <div className="pt-6 border-t border-black/[0.1]">
            <p className="text-sm text-ink-secondary mb-4">Have a promo code?</p>
            <div className="flex items-center gap-2 justify-center">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => { setPromoCode(e.target.value); setPromoError(''); }}
                placeholder="Enter code"
                className="w-40 px-4 py-2.5 bg-surface-secondary border border-black/[0.12] text-base text-ink text-center focus:border-black/[0.25] transition-colors rounded-full placeholder:text-ink-tertiary"
              />
              <button
                onClick={handlePromo}
                disabled={promoLoading}
                className="btn btn-secondary text-sm py-2.5 px-5 disabled:opacity-30"
              >
                {promoLoading ? '...' : 'Apply'}
              </button>
            </div>
            {promoError && (
              <p className="mt-2 text-sm text-red-500">{promoError}</p>
            )}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="relative py-20 px-6 bg-surface-secondary z-10">
        <div className="relative max-w-lg mx-auto">
          <p className="text-xs text-ink-secondary tracking-[0.3em] uppercase mb-8 text-center">
            What You Receive
          </p>

          <div className="space-y-6 text-base text-ink-secondary leading-relaxed">
            <p>
              A philosophical document generated from your answers, a framework built
              over a decade, and references drawn from across every tradition — philosophy,
              theology, science, literature.
            </p>

            <p>
              This isn't AI-generated filler. The framework is human. The AI is the
              delivery mechanism — it synthesizes your answers with a specific
              philosophical system to produce something that could only be written
              for you.
            </p>

            <p>
              The document is a conversation between what you said, what the framework
              sees in it, and what thinkers across centuries have said about the same
              things. 5,000+ words of genuine philosophical engagement with your life.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="relative py-16 px-6 text-center z-10">
        <p className="text-base text-ink-tertiary mb-2">Questions?</p>
        <a
          href="mailto:danieledmondson45@gmail.com"
          className="text-base text-ink-secondary hover:text-ink transition-colors"
        >
          danieledmondson45@gmail.com
        </a>
      </section>
    </main>
  );
}

export default function OfferingPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-ink-secondary animate-pulse-soft">Loading...</p>
      </main>
    }>
      <OfferingContent />
    </Suspense>
  );
}
