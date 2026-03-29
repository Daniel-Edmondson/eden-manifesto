import './globals.css';

export const metadata = {
  title: 'The Eden Project — Your Personal Philosophical Guidebook of Enlightenment',
  description: 'A custom-written philosophical guidebook that applies a rigorous philosophical framework to your specific life. Not self-help. Not generic. Yours.',
  openGraph: {
    title: 'The Eden Project — Your Personal Philosophical Guidebook of Enlightenment',
    description: 'A custom-written philosophical guidebook that applies a rigorous philosophical framework to your specific life.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Eden Project — Your Personal Philosophical Guidebook of Enlightenment',
    description: 'A custom-written philosophical guidebook that applies a rigorous philosophical framework to your specific life.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-black font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
