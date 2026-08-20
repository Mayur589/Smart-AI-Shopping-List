import React from 'react';
import {
  X,
  ArrowRightLeft,
  Sparkles,
  Check,
  Leaf,
  DollarSign,
  Heart,
} from 'lucide-react';
import { useShopping } from '../../context/ShoppingContext';
import { CategoryIcon } from '../common/CategoryIcon';
import { CATEGORIES } from '../../data/categories';

export const SubstituteModal: React.FC = () => {
  const {
    activeSubstitutesModal,
    closeSubstitutesModal,
    replaceWithSubstitute,
  } = useShopping();

  if (!activeSubstitutesModal.isOpen || !activeSubstitutesModal.item) {
    return null;
  }

  const item = activeSubstitutesModal.item;
  const suggestions = activeSubstitutesModal.suggestions;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="glass-panel w-full max-w-lg rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-850/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">
                Healthy & Dietary Substitutes
              </h3>
              <p className="text-xs text-slate-400">
                Alternatives for <span className="font-semibold text-slate-200">"{item.name}"</span>
              </p>
            </div>
          </div>

          <button
            onClick={closeSubstitutesModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
          {suggestions.length > 0 ? (
            suggestions.map((sub, index) => {
              const catMeta = CATEGORIES[sub.substituteItem.category] || CATEGORIES.pantry;

              return (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-teal-500/40 transition-all shadow-md"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-100">
                          {sub.substituteItem.name}
                        </span>
                        {sub.substituteItem.brand && (
                          <span className="text-xs text-slate-400">
                            by {sub.substituteItem.brand}
                          </span>
                        )}
                      </div>

                      {/* Benefit Tag */}
                      <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-teal-500/15 text-teal-300 border border-teal-500/30">
                        <Heart className="w-3 h-3 text-teal-400" />
                        {sub.benefitTag}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-extrabold text-emerald-400 block">
                        ${sub.substituteItem.typicalPrice.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        per {sub.substituteItem.defaultUnit}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mb-4 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                    {sub.reason}
                  </p>

                  <button
                    onClick={() => replaceWithSubstitute(item.id, sub.substituteItem)}
                    className="w-full py-2 px-3 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-teal-600/20"
                  >
                    <Check className="w-4 h-4" />
                    <span>Swap with this substitute</span>
                  </button>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-slate-400">
              <Sparkles className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-sm">No predefined substitutes found for "{item.name}".</p>
              <p className="text-xs text-slate-500 mt-1">
                Try searching our catalog or using voice: "Substitute for whole milk".
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/80 text-right">
          <button
            onClick={closeSubstitutesModal}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
