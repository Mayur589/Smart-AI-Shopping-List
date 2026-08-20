import React from 'react';
import {
  CheckCircle2,
  DollarSign,
  Plus,
  Trash2,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { useShopping } from '../../context/ShoppingContext';

interface ListSummaryCardProps {
  onOpenManualAdd: () => void;
}

export const ListSummaryCard: React.FC<ListSummaryCardProps> = ({ onOpenManualAdd }) => {
  const {
    items,
    totalEstimatedCost,
    completedCount,
    pendingCount,
    completionPercentage,
    clearCompleted,
    clearAll,
  } = useShopping();

  return (
    <div className="glass-card rounded-2xl p-5 mb-6 border border-slate-800/90 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Progress & Counts */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-slate-200">
                Shopping Progress ({completedCount}/{items.length} completed)
              </span>
            </div>
            <span className="text-xs font-bold text-emerald-400">{completionPercentage}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden border border-slate-700/60">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Estimated Budget & Action Buttons */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 sm:gap-4 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
          {/* Estimated Cost */}
          <div className="px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-left">
            <span className="text-[11px] text-slate-400 block font-medium">Estimated Total</span>
            <div className="flex items-center text-emerald-400 font-extrabold text-base sm:text-lg">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span>{totalEstimatedCost.toFixed(2)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5"
                title="Remove checked items"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Clear Done ({completedCount})</span>
              </button>
            )}

            {items.length > 0 && (
              <button
                onClick={clearAll}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700/80 hover:border-rose-500/30 transition-all"
                title="Clear entire list"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onOpenManualAdd}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
