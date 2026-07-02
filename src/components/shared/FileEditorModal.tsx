import { useState, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeEditor } from "./CodeEditor";

interface FileEditorModalProps {
  open: boolean;
  title: string;
  content: string;
  readonly?: boolean;
  onSave: (content: string) => void;
  onClose: () => void;
}

function getFileType(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || "";
}

function getFileLabel(ext: string): { color: string; label: string } {
  switch (ext) {
    case "md": return { color: "text-blue-500", label: "MD" };
    case "json": return { color: "text-amber-500", label: "JSON" };
    case "toml": return { color: "text-orange-500", label: "TOML" };
    case "js": return { color: "text-yellow-500", label: "JS" };
    case "ts": return { color: "text-blue-400", label: "TS" };
    case "tsx": return { color: "text-cyan-500", label: "TSX" };
    case "sh": return { color: "text-green-500", label: "SH" };
    case "py": return { color: "text-blue-300", label: "PY" };
    case "yml":
    case "yaml": return { color: "text-red-400", label: "YAML" };
    case "css": return { color: "text-sky-400", label: "CSS" };
    case "html": return { color: "text-orange-400", label: "HTML" };
    default: return { color: "text-gray-400", label: ext.toUpperCase() };
  }
}

export function FileEditorModal({ open, title, content: initialContent, readonly, onSave, onClose }: FileEditorModalProps) {
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const ext = getFileType(title);
  const isMarkdown = ext === "md";
  const fileInfo = getFileLabel(ext);

  useEffect(() => {
    if (open) {
      setValue(initialContent);
      setShowPreview(false);
    }
  }, [open, initialContent]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await onSave(value);
      onClose();
    } catch {
      // handled by parent
    } finally {
      setSaving(false);
    }
  }, [value, onSave, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[85vh] flex flex-col animate-scaleIn border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 shrink-0">
          <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${fileInfo.color}`} style={{ backgroundColor: 'currentColor', opacity: 0.1 }}>
              {fileInfo.label}
            </span>
            {title}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {isMarkdown && showPreview ? (
            <div className="p-6 overflow-y-auto h-full">
              <article className="prose prose-slate max-w-none prose-headings:font-semibold prose-p:text-sm prose-p:text-gray-600 prose-code:text-xs prose-code:bg-amber-50 prose-code:text-amber-700 prose-code:before:content-none prose-code:after:content-none prose-pre:bg-slate-900 prose-pre:rounded-xl">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
              </article>
            </div>
          ) : (
            <CodeEditor value={value} filename={title} readonly={readonly} onChange={setValue} />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 bg-gray-50 rounded-b-2xl shrink-0">
          <div className="flex items-center gap-2">
            {isMarkdown && (
              <button onClick={() => setShowPreview(!showPreview)} className="text-xs px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-100 transition-all font-medium">
                {showPreview ? "编辑" : "预览"}
              </button>
            )}
            <span className="text-[10px] text-gray-400">{value.length} 字符</span>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="text-sm px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors">取消</button>
            <button onClick={handleSave} disabled={saving || readonly} className="text-sm px-5 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition-all font-medium disabled:opacity-50">
              {saving ? "保存中..." : "保存"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
