import Card from './card';

export default function InitiativeCard({ title, description, status, eta }) {
  return (
    <Card className="space-y-3">
      <div>
        <p className="text-xs uppercase tracking-wide text-primary-600">{status}</p>
        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      </div>
      <p className="text-sm text-slate-600">{description}</p>
      <p className="text-xs text-slate-500">Target milestone • {eta}</p>
    </Card>
  );
}
