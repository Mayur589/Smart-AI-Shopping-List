import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Mic,
  DollarSign,
  Plus,
  Check,
  Leaf,
  Sparkles,
  SlidersHorizontal,
  Package,
} from 'lucide-react';
import { useVoice } from '../../context/VoiceContext';
import { useShopping } from '../../context/ShoppingContext';
import { PRODUCT_CATALOG } from '../../data/productCatalog';
import { ItemCategory, ProductCatalogItem } from '../../types/shopping';
import { CATEGORY_LIST, CATEGORIES } from '../../data/categories';
import { CategoryIcon } from '../common/CategoryIcon';

export const VoiceSearchModal: React.FC = () => {
  const {
    activeSearchModal,
    closeSearchModal,
    isListening,
    toggleListening,
  } = useVoice();

  const { addItem, showToast } = useShopping();

  const [query, setQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(15);
  const [categoryFilter, setCategoryFilter] = useState<ItemCategory | 'all'>('all');
  const [onlyOrganic, setOnlyOrganic] = useState(false);
  const [onlyGlutenFree, setOnlyGlutenFree] = useState(false);
  const [onlyVegan, setOnlyVegan] = useState(false);
  const [addedItemIds, setAddedItemIds] = useState<Set<string>>(new Set());

  // Initialize query and maxPrice if passed from voice command
  useEffect(() => {
    if (activeSearchModal.isOpen) {
      if (activeSearchModal.initialQuery) {
        setQuery(activeSearchModal.initialQuery);
      }
      if (activeSearchModal.maxPrice) {
        setMaxPrice(activeSearchModal.maxPrice);
      }
    }
  }, [activeSearchModal]);

  if (!activeSearchModal.isOpen) return null;

  // Filter product catalog
  const filteredProducts = PRODUCT_CATALOG.filter((product) => {
    // Text search query
    const cleanQuery = query.toLowerCase().trim();
    const matchesQuery =
      !cleanQuery ||
      product.name.toLowerCase().includes(cleanQuery) ||
      (product.brand && product.brand.toLowerCase().includes(cleanQuery)) ||
      product.aliases.some((alias) => alias.toLowerCase().includes(cleanQuery));

    // Price filter
    const matchesPrice = product.typicalPrice <= maxPrice;

    // Category filter
    const matchesCategory =
      categoryFilter === 'all' || product.category === categoryFilter;

    // Dietary filters
    const matchesOrganic = !onlyOrganic || !!product.isOrganic;
    const matchesGlutenFree = !onlyGlutenFree || !!product.isGlutenFree;
    const matchesVegan = !onlyVegan || !!product.isVegan;

    return (
      matchesQuery &&
      matchesPrice &&
      matchesCategory &&
      matchesOrganic &&
      matchesGlutenFree &&
      matchesVegan
    );
  });

  const handleAddProduct = (product: ProductCatalogItem) => {
    addItem({
      name: product.name,
      category: product.category,
      quantity: 1,
      unit: product.defaultUnit,
      estimatedPrice: product.typicalPrice,
      isOrganic: product.isOrganic || false,
      addedViaVoice: false,
    });
    setAddedItemIds((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedItemIds((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="glass-panel w-full max-w-3xl rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-850/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">
                Voice & Catalog Search
              </h3>
              <p className="text-xs text-slate-400">
                Filter by price ceiling, brand, dietary preference, or voice command
              </p>
            </div>
          </div>

          <button
            onClick={closeSearchModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Controls */}
        <div className="p-6 border-b border-slate-800/80 bg-slate-900/60 space-y-4">
          {/* Main search bar with inline mic */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Search products (e.g. "Honeycrisp apples", "Silk Almond Milk", "Toothpaste")...'
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 focus:border-emerald-500 text-sm text-slate-100 placeholder-slate-400 outline-none transition-all"
                autoFocus
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => toggleListening()}
              className={`p-2.5 rounded-xl border transition-all ${
                isListening
                  ? 'bg-emerald-500 text-slate-950 glow-emerald'
                  : 'bg-slate-800 text-emerald-400 border-slate-700 hover:bg-slate-700'
              }`}
              title="Voice search command"
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            {/* Price Ceiling Slider */}
            <div className="bg-slate-850 p-3 rounded-xl border border-slate-750">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Max Price
                </span>
                <span className="text-xs font-bold text-emerald-400">${maxPrice.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                step={0.5}
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Category Dropdown Filter */}
            <div className="bg-slate-850 p-3 rounded-xl border border-slate-750">
              <span className="text-xs font-semibold text-slate-300 block mb-1.5">Category</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className="w-full py-1 px-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 outline-none"
              >
                <option value="all">All Categories</option>
                {CATEGORY_LIST.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Dietary Checkboxes */}
            <div className="sm:col-span-2 bg-slate-850 p-3 rounded-xl border border-slate-750 flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-300 block">Dietary Preferences</span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyOrganic}
                    onChange={(e) => setOnlyOrganic(e.target.checked)}
                    className="rounded accent-emerald-500"
                  />
                  <span>Organic</span>
                </label>

                <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyGlutenFree}
                    onChange={(e) => setOnlyGlutenFree(e.target.checked)}
                    className="rounded accent-emerald-500"
                  />
                  <span>Gluten-Free</span>
                </label>

                <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyVegan}
                    onChange={(e) => setOnlyVegan(e.target.checked)}
                    className="rounded accent-emerald-500"
                  />
                  <span>Vegan</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
            <span>Showing {filteredProducts.length} matching products</span>
            <span>Click "+" to add directly to list</span>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredProducts.map((prod) => {
                const isAdded = addedItemIds.has(prod.id);
                const catMeta = CATEGORIES[prod.category] || CATEGORIES.pantry;

                return (
                  <div
                    key={prod.id}
                    className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/40 transition-all flex items-start justify-between gap-3 group shadow-md"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-xs text-slate-100 truncate">
                          {prod.name}
                        </span>
                        {prod.isOrganic && (
                          <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded text-[9px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                            <Leaf className="w-2.5 h-2.5 text-emerald-400" /> Bio
                          </span>
                        )}
                      </div>

                      {prod.brand && (
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          {prod.brand}
                        </span>
                      )}

                      <div className="flex items-center gap-2 mt-2">
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] ${catMeta.bgClass} ${catMeta.colorClass}`}>
                          <CategoryIcon category={prod.category} className="w-3 h-3" />
                          {catMeta.name}
                        </span>
                        <span className="text-xs font-bold text-emerald-400">
                          ${prod.typicalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddProduct(prod)}
                      className={`p-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                        isAdded
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-emerald-600/90 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                      }`}
                      title="Add to Shopping List"
                    >
                      {isAdded ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400">
              <Package className="w-10 h-10 text-slate-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300">No products found</p>
              <p className="text-xs text-slate-500 mt-1">
                Try widening your price ceiling (${maxPrice.toFixed(2)}) or clearing your filters.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Say <span className="font-semibold text-slate-300">"Find [item] under $[amount]"</span> to search by voice anytime.
          </span>
          <button
            onClick={closeSearchModal}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
