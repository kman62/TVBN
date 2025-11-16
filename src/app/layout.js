import './globals.css';

export const metadata = {
  title: 'Temecula Business Hub',
  description: 'AI-powered networking hub for Temecula Valley Business Network'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-slate-950 text-white">
      <body className="min-h-screen bg-slate-950 text-slate-50 antialiased">
        {children}
      </body>
    </html>
  );
}
