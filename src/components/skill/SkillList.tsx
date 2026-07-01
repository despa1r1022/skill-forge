import { useNavigate, useParams } from "react-router-dom";
import { useTools } from "../../hooks/useTools";
import { useSkills } from "../../hooks/useSkills";
import { SkillCard } from "./SkillCard";

export function SkillList() {
  const { selectedTool } = useTools();
  const { skills, loading } = useSkills(selectedTool);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-400">Loading skills...</p>
      </div>
    );
  }

  if (skills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-slate-400">No skills found for this tool</p>
        <a href="/skills/create" className="text-sm text-primary-500 hover:text-primary-600">
          + Create your first skill
        </a>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-800 mb-4">
        Skills ({skills.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <SkillCard key={`${skill.tool_id}-${skill.name}`} skill={skill} />
        ))}
      </div>
    </div>
  );
}
