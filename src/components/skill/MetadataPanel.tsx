import type { SkillMeta } from "../../types";

interface MetadataPanelProps {
  meta: SkillMeta;
}

export function MetadataPanel({ meta }: MetadataPanelProps) {
  const hasData = meta.requires_bins.length > 0 || meta.requires_env.length > 0 || meta.requires_siblings.length > 0 || meta.openclaw_source || meta.paths.length > 0;
  if (!hasData) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        元数据信息
      </h3>
      <div className="space-y-3">
        {meta.openclaw_source && (
          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
            <span className="text-xs font-medium text-slate-500 shrink-0 mt-0.5">来源</span>
            <span className="text-xs text-indigo-600 break-all font-mono">{meta.openclaw_source}</span>
          </div>
        )}
        {meta.requires_bins.length > 0 && (
          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
            <span className="text-xs font-medium text-slate-500 shrink-0">需要可执行程序</span>
            <div className="flex flex-wrap gap-1">
              {meta.requires_bins.map((b) => <span key={b} className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-mono">{b}</span>)}
            </div>
          </div>
        )}
        {meta.requires_env.length > 0 && (
          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
            <span className="text-xs font-medium text-slate-500 shrink-0">需要环境变量</span>
            <div className="flex flex-wrap gap-1">
              {meta.requires_env.map((e) => <span key={e} className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md font-mono">{e}</span>)}
            </div>
          </div>
        )}
        {meta.requires_siblings.length > 0 && (
          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
            <span className="text-xs font-medium text-slate-500 shrink-0">依赖技能</span>
            <div className="flex flex-wrap gap-1">
              {meta.requires_siblings.map((s) => <span key={s} className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md font-mono">{s}</span>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
