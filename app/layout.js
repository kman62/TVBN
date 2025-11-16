import './globals.css';
import MainNav from '@/components/navigation/main-nav';
import SiteFooter from '@/components/navigation/site-footer';

export const metadata = {
  title: 'TVBN Platform',
  description: 'Operational workspace for the visitor broadcast network.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <div className="flex min-h-screen flex-col">
          <MainNav />
          <main className="container mx-auto flex-1 px-6 py-10 sm:px-8 lg:px-12">
            {children}
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
