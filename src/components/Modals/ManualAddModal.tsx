import React, { useState } from 'react';
import {
  X,
  Plus,
  ShoppingBag,
  Leaf,
  DollarSign,
} from 'lucide-react';
import { useShopping } from '../../context/ShoppingContext';
import { ItemCategory } from '../../types/shopping';
import { CATEGORY_LIST } from '../../data/categories';
import { NLPEngine } from '../../services/nlpEngine';

interface ManualAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManualAddModal: React.FC<ManualAddModalProps> = ({ isOpen, onClose }) => {
  const { addItem } = useShopping();

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState('item');
  const [category, setCategory] = useState<ItemCategory>('produce');
  const [isOrganic, setIsOrganic] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState<string>('3.50');

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (val.trim()) {
      const autoCat = NLPEngine.categorizeItem(val);
      setCategory(autoCat);
      const price = NLPEngine.estimatePrice(val, autoCat);
      setEstimatedPrice(price.toFixed(2));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addItem({
      name: name.trim(),
      quantity: Math.max(1, quantity),
      unit: unit.trim() || 'item',
      category,
      isOrganic,
      estimatedPrice: parseFloat(estimatedPrice) || 3.50,
      addedViaVoice: false,
    });

    setName('');
    setQuantity(1);
    setUnit('item');
    setIsOrganic(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="glass-panel w-full max-w-md rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-850/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">Add Item to List</h3>
              <p className="text-xs text-slate-400">Manual entry or quick keyboard shortcut</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Item Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Item Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Organic Avocados, Whole Milk, Sourdough Bread..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 focus:border-emerald-500 text-sm text-slate-100 placeholder-slate-500 outline-none"
              autoFocus
            />
          </div>

          {/* Quantity and Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Quantity
              </label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800/90 border border-slate-700 focus:border-emerald-500 text-sm text-slate-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Unit
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 focus:border-emerald-500 text-sm text-slate-100 outline-none"
              >
                <option value="item">item(s)</option>
                <option value="lbs">lbs</option>
                <option value="kg">kg</option>
                <option value="bottle">bottle(s)</option>
                <option value="can">can(s)</option>
                <option value="box">box(es)</option>
                <option value="pack">pack(s)</option>
                <option value="bag">bag(s)</option>
                <option value="gallon">gallon(s)</option>
                <option value="loaf">loaf/loaves</option>
              </select>
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ItemCategory)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800/90 border border-slate-700 focus:border-emerald-500 text-sm text-slate-100 outline-none"
            >
              {CATEGORY_LIST.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Estimated Price & Organic Checkbox */}
          <div className="grid grid-cols-2 gap-3 items-center pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Est. Price ($)
              </label>
              <div className="relative">
                <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  step="0.01"
                  min="0.10"
                  value={estimatedPrice}
                  onChange={(e) => setEstimatedPrice(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 focus:border-emerald-500 text-sm text-slate-100 outline-none"
                />
              </div>
            </div>

            <div className="pt-5">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isOrganic}
                  onChange={(e) => setIsOrganic(e.target.checked)}
                  className="rounded accent-emerald-500 w-4 h-4"
                />
                <span className="flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5 text-emerald-400" /> Organic
                </span>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-semibold transition-all shadow-lg shadow-emerald-600/20"
            >
              Add to List
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
