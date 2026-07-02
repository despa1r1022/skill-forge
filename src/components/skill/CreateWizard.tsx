import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTools } from "../../hooks/useToolsContext";
import { useSkillsContext } from "../../hooks/useSkillsContext";
import { api } from "../../lib/tauri";
import { MarkdownPreview } from "../shared/MarkdownPreview";
import { FileEditorModal } from "../shared/FileEditorModal";
import type { CreateRequest, SubdirFile } from "../../types";

export function CreateWizard() {
  const { selectedTool, refresh: refreshTools } = useTools();
  const { refresh } = useSkillsContext();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [version, setVersion] = useState("");
  const [subdirs, setSubdirs] = useState<string[]>([]);
  const [files, setFiles] = useState<SubdirFile[]>([]);
  const [newDirName, setNewDirName] = useState("");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const addSubdir = () => {
    if (!newDirName.trim()) return;
    const dir = newDirName.trim().replace(/[^a-zA-Z0-9_-]/g, "");
    if (dir && !subdirs.includes(dir)) {
      setSubdirs([...subdirs, dir]);
    }
    setNewDirName("");
  };

  const removeSubdir = (dir: string) => {
    setSubdirs(subdirs.filter((d) => d !== dir));
    setFiles(files.filter((f) => f.subdir !== dir));
  };

  const addFileToDir = (subdir: string, filename: string) => {
    if (!filename.trim()) return;
    if (files.some((f) => f.subdir === subdir && f.filename === filename.trim())) return;
    setFiles([...files, { subdir, filename: filename.trim(), content: "" }]);
  };

  const editFileContent = (subdir: string, filename: string, content: string) => {
    setFiles(files.map((f) =>
      f.subdir === subdir && f.filename === filename ? { ...f, content } : f
    ));
  };

  const removeFile = (subdir: string, filename: string) => {
    setFiles(files.filter((f) => !(f.subdir === subdir && f.filename === filename)));
  };

  const handleCreate = async () => {
    setError("");
    if (!name.trim()) { setError("请输入技能名称"); return; }
    if (!description.trim()) { setError("请输入技能描述"); return; }

    const req: CreateRequest = {
      name: name.trim(),
      description: description.trim(),
      version: version.trim() || undefined,
      template: undefined,
      subdirs: subdirs.length > 0 ? subdirs : undefined,
      files: files.length > 0 ? files : undefined,
    };

    setCreating(true);
    try {
      await api.createSkill(selectedTool, req);
      await refresh();
      await refreshTools();
      navigate(`/skills/${name.trim()}`);
    } catch (err) {
      setError(String(err));
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate("/skills")} className="text-sm text-gray-500 hover:text-violet-600 transition-colors mb-4 flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        返回列表
      </button>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </div>
          新建技能
        </h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1.5">技能名称 <span className="text-rose-500">*</span></label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="例如: code-review" className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all placeholder-gray-400" />
            <p className="text-xs text-gray-500 mt-1">小写字母和连字符，如 "code-review"</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-gray-800">描述 <span className="text-rose-500">*</span></label>
              <button type="button" onClick={() => setShowPreview(!showPreview)} className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md transition-all font-medium flex items-center gap-1">
                {showPreview ? (<><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>编辑</>) : (<><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>预览</>)}
              </button>
            </div>
            {showPreview ? (
              <div className="min-h-[200px] border border-gray-200 rounded-xl p-5 bg-gray-50 overflow-y-auto max-h-[400px]">
                {description.trim() ? <MarkdownPreview content={description} /> : <p className="text-sm text-gray-400 italic">暂无内容</p>}
              </div>
            ) : (
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={"# 技能描述"} rows={8} className="w-full text-sm border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all placeholder-gray-400 resize-none font-mono leading-relaxed" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1.5">版本号 <span className="text-gray-400 font-normal">(可选)</span></label>
            <input type="text" value={version} onChange={(e) => setVersion(e.target.value)} placeholder="1.0.0" className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all placeholder-gray-400" />
          </div>

          {/* Directories & Files */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">目录与文件 <span className="text-gray-400 font-normal">(可选)</span></label>
            
            {subdirs.map((dir) => {
              const dirFiles = files.filter((f) => f.subdir === dir);
              return (
                <DirSection key={dir} dir={dir} files={dirFiles}
                  onAddFile={(fn) => addFileToDir(dir, fn)}
                  onEditFile={(fn, c) => editFileContent(dir, fn, c)}
                  onRemoveFile={(fn) => removeFile(dir, fn)}
                  onRemoveDir={() => removeSubdir(dir)}
                />
              );
            })}

            <div className="flex gap-2 mt-3">
              <input type="text" value={newDirName} onChange={(e) => setNewDirName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSubdir(); }}}
                placeholder="输入目录名" className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 placeholder-gray-400" />
              <button onClick={addSubdir} className="text-sm px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition-all font-medium">添加目录</button>
            </div>
          </div>

          {error && (
            <div className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-4 py-3 flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => navigate("/skills")} className="text-sm px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-all font-medium">取消</button>
            <button onClick={handleCreate} disabled={creating} className="text-sm px-6 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition-all font-medium disabled:opacity-50">
              {creating ? "创建中..." : "创建技能"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Per-directory section showing files and add-file form
function DirSection({ dir, files, onAddFile, onEditFile, onRemoveFile, onRemoveDir }: {
  dir: string;
  files: SubdirFile[];
  onAddFile: (fn: string) => void;
  onEditFile: (fn: string, content: string) => void;
  onRemoveFile: (fn: string) => void;
  onRemoveDir: () => void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [editingFile, setEditingFile] = useState<SubdirFile | null>(null);
  return (
    <div className="border border-gray-200 rounded-lg p-3 mb-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" /></svg>
          {dir}/
        </span>
        <button onClick={onRemoveDir} className="text-xs text-gray-400 hover:text-red-500">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      {files.map((f) => (
        <div key={f.filename} className="flex items-center justify-between py-1 px-2 text-xs text-gray-600 hover:bg-gray-50 rounded group/file">
          <span className="flex items-center gap-1.5 cursor-pointer hover:text-violet-600 flex-1" onClick={() => setEditingFile(f)}>
            <svg className="w-3 h-3 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            {f.filename}
            {f.content && <span className="text-[10px] text-violet-400">已编辑</span>}
          </span>
          <button onClick={() => onRemoveFile(f.filename)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover/file:opacity-100 transition-opacity">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      ))}
      {showAdd ? (
        <div className="flex items-center gap-1 mt-1">
          <input type="text" value={newFileName} onChange={(e) => setNewFileName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { onAddFile(newFileName); setNewFileName(""); setShowAdd(false); }}}
            placeholder="filename.md" className="flex-1 text-xs border border-gray-300 rounded px-2 py-1 text-gray-900 focus:outline-none focus:ring-1 focus:ring-violet-500" autoFocus />
          <button onClick={() => { onAddFile(newFileName); setNewFileName(""); setShowAdd(false); }} className="text-xs px-2 py-1 bg-violet-500 text-white rounded hover:bg-violet-600">确定</button>
          <button onClick={() => { setShowAdd(false); setNewFileName(""); }} className="text-xs text-gray-400">取消</button>
        </div>
      ) : (
        <button onClick={() => setShowAdd(true)} className="text-xs text-gray-400 hover:text-violet-500 mt-1">+ 添加文件</button>
      )}
      <FileEditorModal
        open={editingFile !== null}
        title={`编辑: ${editingFile?.filename || ""}`}
        content={editingFile?.content || ""}
        onSave={(content) => {
          if (editingFile) onEditFile(editingFile.filename, content);
          setEditingFile(null);
        }}
        onClose={() => setEditingFile(null)}
      />
    </div>
  );
}
