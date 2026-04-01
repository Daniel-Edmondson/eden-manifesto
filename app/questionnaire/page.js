'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { OProgress, OBreathing, ParticleField } from '../components/OSymbol';

const questions = [
  { id: 'name', label: 'What should I call you?', type: 'text', placeholder: 'Your first name' },
  { id: 'age', label: 'How old are you?', type: 'text', placeholder: 'Your age' },
  { id: 'whatyoudo', label: 'What do you do with your days — and is it what you want to be doing?', type: 'textarea', placeholder: 'Work, school, caregiving, creating, surviving — whatever it is.' },
  { id: 'struggle', label: 'What is the thing you struggle with most — the one that never fully goes away?', type: 'textarea', placeholder: 'Be as honest as you can. There is no wrong answer.' },
  { id: 'belief', label: 'What do you believe is true that most people around you don\'t seem to see?', type: 'textarea', placeholder: 'The thing you think but rarely say out loud.' },
  { id: 'binary', label: 'What are you torn between? What two forces or choices or identities feel like they\'re pulling you apart?', type: 'textarea', placeholder: 'e.g., "Faith and doubt," "ambition and peace," "who I am and who I\'m supposed to be"...' },
  { id: 'control', label: 'Do you feel like you\'re in control of your own mind? Be honest.', type: 'textarea', placeholder: 'What does control look like for you — or the absence of it?' },
  { id: 'pattern', label: 'What pattern do you keep repeating, even though you know you\'re doing it?', type: 'textarea', placeholder: 'The cycle you can\'t seem to break.' },
  { id: 'body', label: 'Where do you carry your stress? What does your body know that your mind won\'t admit?', type: 'textarea', placeholder: 'Chest, jaw, stomach, shoulders — or something else entirely.' },
  { id: 'moment', label: 'Describe a moment when everything briefly made sense — even if you couldn\'t explain why.', type: 'textarea', placeholder: 'A walk, a conversation, a trip, a sunrise. Anything.' },
  { id: 'art', label: 'What song, book, film, or piece of art has gotten closest to saying the thing you can\'t say?', type: 'textarea', placeholder: 'Name it and say why, even loosely.' },
  { id: 'consciousness', label: 'What do you think consciousness is? Don\'t overthink it — just say what comes.', type: 'textarea', placeholder: 'There\'s no right answer. Your instinct is the point.' },
  { id: 'person', label: 'Who is the person who shaped you most — for better or worse?', type: 'textarea', placeholder: 'What did they give you, or what did they take?' },
  { id: 'love', label: 'What is the most honest thing you could say about love right now?', type: 'textarea', placeholder: 'Romantic, familial, divine, absent — whatever love means to you today.' },
  { id: 'faith', label: 'What is your relationship with God, spirituality, or whatever you\'d call the thing beyond yourself?', type: 'textarea', placeholder: 'Belief, doubt, anger, longing, nothing — all valid.' },
  { id: 'faithsystem', label: 'What faith tradition, if any, do you identify with?', type: 'textarea', placeholder: 'e.g., Christian, Muslim, Buddhist, Hindu, Jewish, Agnostic, Atheist, Spiritual but not religious, or something else entirely.' },
  { id: 'death', label: 'What do you think happens when you die?', type: 'textarea', placeholder: 'Say what you actually think, not what you were taught.' },
  { id: 'fear', label: 'What are you most afraid is true about yourself or reality?', type: 'textarea', placeholder: 'The thought you push away.' },
  { id: 'lie', label: 'What is the lie you tell yourself most often?', type: 'textarea', placeholder: 'You know the one.' },
  { id: 'paradox', label: 'Is there something in your life that feels true and impossible at the same time?', type: 'textarea', placeholder: 'Two things that can\'t both be real — but are.' },
  { id: 'freedom', label: 'What would freedom actually look like for you? Not the word — the feeling.', type: 'textarea', placeholder: 'Describe what your life looks like when you\'re free.' },
  { id: 'create', label: 'If you could build, make, or start anything with no fear of failure — what would it be?', type: 'textarea', placeholder: 'The thing you\'d do if nobody was watching.' },
  { id: 'younger', label: 'What would you say to the version of yourself from five years ago?', type: 'textarea', placeholder: 'One honest thing.' },
  { id: 'future', label: 'What do you think the version of yourself five years from now needs you to do right now?', type: 'textarea', placeholder: 'What are you putting off?' },
  { id: 'hope', label: 'If you could know one thing for certain — one truth that would change everything — what would it be?', type: 'textarea', placeholder: 'Not what you want to have. What you want to KNOW.' },
  { id: 'lastword', label: 'Is there anything else you want me to know before I write this for you?', type: 'textarea', placeholder: 'Anything. This is your space.' },
];

function QuestionnaireContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const promoCode = searchParams.get('promo');
  const tier = searchParams.get('tier') || 'deep';

  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [generating, setGenerating] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState(null);
  const [generationStatus, setGenerationStatus] = useState('');
  const inputRef = useRef(null);

  // Check for pre-filled answers from journey
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('eden_journey_answers');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setAnswers(parsed);
          // Skip to first unanswered question
          const firstEmpty = questions.findIndex(q => !parsed[q.id] || parsed[q.id].trim() === '');
          if (firstEmpty > 0) setCurrentQ(firstEmpty);
        } catch (e) {}
      }
    }
  }, []);

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

  const currentQuestion = questions[currentQ];
  const isLast = currentQ === questions.length - 1;
  const canProceed = answers[currentQuestion?.id]?.trim().length > 0;
  const progress = (currentQ + 1) / questions.length;

  const handleNext = () => {
    if (isLast) handleSubmit();
    else setCurrentQ(currentQ + 1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && currentQuestion.type === 'text' && canProceed) {
      e.preventDefault();
      handleNext();
    }
  };

  const handleSubmit = async () => {
    setGenerating(true);
    setError(null);
    setGenerationStatus('Writing your philosophical guidebook...');

    try {
      const textRes = await fetch('/api/generate-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, tier }),
      });

      if (!textRes.ok) {
        const errData = await textRes.json().catch(() => ({}));
        throw new Error(errData.error || 'Generation failed. Please contact danieledmondson45@gmail.com');
      }

      const reader = textRes.body.getReader();
      const decoder = new TextDecoder();
      let manifestoText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        manifestoText += decoder.decode(value, { stream: true });
        const wordCount = manifestoText.split(/\s+/).length;
        setGenerationStatus(`Writing your philosophical guidebook... (${wordCount.toLocaleString()} words)`);
      }

      if (!manifestoText || manifestoText.length < 100) {
        throw new Error('Generation returned empty. Please contact danieledmondson45@gmail.com');
      }

      setGenerationStatus('Formatting your PDF...');

      const pdfRes = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: manifestoText, name: answers.name, tier }),
      });

      if (!pdfRes.ok) throw new Error('PDF formatting failed.');

      const blob = await pdfRes.blob();
      setDownloadUrl(URL.createObjectURL(blob));
      setGenerationStatus('');
      // Clear journey answers
      if (typeof window !== 'undefined') sessionStorage.removeItem('eden_journey_answers');
    } catch (err) {
      console.error(err);
      setError(err.message);
      setGenerating(false);
    }
  };

  if (verifying) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-eden-dark">
        <p className="text-white/20 animate-pulse-slow">Verifying payment...</p>
      </main>
    );
  }

  if ((!sessionId && !promoCode) || !verified) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-eden-dark">
        <div className="max-w-md text-center">
          <p className="text-white/40 mb-4">Payment required before questionnaire.</p>
          <a href="/offering" className="text-sm text-gold/40 hover:text-gold transition-colors">
            ← Return to The Offering
          </a>
        </div>
      </main>
    );
  }

  // Download ready
  if (downloadUrl) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-eden-dark relative">
        <ParticleField count={30} />
        <div className="max-w-lg text-center relative z-10 animate-fade-in">
          <OBreathing size={100} className="mx-auto mb-10" />
          <p className="text-xs tracking-[0.3em] uppercase text-gold/40 mb-8">The Eden Project</p>
          <h1 className="font-serif text-2xl md:text-3xl font-light text-white/70 mb-6">
            Your philosophical guidebook is ready.
          </h1>
          <p className="text-white/30 mb-12">
            This was written for you, {answers.name || 'friend'}. Read it when the noise is loudest.
          </p>
          <a
            href={downloadUrl}
            download={`Eden-Guidebook-${(answers.name || 'yours').replace(/\s/g, '-')}.pdf`}
            className="inline-block px-10 py-4 bg-gold/15 border border-gold/30 text-gold text-sm tracking-wider hover:bg-gold/25 transition-all btn-glow rounded"
          >
            Download Your Guidebook
          </a>
          <p className="mt-10 text-xs text-white/15">
            If this changed something for you, share The Eden Project with someone who needs it.
          </p>

          {/* Upsell for lower tiers */}
          {tier !== 'complete' && (
            <div className="mt-12 pt-8 border-t border-white/5">
              <p className="text-xs text-white/20 mb-3">
                Want to go deeper? Upgrade to {tier === 'essential' ? 'Deep or Complete' : 'Complete'}.
              </p>
              <a href="/offering" className="text-xs text-gold/30 hover:text-gold/50 transition-colors">
                See all tiers →
              </a>
            </div>
          )}
        </div>
      </main>
    );
  }

  if (error && !generating) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-eden-dark">
        <div className="max-w-lg text-center animate-fade-in">
          <p className="text-xl text-white/60 mb-4">Something went wrong.</p>
          <p className="text-base text-white/30 mb-8">{error}</p>
          <button onClick={() => { setError(null); handleSubmit(); }}
            className="px-8 py-3 bg-gold/10 border border-gold/20 text-gold text-sm tracking-wider hover:bg-gold/20 transition-all rounded mr-4">
            Try Again
          </button>
          <a href="mailto:danieledmondson45@gmail.com" className="text-sm text-white/20 hover:text-gold/40 transition-colors">
            Contact Daniel
          </a>
        </div>
      </main>
    );
  }

  if (generating) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-eden-dark relative">
        <ParticleField count={20} />
        <div className="text-center relative z-10 animate-fade-in">
          <div className="relative mx-auto mb-10 w-20 h-20">
            <OBreathing size={80} />
          </div>
          <p className="text-lg text-white/50 mb-2 font-serif">{generationStatus}</p>
          <p className="text-sm text-white/20">
            This takes about 60–90 seconds. Your philosophical guidebook is being written from scratch.
          </p>
        </div>
      </main>
    );
  }

  // Questionnaire
  return (
    <main className="min-h-screen flex flex-col bg-eden-dark">
      {/* Progress O */}
      <div className="fixed top-20 right-6 z-30">
        <OProgress progress={progress} size={44} />
        <p className="text-[10px] text-white/15 text-center mt-1">
          {currentQ + 1}/{questions.length}
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-xl w-full animate-fade-in" key={currentQ}>
          <p className="text-xs text-white/15 mb-2 tracking-wider">
            {currentQ + 1} of {questions.length}
          </p>

          <label className="block font-serif text-xl md:text-2xl font-light text-white/65 mb-8 leading-relaxed">
            {currentQuestion.label}
          </label>

          {currentQuestion.type === 'text' ? (
            <input
              ref={inputRef}
              type="text"
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
              onKeyDown={handleKeyDown}
              placeholder={currentQuestion.placeholder}
              className="w-full bg-transparent border-b border-white/10 py-3 text-lg text-white/80 placeholder:text-white/15 focus:border-gold/30 transition-colors"
            />
          ) : (
            <textarea
              ref={inputRef}
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
              placeholder={currentQuestion.placeholder}
              rows={4}
              className="w-full bg-white/[0.03] border border-white/5 rounded p-4 text-base text-white/70 placeholder:text-white/15 resize-none focus:border-gold/20 transition-colors"
            />
          )}

          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
              className={`text-sm text-white/20 hover:text-white/40 transition-colors ${currentQ === 0 ? 'invisible' : ''}`}
            >
              ← Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className="px-8 py-3 bg-gold/10 border border-gold/20 text-gold/70 text-sm tracking-wider hover:bg-gold/20 hover:border-gold/30 transition-all disabled:opacity-20 disabled:cursor-not-allowed rounded"
            >
              {isLast ? 'Generate My Guidebook' : 'Continue'}
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
      <main className="min-h-screen flex items-center justify-center bg-eden-dark">
        <p className="text-white/20 animate-pulse-slow">Loading...</p>
      </main>
    }>
      <QuestionnaireContent />
    </Suspense>
  );
}
