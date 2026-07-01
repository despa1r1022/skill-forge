import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useTools } from "../../hooks/useTools";
import { useSkills } from "../../hooks/useSkills";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";

export function Layout() {
  const { t } = useTranslation();
  const { selectedTool, tools, setSelectedTool } = useTools();
  const { skills } = useSkills(selectedTool);
  const navigate = useNavigate();
  const { name: activeSkill } = useParams();
  const currentTool = tools.find((t) => t.id === selectedTool);

  const handleToolChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTool = e.target.value;
    setSelectedTool(newTool);
    navigate("/skills");
  }, [setSelectedTool, navigate]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-slate-800 to-slate-900 text-slate-100 flex flex-col shrink-0 shadow-xl">
        {/* App Header */}
        <div className="px-4 py-4 border-b border-slate-700/50">
          <h1 className="text-lg font-bold tracking-tight">
            <span className="text-indigo-400">Skill</span>Forge
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">{t("app.description")}</p>
        </div>

        {/* Tool Selector */}
        <div className="px-3 py-3 border-b border-slate-700/50">
          <label className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-1.5 block">
            {t("sidebar.tools")}
          </label>
          <select
            value={selectedTool}
            onChange={handleToolChange}
            className="w-full text-sm bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          >
            {tools
              .filter((t) => t.installed)
              .map((t) => (
                <option key={t.id} value={t.id} data-tool-option>
                  {t.name} · {t.skill_count}
                </option>
              ))}
            {tools.some((t) => !t.installed) && (
              <optgroup label="──────────────">
                {tools
                  .filter((t) => !t.installed)
                  .map((t) => (
                    <option key={t.id} value={t.id} disabled data-tool-option>
                      {t.name}
                    </option>
                  ))}
              </optgroup>
            )}
          </select>
          {currentTool && (
            <p className="text-[11px] text-slate-500 mt-1 truncate">
              {currentTool.description}
            </p>
          )}
        </div>

        {/* New Skill Button */}
        <div className="px-3 py-2">
          <button
            onClick={() => navigate("/skills/create")}
            className="w-full text-sm py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-all duration-200 font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
          >
            + {t("sidebar.newSkill")}
          </button>
        </div>

        {/* Skill count */}
        <div className="px-3 pb-1">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
            {t("sidebar.skills")} · {skills.length}
          </span>
        </div>

        {/* Skill List */}
        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
          {skills.map((skill) => {
            const isActive = activeSkill === skill.name;
            return (
              <button
                key={`${skill.tool_id}-${skill.name}`}
                onClick={() => navigate(`/skills/${skill.name}`)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-150 group ${
                  isActive
                    ? "bg-indigo-500/20 text-white border border-indigo-500/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-700/50 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      skill.enabled ? "bg-emerald-400" : "bg-rose-400"
                    }`}
                  />
                  <span className="text-sm truncate font-medium">{skill.name}</span>
                </div>
                {skill.description && (
                  <p className="text-[11px] text-slate-500 truncate mt-0.5 ml-4">
                    {skill.description}
                  </p>
                )}
              </button>
            );
          })}
          {skills.length === 0 && (
            <p className="text-xs text-slate-600 text-center py-6">
              {t("sidebar.noSkills")}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-3 py-2 border-t border-slate-700/50">
          <p className="text-[10px] text-slate-500 text-center">
            SkillForge v0.1.0
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-5xl mx-auto p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
