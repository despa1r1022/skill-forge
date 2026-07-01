import type { SkillEntry } from "../../types";

interface SkillToolbarProps {
  skill: SkillEntry;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function SkillToolbar({ skill, onToggle, onEdit, onDelete }: SkillToolbarProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onToggle}
        className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
          skill.enabled
            ? "bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100"
            : "bg-green-50 text-green-600 border border-green-200 hover:bg-green-100"
        }`}
      >
        {skill.enabled ? "Disable" : "Enable"}
      </button>
      <button
        onClick={onEdit}
        className="text-xs px-3 py-1.5 bg-primary-50 text-primary-600 border border-primary-200 rounded-md hover:bg-primary-100 transition-colors"
      >
        Edit
      </button>
      <button
        onClick={onDelete}
        className="text-xs px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
      >
        Delete
      </button>
    </div>
  );
}
