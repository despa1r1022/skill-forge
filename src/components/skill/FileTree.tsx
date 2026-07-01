import type { SubDir, FileEntry } from "../../types";

interface FileTreeProps {
  subdirs: SubDir[];
  skillPath: string;
}

export function FileTree({ subdirs }: FileTreeProps) {
  return (
    <div className="space-y-2">
      {subdirs.map((dir) => (
        <details key={dir.name} className="group">
          <summary className="text-xs font-medium text-slate-600 cursor-pointer hover:text-slate-800 py-1">
            {dir.name}/ ({dir.files.length} files)
          </summary>
          <div className="ml-4 border-l border-slate-200 pl-3 py-1">
            {dir.files.map((file) => (
              <FileRow key={file.path} file={file} />
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}

function FileRow({ file }: { file: FileEntry }) {
  const sizeStr =
    file.size > 1024
      ? `${(file.size / 1024).toFixed(1)} KB`
      : `${file.size} B`;

  return (
    <div className="flex items-center justify-between py-0.5 text-xs text-slate-500">
      <span className="truncate">{file.name}</span>
      <span className="text-slate-400 ml-2 shrink-0">{sizeStr}</span>
    </div>
  );
}
