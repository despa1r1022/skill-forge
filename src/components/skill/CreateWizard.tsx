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
    if (!name.trim()) { setError("请输入技能名称"); return; }
    if (!description.trim()) { setError("请输入技能描述"); return; }

    const req: CreateRequest = { name: name.trim(), description: description.trim(), version: version.trim() || undefined, template };
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
      <button onClick={() => navigate("/skills")} className="text-sm text-slate-400 hover:text-indigo-500 transition-colors mb-4 flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        返回列表
      </button>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </div>
          新建技能
        </h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">技能名称 <span className="text-rose-500">*</span></label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="例如: code-review" className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder-slate-400" />
            <p className="text-xs text-slate-400 mt-1">小写字母和连字符，如 "code-review"</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">描述 <span className="text-rose-500">*</span></label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="描述这个技能的功能..." rows={3} className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder-slate-400 resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">版本号 <span className="text-slate-400 font-normal">(可选)</span></label>
            <input type="text" value={version} onChange={(e) => setVersion(e.target.value)} placeholder="1.0.0" className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder-slate-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">模板选择</label>
            <div className="grid grid-cols-3 gap-2">
              {(["Minimal", "WithReferences", "WithScripts"] as const).map((t) => (
                <button key={t} onClick={() => setTemplate(t)} className={`text-xs p-3 rounded-xl border-2 transition-all text-center ${template === t ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"}`}>
                  <div className="font-semibold mb-1">{t === "Minimal" ? "基础" : t === "WithReferences" ? "含参考文档" : "含脚本"}</div>
                  <div className="text-[10px] opacity-70">{t === "Minimal" ? "仅 SKILL.md" : t === "WithReferences" ? "含 references 目录" : "含 scripts 目录"}</div>
                </button>
              ))}
            </div>
          </div>

          {error && <div className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-4 py-3">{error}</div>}

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => navigate("/skills")} className="text-sm px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-all font-medium">取消</button>
            <button onClick={handleCreate} disabled={creating} className="text-sm px-6 py-2.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all font-medium shadow-md shadow-indigo-500/20 disabled:opacity-50">
              {creating ? "创建中..." : "创建技能"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
