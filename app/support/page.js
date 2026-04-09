'use client';

import { useEffect, useState, useRef } from 'react';
import { OBreathing, SacredGeometry } from '../components/OSymbol';

export default function SupportPage() {
  const [visible, setVisible] = useState(false);
  const [shifted, setShifted] = useState('');
  const [cardGenerated, setCardGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const generateShareCard = () => {
    if (!shifted.trim()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const w = 1200;
    const h = 630;
    canvas.width = w;
    canvas.height = h;

    // Background — tan
    ctx.fillStyle = '#c8b896';
    ctx.fillRect(0, 0, w, h);

    // O symbol — large centered circle
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 200, 0, Math.PI * 2);
    ctx.stroke();

    // Inner circle
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 130, 0, Math.PI * 2);
    ctx.stroke();

    // Header
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '14px sans-serif';
    ctx.letterSpacing = '6px';
    ctx.textAlign = 'center';
    ctx.fillText('T H E   E D E N   P R O J E C T', w / 2, 80);

    // User's words — wrap text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic 28px serif';
    ctx.textAlign = 'center';
    const words = shifted.trim().split(' ');
    const lines = [];
    let currentLine = '';
    const maxWidth = w - 200;

    for (const word of words) {
      const testLine = currentLine ? currentLine + ' ' + word : word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);

    const lineHeight = 42;
    const startY = h / 2 - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((line, i) => {
      ctx.fillText(line, w / 2, startY + i * lineHeight);
    });

    // Footer
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '13px sans-serif';
    ctx.fillText('What shifted.', w / 2, h - 60);

    setCardGenerated(true);
  };

  const downloadCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'eden-what-shifted.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const copyShareText = () => {
    const text = `"${shifted.trim()}"\n\nThe Eden Project — a philosophical experience built around you.\nhttps://edenproject.app/mirror`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <main className="min-h-screen bg-surface relative overflow-hidden">
      <SacredGeometry opacity={0.05} />

      <div className={`relative z-10 max-w-2xl mx-auto px-6 py-24 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

        {/* Symbol */}
        <div className="flex justify-center mb-16">
          <OBreathing size={60} />
        </div>

        {/* ===== WHAT SHIFTED — SHARING MECHANISM ===== */}
        <div className="mb-16">
          <h1 className="font-serif text-3xl md:text-4xl text-ink text-center mb-6 leading-relaxed">
            What shifted?
          </h1>

          <p className="text-base md:text-lg text-ink-secondary text-center mb-8 leading-relaxed max-w-lg mx-auto">
            One sentence. What changed — even slightly — in how you see things?
            If something moved, name it. That's how this spreads.
          </p>

          <div className="max-w-lg mx-auto">
            <textarea
              value={shifted}
              onChange={(e) => { setShifted(e.target.value); setCardGenerated(false); }}
              placeholder="I realized that..."
              rows={3}
              maxLength={280}
              className="w-full bg-surface-secondary border border-white/[0.15] rounded-xl p-4 text-lg text-ink placeholder:text-ink-tertiary resize-none focus:border-white/[0.3] transition-colors mb-4"
            />

            <div className="flex items-center justify-between">
              <span className="text-xs text-ink-tertiary">{shifted.length}/280</span>
              <button
                onClick={generateShareCard}
                disabled={!shifted.trim()}
                className="btn btn-primary text-sm disabled:opacity-20 disabled:cursor-not-allowed"
              >
                Create share card
              </button>
            </div>

            {/* Generated card preview */}
            {cardGenerated && (
              <div className="mt-8 space-y-4">
                <canvas
                  ref={canvasRef}
                  className="w-full rounded-xl border border-white/[0.15]"
                  style={{ aspectRatio: '1200/630' }}
                />
                <div className="flex gap-3 justify-center">
                  <button onClick={downloadCard} className="btn btn-secondary text-sm">
                    Download image
                  </button>
                  <button onClick={copyShareText} className="btn btn-secondary text-sm">
                    {copied ? 'Copied!' : 'Copy share text'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hidden canvas for generation */}
        {!cardGenerated && <canvas ref={canvasRef} className="hidden" />}

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
            It is an attempt to replicate the unrepeatable:
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

        {/* Re-entry */}
        <div className="text-center space-y-4">
          <p className="font-serif text-ink-secondary text-base italic">
            Read the document again in thirty days.
            <br />
            Come back to the Mirror. Say what shifted.
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
