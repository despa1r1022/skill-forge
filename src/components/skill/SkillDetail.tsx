import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTools } from "../../hooks/useTools";
import { useSkillDetail } from "../../hooks/useSkillDetail";
import { useSkills } from "../../hooks/useSkills";
import { MarkdownPreview } from "../shared/MarkdownPreview";
import { TagBadge } from "../shared/TagBadge";
import { ToolBadge } from "../shared/ToolBadge";
import { StatusBadge } from "../shared/StatusBadge";
import { ConfirmDialog } from "../shared/ConfirmDialog";
import { MetadataPanel } from "./MetadataPanel";
import { FileTree as FileTreeView } from "./FileTree";
import { SkillToolbar } from "./SkillToolbar";
import { api } from "../../lib/tauri";

export function SkillDetail() {
  const { name } = useParams<{ name: string }>();
  const { selectedTool, tools } = useTools();
  const { skill, loading, refresh } = useSkillDetail(selectedTool, name);
  const { refresh: refreshList } = useSkills(selectedTool);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const navigate = useNavigate();

  const currentTool = tools.find((t) => t.id === selectedTool);

  const handleDelete = async () => {
    if (!skill) return;
    try {
      await api.deleteSkill(skill.path);
      refreshList();
      navigate("/skills");
    } catch (err) {
      console.error("Failed to delete skill:", err);
    }
  };

  const handleToggle = async () => {
    if (!skill) return;
    try {
      await api.toggleSkill(skill.path);
      refresh();
      refreshList();
    } catch (err) {
      console.error("Failed to toggle skill:", err);
    }
  };

  if (loading) {
    return <p className="text-slate-400">Loading skill details...</p>;
  }

  if (!skill) {
    return <p className="text-slate-400">Skill not found: {name}</p>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-slate-800">{skill.name}</h1>
            <StatusBadge enabled={skill.enabled} />
          </div>
          <div className="flex items-center gap-2">
            {currentTool && <ToolBadge toolName={currentTool.name} />}
            {skill.version && <TagBadge label={`v${skill.version}`} variant="primary" />}
            <TagBadge label={skill.format} variant="default" />
          </div>
        </div>

        <SkillToolbar
          skill={skill}
          onToggle={handleToggle}
          onEdit={() => navigate(`/skills/${name}/edit`)}
          onDelete={() => setShowDeleteDialog(true)}
        />
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 mb-6">{skill.description}</p>

      {/* Metadata */}
      <MetadataPanel meta={skill.meta} />

      {/* File Tree */}
      {skill.subdirs.length > 0 && (
        <div className="mt-6 mb-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Directory Structure</h3>
          <FileTreeView subdirs={skill.subdirs} skillPath={skill.path} />
        </div>
      )}

      {/* Content Preview */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Content Preview</h3>
        <div className="bg-white border border-slate-200 rounded-lg p-4 max-h-[600px] overflow-y-auto">
          <MarkdownPreview content={skill.raw_content || ""} />
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete Skill"
        message={`Are you sure you want to delete "${skill.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  );
}
