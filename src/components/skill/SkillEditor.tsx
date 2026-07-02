import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTools } from "../../hooks/useToolsContext";
import { useSkillDetail } from "../../hooks/useSkillDetail";
import { MarkdownPreview } from "../shared/MarkdownPreview";
import { FileTree } from "./FileTree";
import { api } from "../../lib/tauri";

export function SkillEditor() {
  const { name } = useParams<{ name: string }>();
  const { selectedTool } = useTools();
  const { skill, loading, refresh } = useSkillDetail(selectedTool, name);
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
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" /></div>;
  }
  if (!skill) return <p className="text-gray-500">技能未找到</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">编辑技能</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-medium text-violet-600">{skill.name}</span>
            <span className="text-xs text-gray-500">· {skill.file_name}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-emerald-600 font-medium animate-pulse">已保存!</span>}
          <button onClick={() => setShowPreview(!showPreview)} className="text-sm px-4 py-2 bg-gray-100 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-200 transition-all font-medium">
            {showPreview ? "编辑模式" : "预览"}
          </button>
          <button onClick={handleSave} disabled={saving} className="text-sm px-5 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition-all font-medium disabled:opacity-50">
            {saving ? "保存中..." : "保存"}
          </button>
          <button onClick={() => navigate(`/skills/${name}`)} className="text-sm px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors">取消</button>
        </div>
      </div>

      {showPreview ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <MarkdownPreview content={content} />
        </div>
      ) : (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-[50vh] bg-white border border-gray-200 rounded-2xl p-5 font-mono text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-none shadow-sm leading-relaxed"
          placeholder="# SKILL.md 内容..."
          spellCheck={false}
        />
      )}

      {/* Directory & File Management */}
      {skill.subdirs.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
            目录与文件管理
          </h3>
          <FileTree subdirs={skill.subdirs} skillPath={skill.path} onRefresh={refresh} />
        </div>
      )}

      {/* Add directory for existing skill */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          新增目录
        </h3>
        <AddDirectoryForm skillPath={skill.path} onAdded={refresh} />
      </div>
    </div>
  );
}

function AddDirectoryForm({ skillPath, onAdded }: { skillPath: string; onAdded: () => void }) {
  const [dirName, setDirName] = useState("");
  const [creating, setCreating] = useState(false);

  const handleAdd = async () => {
    if (!dirName.trim()) return;
    const name = dirName.trim().replace(/[^a-zA-Z0-9_-]/g, "");
    if (!name) return;
    setCreating(true);
    try {
      await api.createFile(skillPath, name, ".gitkeep");
      setDirName("");
      onAdded();
    } catch (err) {
      alert(`创建失败: ${err}`);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={dirName}
        onChange={(e) => setDirName(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAdd(); }}}
        placeholder="输入目录名，如 references"
        className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 placeholder-gray-400"
      />
      <button onClick={handleAdd} disabled={creating} className="text-sm px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition-all font-medium disabled:opacity-50">
        {creating ? "创建中..." : "创建目录"}
      </button>
    </div>
  );
}
