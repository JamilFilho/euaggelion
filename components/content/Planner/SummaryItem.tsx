interface SummaryItemProps {
  label: string;
  value: string;
}

export function SummaryItem({ label, value }: SummaryItemProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-ring/20 px-3 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}