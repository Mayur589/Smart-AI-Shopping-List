import React from 'react';
import {
  Tag,
  Plus,
  Percent,
  Sun,
  Flame,
  Check,
} from 'lucide-react';
import { useShopping } from '../../context/ShoppingContext';
import { CategoryIcon } from '../common/CategoryIcon';
import { CATEGORIES } from '../../data/categories';

export const SeasonalDealsSection: React.FC = () => {
  const { seasonalRecommendations, addSeasonalDeal } = useShopping();

  if (seasonalRecommendations.length === 0) return null;

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800/90 shadow-xl mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Sun className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
              <span>Seasonal Picks & Deals</span>
              <span className="px-2 py-0.2 text-[10px] rounded-full bg-amber-500/20 text-amber-300 font-bold">
                {seasonalRecommendations.length}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Peak freshness produce & weekly savings</p>
          </div>
        </div>
      </div>

      {/* Deals list */}
      <div className="space-y-2.5">
        {seasonalRecommendations.map((deal) => {
          const categoryMeta = CATEGORIES[deal.category] || CATEGORIES.pantry;

          return (
            <div
              key={deal.id}
              className="p-3 rounded-xl bg-slate-850/80 hover:bg-slate-800 border border-slate-750/70 transition-all flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`p-2 rounded-lg ${categoryMeta.bgClass} ${categoryMeta.colorClass} border ${categoryMeta.borderClass} shrink-0`}>
                  <CategoryIcon category={deal.category} className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold text-xs text-slate-200 truncate">
                      {deal.name}
                    </span>
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      <Percent className="w-2.5 h-2.5 text-amber-400" /> {deal.discountPercentage}% OFF
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                    <span className="text-emerald-400 font-bold">${deal.discountedPrice.toFixed(2)}</span>
                    <span className="line-through text-slate-500">${deal.originalPrice.toFixed(2)}</span>
                    <span>•</span>
                    <span className="text-slate-400">{deal.badgeText}</span>
                  </div>
                </div>
              </div>

              {/* Add Button */}
              <button
                onClick={() => addSeasonalDeal(deal)}
                className="px-2.5 py-1.5 rounded-lg bg-amber-600/90 hover:bg-amber-500 text-white font-medium text-xs transition-all flex items-center gap-1 shrink-0 shadow-sm group-hover:scale-105"
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
