'use client';

import { useApp } from '@/context/AppContext';

export function ToastHost() {
  const { toast, clearToast } = useApp();
  return (
    <div className="toast-host" aria-live="polite">
      {toast && (
        <div className="toast" role="status">
          {toast.msg}
          {toast.action && <button type="button" onClick={() => { toast.action!.run(); clearToast(); }}>{toast.action.label}</button>}
        </div>
      )}
    </div>
  );
}
