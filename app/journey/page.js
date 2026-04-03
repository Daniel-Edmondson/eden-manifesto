'use client';

import { useState, useEffect, useRef } from 'react';
import { OProgress, OBreathing, SacredGeometry } from '../components/OSymbol';
import { questions, resolveLabel, getVisibleQuestions } from '../../lib/questions';

export default function JourneyPage() {
  const [answers, setAnswers] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [started, setStarted] = useState(false);
  const inputRef = useRef(null);

  const visibleQuestions = getVisibleQuestions(answers);
  const current = visibleQuestions[currentIdx];
  const totalQuestions = visibleQuestions.length;
  const progress = totalQuestions > 0 ? (currentIdx + 1) / totalQuestions : 0;
  const isLast = currentIdx === totalQuestions - 1;

  useEffect(() => {
    if (started && (current?.type === 'text' || current?.type === 'textarea')) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [currentIdx, started]);

  const canProceed = current && (
    (current.type === 'select' && answers[current.id]) ||
    (current.type !== 'select' && answers[current.id]?.trim().length > 0)
  );

  const goNext = () => {
    if (!canProceed) return;
    if (isLast) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('eden_answers', JSON.stringify(answers));
      }
      window.location.href = '/offering?from=journey';
      return;
    }
    setTransitioning(true);
    setTimeout(() => {
      setCurrentIdx(currentIdx + 1);
      setTransitioning(false);
    }, 300);
  };

  const goBack = () => {
    if (currentIdx <= 0) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrentIdx(currentIdx - 1);
      setTransitioning(false);
    }, 300);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && current?.type === 'text' && canProceed) {
      e.preventDefault();
      goNext();
    }
  };

  // Pre-start screen
  if (!started) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-white relative overflow-hidden">
        <SacredGeometry opacity={0.02} />

        <div className="relative max-w-md text-center page-enter z-10">
          <div className="mb-10">
            <OBreathing size={80} className="mx-auto" />
          </div>

          <p className="text-[11px] text-ink-tertiary tracking-[0.3em] uppercase mb-8">
            The Eden Project
          </p>

          <h1 className="font-serif text-heading text-ink mb-6">
            Fifteen questions.
          </h1>

          <p className="text-base text-ink-secondary leading-relaxed mb-4">
            Open-ended. They adapt to what you say. There are no right answers.
            The only thing that matters is honesty.
          </p>

          <p className="text-sm text-ink-tertiary mb-12">
            Your responses shape a personalized document written
            specifically for you.
          </p>

          <button
            onClick={() => setStarted(true)}
            className="btn btn-primary"
          >
            Begin
          </button>
        </div>
      </main>
    );
  }

  if (!current) return null;

  const label = resolveLabel(current, answers);

  return (
    <main className="min-h-screen flex flex-col bg-white relative">
      {/* Progress ring */}
      <div className="fixed top-20 right-6 z-30 flex flex-col items-center">
        <OProgress progress={progress} size={40} />
        <p className="text-[10px] text-ink-tertiary mt-1">
          {currentIdx + 1}/{totalQuestions}
        </p>
      </div>

      {/* Thin progress bar */}
      <div className="fixed top-14 left-0 right-0 z-40">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>

      {/* Main content */}
      <div className="relative flex-1 flex items-center justify-center px-6 py-24 z-10">
        <div
          className={`max-w-xl w-full transition-all duration-350 ${
            transitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}
          key={current.id}
        >
          <p className="text-[11px] text-ink-tertiary mb-6 tracking-[0.2em]">
            {currentIdx + 1} of {totalQuestions}
          </p>

          <label className="block font-serif text-xl md:text-2xl text-ink leading-relaxed mb-8">
            {label}
          </label>

          {/* Text input */}
          {current.type === 'text' && (
            <input
              ref={inputRef}
              type="text"
              value={answers[current.id] || ''}
              onChange={(e) => setAnswers({ ...answers, [current.id]: e.target.value })}
              onKeyDown={handleKeyDown}
              placeholder={current.placeholder}
              className="w-full bg-transparent border-b border-black/[0.1] py-3 text-lg text-ink placeholder:text-ink-faint focus:border-black/[0.3] transition-colors"
            />
          )}

          {/* Textarea */}
          {current.type === 'textarea' && (
            <textarea
              ref={inputRef}
              value={answers[current.id] || ''}
              onChange={(e) => setAnswers({ ...answers, [current.id]: e.target.value })}
              placeholder={current.placeholder}
              rows={4}
              className="w-full bg-surface-secondary border border-black/[0.06] rounded-xl p-4 text-base text-ink placeholder:text-ink-faint resize-none focus:border-black/[0.15] transition-colors"
            />
          )}

          {/* Select */}
          {current.type === 'select' && current.options && (
            <div className="space-y-2">
              {current.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setAnswers({ ...answers, [current.id]: opt.value });
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all text-sm leading-relaxed ${
                    answers[current.id] === opt.value
                      ? 'border-ink bg-ink text-white'
                      : 'border-black/[0.06] bg-surface-secondary text-ink-secondary hover:border-black/[0.12]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-10">
            <button
              onClick={goBack}
              className={`text-sm text-ink-tertiary hover:text-ink transition-colors ${
                currentIdx === 0 ? 'invisible' : ''
              }`}
            >
              &larr; Back
            </button>

            <button
              onClick={goNext}
              disabled={!canProceed}
              className="btn btn-primary disabled:opacity-20 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {isLast ? 'Continue to your document' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
