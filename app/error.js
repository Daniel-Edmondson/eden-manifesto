'use client';

export default function GlobalError({ error, reset }) {
  return (
    <main className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#c8b896' }}>
      <div className="max-w-md text-center">
        <h1 className="font-serif text-2xl mb-4" style={{ color: '#ffffff' }}>Something went wrong.</h1>
        <p className="text-base mb-4" style={{ color: 'rgba(255,255,255,0.8)' }}>
          {error?.message || 'An unexpected error occurred.'}
        </p>
        <button
          onClick={() => {
            try {
              sessionStorage.clear();
            } catch (_) {}
            reset();
          }}
          className="px-6 py-3 rounded-full text-white font-medium"
          style={{ backgroundColor: '#4a6741' }}
        >
          Try again
        </button>
        <p className="mt-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
          <a href="mailto:danieledmondson45@gmail.com">danieledmondson45@gmail.com</a>
        </p>
      </div>
    </main>
  );
}
