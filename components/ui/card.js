import clsx from 'clsx';

export default function Card({ as: Component = 'section', className, children }) {
  return (
    <Component className={clsx('rounded-2xl border border-slate-200 bg-white p-6 shadow-sm', className)}>
      {children}
    </Component>
  );
}
