import React from 'react';
import {
  CheckCircle2,
  Info,
  AlertTriangle,
  AlertCircle,
  X,
} from 'lucide-react';
import { useShopping } from '../../context/ShoppingContext';

export const NotificationToasts: React.FC = () => {
  const { toasts, dismissToast } = useShopping();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let icon = <Info className="w-4 h-4 text-sky-400 shrink-0" />;
        let borderClass = 'border-sky-500/30 bg-slate-900/95 text-slate-200';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
          borderClass = 'border-emerald-500/30 bg-slate-900/95 text-slate-200';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
          borderClass = 'border-amber-500/30 bg-slate-900/95 text-slate-200';
        } else if (toast.type === 'error') {
          icon = <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
          borderClass = 'border-rose-500/30 bg-slate-900/95 text-slate-200';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl border shadow-2xl backdrop-blur-xl flex items-start justify-between gap-3 text-xs sm:text-sm animate-in slide-in-from-bottom-2 duration-200 ${borderClass}`}
          >
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="mt-0.5">{icon}</div>
              <span className="font-medium leading-relaxed">{toast.message}</span>
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5 transition-colors shrink-0"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
