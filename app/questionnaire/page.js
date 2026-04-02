'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { OProgress, OBreathing } from '../components/OSymbol';
import { questions, resolveLabel, getVisibleQuestions } from '../../lib/questions';

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
  const inputRef = useRef(null);

  // Load saved journey answers
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('eden_answers');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setAnswers(parsed);
          // Skip to first unanswered
          const visible = getVisibleQuestions(parsed);
          const firstEmpty = visible.findIndex(q => !parsed[q.id] || (typeof parsed[q.id] === 'string' && parsed[q.id].trim() === ''));
          if (firstEmpty > 0) setCurrentQ(firstEmpty);
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
        setGenerationStatus(`Writing your document... (${words.toLocaleString()} words)`);
      }

      if (!text || text.length < 100) {
        throw new Error('Generation returned empty. Contact danieledmondson45@gmail.com');
      }

      setGenerationStatus('Formatting PDF...');

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
      <main className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-eden-400 animate-pulse-soft">Verifying...</p>
      </main>
    );
  }

  if ((!sessionId && !promoCode) || !verified) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-white">
        <div className="max-w-md text-center">
          <p className="text-eden-500 mb-4">Payment required.</p>
          <a href="/offering" className="text-sm text-eden-600 hover:text-eden-900 transition-colors">
            &larr; Return to offering
          </a>
        </div>
      </main>
    );
  }

  // Download ready
  if (downloadUrl) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-white">
        <div className="max-w-md text-center page-enter">
          <OBreathing size={80} className="mx-auto mb-10" />

          <h1 className="font-serif text-heading text-eden-900 mb-4">
            Your document is ready.
          </h1>

          <p className="text-base text-eden-500 mb-10">
            This was written for you, {answers.name || 'friend'}.
          </p>

          <a
            href={downloadUrl}
            download={`Eden-${(answers.name || 'yours').replace(/\s/g, '-')}.pdf`}
            className="btn btn-primary"
          >
            Download PDF
          </a>

          <p className="mt-10 text-xs text-eden-400">
            Questions? <a href="mailto:danieledmondson45@gmail.com" className="hover:text-eden-700 transition-colors">danieledmondson45@gmail.com</a>
          </p>
        </div>
      </main>
    );
  }

  // Error
  if (error && !generating) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-white">
        <div className="max-w-md text-center page-enter">
          <p className="text-lg text-eden-700 mb-4">Something went wrong.</p>
          <p className="text-sm text-eden-500 mb-8">{error}</p>
          <button onClick={() => { setError(null); handleSubmit(); }}
            className="btn btn-primary mr-3">
            Try again
          </button>
          <a href="mailto:danieledmondson45@gmail.com" className="text-sm text-eden-500 hover:text-eden-800">
            Contact Daniel
          </a>
        </div>
      </main>
    );
  }

  // Generating
  if (generating) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-white">
        <div className="text-center page-enter">
          <OBreathing size={60} className="mx-auto mb-8" />
          <p className="text-base text-eden-600 mb-2">{generationStatus}</p>
          <p className="text-sm text-eden-400">
            This takes about 60–90 seconds.
          </p>
        </div>
      </main>
    );
  }

  if (!currentQuestion) return null;

  const label = resolveLabel(currentQuestion, answers);

  // Questionnaire
  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Progress */}
      <div className="fixed top-20 right-6 z-30">
        <OProgress progress={progress} size={40} />
        <p className="text-[10px] text-eden-400 text-center mt-1">
          {currentQ + 1}/{visibleQuestions.length}
        </p>
      </div>

      <div className="fixed top-14 left-0 right-0 z-40">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-xl w-full question-enter" key={currentQ}>
          <p className="text-xs text-eden-400 mb-6 tracking-wide">
            {currentQ + 1} of {visibleQuestions.length}
          </p>

          <label className="block font-serif text-xl md:text-2xl text-eden-800 mb-8 leading-relaxed">
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
              className="w-full bg-transparent border-b border-eden-200 py-3 text-lg text-eden-800 placeholder:text-eden-300 focus:border-eden-900 transition-colors"
            />
          )}

          {currentQuestion.type === 'textarea' && (
            <textarea
              ref={inputRef}
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
              placeholder={currentQuestion.placeholder}
              rows={4}
              className="w-full bg-eden-50 border border-eden-200 rounded-lg p-4 text-base text-eden-800 placeholder:text-eden-300 resize-none focus:border-eden-500 transition-colors"
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
                      ? 'border-eden-900 bg-eden-900 text-white'
                      : 'border-eden-200 bg-white text-eden-600 hover:border-eden-400'
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
              className={`text-sm text-eden-400 hover:text-eden-700 transition-colors ${currentQ === 0 ? 'invisible' : ''}`}
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
      <main className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-eden-400 animate-pulse-soft">Loading...</p>
      </main>
    }>
      <QuestionnaireContent />
    </Suspense>
  );
}
