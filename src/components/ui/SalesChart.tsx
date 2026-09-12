import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export interface SalesPoint {
  label: string;
  amount: number;
}

export function SalesChart({ data }: { data: SalesPoint[] }) {
  return (
    <div className="h-64 w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-border)" />
          <XAxis dataKey="label" stroke="var(--ink-subtle)" fontSize={12} tickLine={false} />
          <YAxis stroke="var(--ink-subtle)" fontSize={12} tickLine={false} width={40} />
          <Tooltip
            contentStyle={{
              background: 'var(--surface-overlay)',
              border: '1px solid var(--surface-border)',
              borderRadius: 12,
              fontSize: 12,
            }}
          />
          <Line type="monotone" dataKey="amount" stroke="var(--brand-400)" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
