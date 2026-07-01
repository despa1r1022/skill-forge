import { useNavigate } from "react-router-dom";
import type { SkillEntry } from "../../types";
import { StatusBadge } from "../shared/StatusBadge";
import { TagBadge } from "../shared/TagBadge";

interface SkillCardProps {
  skill: SkillEntry;
}

export function SkillCard({ skill }: SkillCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/skills/${skill.name}`)}
      className="bg-white border border-slate-200 rounded-lg p-4 cursor-pointer hover:border-primary-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-slate-800 truncate flex-1">
          {skill.name}
        </h3>
        <StatusBadge enabled={skill.enabled} />
      </div>
      <p className="text-xs text-slate-500 line-clamp-2 mb-3">
        {skill.description || "No description"}
      </p>
      <div className="flex items-center gap-2">
        {skill.version && (
          <TagBadge label={`v${skill.version}`} variant="primary" />
        )}
        <TagBadge label={skill.format} />
        {skill.subdirs.length > 0 && (
          <span className="text-xs text-slate-400">
            {skill.subdirs.length} subdirs
          </span>
        )}
      </div>
    </div>
  );
}
