import React from 'react';
import {
  Sparkles,
  Plus,
  Clock,
  AlertTriangle,
  Flame,
  Check,
} from 'lucide-react';
import { useShopping } from '../../context/ShoppingContext';
import { CategoryIcon } from '../common/CategoryIcon';
import { CATEGORIES } from '../../data/categories';

export const SmartSuggestionsPanel: React.FC = () => {
  const { predictiveRecommendations, addRecommendation } = useShopping();

  if (predictiveRecommendations.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-5 border border-slate-800 text-center">
        <Sparkles className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
        <h4 className="text-sm font-bold text-slate-200">All Restocked!</h4>
        <p className="text-xs text-slate-400 mt-1">
          No predictive items are overdue based on your historical shopping cycles.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800/90 shadow-xl mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
              <span>Smart Reorder Predictions</span>
              <span className="px-2 py-0.2 text-[10px] rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                {predictiveRecommendations.length}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Based on your previous shopping cycles</p>
          </div>
        </div>
      </div>

      {/* Cards list */}
      <div className="space-y-2.5">
        {predictiveRecommendations.slice(0, 4).map((rec) => {
          const categoryMeta = CATEGORIES[rec.category] || CATEGORIES.pantry;

          return (
            <div
              key={rec.id}
              className="p-3 rounded-xl bg-slate-850/80 hover:bg-slate-800 border border-slate-750/70 transition-all flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`p-2 rounded-lg ${categoryMeta.bgClass} ${categoryMeta.colorClass} border ${categoryMeta.borderClass} shrink-0`}>
                  <CategoryIcon category={rec.category} className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold text-xs text-slate-200 truncate">
                      {rec.name}
                    </span>
                    {rec.urgency === 'high' ? (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                        <Flame className="w-2.5 h-2.5 text-rose-400" /> Overdue
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        <Clock className="w-2.5 h-2.5 text-amber-400" /> Running Low
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{rec.reason}</p>
                </div>
              </div>

              {/* Add Button */}
              <button
                onClick={() => addRecommendation(rec)}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white font-medium text-xs transition-all flex items-center gap-1 shrink-0 shadow-sm group-hover:scale-105"
                title="Add to shopping list"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
