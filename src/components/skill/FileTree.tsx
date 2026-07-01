import type { SubDir, FileEntry } from "../../types";

interface FileTreeProps {
  subdirs: SubDir[];
  skillPath: string;
}

export function FileTree({ subdirs }: FileTreeProps) {
  return (
    <div className="space-y-1">
      {subdirs.map((dir) => (
        <details key={dir.name} className="group">
          <summary className="text-xs font-medium text-slate-600 cursor-pointer hover:text-indigo-600 transition-colors py-1.5 px-2 rounded-md hover:bg-slate-50 select-none">
            <span className="inline-flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" /></svg>
              {dir.name}/
              <span className="text-slate-400 font-normal">{dir.files.length} 个文件</span>
            </span>
          </summary>
          <div className="ml-5 border-l-2 border-slate-100 pl-3 py-1 space-y-0.5">
            {dir.files.map((file) => <FileRow key={file.path} file={file} />)}
          </div>
        </details>
      ))}
    </div>
  );
}

function FileRow({ file }: { file: FileEntry }) {
  const sizeStr = file.size > 1024 ? `${(file.size / 1024).toFixed(1)} KB` : `${file.size} B`;
  return (
    <div className="flex items-center justify-between py-0.5 px-2 rounded text-xs text-slate-500 hover:bg-slate-50 group/file">
      <span className="truncate flex items-center gap-1.5">
        <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        {file.name}
      </span>
      <span className="text-slate-400 ml-2 shrink-0 opacity-0 group-hover/file:opacity-100 transition-opacity">{sizeStr}</span>
    </div>
  );
}
