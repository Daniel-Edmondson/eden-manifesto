'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { OProgress, OBreathing, AwakeningSequence, SacredGeometry } from '../components/OSymbol';
import { questions, resolveLabel, getVisibleQuestions } from '../../lib/questions';

// Awakening messages shown during generation
const AWAKENING_MESSAGES = [
  'Reading your answers...',
  'Finding the threads...',
  'Building your triad...',
  'Drawing from the traditions...',
  'Weaving the connections...',
  'The framework meets your words...',
  'Something is taking shape...',
  'Almost there...',
];

function QuestionnaireContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const promoCode = searchParams.get('promo');

  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [generating, setGenerating] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState(null);
  const [generationStatus, setGenerationStatus] = useState('');
  const [awakeningPhase, setAwakeningPhase] = useState(0);
  const [awakeningMsg, setAwakeningMsg] = useState(0);
  const inputRef = useRef(null);

  // Load saved journey answers
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('eden_answers');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setAnswers(parsed);
          // Skip to first unanswered — or if all answered, jump to last (triggers submit)
          const visible = getVisibleQuestions(parsed);
          const firstEmpty = visible.findIndex(q => !parsed[q.id] || (typeof parsed[q.id] === 'string' && parsed[q.id].trim() === ''));
          if (firstEmpty === -1) {
            // All questions answered — jump to last so "Generate" is visible
            setCurrentQ(visible.length - 1);
          } else if (firstEmpty > 0) {
            setCurrentQ(firstEmpty);
          }
        } catch (e) {}
      }
    }
  }, []);

  // Verify payment or promo
  useEffect(() => {
    if (sessionId) { setVerified(true); setVerifying(false); }
    else if (promoCode) {
      fetch('/api/verify-promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode }),
      }).then(r => r.json()).then(d => { setVerified(d.valid); setVerifying(false); }).catch(() => setVerifying(false));
    } else {
      setVerifying(false);
    }
  }, [sessionId, promoCode]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 200);
  }, [currentQ]);

  // Awakening sequence progression during generation
  useEffect(() => {
    if (!generating) return;

    const phaseTimer = setInterval(() => {
      setAwakeningPhase(prev => Math.min(prev + 1, 3));
    }, 15000);

    const msgTimer = setInterval(() => {
      setAwakeningMsg(prev => (prev + 1) % AWAKENING_MESSAGES.length);
    }, 8000);

    return () => {
      clearInterval(phaseTimer);
      clearInterval(msgTimer);
    };
  }, [generating]);

  const visibleQuestions = getVisibleQuestions(answers);
  const currentQuestion = visibleQuestions[currentQ];
  const isLast = currentQ === visibleQuestions.length - 1;
  const canProceed = currentQuestion && (
    (currentQuestion.type === 'select' && answers[currentQuestion.id]) ||
    (currentQuestion.type !== 'select' && answers[currentQuestion.id]?.trim().length > 0)
  );
  const progress = visibleQuestions.length > 0 ? (currentQ + 1) / visibleQuestions.length : 0;

  const handleNext = () => {
    if (isLast) handleSubmit();
    else setCurrentQ(currentQ + 1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && currentQuestion?.type === 'text' && canProceed) {
      e.preventDefault();
      handleNext();
    }
  };

  const handleSubmit = async () => {
    setGenerating(true);
    setError(null);
    setGenerationStatus('Writing your document...');
    setAwakeningPhase(0);
    setAwakeningMsg(0);

    try {
      const textRes = await fetch('/api/generate-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });

      if (!textRes.ok) {
        const errData = await textRes.json().catch(() => ({}));
        throw new Error(errData.error || 'Generation failed. Contact danieledmondson45@gmail.com');
      }

      const reader = textRes.body.getReader();
      const decoder = new TextDecoder();
      let text = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        const words = text.split(/\s+/).length;
        setGenerationStatus(`${words.toLocaleString()} words and counting...`);
      }

      if (!text || text.length < 100) {
        throw new Error('Generation returned empty. Contact danieledmondson45@gmail.com');
      }

      setGenerationStatus('Formatting your PDF...');
      setAwakeningPhase(3);

      const pdfRes = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, name: answers.name }),
      });

      if (!pdfRes.ok) throw new Error('PDF formatting failed.');

      const blob = await pdfRes.blob();
      setDownloadUrl(URL.createObjectURL(blob));
      setGenerationStatus('');
      if (typeof window !== 'undefined') sessionStorage.removeItem('eden_answers');
    } catch (err) {
      console.error(err);
      setError(err.message);
      setGenerating(false);
    }
  };

  // Loading states
  if (verifying) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-midnight">
        <p className="text-cream/30 animate-pulse-soft">Verifying...</p>
      </main>
    );
  }

  if ((!sessionId && !promoCode) || !verified) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-midnight">
        <div className="max-w-md text-center">
          <p className="text-cream/50 mb-4">Payment required.</p>
          <a href="/offering" className="text-sm text-gold/60 hover:text-gold transition-colors">
            &larr; Return to offering
          </a>
        </div>
      </main>
    );
  }

  // Download ready
  if (downloadUrl) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-midnight relative overflow-hidden">
        <div className="absolute inset-0 bg-void" />
        <div className="absolute inset-0 bg-gold-glow opacity-20" />
        <SacredGeometry opacity={0.03} />

        <div className="relative max-w-md text-center page-enter z-10">
          <OBreathing size={80} className="mx-auto mb-10" />

          <h1 className="font-serif text-heading text-cream mb-4">
            Your document is ready.
          </h1>

          <p className="text-base text-cream/50 mb-10">
            This was written for you, {answers.name || 'friend'}.
          </p>

          <a
            href={downloadUrl}
            download={`Eden-${(answers.name || 'yours').replace(/\s/g, '-')}.pdf`}
            className="btn btn-primary"
          >
            Download PDF
          </a>

          <p className="mt-10 text-xs text-cream/25">
            Questions? <a href="mailto:danieledmondson45@gmail.com" className="hover:text-gold transition-colors">danieledmondson45@gmail.com</a>
          </p>
        </div>
      </main>
    );
  }

  // Error
  if (error && !generating) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-midnight">
        <div className="max-w-md text-center page-enter">
          <p className="text-lg text-cream/80 mb-4">Something went wrong.</p>
          <p className="text-sm text-cream/40 mb-8">{error}</p>
          <button onClick={() => { setError(null); handleSubmit(); }}
            className="btn btn-primary mr-3">
            Try again
          </button>
          <a href="mailto:danieledmondson45@gmail.com" className="text-sm text-cream/40 hover:text-gold">
            Contact Daniel
          </a>
        </div>
      </main>
    );
  }

  // ===== AWAKENING SEQUENCE — during generation =====
  if (generating) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-midnight relative overflow-hidden">
        <div className="absolute inset-0 bg-void" />
        <div className="absolute inset-0 bg-gold-glow opacity-30" />
        <div className="absolute inset-0 bg-stars" />

        <div className="relative text-center z-10">
          {/* The awakening visualization */}
          <div className="mb-12">
            <AwakeningSequence phase={awakeningPhase} />
          </div>

          {/* Rotating messages */}
          <p className="text-base text-gold font-serif mb-2 transition-opacity duration-1000">
            {AWAKENING_MESSAGES[awakeningMsg]}
          </p>

          <p className="text-sm text-cream/30 mb-2">
            {generationStatus}
          </p>

          <p className="text-xs text-cream/20">
            This takes about 60-90 seconds. Something real is being written.
          </p>
        </div>
      </main>
    );
  }

  if (!currentQuestion) return null;

  const label = resolveLabel(currentQuestion, answers);

  // Questionnaire
  return (
    <main className="min-h-screen flex flex-col bg-midnight relative">
      <div className="fixed inset-0 bg-void pointer-events-none" />

      {/* Progress */}
      <div className="fixed top-20 right-6 z-30">
        <OProgress progress={progress} size={40} />
        <p className="text-[10px] text-gold/40 text-center mt-1">
          {currentQ + 1}/{visibleQuestions.length}
        </p>
      </div>

      <div className="fixed top-14 left-0 right-0 z-40">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>

      <div className="relative flex-1 flex items-center justify-center px-6 py-24 z-10">
        <div className="max-w-xl w-full question-enter" key={currentQ}>
          <p className="text-[11px] text-gold/40 mb-6 tracking-[0.2em]">
            {currentQ + 1} of {visibleQuestions.length}
          </p>

          <label className="block font-serif text-xl md:text-2xl text-cream mb-8 leading-relaxed">
            {label}
          </label>

          {currentQuestion.type === 'text' && (
            <input
              ref={inputRef}
              type="text"
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
              onKeyDown={handleKeyDown}
              placeholder={currentQuestion.placeholder}
              className="w-full bg-transparent border-b border-gold/20 py-3 text-lg text-cream placeholder:text-cream/20 focus:border-gold/60 transition-colors"
            />
          )}

          {currentQuestion.type === 'textarea' && (
            <textarea
              ref={inputRef}
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
              placeholder={currentQuestion.placeholder}
              rows={4}
              className="w-full bg-midnight-light border border-gold/10 rounded-lg p-4 text-base text-cream placeholder:text-cream/20 resize-none focus:border-gold/30 transition-colors"
            />
          )}

          {currentQuestion.type === 'select' && currentQuestion.options && (
            <div className="space-y-2">
              {currentQuestion.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setAnswers({ ...answers, [currentQuestion.id]: opt.value })}
                  className={`w-full text-left p-4 rounded-lg border transition-all text-sm leading-relaxed ${
                    answers[currentQuestion.id] === opt.value
                      ? 'border-gold bg-gold/10 text-cream'
                      : 'border-gold/10 bg-midnight-light text-cream/60 hover:border-gold/30'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center mt-10">
            <button
              onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
              className={`text-sm text-cream/30 hover:text-gold transition-colors ${currentQ === 0 ? 'invisible' : ''}`}
            >
              &larr; Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className="btn btn-primary disabled:opacity-20 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {isLast ? 'Generate my document' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function QuestionnairePage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-midnight">
        <p className="text-cream/30 animate-pulse-soft">Loading...</p>
      </main>
    }>
      <QuestionnaireContent />
    </Suspense>
  );
}
