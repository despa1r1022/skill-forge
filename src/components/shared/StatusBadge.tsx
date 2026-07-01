interface StatusBadgeProps {
  enabled: boolean;
}

export function StatusBadge({ enabled }: StatusBadgeProps) {
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${
        enabled ? "bg-green-400" : "bg-red-400"
      }`}
      title={enabled ? "Enabled" : "Disabled"}
    />
  );
}
