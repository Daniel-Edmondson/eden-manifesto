'use client';

export default function QuestionnaireError({ error, reset }) {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-surface">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-2xl text-ink mb-4">Something went wrong.</h1>
        <p className="text-base text-ink-secondary mb-4">
          {error?.message || 'An unexpected error occurred.'}
        </p>
        <p className="text-sm text-ink-tertiary mb-8">
          Error details: {String(error)}
        </p>
        <button
          onClick={() => {
            // Clear potentially corrupt sessionStorage
            try {
              sessionStorage.removeItem('eden_generated_text');
              sessionStorage.removeItem('eden_pdf_base64');
              sessionStorage.removeItem('eden_gen_name');
              sessionStorage.removeItem('eden_gen_in_progress');
              sessionStorage.removeItem('eden_answers');
            } catch (_) {}
            reset();
          }}
          className="btn btn-primary mr-3"
        >
          Try again
        </button>
        <a
          href="mailto:danieledmondson45@gmail.com"
          className="text-base text-ink-secondary hover:text-ink transition-colors"
        >
          Contact Daniel
        </a>
      </div>
    </main>
  );
}
