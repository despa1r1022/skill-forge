import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTools } from "../../hooks/useToolsContext";
import { useSkillDetail } from "../../hooks/useSkillDetail";
import { useSkillsContext } from "../../hooks/useSkillsContext";
import { MarkdownPreview } from "../shared/MarkdownPreview";
import { ConfirmDialog } from "../shared/ConfirmDialog";
import { MetadataPanel } from "./MetadataPanel";
import { FileTree } from "./FileTree";
import { api } from "../../lib/tauri";

export function SkillDetail() {
  const { name } = useParams<{ name: string }>();
  const { selectedTool, tools, refresh: refreshTools } = useTools();
  const { skill, loading, refresh } = useSkillDetail(selectedTool, name);
  const { refresh: refreshList } = useSkillsContext();
  const [showDisable, setShowDisable] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();
  const currentTool = tools.find((t) => t.id === selectedTool);

  const handleToggle = async () => {
    if (!skill) return;
    try {
      await api.toggleSkill(skill.path);
      await refresh();
      await refreshList();
      await refreshTools();
    } catch (err) { console.error(err); }
  };

  // Soft delete: disable first
  const handleSoftDisable = async () => {
    if (!skill || skill.enabled === false) return;
    try {
      await api.toggleSkill(skill.path);
      setShowDisable(false);
      refresh();
      refreshList();
      refreshTools();
    } catch (err) { console.error(err); }
  };

  // Hard delete: permanently remove
  const handleHardDelete = async () => {
    if (!skill || deleteInput !== skill.name) return;
    setActionLoading(true);
    try {
      await api.deleteSkill(skill.path);
      setShowDelete(false);
      setDeleteInput("");
      await refreshList();
      await refreshTools();
      navigate("/skills");
    } catch (err) {
      console.error(err);
      alert("删除失败");
    } finally {
      setActionLoading(false);
    }
  };

  const handleExport = async () => {
    if (!skill) return;
    try {
      const path = await api.exportSkill(skill.path);
      setShowExport(false);
      alert(`已导出到: ${path}`);
    } catch { alert("导出失败"); }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" /></div>;
  }
  if (!skill) {
    return <div className="text-center py-16"><p className="text-gray-400">技能未找到: {name}</p></div>;
  }

  const canPermanentDelete = !skill.enabled;

  return (
    <div>
      <button onClick={() => navigate("/skills")} className="text-sm text-gray-400 hover:text-violet-500 transition-colors mb-4 flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        返回列表
      </button>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/20">
              <span className="text-white font-bold text-xl">{(skill.name[0] || "S").toUpperCase()}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-800">{skill.name}</h1>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${skill.enabled ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-amber-50 text-amber-600 border border-amber-200"}`}>
                  {skill.enabled ? "已启用" : "已禁用"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {currentTool && <span className="text-xs px-2 py-0.5 bg-violet-50 text-violet-600 rounded-full font-medium">{currentTool.name}</span>}
                {skill.version && <span className="text-xs text-gray-400">v{skill.version}</span>}
                <span className="text-xs text-gray-400">{skill.format === "SkillMdYaml" ? "SKILL.md" : skill.format}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleToggle} className={`text-xs px-3 py-2 rounded-lg font-medium transition-all ${skill.enabled ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100" : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"}`}>
              {skill.enabled ? "禁用" : "启用"}
            </button>
            <button onClick={() => navigate(`/skills/${name}/edit`)} className="text-xs px-3 py-2 bg-white text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium">编辑</button>
            <button onClick={() => setShowExport(true)} className="text-xs px-3 py-2 bg-white text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium">导出</button>
            {canPermanentDelete ? (
              <button onClick={() => setShowDelete(true)} className="text-xs px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-all font-medium">永久删除</button>
            ) : (
              <button onClick={() => setShowDisable(true)} className="text-xs px-3 py-2 bg-white text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium">删除</button>
            )}
          </div>
        </div>
        {skill.description && <p className="text-sm text-gray-600 leading-relaxed">{skill.description}</p>}
      </div>

      <MetadataPanel meta={skill.meta} />

      {skill.subdirs.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
            目录结构
          </h3>
          <FileTree subdirs={skill.subdirs} skillPath={skill.path} onRefresh={refresh} />
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          <span className="text-sm font-medium text-gray-600">{skill.file_name} 内容预览</span>
        </div>
        <div className="p-6 max-h-[600px] overflow-y-auto"><MarkdownPreview content={skill.raw_content || ""} /></div>
      </div>

      {/* Soft disable dialog */}
      <ConfirmDialog
        open={showDisable}
        title="禁用技能"
        message={`先禁用 "${skill.name}"？禁用后技能目录会保留，可随时启用。\n\n如需永久删除，禁用后再点击"永久删除"。`}
        confirmLabel="确认禁用"
        onConfirm={handleSoftDisable}
        onCancel={() => setShowDisable(false)}
      />

      {/* Hard delete dialog with name confirmation */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-scaleIn border border-gray-200">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">永久删除技能</h3>
            <p className="text-sm text-gray-500 text-center mb-1">此操作不可撤销！技能目录将被永久移除。</p>
            <p className="text-sm text-gray-400 text-center mb-4">请输入技能名称 <strong className="text-red-500 font-mono">{skill.name}</strong> 以确认：</p>
            <input
              type="text"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder={skill.name}
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-center font-mono"
              autoFocus
            />
            <div className="flex justify-center gap-3 mt-4">
              <button onClick={() => { setShowDelete(false); setDeleteInput(""); }} className="px-5 py-2.5 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all font-medium">取消</button>
              <button
                onClick={handleHardDelete}
                disabled={deleteInput !== skill.name || actionLoading}
                className={`px-5 py-2.5 text-sm text-white rounded-lg transition-all font-medium ${deleteInput === skill.name ? "bg-red-500 hover:bg-red-600 cursor-pointer" : "bg-gray-300 cursor-not-allowed"}`}
              >
                {actionLoading ? "删除中..." : "确认删除"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={showExport} title="导出技能" message={`将 "${skill.name}" 打包导出为 ZIP 文件？`} confirmLabel="导出" onConfirm={handleExport} onCancel={() => setShowExport(false)} />
    </div>
  );
}
