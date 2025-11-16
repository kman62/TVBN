export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container mx-auto flex flex-col gap-2 px-6 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <p>© {year} TVBN • Built on Next.js 14</p>
        <p>Scaffold ready for Activity Feed, Visitor CRM, and Content Studio.</p>
      </div>
    </footer>
  );
}
