import { describe, it, expect } from 'vitest';
import { SuggestionEngine } from './suggestionEngine';
import { ShoppingItem } from '../types/shopping';

describe('SuggestionEngine - Smart Suggestions & Substitutes', () => {
  it('generates predictive recommendations when items are overdue', () => {
    const currentItems: ShoppingItem[] = [];
    const recommendations = SuggestionEngine.getPredictiveRecommendations(currentItems);

    expect(recommendations.length).toBeGreaterThan(0);
    // Overdue items like Bread and Milk should be in high or medium urgency
    const breadRec = recommendations.find((r) => r.name.toLowerCase().includes('bread'));
    expect(breadRec).toBeDefined();
    expect(breadRec?.urgency).toBe('high');
  });

  it('does not recommend items that are already in the shopping list', () => {
    const currentItems: ShoppingItem[] = [
      {
        id: '1',
        name: 'Whole Milk',
        quantity: 1,
        unit: 'gallon',
        category: 'dairy',
        estimatedPrice: 4.79,
        completed: false,
        createdAt: Date.now(),
        lastModifiedAt: Date.now(),
      },
    ];

    const recommendations = SuggestionEngine.getPredictiveRecommendations(currentItems);
    const milkRec = recommendations.find((r) => r.name.toLowerCase() === 'whole milk');
    expect(milkRec).toBeUndefined();
  });

  it('finds plant-based and healthy substitutes for whole milk', () => {
    const substitutes = SuggestionEngine.getSubstitutes('Whole Milk');
    expect(substitutes.length).toBeGreaterThan(0);
    const names = substitutes.map((s) => s.substituteItem.name.toLowerCase());
    expect(names.some((n) => n.includes('almond') || n.includes('oat') || n.includes('soy'))).toBe(true);
  });

  it('finds substitutes for butter', () => {
    const substitutes = SuggestionEngine.getSubstitutes('Butter');
    expect(substitutes.length).toBeGreaterThan(0);
  });

  it('retrieves active seasonal produce and deals', () => {
    const deals = SuggestionEngine.getSeasonalRecommendations([]);
    expect(deals.length).toBeGreaterThan(0);
    expect(deals[0].discountPercentage).toBeGreaterThan(0);
  });
});
