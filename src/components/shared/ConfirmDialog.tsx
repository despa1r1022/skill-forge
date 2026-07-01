interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ open, title, message, confirmLabel = "确认", onConfirm, onCancel }: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-scaleIn">
        <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-4 mx-auto">
          <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-800 text-center mb-2">{title}</h3>
        <p className="text-sm text-slate-500 text-center mb-6 leading-relaxed">{message}</p>
        <div className="flex justify-center gap-3">
          <button onClick={onCancel} className="px-5 py-2.5 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all font-medium">
            取消
          </button>
          <button onClick={onConfirm} className="px-5 py-2.5 text-sm bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-all font-medium shadow-md shadow-rose-500/20">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
