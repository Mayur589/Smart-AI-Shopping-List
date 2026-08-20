import React, { createContext, useContext, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ItemCategory,
  ProductCatalogItem,
  PurchaseHistoryRecord,
  SeasonalDeal,
  ShoppingItem,
  SmartRecommendation,
  SubstituteSuggestion,
} from '../types/shopping';
import { INITIAL_PURCHASE_HISTORY } from '../data/initialHistory';
import { SEASONAL_DEALS } from '../data/seasonalDeals';
import { SuggestionEngine } from '../services/suggestionEngine';
import { soundEffects } from '../services/soundEffects';

interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: number;
}

interface ShoppingContextType {
  items: ShoppingItem[];
  addItem: (item: Partial<ShoppingItem> & { name: string }) => ShoppingItem;
  removeItem: (idOrName: string) => boolean;
  updateQuantity: (idOrName: string, quantity: number, unit?: string) => boolean;
  toggleCompleted: (idOrName: string) => boolean;
  clearCompleted: () => void;
  clearAll: () => void;
  replaceWithSubstitute: (originalItemId: string, substitute: ProductCatalogItem) => void;
  addRecommendation: (rec: SmartRecommendation) => void;
  addSeasonalDeal: (deal: SeasonalDeal) => void;
  predictiveRecommendations: SmartRecommendation[];
  seasonalRecommendations: SeasonalDeal[];
  activeSubstitutesModal: { isOpen: boolean; item: ShoppingItem | null; suggestions: SubstituteSuggestion[] };
  openSubstitutesModal: (item: ShoppingItem) => void;
  closeSubstitutesModal: () => void;
  toasts: ToastNotification[];
  dismissToast: (id: string) => void;
  showToast: (message: string, type?: ToastNotification['type']) => void;
  searchFilter: string;
  setSearchFilter: (filter: string) => void;
  selectedCategory: ItemCategory | 'all';
  setSelectedCategory: (cat: ItemCategory | 'all') => void;
  totalEstimatedCost: number;
  completedCount: number;
  pendingCount: number;
  completionPercentage: number;
}

const ShoppingContext = createContext<ShoppingContextType | null>(null);

const STORAGE_KEY = 'voice_shopping_assistant_items_v1';
const HISTORY_STORAGE_KEY = 'voice_shopping_assistant_history_v1';

const INITIAL_DEMO_ITEMS: ShoppingItem[] = [
  {
    id: 'item-1',
    name: 'Organic Honeycrisp Apples',
    quantity: 3,
    unit: 'lbs',
    category: 'produce',
    estimatedPrice: 3.99,
    completed: false,
    isOrganic: true,
    addedViaVoice: true,
    createdAt: Date.now() - 3600000,
    lastModifiedAt: Date.now() - 3600000,
  },
  {
    id: 'item-2',
    name: 'Whole Milk',
    quantity: 1,
    unit: 'gallon',
    category: 'dairy',
    estimatedPrice: 4.79,
    completed: false,
    addedViaVoice: false,
    createdAt: Date.now() - 7200000,
    lastModifiedAt: Date.now() - 7200000,
  },
  {
    id: 'item-3',
    name: 'Organic Rolled Oats',
    quantity: 1,
    unit: 'bag',
    category: 'bakery',
    estimatedPrice: 4.49,
    completed: true,
    isOrganic: true,
    addedViaVoice: true,
    createdAt: Date.now() - 86400000,
    lastModifiedAt: Date.now() - 86400000,
  },
];

