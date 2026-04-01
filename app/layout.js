import './globals.css';

export const metadata = {
  title: 'The Eden Project — Psychedelic Life Design',
  description: 'A guided philosophical experience that generates a personalized theory of everything for your life. The language of psychedelics without the psychedelics.',
  openGraph: {
    title: 'The Eden Project — Psychedelic Life Design',
    description: 'A guided philosophical experience that generates a personalized theory of everything for your life.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Eden Project',
    description: 'A guided philosophical experience that generates a personalized theory of everything for your life.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-eden-dark text-white font-sans antialiased">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-40 bg-eden-dark/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            <a href="/" className="text-xs tracking-[0.25em] uppercase text-gold/60 hover:text-gold transition-colors">
              The Eden Project
            </a>
            <div className="flex items-center gap-6">
              <a href="/journey" className="text-xs tracking-wider text-white/30 hover:text-white/70 transition-colors">
                Journey
              </a>
              <a href="/mirror" className="text-xs tracking-wider text-white/30 hover:text-white/70 transition-colors">
                Mirror
              </a>
              <a href="/offering" className="text-xs tracking-wider text-white/30 hover:text-white/70 transition-colors">
                Offering
              </a>
            </div>
          </div>
        </nav>

        {/* Page content */}
        <div className="pt-14">
          {children}
        </div>
      </body>
    </html>
  );
}
