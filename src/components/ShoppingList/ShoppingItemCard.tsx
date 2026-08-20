import React from 'react';
import {
  CheckCircle2,
  Circle,
  Plus,
  Minus,
  Trash2,
  Mic,
  Leaf,
  ArrowRightLeft,
  DollarSign,
} from 'lucide-react';
import { ShoppingItem } from '../../types/shopping';
import { useShopping } from '../../context/ShoppingContext';
import { CATEGORIES } from '../../data/categories';
import { CategoryIcon } from '../common/CategoryIcon';
import { SuggestionEngine } from '../../services/suggestionEngine';

interface ShoppingItemCardProps {
  item: ShoppingItem;
}

export const ShoppingItemCard: React.FC<ShoppingItemCardProps> = ({ item }) => {
  const {
    toggleCompleted,
    updateQuantity,
    removeItem,
    openSubstitutesModal,
  } = useShopping();

  const categoryMeta = CATEGORIES[item.category] || CATEGORIES.pantry;
  const hasSubstitutes = SuggestionEngine.getSubstitutes(item.name).length > 0;
  const itemTotal = (item.estimatedPrice * item.quantity).toFixed(2);

  return (
    <div
      className={`group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl transition-all duration-200 border ${
        item.completed
          ? 'bg-slate-800/40 border-slate-700/40 opacity-60'
          : 'bg-slate-850/80 hover:bg-slate-800/90 border-slate-700/70 hover:border-slate-600 shadow-md hover:shadow-lg'
      }`}
    >
      {/* Left section: Checkbox, Name, Badges */}
      <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0 mb-3 sm:mb-0">
        {/* Checkbox */}
        <button
          onClick={() => toggleCompleted(item.id)}
          className="mt-0.5 sm:mt-0 text-slate-400 hover:text-emerald-400 transition-colors shrink-0"
          title={item.completed ? 'Mark as pending' : 'Mark as purchased'}
        >
          {item.completed ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
          ) : (
            <Circle className="w-5 h-5 hover:text-emerald-400" />
          )}
        </button>

        {/* Item details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`font-semibold text-sm sm:text-base tracking-tight truncate ${
                item.completed
                  ? 'line-through text-slate-400'
                  : 'text-slate-100'
              }`}
            >
              {item.name}
            </span>

            {/* Badges */}
            {item.isOrganic && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <Leaf className="w-3 h-3 text-emerald-400" /> Organic
              </span>
            )}

            {item.addedViaVoice && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-sky-500/10 text-sky-300 border border-sky-500/20">
                <Mic className="w-2.5 h-2.5 text-sky-400" /> Voice
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${categoryMeta.bgClass} ${categoryMeta.colorClass} border ${categoryMeta.borderClass}`}>
              <CategoryIcon category={item.category} className="w-3 h-3" />
              <span>{categoryMeta.name}</span>
            </span>

            <span>•</span>
            <span className="flex items-center text-slate-400">
              <DollarSign className="w-3 h-3 text-slate-500 inline" />
              {item.estimatedPrice.toFixed(2)} / {item.unit}
            </span>
          </div>
        </div>
      </div>

      {/* Right section: Quantity Stepper, Price, Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-3 pl-8 sm:pl-0 shrink-0">
        {/* Quantity Controls */}
        <div className="flex items-center bg-slate-900/90 rounded-lg border border-slate-700/80 p-0.5">
          <button
            onClick={() => {
              if (item.quantity > 1) {
                updateQuantity(item.id, item.quantity - 1);
              } else {
                removeItem(item.id);
              }
            }}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <span className="px-2.5 text-xs font-bold text-slate-200 min-w-[2.5rem] text-center">
            {item.quantity} <span className="text-[10px] font-normal text-slate-400">{item.unit}</span>
          </span>

          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Total Price for item */}
        <div className="text-right min-w-[4rem]">
          <span className="text-sm font-bold text-slate-100">${itemTotal}</span>
        </div>

        {/* Substitute Button (if alternatives available) */}
        {hasSubstitutes && (
          <button
            onClick={() => openSubstitutesModal(item)}
            className="p-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/30 transition-all text-xs font-medium flex items-center gap-1"
            title="View Healthy & Dietary Alternatives"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Swap</span>
          </button>
        )}

        {/* Delete Button */}
        <button
          onClick={() => removeItem(item.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 transition-all"
          title="Remove from list"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
