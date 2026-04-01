'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { OBreathing, ParticleField, TriadDots } from '../components/OSymbol';

function OfferingContent() {
  const searchParams = useSearchParams();
  const preselectedTier = searchParams.get('tier');
  const fromJourney = searchParams.get('journey') === 'complete';
  const visitorName = searchParams.get('name') || '';

  const [selectedTier, setSelectedTier] = useState(preselectedTier || 'deep');
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState('');

  const tiers = [
    {
      id: 'essential',
      name: 'Essential',
      price: 20,
      words: '4,000–5,000',
      description: 'The core philosophical guidebook',
      features: [
        'Personalized triadic analysis of your central tension',
        'Faith-specific philosophical integration',
        'The control argument applied to your life',
        'Beautiful PDF delivered instantly',
      ],
    },
    {
      id: 'deep',
      name: 'Deep',
      price: 50,
      words: '7,000–9,000',
      description: 'The expanded philosophical companion',
      featured: true,
      features: [
        'Everything in Essential',
        'Extended exploration of multiple life tensions',
        'Novel philosophical connections across traditions',
        'The psychedelic thesis applied to your consciousness',
        'Diamond art and spiral analysis',
      ],
    },
    {
      id: 'complete',
      name: 'Complete',
      price: 100,
      words: '10,000–12,000',
      description: 'The full theory of everything',
      features: [
        'Everything in Deep',
        'Comprehensive theory of everything for your life',
        'Full exploration of all your responses',
        'Extended cross-traditional connections',
        'The tree, the spiral, the sacred mundane — all applied',
        'The O: your personal symbol of completion',
      ],
    },
  ];

  const currentTier = tiers.find(t => t.id === selectedTier) || tiers[1];

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: currentTier.price * 100,
          tier: currentTier.id,
        }),
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
        window.location.href = `/questionnaire?promo=${encodeURIComponent(promoCode.trim())}&tier=${selectedTier}`;
      } else {
        setPromoError('Invalid code');
      }
    } catch (err) {
      setPromoError('Something went wrong');
    }
    setPromoLoading(false);
  };

  return (
    <main className="min-h-screen bg-eden-dark relative">
      <ParticleField count={15} />

      {/* Hero */}
      <section className="relative py-24 md:py-32 px-6 text-center">
        <div className="relative z-10">
          {fromJourney && visitorName && (
            <p className="text-sm text-gold/40 mb-4 animate-fade-in">
              {visitorName}, your journey is ready to become a document.
            </p>
          )}

          <OBreathing size={100} className="mx-auto mb-8 animate-fade-in" />

          <h1 className="font-serif text-3xl md:text-5xl font-light text-white/70 mb-6 animate-fade-in-d1">
            The Philosophical Guidebook
          </h1>

          <p className="text-white/25 text-base max-w-xl mx-auto leading-relaxed animate-fade-in-d2">
            A personal theory of everything, written for your life.
            Not a template. Not generated content. A document built from a framework
            it took a decade to find, applied to what you actually said.
          </p>
        </div>
      </section>

      {/* Tiers */}
      <section className="py-12 px-4 md:px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <button
              key={tier.id}
              onClick={() => setSelectedTier(tier.id)}
              className={`tier-card text-left p-8 rounded-lg transition-all ${
                selectedTier === tier.id
                  ? tier.featured
                    ? 'tier-card-featured glass'
                    : 'glass border border-gold/30'
                  : 'glass border border-transparent hover:border-white/10'
              }`}
            >
              {tier.featured && (
                <div className="text-[10px] tracking-[0.2em] uppercase text-gold/60 mb-3">
                  Most Popular
                </div>
              )}
              <p className={`text-xs tracking-[0.2em] uppercase mb-2 ${
                selectedTier === tier.id ? 'text-gold/70' : 'text-white/30'
              }`}>
                {tier.name}
              </p>
              <p className={`text-4xl font-light mb-1 ${
                selectedTier === tier.id ? 'text-gold' : 'text-white/60'
              }`}>
                ${tier.price}
              </p>
              <p className="text-xs text-white/20 mb-6">{tier.words} words</p>

              <p className="text-sm text-white/30 mb-4">{tier.description}</p>

              <ul className="space-y-2">
                {tier.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className={`mt-0.5 ${selectedTier === tier.id ? 'text-gold/50' : 'text-white/15'}`}>
                      ·
                    </span>
                    <span className="text-white/30">{f}</span>
                  </li>
                ))}
              </ul>

              {selectedTier === tier.id && (
                <div className="mt-6 pt-4 border-t border-gold/10">
                  <div className="w-2 h-2 rounded-full bg-gold mx-auto" />
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Checkout */}
      <section className="py-16 px-6">
        <div className="max-w-md mx-auto text-center">
          <p className="text-white/30 text-sm mb-6">
            {currentTier.name} — ${currentTier.price} — {currentTier.words} words
          </p>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full py-5 bg-gold/15 border border-gold/30 text-gold tracking-wider text-sm hover:bg-gold/25 transition-all btn-glow disabled:opacity-30 disabled:cursor-not-allowed rounded"
          >
            {loading ? 'Redirecting to checkout...' : `Get Your ${currentTier.name} Guidebook`}
          </button>

          <p className="mt-4 text-xs text-white/15">
            Secure payment via Stripe. A questionnaire follows checkout.
          </p>

          {/* Promo code */}
          <div className="mt-8 pt-6 border-t border-white/5">
            <div className="flex items-center gap-2 justify-center">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => { setPromoCode(e.target.value); setPromoError(''); }}
                placeholder="Promo code"
                className="w-36 px-3 py-2 bg-white/[0.03] border border-white/5 text-sm text-white/50 text-center focus:border-gold/20 transition-colors rounded"
              />
              <button
                onClick={handlePromo}
                disabled={promoLoading}
                className="px-4 py-2 border border-white/5 text-xs text-white/30 hover:border-gold/20 hover:text-gold/50 transition-colors rounded disabled:opacity-30"
              >
                {promoLoading ? '...' : 'Apply'}
              </button>
            </div>
            {promoError && (
              <p className="mt-2 text-xs text-red-400/60">{promoError}</p>
            )}
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <TriadDots dark className="mb-16" />

          <div className="grid md:grid-cols-2 gap-12 text-sm text-white/25 leading-relaxed">
            <div>
              <p className="text-white/40 font-serif text-lg mb-3">What makes this different</p>
              <p>
                This is not AI-generated content pasted into a PDF. The framework behind this
                took a decade to develop — a genuine philosophical system with its own logic,
                its own structure, its own way of seeing. The AI is the delivery mechanism.
                The philosophy is human.
              </p>
            </div>
            <div>
              <p className="text-white/40 font-serif text-lg mb-3">What you will receive</p>
              <p>
                A beautifully formatted PDF, delivered instantly after you complete the
                questionnaire. Pure prose — no bullet points, no headers, no lists.
                A document that reads like it was written by a philosopher who knows
                your life. Because in a real sense, it was.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 text-center">
        <p className="font-serif text-xl md:text-2xl text-white/30 max-w-md mx-auto mb-8">
          Eden is already here. The only thing between you and it
          is a way of seeing you have not found yet.
        </p>
        <a
          href="mailto:danieledmondson45@gmail.com"
          className="text-xs text-white/15 hover:text-gold/40 transition-colors tracking-wider"
        >
          Questions? danieledmondson45@gmail.com
        </a>
      </section>
    </main>
  );
}

export default function OfferingPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-eden-dark">
        <p className="text-white/20 animate-pulse-slow">Loading...</p>
      </main>
    }>
      <OfferingContent />
    </Suspense>
  );
}
