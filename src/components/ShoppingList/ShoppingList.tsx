import React from 'react';
import {
  Search,
  SlidersHorizontal,
  PlusCircle,
  PackageOpen,
  Sparkles,
  Layers,
} from 'lucide-react';
import { ItemCategory, ShoppingItem } from '../../types/shopping';
import { useShopping } from '../../context/ShoppingContext';
import { CATEGORY_LIST, CATEGORIES } from '../../data/categories';
import { CategoryIcon } from '../common/CategoryIcon';
import { CategorySection } from './CategorySection';
import { ListSummaryCard } from './ListSummaryCard';

interface ShoppingListProps {
  onOpenManualAdd: () => void;
}

export const ShoppingList: React.FC<ShoppingListProps> = ({ onOpenManualAdd }) => {
  const {
    items,
    searchFilter,
    setSearchFilter,
    selectedCategory,
    setSelectedCategory,
  } = useShopping();

  // Filter items by search query and category
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      !searchFilter.trim() ||
      item.name.toLowerCase().includes(searchFilter.toLowerCase().trim()) ||
      CATEGORIES[item.category]?.name.toLowerCase().includes(searchFilter.toLowerCase().trim());

    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Group filtered items by category
  const groupedByCategory = CATEGORY_LIST.map((cat) => ({
    category: cat.id,
    items: filteredItems.filter((it) => it.category === cat.id),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="w-full">
      {/* List Summary & Progress Header */}
      <ListSummaryCard onOpenManualAdd={onOpenManualAdd} />

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        {/* Category Scrollable Navigation Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none max-w-full">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white border border-slate-700/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Categories ({items.length})</span>
          </button>

          {CATEGORY_LIST.map((cat) => {
            const countInCat = items.filter((i) => i.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white border border-slate-700/60'
                }`}
              >
                <CategoryIcon category={cat.id} className="w-3.5 h-3.5" />
                <span>{cat.name}</span>
                {countInCat > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {countInCat}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search inside list */}
        <div className="relative min-w-[200px] sm:w-64 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter active list..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Categorized List or Empty States */}
      {groupedByCategory.length > 0 ? (
        <div className="space-y-4">
          {groupedByCategory.map((group) => (
            <CategorySection
              key={group.category}
              category={group.category}
              items={group.items}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-10 text-center border border-slate-800 my-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400">
            <PackageOpen className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-base font-bold text-slate-200 mb-1">
            {searchFilter ? 'No items match your filter' : 'Your shopping list is empty'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
            {searchFilter
              ? `No items found matching "${searchFilter}". Try clearing your search query.`
              : 'Add items easily by speaking voice commands ("Add 2 apples", "I need whole milk") or click below.'}
          </p>

          <div className="flex items-center justify-center gap-3">
            {searchFilter && (
              <button
                onClick={() => setSearchFilter('')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all"
              >
                Clear Search
              </button>
            )}
            <button
              onClick={onOpenManualAdd}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add First Item</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
