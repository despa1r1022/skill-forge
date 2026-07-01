import type { SkillMeta } from "../../types";

interface MetadataPanelProps {
  meta: SkillMeta;
}

export function MetadataPanel({ meta }: MetadataPanelProps) {
  const hasData =
    meta.requires_bins.length > 0 ||
    meta.requires_env.length > 0 ||
    meta.requires_siblings.length > 0 ||
    meta.openclaw_source ||
    meta.paths.length > 0;

  if (!hasData) return null;

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
      <h3 className="text-sm font-semibold text-slate-700 mb-3">Metadata</h3>
      <div className="space-y-3">
        {meta.openclaw_source && (
          <div>
            <span className="text-xs font-medium text-slate-500">Source:</span>
            <span className="text-xs text-slate-700 ml-2 break-all">
              {meta.openclaw_source}
            </span>
          </div>
        )}
        {meta.requires_bins.length > 0 && (
          <div>
            <span className="text-xs font-medium text-slate-500">
              Required binaries:
            </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {meta.requires_bins.map((bin) => (
                <span
                  key={bin}
                  className="text-xs bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded"
                >
                  {bin}
                </span>
              ))}
            </div>
          </div>
        )}
        {meta.requires_env.length > 0 && (
          <div>
            <span className="text-xs font-medium text-slate-500">
              Required env vars:
            </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {meta.requires_env.map((env) => (
                <span
                  key={env}
                  className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded"
                >
                  {env}
                </span>
              ))}
            </div>
          </div>
        )}
        {meta.requires_siblings.length > 0 && (
          <div>
            <span className="text-xs font-medium text-slate-500">
              Required siblings:
            </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {meta.requires_siblings.map((s) => (
                <span
                  key={s}
                  className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
