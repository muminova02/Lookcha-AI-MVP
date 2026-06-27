interface TrafficBarProps {
  label: string;
  percent: number;
  value: number;
}

export default function TrafficBar({ label, percent, value }: TrafficBarProps) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium text-ink">{label}</span>
        <span className="text-muted">
          {value.toLocaleString("ru-RU").replace(/,/g, " ")} · {percent}%
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-container">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary-container transition-all"
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </div>
  );
}
