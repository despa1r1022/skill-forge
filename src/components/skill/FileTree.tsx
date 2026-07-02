import { useState } from "react";
import type { SubDir, FileEntry } from "../../types";
import { api } from "../../lib/tauri";
import { FileEditorModal } from "../shared/FileEditorModal";

interface FileTreeProps {
  subdirs: SubDir[];
  skillPath: string;
  onRefresh: () => void;
}

export function FileTree({ subdirs, skillPath, onRefresh }: FileTreeProps) {
  const [showAddDir, setShowAddDir] = useState(false);
  const [newDirName, setNewDirName] = useState("");
  const [addingDir, setAddingDir] = useState(false);

  const handleAddDir = async () => {
    if (!newDirName.trim()) return;
    setAddingDir(true);
    try {
      await api.createDirectory(skillPath, newDirName.trim());
      setNewDirName("");
      setShowAddDir(false);
      onRefresh();
    } catch (err) {
      alert(`创建目录失败: ${err}`);
    } finally {
      setAddingDir(false);
    }
  };

  return (
    <div className="space-y-1">
      {subdirs.map((dir) => (
        <SubdirSection key={dir.name} subdir={dir} skillPath={skillPath} onRefresh={onRefresh} />
      ))}
      {showAddDir ? (
        <div className="flex items-center gap-1 py-1 px-2">
          <input type="text" value={newDirName} onChange={(e) => setNewDirName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleAddDir(); if (e.key === "Escape") { setShowAddDir(false); setNewDirName(""); }}}
            placeholder="新目录名" className="flex-1 text-xs border border-gray-300 rounded px-2 py-1 text-gray-900 focus:outline-none focus:ring-1 focus:ring-violet-500" autoFocus />
          <button onClick={handleAddDir} disabled={addingDir} className="text-xs px-2 py-1 bg-violet-500 text-white rounded hover:bg-violet-600">确定</button>
          <button onClick={() => { setShowAddDir(false); setNewDirName(""); }} className="text-xs px-2 py-1 text-gray-400 hover:text-gray-600">取消</button>
        </div>
      ) : (
        <button onClick={() => setShowAddDir(true)} className="text-xs text-gray-400 hover:text-violet-500 py-1 px-2 transition-colors">+ 新建目录</button>
      )}
    </div>
  );
}

function SubdirSection({ subdir, skillPath, onRefresh }: { subdir: SubDir; skillPath: string; onRefresh: () => void }) {
  const [showAddFile, setShowAddFile] = useState(false);
  const [newFileName, setNewFileName] = useState("");

  const handleCreateFile = async () => {
    if (!newFileName.trim()) return;
    try {
      await api.createFile(skillPath, subdir.name, newFileName.trim());
      setNewFileName("");
      setShowAddFile(false);
      onRefresh();
    } catch (err) {
      alert(`创建失败: ${err}`);
    }
  };

  return (
    <details className="group" open>
      <summary className="text-xs font-medium text-gray-600 cursor-pointer hover:text-violet-600 transition-colors py-1.5 px-2 rounded-md hover:bg-gray-50 select-none">
        <span className="inline-flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" /></svg>
          {subdir.name}/
          <span className="text-gray-400 font-normal">{subdir.files.length} 个文件</span>
        </span>
      </summary>
      <div className="ml-5 border-l-2 border-gray-100 pl-3 py-1 space-y-0.5">
        {subdir.files.map((file) => (
          <FileRow key={file.path} file={file} onRefresh={onRefresh} />
        ))}
        {showAddFile ? (
          <div className="flex items-center gap-1 py-0.5 px-2">
            <input type="text" value={newFileName} onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleCreateFile(); if (e.key === "Escape") { setShowAddFile(false); setNewFileName(""); }}}
              placeholder="filename.md" className="flex-1 text-xs border border-gray-300 rounded px-2 py-1 text-gray-900 focus:outline-none focus:ring-1 focus:ring-violet-500" autoFocus />
            <button onClick={handleCreateFile} className="text-xs px-2 py-1 bg-violet-500 text-white rounded hover:bg-violet-600">确定</button>
            <button onClick={() => { setShowAddFile(false); setNewFileName(""); }} className="text-xs px-2 py-1 text-gray-400 hover:text-gray-600">取消</button>
          </div>
        ) : (
          <button onClick={() => setShowAddFile(true)} className="text-xs text-gray-400 hover:text-violet-500 py-0.5 px-2 transition-colors">+ 新建文件</button>
        )}
      </div>
    </details>
  );
}

function FileRow({ file, onRefresh }: { file: FileEntry; onRefresh: () => void }) {
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editContent, setEditContent] = useState("");

  const handleStartEdit = async () => {
    try {
      const content = await api.readFileContent(file.path);
      setEditContent(content);
      setShowEdit(true);
    } catch (err) {
      alert(`无法读取文件: ${err}`);
    }
  };

  const handleSaveEdit = async (content: string) => {
    await api.saveFileContent(file.path, content);
    setShowEdit(false);
    onRefresh();
  };

  const handleDelete = async () => {
    try {
      await api.deleteFile(file.path);
      onRefresh();
    } catch (err) {
      alert(`删除失败: ${err}`);
    }
  };

  const sizeStr = file.size > 1024 ? `${(file.size / 1024).toFixed(1)} KB` : `${file.size} B`;

  return (
    <>
      <div className="flex items-center justify-between py-0.5 px-2 rounded text-xs text-gray-500 hover:bg-gray-50 group/file">
        <span className="truncate flex items-center gap-1.5 cursor-pointer hover:text-violet-600" onClick={handleStartEdit}>
          <svg className="w-3 h-3 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          <span className="truncate">{file.name}</span>
        </span>
        <div className="flex items-center gap-2 shrink-0 ml-2 opacity-0 group-hover/file:opacity-100 transition-opacity">
          <span className="text-gray-400">{sizeStr}</span>
          {showDelete ? (
            <><button onClick={handleDelete} className="text-red-500 hover:text-red-700 text-[10px]">确认</button>
            <button onClick={() => setShowDelete(false)} className="text-gray-400 hover:text-gray-600 text-[10px]">取消</button></>
          ) : (
            <button onClick={() => setShowDelete(true)} className="text-gray-400 hover:text-red-500">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          )}
        </div>
      </div>
      <FileEditorModal open={showEdit} title={`编辑: ${file.name}`} content={editContent} onSave={handleSaveEdit} onClose={() => setShowEdit(false)} />
    </>
  );
}
