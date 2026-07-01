interface TagBadgeProps {
  label: string;
  variant?: "default" | "primary" | "warning";
}

export function TagBadge({ label, variant = "default" }: TagBadgeProps) {
  const colors = {
    default: "bg-slate-100 text-slate-600",
    primary: "bg-primary-100 text-primary-700",
    warning: "bg-amber-100 text-amber-700",
  };

  return (
    <span className={`inline-block text-xs px-1.5 py-0.5 rounded font-medium ${colors[variant]}`}>
      {label}
    </span>
  );
}
