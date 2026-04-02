'use client';

import { useState, useRef, useEffect } from 'react';
import { OBreathing } from '../components/OSymbol';

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
      content: 'Something brought you here. Maybe curiosity, maybe restlessness, maybe a thought you can\'t quite finish. Whatever it is — say it.',
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
      <main className="min-h-screen flex items-center justify-center px-6 bg-white">
        <div className="max-w-md text-center page-enter">
          <OBreathing size={100} className="mx-auto mb-10" />

          <h1 className="font-serif text-heading text-eden-900 mb-4">
            The Mirror
          </h1>

          <p className="text-base text-eden-500 leading-relaxed mb-4">
            A philosophical conversation. Ask it anything.
            It sees connections you haven't seen.
          </p>

          <p className="text-sm text-eden-400 mb-10">
            This is not a search engine. This is not therapy.
          </p>

          <button
            onClick={startConversation}
            className="btn btn-primary"
          >
            Begin
          </button>

          <div className="mt-14">
            <p className="text-xs text-eden-300 mb-3">Try asking:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                'What is the loss of control?',
                'I\'m torn between two things',
                'I don\'t believe in anything',
                'What is enlightenment?',
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
                  className="text-xs px-3 py-1.5 border border-eden-200 text-eden-500 hover:text-eden-800 hover:border-eden-400 transition-colors rounded-full"
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
    <main className="min-h-screen flex flex-col bg-white">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`chat-message ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
            >
              {msg.role === 'assistant' && (
                <p className="text-[10px] tracking-wider uppercase text-eden-300 mb-1">
                  The Mirror
                </p>
              )}
              <div
                className={`inline-block max-w-[85%] text-left ${
                  msg.role === 'user'
                    ? 'bg-eden-900 text-white rounded-2xl rounded-br-sm px-5 py-3'
                    : ''
                }`}
              >
                <p className={`text-sm md:text-base leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user' ? 'text-white' : 'font-serif text-eden-700'
                }`}>
                  {msg.content}
                </p>
              </div>
            </div>
          ))}

          {/* Streaming */}
          {streamingText && (
            <div className="chat-message text-left">
              <p className="text-[10px] tracking-wider uppercase text-eden-300 mb-1">
                The Mirror
              </p>
              <p className="font-serif text-sm md:text-base text-eden-700 leading-relaxed whitespace-pre-wrap">
                {streamingText}
                <span className="inline-block w-1 h-4 bg-eden-400 ml-0.5 animate-pulse" />
              </p>
            </div>
          )}

          {/* Loading */}
          {loading && !streamingText && (
            <div className="chat-message text-left">
              <p className="text-[10px] tracking-wider uppercase text-eden-300 mb-1">
                The Mirror
              </p>
              <div className="flex gap-1 py-2">
                <div className="w-1.5 h-1.5 rounded-full bg-eden-300 animate-pulse" style={{ animationDelay: '0s' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-eden-300 animate-pulse" style={{ animationDelay: '0.15s' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-eden-300 animate-pulse" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* CTA after enough messages */}
      {messages.length >= 6 && (
        <div className="px-4 py-3 bg-eden-50 border-t border-eden-100 text-center">
          <a
            href="/offering"
            className="text-xs text-eden-500 hover:text-eden-800 transition-colors"
          >
            Turn this into a permanent document &rarr;
          </a>
        </div>
      )}

      {/* Input */}
      <div className="sticky bottom-0 bg-white border-t border-eden-100 px-4 md:px-6 py-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Say something..."
            rows={1}
            className="flex-1 bg-eden-50 border border-eden-200 rounded-xl px-4 py-3 text-sm text-eden-800 placeholder:text-eden-300 resize-none focus:border-eden-500 transition-colors"
            style={{ minHeight: '44px', maxHeight: '120px' }}
            onInput={(e) => {
              e.target.style.height = '44px';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="px-4 py-3 bg-eden-900 text-white rounded-xl hover:bg-eden-700 transition-colors disabled:opacity-20 disabled:cursor-not-allowed flex-shrink-0"
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
