/**
 * THE EDEN PROJECT — ADAPTIVE QUESTION TREE
 *
 * 15 questions designed to genuinely know the person.
 * Open-ended. Not leading. Reactive to what came before.
 *
 * Each question has:
 *   id: unique identifier
 *   label: the question text (can be a function of prior answers)
 *   type: 'text' | 'textarea' | 'select'
 *   placeholder: hint text
 *   options: for select-type questions
 *   getLabel: optional function(answers) => string for adaptive phrasing
 *   condition: optional function(answers) => boolean — if false, skip
 */

// Faith-specific language helpers
function faithTerm(answers, concept) {
  const faith = (answers.faith_system || '').toLowerCase();

  const terms = {
    god: {
      christian: 'God',
      muslim: 'Allah',
      jewish: 'God',
      hindu: 'Brahman',
      buddhist: 'the nature of reality',
      agnostic: 'whatever is beyond yourself',
      atheist: 'existence itself',
      spiritual: 'the divine',
      default: 'the ultimate',
    },
    sacred_text: {
      christian: 'Scripture',
      muslim: 'the Quran',
      jewish: 'Torah',
      hindu: 'the Bhagavad Gita',
      buddhist: 'the sutras',
      default: 'the texts you know',
    },
    practice: {
      christian: 'prayer',
      muslim: 'salah',
      jewish: 'prayer and study',
      hindu: 'meditation or puja',
      buddhist: 'meditation',
      spiritual: 'your practice',
      default: 'reflection',
    },
    enlightenment: {
      christian: 'salvation — the peace that surpasses understanding',
      muslim: 'tawakkul — complete trust in Allah',
      jewish: 'devekut — closeness to God',
      hindu: 'moksha',
      buddhist: 'nirvana',
      agnostic: 'clarity — the moment where everything makes sense',
      atheist: 'clarity — the moment where everything coheres',
      spiritual: 'awakening',
      default: 'enlightenment',
    },
    heaven: {
      christian: 'the Kingdom of Heaven',
      muslim: 'Jannah',
      jewish: 'Olam Ha-Ba',
      hindu: 'moksha',
      buddhist: 'nirvana',
      agnostic: 'the best possible state of being',
      atheist: 'the best version of reality available to consciousness',
      spiritual: 'transcendence',
      default: 'the state you are searching for',
    },
  };

  const map = terms[concept] || {};
  for (const key of Object.keys(map)) {
    if (key !== 'default' && faith.includes(key)) return map[key];
  }
  return map.default || concept;
}

// Determine the faith key for branching
function getFaithKey(answers) {
  const f = (answers.faith_system || '').toLowerCase();
  if (f.includes('christian')) return 'christian';
  if (f.includes('muslim') || f.includes('islam')) return 'muslim';
  if (f.includes('jewish') || f.includes('judai')) return 'jewish';
  if (f.includes('hindu')) return 'hindu';
  if (f.includes('buddhist') || f.includes('buddhism')) return 'buddhist';
  if (f.includes('agnostic')) return 'agnostic';
  if (f.includes('atheist')) return 'atheist';
  if (f.includes('spiritual')) return 'spiritual';
  return 'other';
}

