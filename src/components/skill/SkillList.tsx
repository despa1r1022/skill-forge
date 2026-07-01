import { useNavigate } from "react-router-dom";
import { useTools } from "../../hooks/useTools";
import { useSkills } from "../../hooks/useSkills";

export function SkillList() {
  const { selectedTool } = useTools();
  const { skills, loading } = useSkills(selectedTool);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400">加载技能列表...</p>
        </div>
      </div>
    );
  }

  if (skills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-700 mb-1">暂无技能</h3>
        <p className="text-sm text-slate-400 mb-4">点击 "+ 新建" 创建你的第一个技能</p>
        <button
          onClick={() => navigate("/skills/create")}
          className="px-4 py-2 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600 transition-colors font-medium"
        >
          创建技能
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">所有技能</h2>
          <p className="text-sm text-slate-500">共 {skills.length} 个技能</p>
        </div>
        <button
          onClick={() => navigate("/skills/create")}
          className="px-4 py-2 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600 transition-all font-medium shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30"
        >
          + 新建技能
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <div
            key={`${skill.tool_id}-${skill.name}`}
            onClick={() => navigate(`/skills/${skill.name}`)}
            className="bg-white border border-slate-200 rounded-xl p-5 cursor-pointer hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-200 group"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-800 truncate flex-1 group-hover:text-indigo-600 transition-colors">
                {skill.name}
              </h3>
              <span
                className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${
                  skill.enabled ? "bg-emerald-400" : "bg-rose-400"
                }`}
              />
            </div>
            <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
              {skill.description || "暂无描述"}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {skill.version && (
                <span className="text-[10px] px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-md font-medium border border-indigo-100">
                  v{skill.version}
                </span>
              )}
              <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-md font-medium border border-slate-200">
                {skill.format === "SkillMdYaml" ? "SKILL.md" : skill.format}
              </span>
              {skill.subdirs.length > 0 && (
                <span className="text-[10px] text-slate-400">
                  {skill.subdirs.length} 个子目录
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
