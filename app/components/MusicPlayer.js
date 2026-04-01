'use client';

import { useState, useEffect, useCallback } from 'react';
import { tracks, getSpotifySearchUrl, getSpotifyEmbedUrl } from '../../lib/tracks';

export default function MusicPlayer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showSuggest, setShowSuggest] = useState(false);
  const [suggestValue, setSuggestValue] = useState('');
  const [suggestSent, setSuggestSent] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [shuffleOrder, setShuffleOrder] = useState([]);

  // Fade in after a moment
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Generate shuffle order
  useEffect(() => {
    if (shuffle) {
      const order = [...Array(tracks.length).keys()];
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
      setShuffleOrder(order);
    }
  }, [shuffle]);

  const getActualIndex = useCallback((idx) => {
    if (shuffle && shuffleOrder.length > 0) {
      return shuffleOrder[idx % shuffleOrder.length];
    }
    return idx % tracks.length;
  }, [shuffle, shuffleOrder]);

  const currentTrack = tracks[getActualIndex(currentIndex)];
  const embedUrl = getSpotifyEmbedUrl(currentTrack);
  const searchUrl = getSpotifySearchUrl(currentTrack);

  const next = () => setCurrentIndex((i) => (i + 1) % tracks.length);
  const prev = () => setCurrentIndex((i) => (i - 1 + tracks.length) % tracks.length);

  const handleSuggest = async () => {
    if (!suggestValue.trim()) return;
    try {
      await fetch('/api/suggest-song', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suggestion: suggestValue.trim() }),
      });
      setSuggestSent(true);
      setTimeout(() => {
        setSuggestSent(false);
        setShowSuggest(false);
        setSuggestValue('');
      }, 2000);
    } catch (e) {
      // Silently fail
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ${
        isExpanded ? 'h-auto max-h-[80vh]' : 'h-16'
      }`}
    >
      {/* Playlist overlay */}
      {showPlaylist && isExpanded && (
        <div className="bg-eden-dark/95 backdrop-blur-xl border-t border-white/5 max-h-[60vh] overflow-y-auto">
          <div className="max-w-2xl mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs tracking-[0.2em] uppercase text-gold/60">
                Playlist — {tracks.length} tracks
              </span>
              <button
                onClick={() => setShowSuggest(!showSuggest)}
                className="text-xs text-gold/40 hover:text-gold transition-colors"
              >
                {showSuggest ? 'Close' : 'Suggest a song'}
              </button>
            </div>

            {showSuggest && (
              <div className="mb-4 flex gap-2 animate-fade-in">
                <input
                  type="text"
                  value={suggestValue}
                  onChange={(e) => setSuggestValue(e.target.value)}
                  placeholder="Song name — Artist"
                  className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white/80 placeholder:text-white/20 focus:border-gold/30"
                  onKeyDown={(e) => e.key === 'Enter' && handleSuggest()}
                />
                <button
                  onClick={handleSuggest}
                  className="px-4 py-2 bg-gold/20 text-gold text-xs rounded hover:bg-gold/30 transition-colors"
                >
                  {suggestSent ? 'Sent' : 'Send'}
                </button>
              </div>
            )}

            {tracks.map((track, i) => {
              const actualI = getActualIndex(currentIndex);
              const isCurrent = i === actualI;
              return (
                <button
                  key={i}
                  onClick={() => {
                    // Find the position in the current order that maps to this track
                    if (shuffle) {
                      const pos = shuffleOrder.indexOf(i);
                      if (pos !== -1) setCurrentIndex(pos);
                    } else {
                      setCurrentIndex(i);
                    }
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded transition-all flex items-center gap-3 ${
                    isCurrent
                      ? 'bg-gold/10 text-gold'
                      : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                  }`}
                >
                  <span className="text-xs w-6 text-right opacity-40">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm truncate block">{track.title}</span>
                    <span className="text-xs opacity-50 truncate block">{track.artist}</span>
                  </div>
                  {isCurrent && (
                    <div className="flex gap-0.5 items-end h-3">
                      <div className="w-0.5 bg-gold animate-pulse" style={{ height: '8px', animationDelay: '0s' }} />
                      <div className="w-0.5 bg-gold animate-pulse" style={{ height: '12px', animationDelay: '0.15s' }} />
                      <div className="w-0.5 bg-gold animate-pulse" style={{ height: '6px', animationDelay: '0.3s' }} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Spotify embed (hidden when collapsed) */}
      {isExpanded && !showPlaylist && (
        <div className="bg-eden-dark/95 backdrop-blur-xl border-t border-white/5 p-4">
          <div className="max-w-xl mx-auto">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="spotify-embed"
              />
            ) : (
              <div className="text-center py-6">
                <p className="text-white/40 text-sm mb-3">
                  {currentTrack.title} — {currentTrack.artist}
                </p>
                <a
                  href={searchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1DB954] text-white text-sm rounded-full hover:bg-[#1ed760] transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                  Listen on Spotify
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Compact player bar */}
      <div className="music-player-bar bg-eden-dark/90 h-16 flex items-center px-4 animate-slide-up">
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between gap-4">
          {/* Track info */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-3 min-w-0 flex-1 text-left group"
          >
            {/* Visualizer dots */}
            <div className="flex gap-0.5 items-end h-4 flex-shrink-0">
              <div className="w-0.5 bg-gold/60 rounded-full animate-pulse" style={{ height: '6px', animationDelay: '0s' }} />
              <div className="w-0.5 bg-gold/60 rounded-full animate-pulse" style={{ height: '14px', animationDelay: '0.2s' }} />
              <div className="w-0.5 bg-gold/60 rounded-full animate-pulse" style={{ height: '10px', animationDelay: '0.1s' }} />
              <div className="w-0.5 bg-gold/60 rounded-full animate-pulse" style={{ height: '16px', animationDelay: '0.3s' }} />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-white/80 truncate group-hover:text-gold transition-colors">
                {currentTrack.title}
              </p>
              <p className="text-xs text-white/30 truncate">{currentTrack.artist}</p>
            </div>
            <svg
              className={`w-3 h-3 text-white/20 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>

          {/* Controls */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button onClick={prev} className="text-white/30 hover:text-white/70 transition-colors p-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
              </svg>
            </button>

            <button onClick={next} className="text-white/30 hover:text-white/70 transition-colors p-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 18h2V6h-2zM5.5 12l8.5-6v12z" transform="scale(-1,1) translate(-24,0)"/>
              </svg>
            </button>

            <button
              onClick={() => setShuffle(!shuffle)}
              className={`p-1 transition-colors ${shuffle ? 'text-gold' : 'text-white/20 hover:text-white/50'}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
              </svg>
            </button>

            <button
              onClick={() => { setShowPlaylist(!showPlaylist); if (!isExpanded) setIsExpanded(true); }}
              className={`p-1 transition-colors ${showPlaylist ? 'text-gold' : 'text-white/20 hover:text-white/50'}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
