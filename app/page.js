'use client';

import { useState } from 'react';

export default function Home() {
  const [selectedAmount, setSelectedAmount] = useState(2000);
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState('');

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const amount = customAmount ? Math.max(2000, parseInt(customAmount) * 100) : selectedAmount;
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-6 py-24 md:py-32">
        <div className="max-w-2xl">
          <p className="text-sm tracking-[0.3em] uppercase text-gray-400 mb-12 animate-fade-in">
            The Eden Project
          </p>

          <h1 className="text-3xl md:text-5xl font-light leading-tight mb-8 animate-fade-in-delay-1">
            You already know<br />
            something is true<br />
            that you can&rsquo;t yet say.
          </h1>

          <div className="space-y-6 text-lg text-gray-700 leading-relaxed animate-fade-in-delay-2">
            <p>
              There is something at the edge of your thinking that you&rsquo;ve
              been circling for years. A pattern. A suspicion. A feeling that
              the answer to every question you&rsquo;ve ever had is somehow
              the same answer.
            </p>

            <p>
              I&rsquo;ve spent a decade exploring the edges of consciousness
              &mdash; through hallucinogens, through philosophy, through the
              kind of searching that leaves marks. And on the other side, I
              found a logical framework that I believe maps the structure of
              transcendence itself.
            </p>

            <p>
              Not a self-help book. Not a listicle. A personal document
              written for you &mdash; about your life, your struggle, your
              specific relationship with the truth &mdash; using a logic
              that has taken me a decade of relentless exploration to find.
            </p>

            <p className="text-black font-medium">
              Tell me who you are. I&rsquo;ll tell you what you already know.
            </p>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="border-t border-gray-100 px-6 py-24">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-sm tracking-[0.3em] uppercase text-gray-400 mb-12">
            What you receive
          </h2>

          <div className="space-y-8 text-gray-700">
            <div>
              <p className="text-black font-medium mb-2">A custom manifesto.</p>
              <p>
                Not a template with your name pasted in. A document that takes
                your specific answers &mdash; your struggles, your beliefs,
                your unfinished questions &mdash; and runs them through a
                philosophical framework that maps the structure of transcendence
                across every binary you&rsquo;ve ever been trapped in.
              </p>
            </div>

            <div>
              <p className="text-black font-medium mb-2">The logic, applied to your life.</p>
              <p>
                The framework works like this: every conflict in your life
                has three positions, not two. The binary you&rsquo;re stuck in,
                the paradox that dissolves it, and the transcendence that was
                always already there. Your manifesto maps this to the exact
                territory of your mind.
              </p>
            </div>

            <div>
              <p className="text-black font-medium mb-2">A PDF you&rsquo;ll keep.</p>
              <p>
                Delivered immediately. Beautifully formatted. Something you
                can return to when the noise gets loud. Roughly 3,000&ndash;4,000
                words written specifically for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="border-t border-gray-100 px-6 py-24">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-sm tracking-[0.3em] uppercase text-gray-400 mb-12">
            Who writes this
          </h2>

          <div className="space-y-6 text-gray-700">
            <p>
              My name is Daniel Edmondson. I&rsquo;m a writer, not a guru.
              I have an English degree, a decade of hallucinogenic
              experimentation, and hundreds of pages of philosophical
              writing that nobody asked me to produce.
            </p>

            <p>
              What I found in that work is a logical framework &mdash; not
              a feeling, not a vibe, an actual structure &mdash; that I believe
              maps how transcendence works. This project is my attempt to make
              it useful for someone other than me.
            </p>

            <p className="text-black">
              The Eden Project is the idea that heaven is already here,
              and the only thing between you and it is a logic you
              haven&rsquo;t seen yet.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing — at the bottom */}
      <section className="border-t border-gray-100 px-6 py-24">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm text-gray-500 mb-6">
            Choose what feels right. Every manifesto gets the same depth.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {[
              { label: '$20', value: 2000 },
              { label: '$50', value: 5000 },
              { label: '$100', value: 10000 },
            ].map(({ label, value }) => (
              <button
                key={value}
                onClick={() => { setSelectedAmount(value); setCustomAmount(''); }}
                className={`px-6 py-3 border text-sm transition-all duration-200 ${
                  selectedAmount === value && !customAmount
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-gray-300 hover:border-black'
                }`}
              >
                {label}
              </button>
            ))}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
              <input
                type="number"
                min="20"
                placeholder="Other"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(0);
                }}
                className="w-28 pl-7 pr-3 py-3 border border-gray-300 text-sm focus:border-black transition-colors"
              />
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="px-12 py-4 bg-black text-white text-sm tracking-wide hover:bg-gray-900 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Redirecting to checkout...' : 'Get Your Manifesto'}
          </button>

          <p className="mt-4 text-xs text-gray-400">
            Secure payment via Stripe. You&rsquo;ll answer a questionnaire after checkout.
          </p>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex justify-center items-center gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => { setPromoCode(e.target.value); setPromoError(''); }}
                placeholder="Promo code"
                className="w-40 px-3 py-2 border border-gray-300 text-sm text-center focus:border-black transition-colors"
              />
              <button
                onClick={async () => {
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
                      setPromoError('Invalid code');
                    }
                  } catch (err) {
                    setPromoError('Something went wrong');
                  }
                  setPromoLoading(false);
                }}
                disabled={promoLoading}
                className="px-4 py-2 border border-gray-300 text-sm text-gray-600 hover:border-black hover:text-black transition-colors disabled:text-gray-300"
              >
                {promoLoading ? '...' : 'Apply'}
              </button>
            </div>
            {promoError && (
              <p className="mt-2 text-xs text-red-500 text-center">{promoError}</p>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-12">
        <div className="max-w-2xl mx-auto flex justify-between items-center text-xs text-gray-400">
          <span>The Eden Project &copy; {new Date().getFullYear()}</span>
          <a href="mailto:danieledmondson45@gmail.com" className="hover:text-black transition-colors">
            Contact
          </a>
        </div>
      </footer>
    </main>
  );
}