export const questions = [
  // ===== Q1: NAME =====
  {
    id: 'name',
    label: 'What should I call you?',
    type: 'text',
    placeholder: 'Your first name',
  },

  // ===== Q2: WHAT BROUGHT YOU HERE — WIDE OPEN =====
  {
    id: 'search_state',
    type: 'textarea',
    getLabel: (answers) => {
      const name = answers.name || '';
      return name
        ? `${name}, what brought you here? What are you looking for — or trying to figure out?`
        : 'What brought you here? What are you looking for — or trying to figure out?';
    },
    placeholder: 'There\'s no wrong answer. Say what\'s actually on your mind.',
  },

  // ===== Q3: BELIEF — OPEN, NOT A DROPDOWN =====
  {
    id: 'faith_system',
    type: 'textarea',
    label: 'What do you believe? Not what you were taught — what you actually believe, right now, if no one was watching.',
    placeholder: 'Christian, Buddhist, atheist, unsure, something you can\'t name — all welcome. Say as much or as little as you want.',
  },

  // ===== Q4: FAITH DEPTH — ADAPTIVE =====
  {
    id: 'faith_depth',
    type: 'textarea',
    getLabel: (answers) => {
      const key = getFaithKey(answers);
      const name = answers.name || '';
      const addr = name ? `, ${name}` : '';

      switch (key) {
        case 'christian':
          return `Does your faith make complete sense to you${addr}? Where does it hold — and where does it strain?`;
        case 'muslim':
          return `How complete is your trust in Allah${addr}? Where does your faith feel solid, and where do you wrestle with it?`;
        case 'jewish':
          return `How do you hold the tension between tradition and your own experience${addr}? Where does your faith feel alive?`;
        case 'hindu':
          return `How do you experience the relationship between the self and Brahman in your daily life${addr}? Where does clarity come, and where does it leave?`;
        case 'buddhist':
          return `How do you relate to the idea of attachment${addr}? Where does your practice feel alive, and where does it feel like effort?`;
        case 'agnostic':
          return `What made you stop short of belief — or disbelief${addr}? What would change your mind?`;
        case 'atheist':
          return `What took the place of belief for you${addr}? And does it fully account for the experience of being conscious?`;
        case 'spiritual':
          return `What does your spirituality actually look like day to day${addr}? Where does it hold you, and where does it fall short?`;
        default:
          return `Tell me more about your relationship with belief${addr}. What do you hold onto — and what have you let go?`;
      }
    },
    placeholder: 'Be honest. This shapes everything that follows.',
  },

  // ===== Q5: CONTROL — THE KERNEL =====
  {
    id: 'control',
    type: 'textarea',
    getLabel: (answers) => {
      // Reference their search state to show we're listening
      const search = (answers.search_state || '').toLowerCase();
      if (search.includes('peace') || search.includes('calm') || search.includes('anxiety')) {
        return 'You mentioned peace. Here\'s a question that gets at the root of it: do you feel like you\'re in control of your own thoughts? Not your actions — your thoughts. The ones that show up uninvited.';
      }
      if (search.includes('meaning') || search.includes('purpose')) {
        return 'You\'re looking for meaning. Let me ask you something underneath that: do you feel like you\'re in control of your own thoughts? Not your actions — your thoughts. The ones that arrive whether you want them or not.';
      }
      return 'Do you feel like you\'re in control of your own thoughts? Not your actions — your thoughts. The ones that show up uninvited.';
    },
    placeholder: 'There\'s no right answer. Just say what\'s true.',
  },

  // ===== Q6: THE CONTROL EXPERIMENT =====
  {
    id: 'control_experiment',
    type: 'textarea',
    getLabel: (answers) => {
      const name = answers.name || 'you';
      return `Imagine losing all control, ${name}. Not partially — completely. What happens? What\'s the first thing you see yourself doing?`;
    },
    placeholder: 'Don\'t filter it. Even if the answer is dark or absurd.',
  },

  // ===== Q7: WHAT SCARES YOU — MORE OPEN THAN "SUFFERING" =====
  {
    id: 'suffering',
    type: 'textarea',
    getLabel: (answers) => {
      // React to their control answer
      const control = (answers.control || '').toLowerCase();
      const controlExp = (answers.control_experiment || '').toLowerCase();

      if (control.includes('no') || control.includes('not in control') || control.includes('can\'t')) {
        return 'You said you don\'t feel in control of your thoughts. What does that cost you? What\'s the thing that keeps coming back no matter how many times you try to resolve it?';
      }
      if (controlExp.includes('nothing') || controlExp.includes('free') || controlExp.includes('relief')) {
        return 'Interesting — losing control felt like relief. What are you holding onto so tightly that letting go sounds like freedom?';
      }
      return 'What\'s the pattern that keeps returning? The thing that won\'t stop showing up no matter how many times you try to think your way out of it?';
    },
    placeholder: 'The thing underneath the thing.',
  },

  // ===== Q8: PARADOX — THE TENSION =====
  {
    id: 'paradox',
    type: 'textarea',
    getLabel: (answers) => {
      const name = answers.name || '';
      const addr = name ? `${name}, is` : 'Is';
      return `${addr} there something in your life that feels true and impossible at the same time? Two things that shouldn\'t both be real — but are.`;
    },
    placeholder: 'A contradiction you live inside of.',
  },

  // ===== Q9: FAITH-SPECIFIC DEEP QUESTION =====
  {
    id: 'faith_deep',
    type: 'textarea',
    getLabel: (answers) => {
      const key = getFaithKey(answers);
      const paradox = (answers.paradox || '').slice(0, 60);

      switch (key) {
        case 'christian':
          return 'If God is existence itself — "I AM that I AM" — then where is God not? What does that do to the idea of hell? Sit with that for a moment.';
        case 'muslim':
          return 'If Allah is Al-Rahman, the Most Merciful — and mercy is infinite — what can stand outside of that mercy? Take it seriously.';
        case 'jewish':
          return 'If Ein Sof is truly without end — if God fills all space — then what does exile really mean? What does return mean?';
        case 'hindu':
          return 'If Brahman is all, and maya is the veil — then who is behind the veil, looking? Is there actually a separation to dissolve?';
        case 'buddhist':
          return 'If form is emptiness and emptiness is form — who is the one recognizing this? Can the recognition itself be empty?';
        case 'agnostic':
          return 'You hold the space between belief and disbelief. What if that space itself is the answer — not a failure to decide, but a position with its own integrity?';
        case 'atheist':
          return 'Consciousness exists. That much is undeniable. The fact that anything experiences anything at all — does that feel like a problem that\'s actually been solved?';
        case 'spiritual':
          return 'If the divine is real and present — not distant, not metaphorical — why does it feel intermittent? Why doesn\'t the experience stay?';
        default:
          return paradox
            ? `You said something feels true and impossible at the same time. What would it mean if both sides of that were right — not as a compromise, but as a structure?`
            : 'What is the hardest question you\'ve never been able to answer about existence?';
      }
    },
    placeholder: 'Sit with it. Don\'t rush the answer.',
  },

  // ===== Q10: WHAT WOULD YOU BUILD =====
  {
    id: 'paradigm',
    type: 'textarea',
    getLabel: (answers) => {
      const name = answers.name || '';
      const addr = name ? `${name}, what` : 'What';
      return `${addr} would you be if nothing was holding you back? No belief system limiting you, no past defining you, no role to maintain. Not what you\'d do — what you\'d BE.`;
    },
    placeholder: 'The version of you with nothing in the way.',
  },

  // ===== Q11: ALREADY ENLIGHTENED =====
  {
    id: 'already_enlightened',
    type: 'textarea',
    getLabel: (answers) => {
      const term = faithTerm(answers, 'enlightenment');
      const name = answers.name || '';
      return name
        ? `${name} — what would your life look like if you realized, right now, with no further prerequisite, that you already have ${term}?`
        : `What would your life look like if you realized — right now, with no further prerequisite — that you already have ${term}?`;
    },
    placeholder: 'Not what changes in the world. What changes in you.',
  },

  // ===== Q12: DEATH =====
  {
    id: 'death',
    type: 'textarea',
    getLabel: (answers) => {
      const key = getFaithKey(answers);
      if (key === 'christian') {
        return 'What do you actually think happens when you die? Not what you were taught — what you think when you\'re alone with it at 3 AM.';
      }
      if (key === 'atheist') {
        return 'You probably believe consciousness ends at death. Does that thought feel settled, or does something in you resist it — even quietly?';
      }
      if (key === 'buddhist') {
        return 'What do you think actually happens at the moment of death? Not the doctrine — your felt sense of it.';
      }
      return 'What do you think happens when you die? Say what you actually believe — not what you\'re supposed to believe.';
    },
    placeholder: 'The honest version.',
  },

  // ===== Q13: MOST ALIVE =====
  {
    id: 'resonance',
    type: 'textarea',
    getLabel: (answers) => {
      // Reactive — pull from their earlier answers
      const paradigm = (answers.paradigm || '').toLowerCase();
      if (paradigm.includes('free') || paradigm.includes('create') || paradigm.includes('art') || paradigm.includes('write')) {
        return 'You described a version of yourself connected to creation. Tell me: what song, book, film, or moment in your life has gotten closest to saying the thing you can\'t say?';
      }
      return 'What song, book, film, or single moment in your life has gotten closest to saying the thing you can\'t quite say?';
    },
    placeholder: 'Name it. Say why, even loosely.',
  },

  // ===== Q14: THE PERSON =====
  {
    id: 'person',
    type: 'textarea',
    getLabel: (answers) => {
      const name = answers.name || '';
      return name
        ? `${name}, who shaped you most — for better or worse? Not their name necessarily. What they gave you, or what they cost you.`
        : 'Who shaped you most — for better or worse? Not their name necessarily. What they gave you, or what they cost you.';
    },
    placeholder: 'The person whose voice you still hear.',
  },

  // ===== Q15: WHAT HAVEN'T I ASKED =====
  {
    id: 'final_word',
    type: 'textarea',
    getLabel: (answers) => {
      const name = answers.name || 'friend';
      return `Last question, ${name}. What haven\'t I asked that I should have? What\'s the thing sitting underneath all of this that none of these questions quite reached?`;
    },
    placeholder: 'This is your space. Say whatever needs to be said.',
  },
];

/**
 * Resolve a question's label given current answers.
 */
export function resolveLabel(question, answers) {
  if (question.getLabel) return question.getLabel(answers);
  return question.label;
}

/**
 * Check if a question should be shown.
 */
export function shouldShow(question, answers) {
  if (question.condition) return question.condition(answers);
  return true;
}

/**
 * Get the visible question list for the current state of answers.
 */
export function getVisibleQuestions(answers) {
  return questions.filter(q => shouldShow(q, answers));
}

/**
 * Get faith key for external use
 */
export { getFaithKey };
