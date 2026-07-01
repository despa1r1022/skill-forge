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
    if (skill?.raw_content) {
      setContent(skill.raw_content);
    }
  }, [skill]);

  const handleSave = async () => {
    if (!skill) return;
    setSaving(true);
    try {
      await api.saveSkill(selectedTool, skill.name, content);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-slate-400">Loading...</p>;
  }

  if (!skill) {
    return <p className="text-slate-400">Skill not found</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Editing: {skill.name}</h2>
          <p className="text-xs text-slate-500 mt-1">{skill.file_name}</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-xs text-green-600 font-medium">Saved!</span>
          )}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="text-xs px-3 py-1.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-md hover:bg-slate-200 transition-colors"
          >
            {showPreview ? "Edit" : "Preview"}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-xs px-4 py-1.5 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={() => navigate(`/skills/${name}`)}
            className="text-xs px-3 py-1.5 text-slate-500 hover:text-slate-700"
          >
            Cancel
          </button>
        </div>
      </div>

      {showPreview ? (
        <div className="bg-white border border-slate-200 rounded-lg p-6 max-h-[70vh] overflow-y-auto">
          <MarkdownPreview content={content} />
        </div>
      ) : (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-[70vh] bg-white border border-slate-200 rounded-lg p-4 font-mono text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
          placeholder="SKILL.md content..."
          spellCheck={false}
        />
      )}
    </div>
  );
}
