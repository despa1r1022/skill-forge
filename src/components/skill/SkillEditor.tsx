import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTools } from "../../hooks/useTools";
import { useSkillDetail } from "../../hooks/useSkillDetail";
import { MarkdownPreview } from "../shared/MarkdownPreview";
import { api } from "../../lib/tauri";

export function SkillEditor() {
  const { name } = useParams<{ name: string }>();
  const { selectedTool } = useTools();
  const { skill, loading } = useSkillDetail(selectedTool, name);
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (skill?.raw_content) setContent(skill.raw_content);
  }, [skill]);

  const handleSave = async () => {
    if (!skill) return;
    setSaving(true);
    try {
      await api.saveSkill(selectedTool, skill.name, content);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert("保存失败");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;
  }
  if (!skill) return <p className="text-slate-400">技能未找到</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">编辑技能</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-medium text-indigo-600">{skill.name}</span>
            <span className="text-xs text-slate-400">· {skill.file_name}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-emerald-600 font-medium animate-pulse">已保存!</span>}
          <button onClick={() => setShowPreview(!showPreview)} className="text-sm px-4 py-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-200 transition-all font-medium">
            {showPreview ? "编辑模式" : "预览"}
          </button>
          <button onClick={handleSave} disabled={saving} className="text-sm px-5 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all font-medium shadow-md shadow-indigo-500/20 disabled:opacity-50">
            {saving ? "保存中..." : "保存"}
          </button>
          <button onClick={() => navigate(`/skills/${name}`)} className="text-sm px-4 py-2 text-slate-500 hover:text-slate-700 transition-colors">取消</button>
        </div>
      </div>

      {showPreview ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 max-h-[70vh] overflow-y-auto shadow-sm">
          <MarkdownPreview content={content} />
        </div>
      ) : (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-[70vh] bg-white border border-slate-200 rounded-2xl p-5 font-mono text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none shadow-sm leading-relaxed"
          placeholder="# SKILL.md 内容..."
          spellCheck={false}
        />
      )}
    </div>
  );
}
