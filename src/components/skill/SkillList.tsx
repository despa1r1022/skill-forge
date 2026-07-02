import { useNavigate } from "react-router-dom";
import { useSkillsContext } from "../../hooks/useSkillsContext";

export function SkillList() {
  const { skills, loading } = useSkillsContext();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (skills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center animate-fadeIn">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 border border-gray-200 shadow-sm">
          <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-1">暂无技能</h3>
        <p className="text-sm text-gray-400 mb-4">点击 "+ 新建" 创建你的第一个技能</p>
        <button onClick={() => navigate("/skills/create")} className="px-4 py-2 bg-violet-600 text-white text-sm rounded-lg hover:bg-violet-500 transition-colors font-medium shadow-lg shadow-violet-500/20">
          创建技能
        </button>
      </div>
    );
  }

  return (
    <div className="animate-slideUp">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">所有技能</h2>
          <p className="text-sm text-gray-500">共 {skills.length} 个技能</p>
        </div>
        <button onClick={() => { navigate("/skills/create"); }} className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm rounded-lg transition-all font-medium shadow-lg shadow-violet-500/20">
          + 新建技能
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <div key={`${skill.tool_id}-${skill.name}`} onClick={() => navigate(`/skills/${skill.name}`)} className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:border-violet-300 hover:shadow-md hover:shadow-violet-500/5 transition-all duration-200 group">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-800 truncate flex-1 group-hover:text-violet-600 transition-colors">{skill.name}</h3>
              <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${skill.enabled ? "bg-emerald-400" : "bg-amber-400"}`} />
            </div>
            <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">{skill.description || "暂无描述"}</p>
            <div className="flex items-center gap-2 flex-wrap">
              {skill.version && <span className="text-[10px] px-1.5 py-0.5 bg-violet-50 text-violet-600 rounded font-medium">v{skill.version}</span>}
              <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded font-medium">{skill.format === "SkillMdYaml" ? "SKILL.md" : skill.format}</span>
              {!skill.enabled && <span className="text-[10px] px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded font-medium">已禁用</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
