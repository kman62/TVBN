import Link from 'next/link';
import clsx from 'clsx';

export default function PageHeader({ eyebrow, title, description, cta }) {
  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white px-6 py-8 shadow-sm">
      {eyebrow ? <p className="text-sm uppercase tracking-wide text-primary-600">{eyebrow}</p> : null}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">{title}</h1>
        {description ? <p className="text-lg text-slate-600">{description}</p> : null}
      </div>
      {cta ? (
        <Link
          href={cta.href}
          className={clsx(
            'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold shadow-sm',
            'bg-primary-600 text-white hover:bg-primary-500'
          )}
        >
          {cta.label}
        </Link>
      ) : null}
    </section>
  );
}
