import type { ToolInfo } from "../../types";

interface ToolSelectorProps {
  tools: ToolInfo[];
  selected: string;
  onChange: (id: string) => void;
}

export function ToolSelector({ tools, selected, onChange }: ToolSelectorProps) {
  const grouped = tools.reduce(
    (acc, t) => {
      if (t.installed) acc.installed.push(t);
      else acc.notInstalled.push(t);
      return acc;
    },
    { installed: [] as ToolInfo[], notInstalled: [] as ToolInfo[] }
  );

  const currentTool = tools.find((t) => t.id === selected);

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
        Tool
      </label>
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-sm bg-slate-50 border border-slate-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
      >
        {grouped.installed.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name} ({t.skill_count})
          </option>
        ))}
        {grouped.notInstalled.length > 0 && (
          <optgroup label="Not detected">
            {grouped.notInstalled.map((t) => (
              <option key={t.id} value={t.id} disabled>
                {t.name}
              </option>
            ))}
          </optgroup>
        )}
      </select>
      {currentTool && (
        <p className="text-xs text-slate-400 mt-1 truncate">
          {currentTool.description}
        </p>
      )}
    </div>
  );
}
