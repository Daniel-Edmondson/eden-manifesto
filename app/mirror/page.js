'use client';

import { useState, useRef, useEffect } from 'react';
import { OBreathing, SacredGeometry } from '../components/OSymbol';

// ===== CONVERSATION MEMORY =====
const MIRROR_MEMORY_KEY = 'eden_mirror_memory';
const MIRROR_MESSAGES_KEY = 'eden_mirror_messages';

function saveMirrorMemory(messages) {
  if (typeof window === 'undefined') return;
  try {
    // Save last 10 messages for context
    const recent = messages.slice(-10);
    localStorage.setItem(MIRROR_MESSAGES_KEY, JSON.stringify(recent));

    // Build a lightweight summary of themes discussed
    const userMessages = messages
      .filter(m => m.role === 'user')
      .map(m => m.content)
      .join(' ');

    // Save the raw user text for theme extraction by the API
    if (userMessages.length > 20) {
      localStorage.setItem(MIRROR_MEMORY_KEY, JSON.stringify({
        lastVisit: new Date().toISOString(),
        messageCount: messages.length,
        userText: userMessages.slice(0, 1500), // Keep it manageable
      }));
    }
  } catch (e) {}
}

function loadMirrorMemory() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(MIRROR_MEMORY_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    // Only use memory from last 30 days
    const lastVisit = new Date(data.lastVisit);
    const daysSince = (Date.now() - lastVisit.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince > 30) {
      localStorage.removeItem(MIRROR_MEMORY_KEY);
      localStorage.removeItem(MIRROR_MESSAGES_KEY);
      return null;
    }
    return data;
  } catch (e) { return null; }
}

function buildReturningContext(memory) {
  if (!memory) return '';
  const daysSince = Math.floor((Date.now() - new Date(memory.lastVisit).getTime()) / (1000 * 60 * 60 * 24));
  const timeAgo = daysSince === 0 ? 'earlier today' : daysSince === 1 ? 'yesterday' : `${daysSince} days ago`;
  return `\n\nRETURNING USER SUMMARY: This person was here ${timeAgo} and exchanged ${memory.messageCount} messages. Here is what they said last time (their words only): "${memory.userText}"\n\nGreet them with recognition. Reference what you discussed. Ask what shifted since last time. Do not start from scratch.`;
}

