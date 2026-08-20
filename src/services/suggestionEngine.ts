import { INITIAL_PURCHASE_HISTORY } from '../data/initialHistory';
import { CURRENT_ACTIVE_SEASON, SEASONAL_DEALS } from '../data/seasonalDeals';
import { PRODUCT_BY_ID } from '../data/productCatalog';
import { findSubstitutesForText } from '../data/substitutesData';
import {
  PurchaseHistoryRecord,
  SeasonalDeal,
  ShoppingItem,
  SmartRecommendation,
  SubstituteSuggestion,
} from '../types/shopping';

export class SuggestionEngine {
  /**
   * Generates proactive, frequency-based recommendations ("You are running low on bread")
   */
  public static getPredictiveRecommendations(
    currentItems: ShoppingItem[],
    history: PurchaseHistoryRecord[] = INITIAL_PURCHASE_HISTORY
  ): SmartRecommendation[] {
    const currentItemNames = new Set(
      currentItems.map((item) => item.name.toLowerCase())
    );

    const recommendations: SmartRecommendation[] = [];

    for (const record of history) {
      // Don't recommend if already in shopping list
      const alreadyInList = Array.from(currentItemNames).some(
        (name) =>
          name.includes(record.name.toLowerCase()) ||
          record.name.toLowerCase().includes(name)
      );

      if (alreadyInList) continue;

      const daysOverdue = record.lastPurchasedDaysAgo - record.frequencyDays;
      const isUrgent = daysOverdue >= 0;

      let urgency: 'high' | 'medium' | 'low' = 'low';
      let reason = `Usually bought every ${record.frequencyDays} days.`;

      if (daysOverdue >= 2) {
        urgency = 'high';
        reason = `Usually restocked every ${record.frequencyDays} days. It's been ${record.lastPurchasedDaysAgo} days since last purchase.`;
      } else if (daysOverdue >= 0) {
        urgency = 'medium';
        reason = `Likely running low soon (last purchased ${record.lastPurchasedDaysAgo} days ago).`;
      } else if (record.purchaseCount >= 8) {
        urgency = 'medium';
        reason = `Frequently bought item (${record.purchaseCount} times previously).`;
      }

      const product = PRODUCT_BY_ID.get(record.productId);
      const price = product ? product.typicalPrice : 3.99;

      recommendations.push({
        id: `rec-${record.productId}`,
        productId: record.productId,
        name: record.name,
        category: record.category,
        quantity: record.averageQuantity || 1,
        unit: record.unit || 'item',
        estimatedPrice: price,
        reason,
        urgency,
        type: isUrgent ? 'predictive' : 'frequent',
      });
    }

    // Sort by urgency: high -> medium -> low
    const urgencyOrder = { high: 0, medium: 1, low: 2 };
    return recommendations.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);
  }

  /**
   * Retrieves active seasonal produce recommendations and discounts
   */
  public static getSeasonalRecommendations(
    currentItems: ShoppingItem[],
    deals: SeasonalDeal[] = SEASONAL_DEALS
  ): SeasonalDeal[] {
    const currentItemNames = new Set(
      currentItems.map((item) => item.name.toLowerCase())
    );

    return deals.filter((deal) => {
      const alreadyInList = Array.from(currentItemNames).some((name) =>
        name.includes(deal.name.toLowerCase())
      );
      return !alreadyInList && (deal.season === CURRENT_ACTIVE_SEASON || deal.discountPercentage > 15);
    });
  }

  /**
   * Finds contextual substitutes when a user adds an item or searches for replacements
   */
  public static getSubstitutes(itemText: string): SubstituteSuggestion[] {
    return findSubstitutesForText(itemText);
  }
}
