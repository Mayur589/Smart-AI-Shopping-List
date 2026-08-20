import { describe, it, expect } from 'vitest';
import { NLPEngine } from './nlpEngine';

describe('NLPEngine - Voice Intent & Entity Parsing', () => {
  describe('Adding Items with Varied Phrasing & Natural Language', () => {
    it('parses direct command "Add milk"', () => {
      const result = NLPEngine.parseCommand('Add milk');
      expect(result.intent).toBe('ADD_ITEM');
      expect(result.entities.itemName?.toLowerCase()).toContain('milk');
      expect(result.entities.category).toBe('dairy');
    });

    it('parses "I need 3 organic apples"', () => {
      const result = NLPEngine.parseCommand('I need 3 organic apples');
      expect(result.intent).toBe('ADD_ITEM');
      expect(result.entities.quantity).toBe(3);
      expect(result.entities.itemName?.toLowerCase()).toContain('apple');
      expect(result.entities.category).toBe('produce');
    });

    it('parses "I want to buy bananas"', () => {
      const result = NLPEngine.parseCommand('I want to buy bananas');
      expect(result.intent).toBe('ADD_ITEM');
      expect(result.entities.itemName?.toLowerCase()).toContain('banana');
      expect(result.entities.category).toBe('produce');
    });

    it('parses "Add 2 bottles of water"', () => {
      const result = NLPEngine.parseCommand('Add 2 bottles of water');
      expect(result.intent).toBe('ADD_ITEM');
      expect(result.entities.quantity).toBe(2);
      expect(result.entities.unit).toBe('bottles');
      expect(result.entities.itemName?.toLowerCase()).toContain('water');
      expect(result.entities.category).toBe('beverages');
    });

    it('parses "Buy 5 oranges"', () => {
      const result = NLPEngine.parseCommand('Buy 5 oranges');
      expect(result.intent).toBe('ADD_ITEM');
      expect(result.entities.quantity).toBe(5);
      expect(result.entities.itemName?.toLowerCase()).toContain('orange');
    });

    it('parses word numbers like "two loaves of bread"', () => {
      const result = NLPEngine.parseCommand('Add two loaves of bread');
      expect(result.intent).toBe('ADD_ITEM');
      expect(result.entities.quantity).toBe(2);
      expect(result.entities.unit).toBe('loaves');
      expect(result.entities.category).toBe('bakery');
    });
  });

  describe('Removing & Modifying Items', () => {
    it('parses "Remove milk from my list"', () => {
      const result = NLPEngine.parseCommand('Remove milk from my list');
      expect(result.intent).toBe('REMOVE_ITEM');
      expect(result.entities.itemName?.toLowerCase()).toBe('milk');
    });

    it('parses "I don\'t need apples anymore"', () => {
      const result = NLPEngine.parseCommand("I don't need apples anymore");
      expect(result.intent).toBe('REMOVE_ITEM');
      expect(result.entities.itemName?.toLowerCase()).toBe('apples');
    });

    it('parses "Change bananas quantity to 6"', () => {
      const result = NLPEngine.parseCommand('Change bananas quantity to 6');
      expect(result.intent).toBe('MODIFY_QUANTITY');
      expect(result.entities.itemName?.toLowerCase()).toContain('banana');
      expect(result.entities.quantity).toBe(6);
    });
  });

  describe('Voice-Activated Search & Price Filtering', () => {
    it('parses "Find toothpaste under $5"', () => {
      const result = NLPEngine.parseCommand('Find toothpaste under $5');
      expect(result.intent).toBe('SEARCH_PRODUCTS');
      expect(result.entities.itemName?.toLowerCase()).toContain('toothpaste');
      expect(result.entities.maxPrice).toBe(5.0);
    });

    it('parses "Search for organic apples under 10 dollars"', () => {
      const result = NLPEngine.parseCommand('Search for organic apples under 10 dollars');
      expect(result.intent).toBe('SEARCH_PRODUCTS');
      expect(result.entities.maxPrice).toBe(10.0);
    });
  });

  describe('Dietary Substitutes Queries', () => {
    it('parses "What can I substitute for butter?"', () => {
      const result = NLPEngine.parseCommand('What can I substitute for butter?');
      expect(result.intent).toBe('ASK_SUBSTITUTES');
      expect(result.entities.targetSubstitute?.toLowerCase()).toBe('butter');
    });

    it('parses "Alternative to whole milk"', () => {
      const result = NLPEngine.parseCommand('Alternative to whole milk');
      expect(result.intent).toBe('ASK_SUBSTITUTES');
      expect(result.entities.targetSubstitute?.toLowerCase()).toBe('whole milk');
    });
  });

  describe('Checking Off & Clearing Commands', () => {
    it('parses "Check off bread"', () => {
      const result = NLPEngine.parseCommand('Check off bread');
      expect(result.intent).toBe('CHECK_ITEM');
      expect(result.entities.itemName?.toLowerCase()).toBe('bread');
    });

    it('parses "Clear completed items"', () => {
      const result = NLPEngine.parseCommand('Clear completed items');
      expect(result.intent).toBe('CLEAR_COMPLETED');
    });
  });

  describe('Automatic Categorization', () => {
    it('categorizes apples into produce', () => {
      expect(NLPEngine.categorizeItem('Honeycrisp Apples')).toBe('produce');
    });

    it('categorizes almond milk into dairy', () => {
      expect(NLPEngine.categorizeItem('Almond Milk')).toBe('dairy');
    });

    it('categorizes chicken breast into meat', () => {
      expect(NLPEngine.categorizeItem('Chicken Breast')).toBe('meat');
    });

    it('categorizes sourdough into bakery', () => {
      expect(NLPEngine.categorizeItem('Sourdough Bread')).toBe('bakery');
    });

    it('categorizes olive oil into pantry', () => {
      expect(NLPEngine.categorizeItem('Olive Oil')).toBe('pantry');
    });

    it('categorizes coffee into beverages', () => {
      expect(NLPEngine.categorizeItem('Dark Roast Coffee')).toBe('beverages');
    });

    it('categorizes toothpaste into personal_care', () => {
      expect(NLPEngine.categorizeItem('Mint Toothpaste')).toBe('personal_care');
    });

    it('categorizes dish soap into household', () => {
      expect(NLPEngine.categorizeItem('Dish Soap')).toBe('household');
    });
  });

  describe('Multilingual Command Support', () => {
    it('parses Spanish "Agregar 2 manzanas"', () => {
      const result = NLPEngine.parseCommand('Agregar 2 manzanas', 'es-ES');
      expect(result.intent).toBe('ADD_ITEM');
      expect(result.entities.quantity).toBe(2);
      expect(result.entities.category).toBe('produce');
    });

    it('parses Spanish "Quitar leche"', () => {
      const result = NLPEngine.parseCommand('Quitar leche', 'es-ES');
      expect(result.intent).toBe('REMOVE_ITEM');
      expect(result.entities.itemName?.toLowerCase()).toBe('leche');
    });

    it('parses French "Ajouter du pain"', () => {
      const result = NLPEngine.parseCommand('Ajouter du pain', 'fr-FR');
      expect(result.intent).toBe('ADD_ITEM');
      expect(result.entities.category).toBe('bakery');
    });

    it('parses German "Milch hinzufügen"', () => {
      const result = NLPEngine.parseCommand('Milch hinzufügen', 'de-DE');
      expect(result.intent).toBe('ADD_ITEM');
      expect(result.entities.category).toBe('dairy');
    });
  });
});
