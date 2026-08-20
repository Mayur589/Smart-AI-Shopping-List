export type ItemCategory =
  | 'produce'
  | 'dairy'
  | 'bakery'
  | 'meat'
  | 'pantry'
  | 'beverages'
  | 'snacks'
  | 'household'
  | 'personal_care';

export interface CategoryInfo {
  id: ItemCategory;
  name: string;
  description: string;
  iconName: string; // Lucide icon identifier
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: ItemCategory;
  estimatedPrice: number; // in USD
  completed: boolean;
  notes?: string;
  brand?: string;
  isOrganic?: boolean;
  addedViaVoice?: boolean;
  createdAt: number;
  lastModifiedAt: number;
  matchedProductId?: string;
}

export interface ProductCatalogItem {
  id: string;
  name: string;
  category: ItemCategory;
  brand?: string;
  defaultUnit: string;
  typicalPrice: number; // in USD
  isOrganic?: boolean;
  isGlutenFree?: boolean;
  isVegan?: boolean;
  isSeasonal?: boolean;
  seasonalTag?: 'spring' | 'summer' | 'fall' | 'winter' | 'year_round';
  substitutes?: string[]; // IDs or names of alternative products
  aliases: string[]; // Variations in natural language (e.g. ['skim milk', 'low fat milk', 'whole milk'])
  description?: string;
  nutritionHighlight?: string;
}

export interface SubstituteSuggestion {
  originalItem: string;
  substituteItem: ProductCatalogItem;
  reason: string; // e.g., 'Healthier alternative', 'Plant-based dairy-free', 'Budget-friendly option'
  benefitTag: string; // e.g. 'Dairy-Free', 'Gluten-Free', 'Lower Sugar'
}

export interface PurchaseHistoryRecord {
  productId: string;
  name: string;
  category: ItemCategory;
  frequencyDays: number; // typical interval in days
  lastPurchasedDaysAgo: number;
  purchaseCount: number;
  averageQuantity: number;
  unit: string;
}

export interface SmartRecommendation {
  id: string;
  productId: string;
  name: string;
  category: ItemCategory;
  quantity: number;
  unit: string;
  estimatedPrice: number;
  reason: string; // e.g. "Usually bought every 7 days. Last bought 9 days ago."
  urgency: 'high' | 'medium' | 'low';
  type: 'predictive' | 'seasonal' | 'frequent' | 'deal';
}

export interface SeasonalDeal {
  id: string;
  productId: string;
  name: string;
  category: ItemCategory;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  season: 'spring' | 'summer' | 'fall' | 'winter';
  badgeText: string;
  unit: string;
}

export interface SearchFilterState {
  query: string;
  category?: ItemCategory | 'all';
  maxPrice?: number;
  minPrice?: number;
  brand?: string;
  isOrganic?: boolean;
  isGlutenFree?: boolean;
  isVegan?: boolean;
  isSeasonal?: boolean;
}
