import Link from 'next/link';

const links = [
  { href: '/', label: 'Overview' },
  { href: '/(auth)/onboarding', label: 'Onboarding' },
  { href: '#initiatives', label: 'Initiatives' }
];

export default function MainNav() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="container mx-auto flex items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
        <Link href="/" className="text-lg font-semibold text-primary-600">
          TVBN
        </Link>
        <nav className="flex items-center gap-6 text-sm text-slate-600">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-primary-600">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