export const ShoppingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ShoppingItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return INITIAL_DEMO_ITEMS;
  });

  const [history] = useState<PurchaseHistoryRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return INITIAL_PURCHASE_HISTORY;
  });

  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>('all');

  const [activeSubstitutesModal, setActiveSubstitutesModal] = useState<{
    isOpen: boolean;
    item: ShoppingItem | null;
    suggestions: SubstituteSuggestion[];
  }>({
    isOpen: false,
    item: null,
    suggestions: [],
  });

  // Save to local storage on change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items]);

  const showToast = (message: string, type: ToastNotification['type'] = 'info') => {
    const newToast: ToastNotification = {
      id: `toast-${Date.now()}-${Math.random()}`,
      message,
      type,
      timestamp: Date.now(),
    };
    setToasts((prev) => [...prev.slice(-3), newToast]);
    setTimeout(() => {
      dismissToast(newToast.id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addItem = (itemData: Partial<ShoppingItem> & { name: string }): ShoppingItem => {
    const cleanName = itemData.name.trim();
    const existingIndex = items.findIndex(
      (it) => it.name.toLowerCase() === cleanName.toLowerCase()
    );

    let updatedItem: ShoppingItem;

    if (existingIndex >= 0) {
      // Update quantity
      const existing = items[existingIndex];
      const newQty = existing.quantity + (itemData.quantity || 1);
      updatedItem = {
        ...existing,
        quantity: newQty,
        completed: false, // reactivate if was checked
        lastModifiedAt: Date.now(),
      };
      const newItems = [...items];
      newItems[existingIndex] = updatedItem;
      setItems(newItems);
      showToast(`Updated "${cleanName}" quantity to ${newQty}`, 'success');
      soundEffects.playSuccessChime();
      return updatedItem;
    }

    const newItem: ShoppingItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: cleanName,
      quantity: itemData.quantity || 1,
      unit: itemData.unit || 'unit',
      category: itemData.category || 'pantry',
      estimatedPrice: itemData.estimatedPrice || 3.50,
      completed: false,
      isOrganic: itemData.isOrganic || false,
      addedViaVoice: itemData.addedViaVoice ?? false,
      createdAt: Date.now(),
      lastModifiedAt: Date.now(),
    };

    setItems((prev) => [newItem, ...prev]);
    showToast(`Added "${newItem.name}" to shopping list`, 'success');
    soundEffects.playSuccessChime();

    // Check for substitute suggestions automatically
    const subs = SuggestionEngine.getSubstitutes(newItem.name);
    if (subs.length > 0) {
      setTimeout(() => {
        showToast(
          `Healthy plant/dietary alternatives available for "${newItem.name}". Click to view!`,
          'info'
        );
      }, 1000);
    }

    return newItem;
  };

  const removeItem = (idOrName: string): boolean => {
    const clean = idOrName.toLowerCase().trim();
    const itemToRemove = items.find(
      (it) => it.id === idOrName || it.name.toLowerCase().includes(clean)
    );

    if (!itemToRemove) {
      showToast(`Could not find "${idOrName}" in shopping list.`, 'warning');
      soundEffects.playErrorBuzz();
      return false;
    }

    setItems((prev) => prev.filter((it) => it.id !== itemToRemove.id));
    showToast(`Removed "${itemToRemove.name}" from shopping list`, 'info');
    soundEffects.playRemoveTone();
    return true;
  };

  const updateQuantity = (idOrName: string, quantity: number, unit?: string): boolean => {
    const clean = idOrName.toLowerCase().trim();
    const targetIndex = items.findIndex(
      (it) => it.id === idOrName || it.name.toLowerCase().includes(clean)
    );

    if (targetIndex === -1) {
      showToast(`Could not find "${idOrName}" to modify.`, 'warning');
      return false;
    }

    const newItems = [...items];
    newItems[targetIndex] = {
      ...newItems[targetIndex],
      quantity: Math.max(1, quantity),
      unit: unit || newItems[targetIndex].unit,
      lastModifiedAt: Date.now(),
    };

    setItems(newItems);
    showToast(`Updated "${newItems[targetIndex].name}" to ${quantity} ${newItems[targetIndex].unit}`, 'success');
    soundEffects.playSuccessChime();
    return true;
  };

  const toggleCompleted = (idOrName: string): boolean => {
    const clean = idOrName.toLowerCase().trim();
    const targetIndex = items.findIndex(
      (it) => it.id === idOrName || it.name.toLowerCase().includes(clean)
    );

    if (targetIndex === -1) {
      showToast(`Could not find "${idOrName}" in list.`, 'warning');
      return false;
    }

    const newItems = [...items];
    const target = newItems[targetIndex];
    const nextCompleted = !target.completed;
    newItems[targetIndex] = {
      ...target,
      completed: nextCompleted,
      lastModifiedAt: Date.now(),
    };

    setItems(newItems);
    if (nextCompleted) {
      soundEffects.playSuccessChime();
      showToast(`Marked "${target.name}" as completed`, 'success');

      // Check if all items completed for celebratory confetti
      const pendingLeft = newItems.filter((i) => !i.completed).length;
      if (pendingLeft === 0 && newItems.length > 0) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } else {
      showToast(`Marked "${target.name}" as active`, 'info');
    }
    return true;
  };

  const clearCompleted = () => {
    const completedItems = items.filter((it) => it.completed);
    if (completedItems.length === 0) {
      showToast('No completed items to clear.', 'info');
      return;
    }
    setItems((prev) => prev.filter((it) => !it.completed));
    showToast(`Cleared ${completedItems.length} completed items.`, 'info');
    soundEffects.playRemoveTone();
  };

  const clearAll = () => {
    if (items.length === 0) return;
    setItems([]);
    showToast('Shopping list cleared.', 'info');
    soundEffects.playRemoveTone();
  };

  const replaceWithSubstitute = (originalItemId: string, substitute: ProductCatalogItem) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === originalItemId) {
          return {
            ...item,
            name: substitute.name,
            category: substitute.category,
            estimatedPrice: substitute.typicalPrice,
            isOrganic: substitute.isOrganic || false,
            lastModifiedAt: Date.now(),
          };
        }
        return item;
      })
    );
    closeSubstitutesModal();
    showToast(`Replaced item with "${substitute.name}"`, 'success');
    soundEffects.playSuccessChime();
  };

  const addRecommendation = (rec: SmartRecommendation) => {
    addItem({
      name: rec.name,
      category: rec.category,
      quantity: rec.quantity,
      unit: rec.unit,
      estimatedPrice: rec.estimatedPrice,
      addedViaVoice: false,
    });
  };

  const addSeasonalDeal = (deal: SeasonalDeal) => {
    addItem({
      name: deal.name,
      category: deal.category,
      quantity: 1,
      unit: deal.unit,
      estimatedPrice: deal.discountedPrice,
      addedViaVoice: false,
    });
  };

  const openSubstitutesModal = (item: ShoppingItem) => {
    const suggestions = SuggestionEngine.getSubstitutes(item.name);
    setActiveSubstitutesModal({
      isOpen: true,
      item,
      suggestions,
    });
  };

  const closeSubstitutesModal = () => {
    setActiveSubstitutesModal({
      isOpen: false,
      item: null,
      suggestions: [],
    });
  };

  // Derived state
  const predictiveRecommendations = SuggestionEngine.getPredictiveRecommendations(items, history);
  const seasonalRecommendations = SuggestionEngine.getSeasonalRecommendations(items, SEASONAL_DEALS);

  const completedCount = items.filter((i) => i.completed).length;
  const pendingCount = items.filter((i) => !i.completed).length;
  const completionPercentage = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;
  const totalEstimatedCost = items.reduce(
    (sum, item) => sum + item.estimatedPrice * item.quantity,
    0
  );

  return (
    <ShoppingContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        toggleCompleted,
        clearCompleted,
        clearAll,
        replaceWithSubstitute,
        addRecommendation,
        addSeasonalDeal,
        predictiveRecommendations,
        seasonalRecommendations,
        activeSubstitutesModal,
        openSubstitutesModal,
        closeSubstitutesModal,
        toasts,
        dismissToast,
        showToast,
        searchFilter,
        setSearchFilter,
        selectedCategory,
        setSelectedCategory,
        totalEstimatedCost,
        completedCount,
        pendingCount,
        completionPercentage,
      }}
    >
      {children}
    </ShoppingContext.Provider>
  );
};

export const useShopping = (): ShoppingContextType => {
  const context = useContext(ShoppingContext);
  if (!context) {
    throw new Error('useShopping must be used within a ShoppingProvider');
  }
  return context;
};
