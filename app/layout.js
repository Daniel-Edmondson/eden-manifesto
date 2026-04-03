import './globals.css';

export const metadata = {
  title: 'The Eden Project',
  description: 'You are already enlightened. You just don\'t know it yet. A personalized philosophical document built from your answers and a framework designed to show you what was always there.',
  openGraph: {
    title: 'The Eden Project',
    description: 'You are already enlightened. You just don\'t know it yet.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Eden Project',
    description: 'You are already enlightened. You just don\'t know it yet.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-midnight text-cream font-sans antialiased">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-midnight/80 backdrop-blur-xl border-b border-gold/10">
          <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
            <a href="/" className="text-sm font-medium text-gold hover:text-gold-light transition-colors tracking-[0.1em] uppercase">
              The Eden Project
            </a>
            <div className="flex items-center gap-8">
              <a href="/journey" className="text-sm text-cream/50 hover:text-gold transition-colors tracking-wide">
                Begin
              </a>
              <a href="/mirror" className="text-sm text-cream/50 hover:text-gold transition-colors tracking-wide">
                Mirror
              </a>
              <a href="/offering" className="text-sm text-cream/50 hover:text-gold transition-colors tracking-wide">
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
