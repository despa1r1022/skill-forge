import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTools } from "../../hooks/useTools";
import { useSkillDetail } from "../../hooks/useSkillDetail";
import { useSkills } from "../../hooks/useSkills";
import { MarkdownPreview } from "../shared/MarkdownPreview";
import { ConfirmDialog } from "../shared/ConfirmDialog";
import { MetadataPanel } from "./MetadataPanel";
import { FileTree } from "./FileTree";
import { api } from "../../lib/tauri";

export function SkillDetail() {
  const { name } = useParams<{ name: string }>();
  const { selectedTool, tools } = useTools();
  const { skill, loading, refresh } = useSkillDetail(selectedTool, name);
  const { refresh: refreshList } = useSkills(selectedTool);
  const [showDelete, setShowDelete] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const navigate = useNavigate();
  const currentTool = tools.find((t) => t.id === selectedTool);

  const handleDelete = async () => {
    if (!skill) return;
    try { await api.deleteSkill(skill.path); refreshList(); navigate("/skills"); } catch {}
  };

  const handleToggle = async () => {
    if (!skill) return;
    try { await api.toggleSkill(skill.path); refresh(); refreshList(); } catch {}
  };

  const handleExport = async () => {
    if (!skill) return;
    try { const path = await api.exportSkill(skill.path); setShowExport(false); alert(`已导出到: ${path}`); }
    catch { alert("导出失败"); }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;
  }
  if (!skill) {
    return <div className="text-center py-16"><p className="text-slate-400">技能未找到: {name}</p></div>;
  }

  return (
    <div>
      {/* Back + Header */}
      <button onClick={() => navigate("/skills")} className="text-sm text-slate-400 hover:text-indigo-500 transition-colors mb-4 flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        返回列表
      </button>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <span className="text-white font-bold text-xl">{(skill.name[0] || "S").toUpperCase()}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-slate-800">{skill.name}</h1>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${skill.enabled ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-rose-50 text-rose-600 border-rose-200"}`}>
                  {skill.enabled ? "已启用" : "已禁用"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {currentTool && <span className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full font-medium border border-indigo-100">{currentTool.name}</span>}
                {skill.version && <span className="text-xs text-slate-400">v{skill.version}</span>}
                <span className="text-xs text-slate-400">{skill.format === "SkillMdYaml" ? "SKILL.md" : skill.format}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleToggle} className={`text-xs px-3 py-2 rounded-lg font-medium transition-all border ${skill.enabled ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100" : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"}`}>
              {skill.enabled ? "禁用" : "启用"}
            </button>
            <button onClick={() => navigate(`/skills/${name}/edit`)} className="text-xs px-3 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all font-medium">编辑</button>
            <button onClick={() => setShowExport(true)} className="text-xs px-3 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-all font-medium">导出</button>
            <button onClick={() => setShowDelete(true)} className="text-xs px-3 py-2 bg-white text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-50 hover:border-rose-300 transition-all font-medium">删除</button>
          </div>
        </div>
        {skill.description && <p className="text-sm text-slate-600 leading-relaxed">{skill.description}</p>}
      </div>

      <MetadataPanel meta={skill.meta} />

      {skill.subdirs.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
            目录结构
          </h3>
          <FileTree subdirs={skill.subdirs} skillPath={skill.path} />
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          <span className="text-sm font-medium text-slate-700">{skill.file_name} 内容预览</span>
        </div>
        <div className="p-6 max-h-[600px] overflow-y-auto"><MarkdownPreview content={skill.raw_content || ""} /></div>
      </div>

      <ConfirmDialog open={showDelete} title="删除技能" message={`确定要删除 "${skill.name}" 吗？此操作不可撤销。`} confirmLabel="确认删除" onConfirm={handleDelete} onCancel={() => setShowDelete(false)} />
      <ConfirmDialog open={showExport} title="导出技能" message={`将 "${skill.name}" 打包导出为 ZIP 文件？`} confirmLabel="导出" onConfirm={handleExport} onCancel={() => setShowExport(false)} />
    </div>
  );
}
