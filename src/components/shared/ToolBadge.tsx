interface ToolBadgeProps {
  toolName: string;
}

export function ToolBadge({ toolName }: ToolBadgeProps) {
  return (
    <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200 font-medium">
      {toolName}
    </span>
  );
}