export default function MirrorPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [isReturning, setIsReturning] = useState(false);
  const [deepEngagement, setDeepEngagement] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const memoryRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText]);

  useEffect(() => {
    if (started) inputRef.current?.focus();
  }, [started]);

  // Check for returning user
  useEffect(() => {
    const memory = loadMirrorMemory();
    if (memory) {
      memoryRef.current = memory;
      setIsReturning(true);
    }
  }, []);

  // Track deep engagement for contextual bridge
  useEffect(() => {
    const userMsgCount = messages.filter(m => m.role === 'user').length;
    if (userMsgCount >= 4 && !deepEngagement) {
      setDeepEngagement(true);
    }
  }, [messages]);

  // Save conversation memory periodically
  useEffect(() => {
    if (messages.length >= 4) {
      saveMirrorMemory(messages);
    }
  }, [messages]);

  const startConversation = () => {
    setStarted(true);

    if (isReturning && memoryRef.current) {
      // Returning user — the opening message signals recognition
      setMessages([{
        role: 'assistant',
        content: 'You came back. Something is still working on you — or you\'re still working on it. Either way, I remember. What\'s shifted since we last talked?',
      }]);
    } else {
      setMessages([{
        role: 'assistant',
        content: 'Something brought you here. Maybe curiosity, maybe restlessness, maybe a thought you can\'t quite finish. Whatever it is — say it.',
      }]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);
    setStreamingText('');

    try {
      // Build context with returning user memory if available
      const returningContext = isReturning ? buildReturningContext(memoryRef.current) : '';
      const allMessages = [...messages, { role: 'user', content: userMessage }];

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: allMessages.map(m => ({
            role: m.role,
            content: m.content,
          })),
          returningContext,
        }),
      });

      if (!res.ok) throw new Error('Failed');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setStreamingText(fullText);
      }

      setMessages(prev => [...prev, { role: 'assistant', content: fullText }]);
      setStreamingText('');
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Something went quiet for a moment. Try again.',
      }]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Pre-start
  if (!started) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-surface relative overflow-hidden">
        <SacredGeometry opacity={0.05} />

        <div className="relative max-w-md text-center page-enter z-10">
          <OBreathing size={100} className="mx-auto mb-10" />

          <h1 className="font-serif text-heading text-ink mb-4">
            The Mirror
          </h1>

          {isReturning ? (
            <>
              <p className="text-lg text-ink-secondary leading-relaxed mb-4">
                You've been here before.
              </p>
              <p className="text-base text-ink-secondary mb-10">
                Something brought you back. Pick up where you left off.
              </p>
            </>
          ) : (
            <>
              <p className="text-lg text-ink-secondary leading-relaxed mb-4">
                A philosophical conversation. It sees connections you haven't seen.
              </p>
              <p className="text-base text-ink-secondary mb-10">
                A framework, speaking.
              </p>
            </>
          )}

          <button
            onClick={startConversation}
            className="btn btn-primary"
          >
            {isReturning ? 'Continue' : 'Begin'}
          </button>

          {!isReturning && (
            <div className="mt-14">
              <p className="text-xs text-ink-secondary mb-3 tracking-[0.15em] uppercase">Try saying</p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  'I can\'t stop thinking about something',
                  'I\'m afraid of what I\'d do if I let go',
                  'Nothing makes sense anymore',
                  'I think I might already know the answer',
                ].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setStarted(true);
                      setMessages([{
                        role: 'assistant',
                        content: 'Something brought you here. Whatever it is — say it.',
                      }]);
                      setTimeout(() => setInput(prompt), 300);
                    }}
                    className="text-sm px-4 py-2 border border-white/[0.2] text-ink-secondary hover:text-ink hover:border-white/[0.4] transition-colors rounded-full"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-surface relative">
      {/* Messages */}
      <div className="relative flex-1 overflow-y-auto px-4 md:px-6 py-8 z-10">
        <div className="max-w-2xl mx-auto space-y-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`chat-message ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
            >
              {msg.role === 'assistant' && (
                <p className="text-xs tracking-[0.2em] uppercase text-ink-tertiary mb-1">
                  The Mirror
                </p>
              )}
              <div
                className={`inline-block max-w-[85%] text-left ${
                  msg.role === 'user'
                    ? 'bg-accent text-white rounded-2xl rounded-br-sm px-5 py-3'
                    : ''
                }`}
              >
                <p className={`text-base md:text-lg leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user' ? 'text-white' : 'font-serif text-ink-secondary'
                }`}>
                  {msg.content}
                </p>
              </div>
            </div>
          ))}

          {/* Streaming */}
          {streamingText && (
            <div className="chat-message text-left">
              <p className="text-xs tracking-[0.2em] uppercase text-ink-tertiary mb-1">
                The Mirror
              </p>
              <p className="font-serif text-base md:text-lg text-ink-secondary leading-relaxed whitespace-pre-wrap">
                {streamingText}
                <span className="inline-block w-1 h-5 bg-white/50 ml-0.5 animate-pulse" />
              </p>
            </div>
          )}

          {/* Loading */}
          {loading && !streamingText && (
            <div className="chat-message text-left">
              <p className="text-xs tracking-[0.2em] uppercase text-ink-tertiary mb-1">
                The Mirror
              </p>
              <div className="flex gap-1.5 py-2">
                <div className="w-2 h-2 rounded-full bg-white/35 animate-pulse" style={{ animationDelay: '0s' }} />
                <div className="w-2 h-2 rounded-full bg-white/35 animate-pulse" style={{ animationDelay: '0.15s' }} />
                <div className="w-2 h-2 rounded-full bg-white/35 animate-pulse" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Contextual bridge — appears when deeply engaged */}
      {deepEngagement && (
        <div className="relative px-4 py-3 bg-surface-secondary border-t border-white/[0.12] text-center z-10">
          <a
            href="/journey"
            className="text-sm text-ink-secondary hover:text-ink transition-colors"
          >
            Ready to go deeper? Fifteen questions, then a document written for you &rarr;
          </a>
        </div>
      )}

      {/* Input */}
      <div className="relative sticky bottom-0 bg-surface/95 backdrop-blur-xl border-t border-white/[0.15] px-4 md:px-6 py-4 z-10">
        <div className="max-w-2xl mx-auto flex gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Say something..."
            rows={1}
            className="flex-1 bg-surface-secondary border border-white/[0.15] rounded-xl px-4 py-3 text-base text-ink placeholder:text-ink-tertiary resize-none focus:border-white/[0.3] transition-colors"
            style={{ minHeight: '44px', maxHeight: '120px' }}
            onInput={(e) => {
              e.target.style.height = '44px';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="px-4 py-3 bg-accent text-white rounded-xl hover:bg-accent-muted transition-colors disabled:opacity-20 disabled:cursor-not-allowed flex-shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </div>
    </main>
  );
}
