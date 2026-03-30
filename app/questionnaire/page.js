'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const questions = [
  {
    id: 'name',
    label: 'What should I call you?',
    type: 'text',
    placeholder: 'Your first name',
  },
  {
    id: 'age',
    label: 'How old are you?',
    type: 'text',
    placeholder: 'Your age',
  },
  {
    id: 'whatyoudo',
    label: 'What do you do with your days — and is it what you want to be doing?',
    type: 'textarea',
    placeholder: 'Work, school, caregiving, creating, surviving — whatever it is.',
  },
  {
    id: 'struggle',
    label: 'What is the thing you struggle with most — the one that never fully goes away?',
    type: 'textarea',
    placeholder: 'Be as honest as you can. There is no wrong answer.',
  },
  {
    id: 'belief',
    label: 'What do you believe is true that most people around you don\'t seem to see?',
    type: 'textarea',
    placeholder: 'The thing you think but rarely say out loud.',
  },
  {
    id: 'binary',
    label: 'What are you torn between? What two forces or choices or identities feel like they\'re pulling you apart?',
    type: 'textarea',
    placeholder: 'e.g., "Faith and doubt," "ambition and peace," "who I am and who I\'m supposed to be"...',
  },
  {
    id: 'control',
    label: 'Do you feel like you\'re in control of your own mind? Be honest.',
    type: 'textarea',
    placeholder: 'What does control look like for you — or the absence of it?',
  },
  {
    id: 'pattern',
    label: 'What pattern do you keep repeating, even though you know you\'re doing it?',
    type: 'textarea',
    placeholder: 'The cycle you can\'t seem to break.',
  },
  {
    id: 'body',
    label: 'Where do you carry your stress? What does your body know that your mind won\'t admit?',
    type: 'textarea',
    placeholder: 'Chest, jaw, stomach, shoulders — or something else entirely.',
  },
  {
    id: 'moment',
    label: 'Describe a moment when everything briefly made sense — even if you couldn\'t explain why.',
    type: 'textarea',
    placeholder: 'A walk, a conversation, a trip, a sunrise. Anything.',
  },
  {
    id: 'art',
    label: 'What song, book, film, or piece of art has gotten closest to saying the thing you can\'t say?',
    type: 'textarea',
    placeholder: 'Name it and say why, even loosely.',
  },
  {
    id: 'consciousness',
    label: 'What do you think consciousness is? Don\'t overthink it — just say what comes.',
    type: 'textarea',
    placeholder: 'There\'s no right answer. Your instinct is the point.',
  },
  {
    id: 'person',
    label: 'Who is the person who shaped you most — for better or worse?',
    type: 'textarea',
    placeholder: 'What did they give you, or what did they take?',
  },
  {
    id: 'love',
    label: 'What is the most honest thing you could say about love right now?',
    type: 'textarea',
    placeholder: 'Romantic, familial, divine, absent — whatever love means to you today.',
  },
  {
    id: 'faith',
    label: 'What is your relationship with God, spirituality, or whatever you\'d call the thing beyond yourself?',
    type: 'textarea',
    placeholder: 'Belief, doubt, anger, longing, nothing — all valid.',
  },
  {
    id: 'death',
    label: 'What do you think happens when you die?',
    type: 'textarea',
    placeholder: 'Say what you actually think, not what you were taught.',
  },
  {
    id: 'fear',
    label: 'What are you most afraid is true about yourself or reality?',
    type: 'textarea',
    placeholder: 'The thought you push away.',
  },
  {
    id: 'lie',
    label: 'What is the lie you tell yourself most often?',
    type: 'textarea',
    placeholder: 'You know the one.',
  },
  {
    id: 'paradox',
    label: 'Is there something in your life that feels true and impossible at the same time?',
    type: 'textarea',
    placeholder: 'Two things that can\'t both be real — but are.',
  },
  {
    id: 'freedom',
    label: 'What would freedom actually look like for you? Not the word — the feeling.',
    type: 'textarea',
    placeholder: 'Describe what your life looks like when you\'re free.',
  },
  {
    id: 'create',
    label: 'If you could build, make, or start anything with no fear of failure — what would it be?',
    type: 'textarea',
    placeholder: 'The thing you\'d do if nobody was watching.',
  },
  {
    id: 'younger',
    label: 'What would you say to the version of yourself from five years ago?',
    type: 'textarea',
    placeholder: 'One honest thing.',
  },
  {
    id: 'future',
    label: 'What do you think the version of yourself five years from now needs you to do right now?',
    type: 'textarea',
    placeholder: 'What are you putting off?',
  },
  {
    id: 'hope',
    label: 'If you could know one thing for certain — one truth that would change everything — what would it be?',
    type: 'textarea',
    placeholder: 'Not what you want to have. What you want to KNOW.',
  },
  {
    id: 'lastword',
    label: 'Is there anything else you want me to know before I write this for you?',
    type: 'textarea',
    placeholder: 'Anything. This is your space.',
  },
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

  useEffect(() => {
    // Verify access via Stripe session or valid promo code
    if (sessionId) {
      setVerified(true);
      setVerifying(false);
    } else if (promoCode) {
      // Verify promo code server-side
      fetch('/api/verify-promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode }),
      })
        .then(res => res.json())
        .then(data => {
          setVerified(data.valid);
          setVerifying(false);
        })
        .catch(() => setVerifying(false));
    } else {
      setVerifying(false);
    }
  }, [sessionId, promoCode]);

  const currentQuestion = questions[currentQ];
  const isLast = currentQ === questions.length - 1;
  const canProceed = answers[currentQuestion?.id]?.trim().length > 0;

  const handleNext = () => {
    if (isLast) {
      handleSubmit();
    } else {
      setCurrentQ(currentQ + 1);
    }
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
      // Step 1: Generate the philosophical guidebook text (streaming, Edge Runtime)
      const textRes = await fetch('/api/generate-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });

      if (!textRes.ok) {
        const errData = await textRes.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to generate text. Please contact danieledmondson45@gmail.com');
      }

      // Read the streamed text
      const reader = textRes.body.getReader();
      const decoder = new TextDecoder();
      let manifestoText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        manifestoText += decoder.decode(value, { stream: true });
        // Update status to show progress
        const wordCount = manifestoText.split(/\s+/).length;
        setGenerationStatus(`Writing your philosophical guidebook... (${wordCount} words)`);
      }

      if (!manifestoText || manifestoText.length < 100) {
        throw new Error('Philosophical guidebook generation returned empty. Please contact danieledmondson45@gmail.com');
      }

      // Step 2: Generate the PDF from the text (fast, <2 seconds)
      setGenerationStatus('Formatting your PDF...');

      const pdfRes = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: manifestoText, name: answers.name }),
      });

      if (!pdfRes.ok) {
        throw new Error('PDF generation failed. Please contact danieledmondson45@gmail.com');
      }

      const blob = await pdfRes.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setGenerationStatus('');
    } catch (err) {
      console.error(err);
      setError(err.message);
      setGenerating(false);
    }
  };

  // Not verified
  if (verifying) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <p className="text-gray-400 animate-pulse-slow">Verifying payment...</p>
      </main>
    );
  }

  if ((!sessionId && !promoCode) || !verified) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <p className="text-gray-700 mb-4">Payment required before questionnaire.</p>
          <a href="/" className="text-sm underline text-gray-500 hover:text-black">
            Return to The Eden Project
          </a>
        </div>
      </main>
    );
  }

  // Download ready
  if (downloadUrl) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-lg text-center animate-fade-in">
          <p className="text-sm tracking-[0.3em] uppercase text-gray-400 mb-8">
            The Eden Project
          </p>
          <h1 className="text-2xl md:text-3xl font-light mb-6">
            Your philosophical guidebook is ready.
          </h1>
          <p className="text-gray-600 mb-12">
            This was written for you, {answers.name || 'friend'}. Not for anyone else.
            Read it when the noise is loudest.
          </p>
          <a
            href={downloadUrl}
            download={`Eden-Guidebook-${(answers.name || 'yours').replace(/\s/g, '-')}.pdf`}
            className="inline-block px-12 py-4 bg-black text-white text-sm tracking-wide hover:bg-gray-900 transition-colors"
          >
            Download Your Philosophical Guidebook (PDF)
          </a>
          <p className="mt-8 text-xs text-gray-400">
            If this changed something for you, share The Eden Project with someone who needs it.
          </p>
        </div>
      </main>
    );
  }

  // Error
  if (error && !generating) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-lg text-center animate-fade-in">
          <p className="text-xl text-black mb-4">Something went wrong.</p>
          <p className="text-base text-gray-600 mb-8">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setGenerating(false);
              handleSubmit();
            }}
            className="px-8 py-3 bg-black text-white text-sm tracking-wide hover:bg-gray-900 transition-colors mr-4"
          >
            Try Again
          </button>
          <a
            href="mailto:danieledmondson45@gmail.com"
            className="text-sm underline text-gray-500 hover:text-black"
          >
            Contact Daniel
          </a>
        </div>
      </main>
    );
  }

  // Generating
  if (generating) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center animate-fade-in">
          <div className="w-8 h-8 border border-black border-t-transparent rounded-full animate-spin mx-auto mb-8" />
          <p className="text-lg text-gray-700 mb-2">{generationStatus}</p>
          <p className="text-sm text-gray-400">
            This takes about 30&ndash;60 seconds. Your philosophical guidebook is being written from scratch.
          </p>
        </div>
      </main>
    );
  }

  // Questionnaire
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-xl w-full">
        {/* Progress */}
        <div className="flex gap-1 mb-16">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-0.5 flex-1 transition-colors duration-300 ${
                i <= currentQ ? 'bg-black' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        <div key={currentQ} className="animate-fade-in">
          <p className="text-sm text-gray-400 mb-4">
            {currentQ + 1} of {questions.length}
          </p>

          <label className="block text-xl md:text-2xl font-light mb-8 leading-relaxed">
            {currentQuestion.label}
          </label>

          {currentQuestion.type === 'text' ? (
            <input
              type="text"
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
              onKeyDown={handleKeyDown}
              placeholder={currentQuestion.placeholder}
              autoFocus
              className="w-full border-b border-gray-300 py-3 text-lg bg-transparent placeholder:text-gray-300 focus:border-black transition-colors"
            />
          ) : (
            <textarea
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
              placeholder={currentQuestion.placeholder}
              autoFocus
              rows={4}
              className="w-full border border-gray-200 p-4 text-base bg-transparent placeholder:text-gray-300 resize-none focus:border-black transition-colors"
            />
          )}

          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
              className={`text-sm text-gray-400 hover:text-black transition-colors ${
                currentQ === 0 ? 'invisible' : ''
              }`}
            >
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed}
              className="px-8 py-3 bg-black text-white text-sm tracking-wide hover:bg-gray-900 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isLast ? 'Generate My Philosophical Guidebook' : 'Continue'}
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
      <main className="min-h-screen flex items-center justify-center px-6">
        <p className="text-gray-400 animate-pulse-slow">Loading...</p>
      </main>
    }>
      <QuestionnaireContent />
    </Suspense>
  );
}
