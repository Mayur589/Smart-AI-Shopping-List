import { PRODUCT_CATALOG } from './productCatalog';
import { SubstituteSuggestion } from '../types/shopping';

export interface SubstituteRule {
  triggerKeywords: string[];
  substitutes: {
    productId: string;
    reason: string;
    benefitTag: string;
  }[];
}

export const SUBSTITUTE_RULES: SubstituteRule[] = [
  {
    triggerKeywords: ['milk', 'whole milk', 'cow milk', 'dairy milk', 'regular milk', 'leche'],
    substitutes: [
      {
        productId: 'dairy-002',
        reason: 'Lactose-free, 30 calories per cup, enriched with Calcium and Vitamin D.',
        benefitTag: 'Dairy-Free & Low Calorie',
      },
      {
        productId: 'dairy-003',
        reason: 'Ultra-creamy texture, perfect for frothing in coffee and baking.',
        benefitTag: 'Nut-Free & Creamy',
      },
      {
        productId: 'dairy-004',
        reason: '8g of complete plant protein per cup, matching dairy protein content.',
        benefitTag: 'High Protein Plant Milk',
      },
    ],
  },
  {
    triggerKeywords: ['butter', 'dairy butter', 'salted butter', 'mantequilla'],
    substitutes: [
      {
        productId: 'dairy-010',
        reason: 'Made from olive oil and plant oils with 40% less saturated fat.',
        benefitTag: 'Plant-Based 0mg Cholesterol',
      },
      {
        productId: 'pantry-001',
        reason: 'Heart-healthy monounsaturated fats and polyphenols for cooking and drizzling.',
        benefitTag: 'Heart Healthy Extra Virgin',
      },
    ],
  },
  {
    triggerKeywords: ['eggs', 'egg', 'brown eggs', 'huevos'],
    substitutes: [
      {
        productId: 'dairy-012',
        reason: 'Scrambles and bakes identically with zero cholesterol, made from mung beans.',
        benefitTag: '100% Plant-Based Egg',
      },
    ],
  },
  {
    triggerKeywords: ['bread', 'white bread', 'regular bread', 'pan'],
    substitutes: [
      {
        productId: 'bakery-001',
        reason: 'Slow fermented with wild culture for easier gut digestion and lower glycemic impact.',
        benefitTag: 'Artisan Gut-Friendly Sourdough',
      },
      {
        productId: 'bakery-002',
        reason: 'Certified gluten-free made without wheat, soy, or dairy.',
        benefitTag: 'Certified Gluten-Free',
      },
    ],
  },
  {
    triggerKeywords: ['pasta', 'spaghetti', 'noodles'],
    substitutes: [
      {
        productId: 'bakery-009',
        reason: '20g protein and 8g fiber per serving made from whole chickpeas.',
        benefitTag: 'High Protein & Gluten-Free',
      },
    ],
  },
  {
    triggerKeywords: ['beef', 'ground beef', 'minced meat', 'burger'],
    substitutes: [
      {
        productId: 'meat-005',
        reason: 'Looks, cooks, and satisfies like beef with 20g plant protein and 0mg cholesterol.',
        benefitTag: 'Plant-Based Protein',
      },
      {
        productId: 'meat-002',
        reason: 'High protein, budget-friendly organic soy protein for stir-fries and scrambles.',
        benefitTag: 'Low Calorie Organic Protein',
      },
    ],
  },
  {
    triggerKeywords: ['peanut butter', 'creamy peanut butter', 'crema de cacahuete'],
    substitutes: [
      {
        productId: 'pantry-005',
        reason: '100% nut-free sunflower seed spread safe for school and peanut allergies.',
        benefitTag: 'School-Safe Nut-Free',
      },
      {
        productId: 'pantry-004',
        reason: 'Rich in Vitamin E and magnesium with zero added sugar or oils.',
        benefitTag: 'Organic Raw Almond Spread',
      },
    ],
  },
  {
    triggerKeywords: ['toothpaste', 'regular toothpaste', 'colgate'],
    substitutes: [
      {
        productId: 'care-002',
        reason: 'Strengthens acid-softened enamel and protects sensitive tooth nerves.',
        benefitTag: 'Enamel & Sensitivity Care',
      },
    ],
  },
];

export function findSubstitutesForText(itemText: string): SubstituteSuggestion[] {
  const normalized = itemText.toLowerCase().trim();
  const suggestions: SubstituteSuggestion[] = [];

  for (const rule of SUBSTITUTE_RULES) {
    const isMatch = rule.triggerKeywords.some((kw) =>
      normalized === kw || normalized.includes(kw)
    );

    if (isMatch) {
      for (const sub of rule.substitutes) {
        const product = PRODUCT_CATALOG.find((p) => p.id === sub.productId);
        if (product) {
          suggestions.push({
            originalItem: itemText,
            substituteItem: product,
            reason: sub.reason,
            benefitTag: sub.benefitTag,
          });
        }
      }
      break;
    }
  }

  return suggestions;
}
