import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useTools } from "../../hooks/useToolsContext";
import { useSkillsContext } from "../../hooks/useSkillsContext";
import { SkillsProvider } from "../../hooks/useSkillsContext";
import { useTranslation } from "react-i18next";
import { useCallback, useMemo, useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { api } from "../../lib/tauri";

function SidebarContent() {
  const { t } = useTranslation();
  const { selectedTool, tools, setSelectedTool, refresh: refreshTools } = useTools();
  const { skills, loading, refresh: refreshSkills } = useSkillsContext();
  const navigate = useNavigate();
  const { name: activeSkill } = useParams();
  const currentTool = tools.find((t) => t.id === selectedTool);
  const [search, setSearch] = useState("");
  const [importing, setImporting] = useState(false);

  const handleToolChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTool = e.target.value;
    setSelectedTool(newTool);
    setSearch("");
    navigate("/skills");
  }, [setSelectedTool, navigate]);

  const handleImport = useCallback(async () => {
    try {
      const selected = await open({ directory: true, multiple: false, title: "选择技能文件夹" });
      if (!selected) return;
      setImporting(true);
      const name = await api.importLocalSkill(selectedTool, selected as string);
      await refreshSkills();
      await refreshTools();
      navigate(`/skills/${name}`);
    } catch (err) {
      alert(`导入失败: ${err}`);
    } finally {
      setImporting(false);
    }
  }, [selectedTool, refreshSkills, refreshTools, navigate]);

  const filteredSkills = useMemo(() => {
    if (!search.trim()) return skills;
    const q = search.toLowerCase();
    return skills.filter((s) =>
      s.name.toLowerCase().includes(q) ||
      (s.description || "").toLowerCase().includes(q)
    );
  }, [skills, search]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar - dark */}
      <aside className="w-64 bg-slate-800 flex flex-col shrink-0 shadow-xl">
        {/* Header */}
        <div className="px-4 py-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <img src="/logo.png" className="w-8 h-8 rounded-lg shadow-lg shadow-violet-500/20 flex-shrink-0" alt="SkillForge" />
            <div className="min-w-0">
              <h1 className="text-sm font-semibold text-white tracking-tight truncate">SkillForge</h1>
              <p className="text-[10px] text-slate-400">{t("app.description")}</p>
            </div>
          </div>
        </div>

        {/* Tool Selector */}
        <div className="px-3 py-3 border-b border-slate-700">
          <label className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-1.5 block">
            {t("sidebar.tools")}
          </label>
          <select
            value={selectedTool}
            onChange={handleToolChange}
            className="w-full text-[13px] bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all cursor-pointer"
          >
            {tools.filter((t) => t.installed).map((t) => (
              <option key={t.id} value={t.id}>{t.name} · {t.skill_count}</option>
            ))}
            {tools.some((t) => !t.installed) && (
              <optgroup label="──────────────">
                {tools.filter((t) => !t.installed).map((t) => (
                  <option key={t.id} value={t.id} disabled>{t.name}</option>
                ))}
              </optgroup>
            )}
          </select>
          {currentTool && (
            <p className="text-[11px] text-slate-500 mt-1.5 truncate">{currentTool.description}</p>
          )}
        </div>

        {/* Actions */}
        <div className="px-3 pt-2 pb-1 space-y-1.5">
          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索技能..."
              className="w-full text-[12px] bg-slate-700 border border-slate-600 rounded-lg pl-8 pr-3 py-1.5 text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
            />
          </div>
          <button onClick={() => navigate("/skills/create")} className="w-full text-[13px] py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-all duration-200 font-medium">
            + {t("sidebar.newSkill")}
          </button>
          <button onClick={handleImport} disabled={importing} className="w-full text-[12px] py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-all duration-200 font-medium text-center">
            {importing ? "导入中..." : "导入文件"}
          </button>
        </div>

        {/* Skill count */}
        <div className="px-3 pb-1.5 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
            {t("sidebar.skills")} · {skills.length}
          </span>
          {search && filteredSkills.length !== skills.length && (
            <span className="text-[10px] text-violet-400">{filteredSkills.length} 匹配</span>
          )}
        </div>

        {/* Skill List */}
        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-px">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-4 h-4 border-2 border-violet-400/30 border-t-violet-400 rounded-full animate-spin" />
            </div>
          ) : filteredSkills.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8">
              {search ? "无匹配技能" : t("sidebar.noSkills")}
            </p>
          ) : (
            filteredSkills.map((skill) => {
              const isActive = activeSkill === skill.name;
              return (
                <button
                  key={`${skill.tool_id}-${skill.name}`}
                  onClick={() => navigate(`/skills/${skill.name}`)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-150 ${
                    isActive
                      ? "bg-violet-500/20 text-white border border-violet-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${skill.enabled ? "bg-emerald-400" : "bg-amber-400"}`} />
                    <span className="text-sm truncate font-medium">{skill.name}</span>
                  </div>
                  {skill.description && (
                    <p className="text-[11px] text-slate-500 truncate mt-0.5 ml-4">{skill.description}</p>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-3 py-2.5 border-t border-slate-700">
          <p className="text-[10px] text-slate-600 text-center tracking-wider">v0.1.0</p>
        </div>
      </aside>

      {/* Main Content - light */}
      <main className="flex-1 overflow-y-auto bg-gray-100">
        <div className="max-w-5xl mx-auto p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export function Layout() {
  const { selectedTool } = useTools();
  return (
    <SkillsProvider toolId={selectedTool}>
      <SidebarContent />
    </SkillsProvider>
  );
}
