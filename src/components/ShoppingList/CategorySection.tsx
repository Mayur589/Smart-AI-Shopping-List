import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ItemCategory, ShoppingItem } from '../../types/shopping';
import { CATEGORIES } from '../../data/categories';
import { CategoryIcon } from '../common/CategoryIcon';
import { ShoppingItemCard } from './ShoppingItemCard';

interface CategorySectionProps {
  category: ItemCategory;
  items: ShoppingItem[];
}

export const CategorySection: React.FC<CategorySectionProps> = ({ category, items }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const meta = CATEGORIES[category] || CATEGORIES.pantry;

  if (items.length === 0) return null;

  const completedCount = items.filter((i) => i.completed).length;
  const subtotal = items.reduce(
    (sum, item) => sum + item.estimatedPrice * item.quantity,
    0
  );

  return (
    <div className="mb-5 rounded-2xl overflow-hidden glass-card border border-slate-800/90 shadow-lg">
      {/* Category Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between bg-slate-850/90 hover:bg-slate-800 transition-colors text-left border-b border-slate-800/80"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${meta.bgClass} ${meta.colorClass} border ${meta.borderClass}`}>
            <CategoryIcon category={category} className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-100 text-sm sm:text-base tracking-tight">
                {meta.name}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">{meta.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Subtotal</span>
            <span className="text-sm font-bold text-slate-200">${subtotal.toFixed(2)}</span>
          </div>

          <div className="p-1 rounded-lg bg-slate-800 text-slate-400">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {/* Items List */}
      {isExpanded && (
        <div className="p-3 sm:p-4 space-y-2.5">
          {items.map((item) => (
            <ShoppingItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};
