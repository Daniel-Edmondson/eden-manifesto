/**
 * THE EDEN PROJECT — ADAPTIVE QUESTION TREE
 *
 * 15 questions with full branching logic.
 * Key branch points: faith system, search state, relationship with control.
 *
 * Each question has:
 *   id: unique identifier
 *   label: the question text (can be a function of prior answers)
 *   type: 'text' | 'textarea' | 'select'
 *   placeholder: hint text
 *   options: for select-type questions
 *   getLabel: optional function(answers) => string for adaptive phrasing
 *   condition: optional function(answers) => boolean — if false, skip this question
 *   next: optional function(answers) => questionId — override default sequential flow
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
      christian: 'salvation — or the peace that surpasses understanding',
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

  // ===== Q2: SEARCH STATE =====
  {
    id: 'search_state',
    label: 'Which of these sounds most like where you are right now?',
    type: 'select',
    options: [
      { value: 'searching', label: 'I\'m searching for something — truth, meaning, peace — and I haven\'t found it yet.' },
      { value: 'found', label: 'I think I\'ve found what\'s true for me, but I want to go deeper.' },
      { value: 'stopped', label: 'I stopped searching. I\'m not sure there\'s anything to find.' },
      { value: 'unsure', label: 'I don\'t know what I\'m looking for. Something just feels incomplete.' },
    ],
  },

  // ===== Q3: FAITH SYSTEM — THE BIG BRANCH =====
  {
    id: 'faith_system',
    label: 'What belief system, if any, do you identify with?',
    type: 'select',
    options: [
      { value: 'christian', label: 'Christian' },
      { value: 'muslim', label: 'Muslim' },
      { value: 'jewish', label: 'Jewish' },
      { value: 'hindu', label: 'Hindu' },
      { value: 'buddhist', label: 'Buddhist' },
      { value: 'agnostic', label: 'Agnostic' },
      { value: 'atheist', label: 'Atheist' },
      { value: 'spiritual', label: 'Spiritual but not religious' },
      { value: 'other', label: 'Something else' },
    ],
  },

  // ===== Q4: FAITH DEPTH — ADAPTIVE =====
  {
    id: 'faith_depth',
    type: 'textarea',
    getLabel: (answers) => {
      const key = getFaithKey(answers);
      switch (key) {
        case 'christian':
          return 'Does your faith make complete sense to you? Where does it hold — and where does it strain?';
        case 'muslim':
          return 'How complete is your trust in Allah? Where does your faith feel solid, and where do you wrestle with it?';
        case 'jewish':
          return 'How do you hold the tension between tradition and your own experience? Where does your faith feel alive?';
        case 'hindu':
          return 'How do you experience the relationship between atman and Brahman in your daily life? Where does clarity come, and where does it leave?';
        case 'buddhist':
          return 'How do you relate to the idea of attachment? Where does your practice feel alive, and where does it feel like effort?';
        case 'agnostic':
          return 'What made you stop short of belief — or disbelief? What would it take for you to land somewhere?';
        case 'atheist':
          return 'What took the place of belief for you? And does it fully account for the experience of being conscious?';
        case 'spiritual':
          return 'What does your spirituality actually look like day to day? Where does it hold you, and where does it fall short?';
        default:
          return 'Describe your relationship with belief. What do you hold onto — and what have you let go?';
      }
    },
    placeholder: 'Be honest. This shapes everything that follows.',
  },

  // ===== Q5: CONTROL — THE KERNEL =====
  {
    id: 'control',
    type: 'textarea',
    label: 'Do you feel like you\'re in control of your own thoughts? Not your actions — your thoughts. The ones that show up uninvited.',
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

  // ===== Q7: SUFFERING — ADAPTIVE =====
  {
    id: 'suffering',
    type: 'textarea',
    getLabel: (answers) => {
      const state = answers.search_state;
      if (state === 'stopped') {
        return 'You said you stopped searching. What made you stop? Was it a moment, or a slow fade?';
      }
      if (state === 'found') {
        return 'Even having found something true — what still hurts? What hasn\'t the truth resolved?';
      }
      return 'What\'s the thing that won\'t stop hurting — the one you\'ve tried to think your way out of?';
    },
    placeholder: 'The pattern that keeps returning.',
  },

  // ===== Q8: PARADOX — THE TENSION =====
  {
    id: 'paradox',
    type: 'textarea',
    label: 'Is there something in your life that feels true and impossible at the same time? Two things that shouldn\'t both be real — but are.',
    placeholder: 'e.g., "I believe in God but I\'m angry at God," "I want freedom but I\'m afraid of it"...',
  },

  // ===== Q9: FAITH-SPECIFIC DEEP QUESTION =====
  {
    id: 'faith_deep',
    type: 'textarea',
    getLabel: (answers) => {
      const key = getFaithKey(answers);
      switch (key) {
        case 'christian':
          return 'If God is existence itself — "I AM that I AM" — then where is God not? What does that do to the idea of hell? Take it seriously for a moment.';
        case 'muslim':
          return 'If Allah is Al-Rahman, the Most Merciful — and mercy is infinite — what can stand outside of that mercy? Take it seriously.';
        case 'jewish':
          return 'If Ein Sof is truly without end — if God fills all space — then what does exile really mean? Take the question seriously.';
        case 'hindu':
          return 'If Brahman is all, and maya is the veil — then who is behind the veil, looking? Is there actually a separation?';
        case 'buddhist':
          return 'If form is emptiness and emptiness is form — who is the one recognizing this? Can the recognition itself be empty?';
        case 'agnostic':
          return 'You hold the space between belief and disbelief. What if that space itself is the answer — not a failure to decide, but a position?';
        case 'atheist':
          return 'Consciousness exists. That much is undeniable. The fact that anything experiences anything at all — does that feel like a problem that materialism has actually solved?';
        case 'spiritual':
          return 'If the divine is real and present — not distant, not metaphorical — why does it feel intermittent? Why doesn\'t the experience stay?';
        default:
          return 'What is the hardest question your belief system hasn\'t answered for you?';
      }
    },
    placeholder: 'Sit with it. Don\'t rush the answer.',
  },

  // ===== Q10: THE PARADIGM QUESTION =====
  {
    id: 'paradigm',
    type: 'textarea',
    label: 'What would you be if there was no paradigm holding you back? No belief system limiting you, no past defining you, no role to maintain.',
    placeholder: 'The version of you with nothing in the way.',
  },

  // ===== Q11: ALREADY ENLIGHTENED =====
  {
    id: 'already_enlightened',
    type: 'textarea',
    getLabel: (answers) => {
      const term = faithTerm(answers, 'enlightenment');
      return `What would your life look like if you realized — right now, with no further prerequisite — that you already have ${term}?`;
    },
    placeholder: 'Not what changes in the world. What changes in you.',
  },

  // ===== Q12: WHAT THEY BELIEVE ABOUT DEATH =====
  {
    id: 'death',
    type: 'textarea',
    getLabel: (answers) => {
      const key = getFaithKey(answers);
      if (key === 'christian') {
        return 'What do you actually think happens when you die? Not what you were taught in church — what you think when you\'re alone with it.';
      }
      if (key === 'atheist') {
        return 'You probably believe consciousness ends at death. Does that thought feel settled, or does something in you resist it?';
      }
      return 'What do you think happens when you die? Say what you actually believe, not what you\'re supposed to believe.';
    },
    placeholder: 'The honest version.',
  },

  // ===== Q13: ART / RESONANCE =====
  {
    id: 'resonance',
    type: 'textarea',
    label: 'What song, book, film, or conversation has gotten closest to saying the thing you can\'t say?',
    placeholder: 'Name it. Say why, even loosely.',
  },

  // ===== Q14: THE PERSON =====
  {
    id: 'person',
    type: 'textarea',
    label: 'Who shaped you most — for better or worse? Not their name necessarily, but what they gave you or what they cost you.',
    placeholder: 'The person whose voice you still hear.',
  },

  // ===== Q15: FINAL WORD =====
  {
    id: 'final_word',
    type: 'textarea',
    getLabel: (answers) => {
      const name = answers.name || 'friend';
      return `Last question, ${name}. Is there anything else you want me to know before I write this for you?`;
    },
    placeholder: 'Anything at all. This is your space.',
  },
];

/**
 * Resolve a question's label given current answers.
 * If the question has getLabel, call it. Otherwise return the static label.
 */
export function resolveLabel(question, answers) {
  if (question.getLabel) return question.getLabel(answers);
  return question.label;
}

/**
 * Check if a question should be shown given current answers.
 * If the question has a condition function, evaluate it.
 */
export function shouldShow(question, answers) {
  if (question.condition) return question.condition(answers);
  return true;
}

/**
 * Get the visible question list for the current state of answers.
 * This filters out questions whose conditions aren't met.
 */
export function getVisibleQuestions(answers) {
  return questions.filter(q => shouldShow(q, answers));
}

/**
 * Get faith key for external use (e.g., in framework.js)
 */
export { getFaithKey };
