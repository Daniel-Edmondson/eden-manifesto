'use client';

import { useState, useRef, useEffect } from 'react';
import { OBreathing, ParticleField } from '../components/OSymbol';

export default function MirrorPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText]);

  useEffect(() => {
    if (started) inputRef.current?.focus();
  }, [started]);

  const startConversation = () => {
    setStarted(true);
    setMessages([{
      role: 'assistant',
      content: 'Something brought you here. Maybe curiosity, maybe restlessness, maybe a thought you can\'t quite finish. Whatever it is — say it. I\'m not going to summarize what you already know. I\'m interested in the thing underneath the thing.',
    }]);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);
    setStreamingText('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }].map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) throw new Error('Failed to get response');

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
        content: 'Something went quiet for a moment. Try again — say what you were saying.',
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

  // Pre-conversation screen
  if (!started) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-eden-dark relative">
        <ParticleField count={20} />
        <div className="max-w-lg text-center relative z-10">
          <OBreathing size={120} className="mx-auto mb-12 animate-fade-in" />

          <h1 className="font-serif text-3xl md:text-5xl font-light text-white/60 mb-6 animate-fade-in-d1">
            The Mirror
          </h1>

          <p className="text-white/25 text-base mb-4 leading-relaxed animate-fade-in-d2">
            A philosophical conversation with the framework itself.
            Ask it anything. It sees connections you have not seen.
          </p>

          <p className="text-white/15 text-sm mb-12 animate-fade-in-d3">
            This is not a search engine. This is not therapy.
            This is a mirror that talks back.
          </p>

          <button
            onClick={startConversation}
            className="px-10 py-4 bg-gold/10 border border-gold/30 text-gold text-sm tracking-wider hover:bg-gold/20 transition-all btn-glow animate-fade-in-d4"
          >
            Begin
          </button>

          <div className="mt-16 animate-fade-in-d5">
            <p className="text-xs text-white/10">Conversation starters:</p>
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              {[
                'What is the loss of control?',
                'I\'m torn between two things',
                'What does enlightenment actually mean?',
                'I don\'t believe in anything',
              ].map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setStarted(true);
                    setMessages([{
                      role: 'assistant',
                      content: 'Something brought you here. Maybe curiosity, maybe restlessness, maybe a thought you can\'t quite finish. Whatever it is — say it.',
                    }]);
                    setTimeout(() => {
                      setInput(prompt);
                    }, 500);
                  }}
                  className="text-xs px-3 py-1.5 border border-white/5 text-white/20 hover:text-white/40 hover:border-white/10 transition-colors rounded"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-eden-dark relative">
      <ParticleField count={15} />

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-8 relative z-10">
        <div className="max-w-2xl mx-auto space-y-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`chat-message ${
                msg.role === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              {msg.role === 'assistant' && (
                <p className="text-[10px] tracking-[0.2em] uppercase text-gold/30 mb-1.5">
                  The Mirror
                </p>
              )}
              <div
                className={`inline-block max-w-[85%] text-left ${
                  msg.role === 'user'
                    ? 'bg-gold/10 border border-gold/15 rounded-2xl rounded-br-sm px-5 py-3'
                    : 'text-white/60'
                }`}
              >
                <p className={`text-sm md:text-base leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user' ? 'text-gold/80' : 'font-serif text-white/60'
                }`}>
                  {msg.content}
                </p>
              </div>
            </div>
          ))}

          {/* Streaming text */}
          {streamingText && (
            <div className="chat-message text-left">
              <p className="text-[10px] tracking-[0.2em] uppercase text-gold/30 mb-1.5">
                The Mirror
              </p>
              <p className="font-serif text-sm md:text-base text-white/60 leading-relaxed whitespace-pre-wrap">
                {streamingText}
                <span className="inline-block w-1.5 h-4 bg-gold/40 ml-0.5 animate-pulse" />
              </p>
            </div>
          )}

          {/* Loading indicator */}
          {loading && !streamingText && (
            <div className="chat-message text-left">
              <p className="text-[10px] tracking-[0.2em] uppercase text-gold/30 mb-1.5">
                The Mirror
              </p>
              <div className="flex gap-1.5 py-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gold/30 animate-pulse" style={{ animationDelay: '0s' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-gold/30 animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-gold/30 animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* CTA bar — after enough messages */}
      {messages.length >= 6 && (
        <div className="px-4 py-3 bg-gold/[0.03] border-t border-gold/10 text-center animate-fade-in">
          <p className="text-xs text-white/25 mb-2">
            This conversation revealed something. Turn it into a permanent document.
          </p>
          <a
            href="/offering"
            className="text-xs text-gold/50 hover:text-gold transition-colors tracking-wider"
          >
            Get your philosophical guidebook →
          </a>
        </div>
      )}

      {/* Input area */}
      <div className="sticky bottom-16 bg-eden-dark/90 backdrop-blur-xl border-t border-white/5 px-4 md:px-6 py-4 relative z-10">
        <div className="max-w-2xl mx-auto flex gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Say something..."
            rows={1}
            className="flex-1 bg-white/[0.03] border border-white/5 rounded-lg px-4 py-3 text-sm text-white/70 placeholder:text-white/15 resize-none focus:border-gold/20 transition-colors"
            style={{ minHeight: '44px', maxHeight: '120px' }}
            onInput={(e) => {
              e.target.style.height = '44px';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="px-5 py-3 bg-gold/10 border border-gold/20 text-gold/60 text-sm rounded-lg hover:bg-gold/20 transition-all disabled:opacity-20 disabled:cursor-not-allowed flex-shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </div>
    </main>
  );
}
