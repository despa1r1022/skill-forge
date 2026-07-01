import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTools } from "../../hooks/useTools";
import { useSkills } from "../../hooks/useSkills";
import { api } from "../../lib/tauri";
import type { CreateRequest } from "../../types";

export function CreateWizard() {
  const { selectedTool } = useTools();
  const { refresh } = useSkills(selectedTool);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [version, setVersion] = useState("");
  const [template, setTemplate] = useState<"Minimal" | "WithReferences" | "WithScripts">("Minimal");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    setError("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!description.trim()) {
      setError("Description is required");
      return;
    }

    const req: CreateRequest = {
      name: name.trim(),
      description: description.trim(),
      version: version.trim() || undefined,
      template,
    };

    setCreating(true);
    try {
      await api.createSkill(selectedTool, req);
      refresh();
      navigate(`/skills/${name.trim()}`);
    } catch (err) {
      setError(String(err));
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Create New Skill</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Skill Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="my-awesome-skill"
            className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <p className="text-xs text-slate-400 mt-1">
            Lowercase, hyphens only (e.g. "code-review")
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what this skill does..."
            rows={3}
            className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Version (optional)
          </label>
          <input
            type="text"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="1.0.0"
            className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Template
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["Minimal", "WithReferences", "WithScripts"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTemplate(t)}
                className={`text-xs px-3 py-2 rounded-md border transition-colors ${
                  template === t
                    ? "bg-primary-50 border-primary-300 text-primary-700"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {t === "Minimal" && "Minimal\nSKILL.md only"}
                {t === "WithReferences" && "+ References\nsubdirectory"}
                {t === "WithScripts" && "+ Scripts\nsubdirectory"}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={() => navigate("/skills")}
            className="text-sm px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={creating}
            className="text-sm px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create Skill"}
          </button>
        </div>
      </div>
    </div>
  );
}
