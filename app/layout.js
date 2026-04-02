import './globals.css';

export const metadata = {
  title: 'The Eden Project',
  description: 'A personalized philosophical document built from your answers, your search, and a framework designed to meet you where you are.',
  openGraph: {
    title: 'The Eden Project',
    description: 'A personalized philosophical document built from your answers and a framework designed to meet you where you are.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Eden Project',
    description: 'A personalized philosophical document built from your answers and a framework designed to meet you where you are.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-eden-900 font-sans antialiased">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-eden-200/60">
          <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
            <a href="/" className="text-sm font-medium text-eden-900 hover:text-eden-600 transition-colors">
              The Eden Project
            </a>
            <div className="flex items-center gap-8">
              <a href="/journey" className="text-sm text-eden-500 hover:text-eden-900 transition-colors">
                Begin
              </a>
              <a href="/mirror" className="text-sm text-eden-500 hover:text-eden-900 transition-colors">
                Mirror
              </a>
              <a href="/offering" className="text-sm text-eden-500 hover:text-eden-900 transition-colors">
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
