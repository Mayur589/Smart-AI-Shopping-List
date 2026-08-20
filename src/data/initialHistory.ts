import { PurchaseHistoryRecord } from '../types/shopping';

export const INITIAL_PURCHASE_HISTORY: PurchaseHistoryRecord[] = [
  {
    productId: 'dairy-001',
    name: 'Whole Milk',
    category: 'dairy',
    frequencyDays: 6,
    lastPurchasedDaysAgo: 8, // Overdue! Should trigger high-urgency suggestion
    purchaseCount: 14,
    averageQuantity: 1,
    unit: 'gallon',
  },
  {
    productId: 'bakery-001',
    name: 'Organic Whole Wheat Sourdough Bread',
    category: 'bakery',
    frequencyDays: 7,
    lastPurchasedDaysAgo: 9, // Overdue! "It looks like you're running low on bread"
    purchaseCount: 12,
    averageQuantity: 1,
    unit: 'loaf',
  },
  {
    productId: 'dairy-011',
    name: 'Pasture-Raised Large Brown Eggs',
    category: 'dairy',
    frequencyDays: 10,
    lastPurchasedDaysAgo: 11, // Overdue!
    purchaseCount: 9,
    averageQuantity: 1,
    unit: 'dozen',
  },
  {
    productId: 'prod-003',
    name: 'Organic Bananas',
    category: 'produce',
    frequencyDays: 5,
    lastPurchasedDaysAgo: 6, // Overdue!
    purchaseCount: 18,
    averageQuantity: 1,
    unit: 'bunch',
  },
  {
    productId: 'bev-001',
    name: 'Organic Whole Bean Dark Roast Coffee',
    category: 'beverages',
    frequencyDays: 14,
    lastPurchasedDaysAgo: 16, // Overdue!
    purchaseCount: 7,
    averageQuantity: 1,
    unit: 'bag',
  },
  {
    productId: 'pantry-001',
    name: 'Cold-Pressed Extra Virgin Olive Oil',
    category: 'pantry',
    frequencyDays: 30,
    lastPurchasedDaysAgo: 28, // Almost due
    purchaseCount: 4,
    averageQuantity: 1,
    unit: 'bottle',
  },
  {
    productId: 'prod-005',
    name: 'Organic Hass Avocados',
    category: 'produce',
    frequencyDays: 7,
    lastPurchasedDaysAgo: 8,
    purchaseCount: 10,
    averageQuantity: 1,
    unit: 'pack of 4',
  }
];
