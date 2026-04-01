'use client';

import { useState, useEffect, useRef } from 'react';
import { OProgress, ParticleField } from '../components/OSymbol';

const phases = [
  {
    id: 'intro',
    type: 'statement',
    text: 'Before we begin, understand something.',
    subtext: 'This is not a quiz. There are no right answers. There is only what is true for you right now.',
    delay: 3000,
  },
  {
    id: 'breath',
    type: 'statement',
    text: 'Take a breath.',
    subtext: 'Let it settle.',
    delay: 4000,
  },
  // Phase 1 — Grounding
  {
    id: 'name',
    type: 'text',
    label: 'What should I call you?',
    placeholder: 'Your first name',
    phase: 'grounding',
  },
  {
    id: 'age',
    type: 'text',
    label: 'How old are you?',
    placeholder: 'Your age',
    phase: 'grounding',
  },
  {
    id: 'whatyoudo',
    type: 'textarea',
    label: 'What do you do with your days — and is it what you want to be doing?',
    placeholder: 'Work, school, caregiving, creating, surviving — whatever it is.',
    phase: 'grounding',
  },
  // Phase 2 — Descent
  {
    id: 'descent',
    type: 'statement',
    text: 'Good. Now go deeper.',
    subtext: 'The next questions ask for honesty. Real honesty. The kind that costs something.',
    delay: 3000,
    phase: 'descent',
  },
  {
    id: 'struggle',
    type: 'textarea',
    label: 'What is the thing you struggle with most — the one that never fully goes away?',
    placeholder: 'Be as honest as you can. There is no wrong answer.',
    phase: 'descent',
  },
  {
    id: 'belief',
    type: 'textarea',
    label: 'What do you believe is true that most people around you don\'t seem to see?',
    placeholder: 'The thing you think but rarely say out loud.',
    phase: 'descent',
  },
  {
    id: 'binary',
    type: 'textarea',
    label: 'What are you torn between? What two forces or choices or identities feel like they\'re pulling you apart?',
    placeholder: 'e.g., "Faith and doubt," "ambition and peace," "who I am and who I\'m supposed to be"...',
    phase: 'descent',
  },
  {
    id: 'control',
    type: 'textarea',
    label: 'Do you feel like you\'re in control of your own mind? Be honest.',
    placeholder: 'What does control look like for you — or the absence of it?',
    phase: 'descent',
  },
  {
    id: 'pattern',
    type: 'textarea',
    label: 'What pattern do you keep repeating, even though you know you\'re doing it?',
    placeholder: 'The cycle you can\'t seem to break.',
    phase: 'descent',
  },
  // Phase 3 — The Body
  {
    id: 'bodyintro',
    type: 'statement',
    text: 'Your body knows things your mind won\'t admit.',
    delay: 2500,
    phase: 'body',
  },
  {
    id: 'body',
    type: 'textarea',
    label: 'Where do you carry your stress? What does your body know that your mind won\'t admit?',
    placeholder: 'Chest, jaw, stomach, shoulders — or something else entirely.',
    phase: 'body',
  },
  {
    id: 'moment',
    type: 'textarea',
    label: 'Describe a moment when everything briefly made sense — even if you couldn\'t explain why.',
    placeholder: 'A walk, a conversation, a trip, a sunrise. Anything.',
    phase: 'body',
  },
  // Phase 4 — The Mirror
  {
    id: 'mirrorintro',
    type: 'statement',
    text: 'Now the mirror.',
    subtext: 'What do you see when you look at consciousness itself?',
    delay: 3000,
    phase: 'mirror',
  },
  {
    id: 'art',
    type: 'textarea',
    label: 'What song, book, film, or piece of art has gotten closest to saying the thing you can\'t say?',
    placeholder: 'Name it and say why, even loosely.',
    phase: 'mirror',
  },
  {
    id: 'consciousness',
    type: 'textarea',
    label: 'What do you think consciousness is? Don\'t overthink it — just say what comes.',
    placeholder: 'There\'s no right answer. Your instinct is the point.',
    phase: 'mirror',
  },
  {
    id: 'person',
    type: 'textarea',
    label: 'Who is the person who shaped you most — for better or worse?',
    placeholder: 'What did they give you, or what did they take?',
    phase: 'mirror',
  },
  {
    id: 'love',
    type: 'textarea',
    label: 'What is the most honest thing you could say about love right now?',
    placeholder: 'Romantic, familial, divine, absent — whatever love means to you today.',
    phase: 'mirror',
  },
  // Phase 5 — The Sacred
  {
    id: 'sacredintro',
    type: 'statement',
    text: 'The sacred.',
    subtext: 'Whatever that word means to you. Or doesn\'t mean.',
    delay: 3000,
    phase: 'sacred',
  },
  {
    id: 'faith',
    type: 'textarea',
    label: 'What is your relationship with God, spirituality, or whatever you\'d call the thing beyond yourself?',
    placeholder: 'Belief, doubt, anger, longing, nothing — all valid.',
    phase: 'sacred',
  },
  {
    id: 'faithsystem',
    type: 'textarea',
    label: 'What faith tradition, if any, do you identify with?',
    placeholder: 'e.g., Christian, Muslim, Buddhist, Hindu, Jewish, Agnostic, Atheist, Spiritual but not religious, or something else entirely.',
    phase: 'sacred',
  },
  {
    id: 'death',
    type: 'textarea',
    label: 'What do you think happens when you die?',
    placeholder: 'Say what you actually think, not what you were taught.',
    phase: 'sacred',
  },
  // Phase 6 — The Shadow
  {
    id: 'shadowintro',
    type: 'statement',
    text: 'The shadow.',
    subtext: 'The parts you push away. They matter most.',
    delay: 3000,
    phase: 'shadow',
  },
  {
    id: 'fear',
    type: 'textarea',
    label: 'What are you most afraid is true about yourself or reality?',
    placeholder: 'The thought you push away.',
    phase: 'shadow',
  },
  {
    id: 'lie',
    type: 'textarea',
    label: 'What is the lie you tell yourself most often?',
    placeholder: 'You know the one.',
    phase: 'shadow',
  },
  {
    id: 'paradox',
    type: 'textarea',
    label: 'Is there something in your life that feels true and impossible at the same time?',
    placeholder: 'Two things that can\'t both be real — but are.',
    phase: 'shadow',
  },
  // Phase 7 — The Horizon
  {
    id: 'horizonintro',
    type: 'statement',
    text: 'Almost there. The horizon.',
    subtext: 'Where you are going. What you are becoming.',
    delay: 3000,
    phase: 'horizon',
  },
  {
    id: 'freedom',
    type: 'textarea',
    label: 'What would freedom actually look like for you? Not the word — the feeling.',
    placeholder: 'Describe what your life looks like when you\'re free.',
    phase: 'horizon',
  },
  {
    id: 'create',
    type: 'textarea',
    label: 'If you could build, make, or start anything with no fear of failure — what would it be?',
    placeholder: 'The thing you\'d do if nobody was watching.',
    phase: 'horizon',
  },
  {
    id: 'younger',
    type: 'textarea',
    label: 'What would you say to the version of yourself from five years ago?',
    placeholder: 'One honest thing.',
    phase: 'horizon',
  },
  {
    id: 'future',
    type: 'textarea',
    label: 'What do you think the version of yourself five years from now needs you to do right now?',
    placeholder: 'What are you putting off?',
    phase: 'horizon',
  },
  {
    id: 'hope',
    type: 'textarea',
    label: 'If you could know one thing for certain — one truth that would change everything — what would it be?',
    placeholder: 'Not what you want to have. What you want to KNOW.',
    phase: 'horizon',
  },
  {
    id: 'lastword',
    type: 'textarea',
    label: 'Is there anything else you want me to know before I write this for you?',
    placeholder: 'Anything. This is your space.',
    phase: 'horizon',
  },
  // Completion
  {
    id: 'complete',
    type: 'completion',
  },
];

