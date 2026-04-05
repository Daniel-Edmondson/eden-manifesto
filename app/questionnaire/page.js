'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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

// Session storage keys for generation persistence
const STORAGE_KEYS = {
  GENERATED_TEXT: 'eden_generated_text',
  PDF_BASE64: 'eden_pdf_base64',
  GEN_NAME: 'eden_gen_name',
  GEN_IN_PROGRESS: 'eden_gen_in_progress',
};

// Helper: convert blob to base64
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Helper: convert base64 back to blob (returns null on invalid input)
function base64ToBlob(base64) {
  try {
    const [header, data] = base64.split(',');
    if (!header || !data) return null;
    const match = header.match(/:(.*?);/);
    if (!match) return null;
    const mime = match[1];
    const bytes = atob(data);
    const arr = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
    return new Blob([arr], { type: mime });
  } catch (e) {
    console.error('base64ToBlob failed:', e);
    return null;
  }
}

function QuestionnaireContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
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
  const [recovering, setRecovering] = useState(false);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  // Global error safety net — catch unhandled promise rejections
  useEffect(() => {
    const handler = (event) => {
      console.error('Unhandled rejection caught:', event.reason);
      if (generating) {
        setError(event.reason?.message || 'Something went wrong during generation. Please try again.');
        setGenerating(false);
      }
    };
    window.addEventListener('unhandledrejection', handler);
    return () => window.removeEventListener('unhandledrejection', handler);
  }, [generating]);

  // Warn user before navigating away during generation
  useEffect(() => {
    if (!generating) return;
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [generating]);

  // On mount: check for recoverable state
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedPdf = sessionStorage.getItem(STORAGE_KEYS.PDF_BASE64);
      const savedText = sessionStorage.getItem(STORAGE_KEYS.GENERATED_TEXT);
      const savedName = sessionStorage.getItem(STORAGE_KEYS.GEN_NAME);

      if (savedPdf && savedName) {
        const blob = base64ToBlob(savedPdf);
        if (!blob) {
          // Corrupt PDF data — clear it and fall through to text recovery
          sessionStorage.removeItem(STORAGE_KEYS.PDF_BASE64);
        } else {
          setDownloadUrl(URL.createObjectURL(blob));
          setAnswers(prev => ({ ...prev, name: savedName }));
          setVerified(true);
          setVerifying(false);
          return;
        }
      }

      if (savedText && savedText.length > 100 && savedName) {
        setRecovering(true);
        setVerified(true);
        setVerifying(false);
        setAnswers(prev => ({ ...prev, name: savedName }));
        resumeFromText(savedText, savedName);
        return;
      }
    } catch (e) {
      console.error('Recovery failed:', e);
      // Clear potentially corrupt state
      try {
        sessionStorage.removeItem(STORAGE_KEYS.PDF_BASE64);
        sessionStorage.removeItem(STORAGE_KEYS.GENERATED_TEXT);
        sessionStorage.removeItem(STORAGE_KEYS.GEN_NAME);
        sessionStorage.removeItem(STORAGE_KEYS.GEN_IN_PROGRESS);
      } catch (_) {}
    }
  }, []);

  const resumeFromText = async (text, name) => {
    setGenerating(true);
    setError(null);
    setGenerationStatus('Resuming — formatting your PDF...');
    setAwakeningPhase(3);

    try {
      const pdfRes = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, name }),
      });

      if (!pdfRes.ok) throw new Error('PDF formatting failed.');

      const blob = await pdfRes.blob();
      const base64 = await blobToBase64(blob);
      sessionStorage.setItem(STORAGE_KEYS.PDF_BASE64, base64);

      setDownloadUrl(URL.createObjectURL(blob));
      setGenerationStatus('');
      setGenerating(false);
      setRecovering(false);
      sessionStorage.removeItem(STORAGE_KEYS.GEN_IN_PROGRESS);
    } catch (err) {
      console.error('Resume error:', err);
      setError(err?.message || 'PDF generation failed. Contact danieledmondson45@gmail.com');
      setGenerating(false);
      setRecovering(false);
    }
  };

  // Load saved journey answers — if all questions are answered, auto-generate
  const autoGenerateTriggered = useRef(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('eden_answers');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setAnswers(parsed);
          const visible = getVisibleQuestions(parsed);
          const firstEmpty = visible.findIndex(q => !parsed[q.id] || (typeof parsed[q.id] === 'string' && parsed[q.id].trim() === ''));
          if (firstEmpty === -1) {
            // All questions answered — mark for auto-generation
            setCurrentQ(visible.length - 1);
            autoGenerateTriggered.current = true;
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

  // Auto-generate if user already completed journey and has valid promo/payment
  useEffect(() => {
    if (verified && !verifying && autoGenerateTriggered.current && !generating && !downloadUrl && !error && !recovering) {
      autoGenerateTriggered.current = false;
      handleSubmit();
    }
  }, [verified, verifying]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 200);
  }, [currentQ]);

  // Awakening sequence progression
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
    (currentQuestion.type !== 'select' && typeof answers[currentQuestion.id] === 'string' && answers[currentQuestion.id].trim().length > 0)
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
      sessionStorage.setItem(STORAGE_KEYS.GEN_IN_PROGRESS, 'true');
      sessionStorage.setItem(STORAGE_KEYS.GEN_NAME, answers.name || 'friend');
      sessionStorage.removeItem(STORAGE_KEYS.GENERATED_TEXT);
      sessionStorage.removeItem(STORAGE_KEYS.PDF_BASE64);
    } catch (_) {}

    try {
      // Step 1: Generate text via streaming
      let textRes;
      try {
        textRes = await fetch('/api/generate-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers }),
        });
      } catch (fetchErr) {
        throw new Error('Could not reach the server. Check your internet connection and try again.');
      }

      if (!textRes.ok) {
        let errMsg = 'Generation failed.';
        try {
          const errData = await textRes.json();
          errMsg = errData.error || errMsg;
        } catch (_) {}
        throw new Error(errMsg + ' Contact danieledmondson45@gmail.com');
      }

      // Step 2: Read the streaming response
      let text = '';
      if (textRes.body && typeof textRes.body.getReader === 'function') {
        const reader = textRes.body.getReader();
        const decoder = new TextDecoder();

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            text += decoder.decode(value, { stream: true });
            const words = text.split(/\s+/).length;
            setGenerationStatus(`${words.toLocaleString()} words and counting...`);

            if (words % 200 === 0) {
              try { sessionStorage.setItem(STORAGE_KEYS.GENERATED_TEXT, text); } catch (_) {}
            }
          }
        } finally {
          try { reader.releaseLock(); } catch (_) {}
        }
      } else {
        // Fallback: non-streaming response
        text = await textRes.text();
      }

      try { sessionStorage.setItem(STORAGE_KEYS.GENERATED_TEXT, text); } catch (_) {}

      if (!text || text.length < 100) {
        throw new Error('Generation returned empty. Contact danieledmondson45@gmail.com');
      }

      // Step 3: Generate PDF
      setGenerationStatus('Formatting your PDF...');
      setAwakeningPhase(3);

      let pdfRes;
      try {
        pdfRes = await fetch('/api/generate-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, name: answers.name || 'friend' }),
        });
      } catch (fetchErr) {
        throw new Error('Could not reach the PDF service. Try again.');
      }

      if (!pdfRes.ok) {
        let errMsg = 'PDF formatting failed.';
        try {
          const errData = await pdfRes.json();
          errMsg = errData.error || errMsg;
        } catch (_) {}
        throw new Error(errMsg);
      }

      const blob = await pdfRes.blob();

      try {
        const base64 = await blobToBase64(blob);
        sessionStorage.setItem(STORAGE_KEYS.PDF_BASE64, base64);
      } catch (_) {
        // sessionStorage might be full — that's okay, the blob URL still works
      }

      setDownloadUrl(URL.createObjectURL(blob));
      setGenerationStatus('');
      try {
        sessionStorage.removeItem(STORAGE_KEYS.GEN_IN_PROGRESS);
        sessionStorage.removeItem('eden_answers');
      } catch (_) {}
    } catch (err) {
      console.error('Generation error:', err);
      setError(err?.message || 'An unexpected error occurred. Contact danieledmondson45@gmail.com');
      setGenerating(false);
    }
  };

  // Handle download click: trigger download then redirect to support page
  // IMPORTANT: useCallback must be above all early returns to satisfy React's rules of hooks
  const handleDownload = useCallback(() => {
    setTimeout(() => {
      try {
        sessionStorage.removeItem(STORAGE_KEYS.GENERATED_TEXT);
        sessionStorage.removeItem(STORAGE_KEYS.PDF_BASE64);
        sessionStorage.removeItem(STORAGE_KEYS.GEN_NAME);
        sessionStorage.removeItem(STORAGE_KEYS.GEN_IN_PROGRESS);
      } catch (_) {}
      router.push('/support');
    }, 1500);
  }, [router]);

  // Loading states
  if (verifying) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-surface">
        <p className="text-ink-tertiary animate-pulse-soft">Verifying...</p>
      </main>
    );
  }

  if ((!sessionId && !promoCode) || !verified) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-surface">
        <div className="max-w-md text-center">
          <p className="text-ink-secondary mb-4">Payment required.</p>
          <a href="/offering" className="text-sm text-ink-tertiary hover:text-ink transition-colors">
            &larr; Return to offering
          </a>
        </div>
      </main>
    );
  }

  // Download ready
  if (downloadUrl) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-surface relative overflow-hidden">
        <SacredGeometry opacity={0.05} />

        <div className="relative max-w-md text-center page-enter z-10">
          <OBreathing size={80} className="mx-auto mb-10" />

          <h1 className="font-serif text-heading text-ink mb-4">
            Your document is ready.
          </h1>

          <p className="text-lg text-ink-secondary mb-10">
            This was written for you, {answers.name || 'friend'}.
          </p>

          <a
            href={downloadUrl}
            download={`Eden-${(answers.name || 'yours').replace(/\s/g, '-')}.pdf`}
            onClick={handleDownload}
            className="btn btn-primary"
          >
            Download PDF
          </a>

          <p className="mt-10 text-sm text-ink-tertiary">
            Questions? <a href="mailto:danieledmondson45@gmail.com" className="hover:text-ink transition-colors">danieledmondson45@gmail.com</a>
          </p>
        </div>
      </main>
    );
  }

  // Error
  if (error && !generating) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-surface">
        <div className="max-w-md text-center page-enter">
          <p className="text-xl text-ink mb-4">Something went wrong.</p>
          <p className="text-base text-ink-secondary mb-8">{error}</p>
          <button onClick={() => { setError(null); handleSubmit(); }}
            className="btn btn-primary mr-3">
            Try again
          </button>
          <a href="mailto:danieledmondson45@gmail.com" className="text-base text-ink-secondary hover:text-ink">
            Contact Daniel
          </a>
        </div>
      </main>
    );
  }

  // ===== AWAKENING SEQUENCE — during generation =====
  if (generating) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-surface relative overflow-hidden">
        <SacredGeometry opacity={0.05} />

        <div className="relative text-center z-10">
          <div className="mb-12">
            <AwakeningSequence phase={awakeningPhase} />
          </div>

          <p className="text-lg text-ink font-serif mb-2 transition-opacity duration-1000">
            {AWAKENING_MESSAGES[awakeningMsg]}
          </p>

          <p className="text-base text-ink-secondary mb-2">
            {generationStatus}
          </p>

          <p className="text-sm text-ink-tertiary">
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
    <main className="min-h-screen flex flex-col bg-surface relative">
      {/* Progress */}
      <div className="fixed top-20 right-6 z-30">
        <OProgress progress={progress} size={40} />
        <p className="text-xs text-ink-secondary text-center mt-1">
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
          <p className="text-xs text-ink-secondary mb-6 tracking-[0.2em]">
            {currentQ + 1} of {visibleQuestions.length}
          </p>

          <label className="block font-serif text-2xl md:text-3xl text-ink mb-8 leading-relaxed">
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
              className="w-full bg-transparent border-b border-white/[0.25] py-3 text-xl text-ink placeholder:text-ink-tertiary focus:border-white/[0.5] transition-colors"
            />
          )}

          {currentQuestion.type === 'textarea' && (
            <textarea
              ref={inputRef}
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
              placeholder={currentQuestion.placeholder}
              rows={4}
              className="w-full bg-surface-secondary border border-white/[0.15] rounded-xl p-4 text-lg text-ink placeholder:text-ink-tertiary resize-none focus:border-white/[0.3] transition-colors"
            />
          )}

          {currentQuestion.type === 'select' && currentQuestion.options && (
            <div className="space-y-2">
              {currentQuestion.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setAnswers({ ...answers, [currentQuestion.id]: opt.value })}
                  className={`w-full text-left p-4 rounded-xl border transition-all text-base leading-relaxed ${
                    answers[currentQuestion.id] === opt.value
                      ? 'border-accent bg-accent text-white'
                      : 'border-white/[0.15] bg-surface-secondary text-ink-secondary hover:border-white/[0.3]'
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
              className={`text-base text-ink-secondary hover:text-ink transition-colors ${currentQ === 0 ? 'invisible' : ''}`}
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
      <main className="min-h-screen flex items-center justify-center bg-surface">
        <p className="text-ink-tertiary animate-pulse-soft">Loading...</p>
      </main>
    }>
      <QuestionnaireContent />
    </Suspense>
  );
}