const questionPhases = phases.filter(p => p.type !== 'statement' && p.type !== 'completion');
const totalQuestions = questionPhases.length;

export default function JourneyPage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [transitioning, setTransitioning] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(null);
  const inputRef = useRef(null);

  const current = phases[currentIdx];
  const questionsSoFar = phases.slice(0, currentIdx + 1).filter(p => p.type !== 'statement' && p.type !== 'completion').length;
  const progress = questionsSoFar / totalQuestions;

  // Auto-advance for statement phases
  useEffect(() => {
    if (current?.type === 'statement' && current.delay) {
      const timer = setTimeout(() => {
        goNext();
      }, current.delay);
      return () => clearTimeout(timer);
    }
  }, [currentIdx]);

  // Focus input when question appears
  useEffect(() => {
    if (current?.type === 'text' || current?.type === 'textarea') {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [currentIdx]);

  const goNext = () => {
    if (currentIdx >= phases.length - 1) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrentIdx(currentIdx + 1);
      setTransitioning(false);
    }, 400);
  };

  const goBack = () => {
    if (currentIdx <= 0) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrentIdx(currentIdx - 1);
      setTransitioning(false);
    }, 400);
  };

  const canProceed = current?.type === 'statement' ||
    current?.type === 'completion' ||
    (answers[current?.id] && answers[current?.id].trim().length > 0);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && current.type === 'text' && canProceed) {
      e.preventDefault();
      goNext();
    }
  };

  // Get phase-specific background intensity
  const getPhaseStyle = () => {
    const phase = current?.phase;
    switch (phase) {
      case 'descent': return 'bg-eden-dark';
      case 'body': return 'bg-eden-dark';
      case 'mirror': return 'bg-eden-dark';
      case 'sacred': return 'bg-eden-dark';
      case 'shadow': return 'bg-eden-dark';
      case 'horizon': return 'bg-eden-dark';
      default: return 'bg-eden-dark';
    }
  };

  // Completion screen
  if (current?.type === 'completion') {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-eden-dark relative">
        <ParticleField count={40} />
        <div className="max-w-lg text-center relative z-10 animate-fade-in">
          <OProgress progress={1} size={80} className="mx-auto mb-10" />
          <p className="font-serif text-2xl md:text-3xl font-light text-white/70 mb-6">
            The circle is complete.
          </p>
          <p className="text-white/30 mb-4">
            You have walked through something. What you said matters.
          </p>
          <p className="text-white/30 mb-12">
            Now it becomes a document — a philosophical guidebook written for {answers.name || 'you'} alone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`/offering?journey=complete&name=${encodeURIComponent(answers.name || '')}`}
              onClick={() => {
                // Store answers in sessionStorage for retrieval after payment
                if (typeof window !== 'undefined') {
                  sessionStorage.setItem('eden_journey_answers', JSON.stringify(answers));
                }
              }}
              className="px-10 py-4 bg-gold/20 border border-gold/40 text-gold text-sm tracking-wider hover:bg-gold/30 transition-all btn-glow"
            >
              Get Your Philosophical Guidebook
            </a>
            <a
              href="/mirror"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  sessionStorage.setItem('eden_journey_answers', JSON.stringify(answers));
                }
              }}
              className="px-10 py-4 text-white/30 text-sm tracking-wider hover:text-white/50 transition-colors"
            >
              Talk to the Mirror first
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen flex flex-col ${getPhaseStyle()} transition-colors duration-1000`}>
      {/* Progress — The O */}
      <div className="fixed top-20 right-6 z-30">
        <OProgress progress={progress} size={44} />
        <p className="text-[10px] text-white/20 text-center mt-1">
          {Math.round(progress * 100)}%
        </p>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div
          className={`max-w-xl w-full transition-all duration-400 ${
            transitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}
        >
          {/* Statement screens */}
          {current.type === 'statement' && (
            <div className="text-center animate-fade-in">
              <p className="font-serif text-2xl md:text-4xl font-light text-white/70 leading-snug mb-6">
                {current.text}
              </p>
              {current.subtext && (
                <p className="text-white/25 text-base animate-fade-in-d2">
                  {current.subtext}
                </p>
              )}
              <button
                onClick={goNext}
                className="mt-10 text-xs text-gold/30 hover:text-gold/60 tracking-wider transition-colors"
              >
                Continue →
              </button>
            </div>
          )}

          {/* Question screens */}
          {(current.type === 'text' || current.type === 'textarea') && (
            <div className="question-enter">
              <p className="text-xs text-white/15 mb-2 tracking-wider">
                {questionsSoFar} of {totalQuestions}
              </p>

              <label className="block font-serif text-xl md:text-2xl font-light text-white/70 mb-8 leading-relaxed">
                {current.label}
              </label>

              {current.type === 'text' ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={answers[current.id] || ''}
                  onChange={(e) => setAnswers({ ...answers, [current.id]: e.target.value })}
                  onKeyDown={handleKeyDown}
                  placeholder={current.placeholder}
                  className="w-full bg-transparent border-b border-white/10 py-3 text-lg text-white/80 placeholder:text-white/15 focus:border-gold/30 transition-colors"
                />
              ) : (
                <textarea
                  ref={inputRef}
                  value={answers[current.id] || ''}
                  onChange={(e) => setAnswers({ ...answers, [current.id]: e.target.value })}
                  placeholder={current.placeholder}
                  rows={4}
                  className="w-full bg-white/[0.03] border border-white/5 rounded p-4 text-base text-white/70 placeholder:text-white/15 resize-none focus:border-gold/20 transition-colors"
                />
              )}

              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={goBack}
                  className={`text-sm text-white/20 hover:text-white/40 transition-colors ${
                    currentIdx <= 2 ? 'invisible' : ''
                  }`}
                >
                  ← Back
                </button>

                <button
                  onClick={goNext}
                  disabled={!canProceed}
                  className="px-8 py-3 bg-gold/10 border border-gold/20 text-gold/70 text-sm tracking-wider hover:bg-gold/20 hover:border-gold/30 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  {currentIdx === phases.length - 2 ? 'Complete the Journey' : 'Continue'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
