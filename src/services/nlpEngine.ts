import { ItemCategory } from '../types/shopping';
import { ParsedVoiceCommand, SupportedLanguage, VoiceIntentType } from '../types/voice';
import { CATEGORY_KEYWORD_MAP } from '../data/categories';
import { PRODUCT_CATALOG } from '../data/productCatalog';

// Multi-lingual number word dictionaries
const NUMBER_WORDS: Record<string, number> = {
  // English
  'a': 1, 'an': 1, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
  'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
  'dozen': 12, 'half': 0.5, 'couple': 2, 'few': 3,
  // Spanish
  'un': 1, 'una': 1, 'uno': 1, 'dos': 2, 'tres': 3, 'cuatro': 4, 'cinco': 5,
  'seis': 6, 'siete': 7, 'ocho': 8, 'nueve': 9, 'diez': 10, 'docena': 12,
  // French
  'deux': 2, 'trois': 3, 'quatre': 4, 'cinq': 5, 'six_fr': 6,
  'sept': 7, 'huit': 8, 'neuf': 9, 'dix': 10, 'douzaine': 12,
  // German
  'ein': 1, 'eine': 1, 'eins': 1, 'zwei': 2, 'drei': 3, 'vier': 4, 'fünf': 5,
  'sechs': 6, 'sieben': 7, 'acht': 8, 'neun': 9, 'zehn': 10, 'dutzend': 12,
  // Hindi
  'ek': 1, 'do': 2, 'teen': 3, 'char': 4, 'paanch': 5, 'che': 6,
  'saat': 7, 'aath': 8, 'nau': 9, 'das': 10,
  'एक': 1, 'दो': 2, 'तीन': 3, 'चार': 4, 'पाँच': 5, 'पांच': 5, 'छह': 6, 'सात': 7, 'आठ': 8, 'नौ': 9, 'दस': 10
};

// Unit patterns
const UNIT_PATTERNS = [
  'bottles?', 'bottle', 'botellas?', 'bouteilles?', 'flaschen?', 'बोतल',
  'cans?', 'can', 'latas?', 'boîtes?', 'dosen?', 'कैन',
  'boxes?', 'box', 'cajas?', 'boîtes?', 'kartons?', 'डिब्बा',
  'bags?', 'bag', 'bolsas?', 'sacs?', 'tüten?', 'पैकेट',
  'packs?', 'pack', 'paquetes?', 'paquets?', 'packungen?',
  'lbs?', 'pounds?', 'libras?', 'livres?', 'pfund', 'पाउंड',
  'kg', 'kilos?', 'kilograms?', 'quilômetros?', 'किलो',
  'g', 'grams?', 'gramos?', 'grammes?', 'gramm', 'ग्राम',
  'liters?', 'litres?', 'litros?', 'liter', 'लीटर',
  'gallons?', 'galones?',
  'bunches?', 'bunch', 'manojos?', 'bottes?', 'bündel', 'गुच्छा',
  'loaves?', 'loaf', 'rebanadas?', 'tranches?', 'laibe?',
  'pieces?', 'piece', 'piezas?', 'pièces?', 'stücke?', 'टुकड़ा',
  'pints?', 'tubs?', 'bars?', 'cartons?', 'heads?'
];

// Helper: Levenshtein distance for fuzzy matching
function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

export class NLPEngine {
  /**
   * Categorizes any item name automatically based on keywords and catalog
   */
  public static categorizeItem(itemName: string): ItemCategory {
    const clean = itemName.toLowerCase().trim();

    // 1. Direct catalog lookup
    const catalogMatch = PRODUCT_CATALOG.find(
      (p) =>
        p.name.toLowerCase() === clean ||
        p.aliases.some((alias) => alias.toLowerCase() === clean || clean.includes(alias.toLowerCase()))
    );
    if (catalogMatch) {
      return catalogMatch.category;
    }

    // 2. Keyword mapping match
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORD_MAP)) {
      if (keywords.some((kw) => clean.includes(kw) || kw.includes(clean))) {
        return category as ItemCategory;
      }
    }

    // 3. Fallback heuristic
    if (clean.includes('juice') || clean.includes('water') || clean.includes('tea') || clean.includes('drink') || clean.includes('soda')) {
      return 'beverages';
    }
    if (clean.includes('cookie') || clean.includes('chip') || clean.includes('nut') || clean.includes('snack') || clean.includes('candy')) {
      return 'snacks';
    }
    if (clean.includes('soap') || clean.includes('cream') || clean.includes('shampoo') || clean.includes('brush')) {
      return 'personal_care';
    }
    if (clean.includes('clean') || clean.includes('paper') || clean.includes('towel') || clean.includes('trash') || clean.includes('bag')) {
      return 'household';
    }

    return 'pantry'; // Default general category
  }

  /**
   * Estimates item unit price based on catalog or default heuristics
   */
  public static estimatePrice(itemName: string, category: ItemCategory): number {
    const clean = itemName.toLowerCase().trim();
    const catalogMatch = PRODUCT_CATALOG.find(
      (p) =>
        p.name.toLowerCase().includes(clean) ||
        p.aliases.some((a) => clean.includes(a.toLowerCase()))
    );
    if (catalogMatch) {
      return catalogMatch.typicalPrice;
    }

    // Fallback baseline category estimates
    const baselinePrices: Record<ItemCategory, number> = {
      produce: 2.99,
      dairy: 3.99,
      bakery: 3.49,
      meat: 7.99,
      pantry: 4.29,
      beverages: 3.49,
      snacks: 3.29,
      household: 6.99,
      personal_care: 4.99,
    };
    return baselinePrices[category] || 3.50;
  }

  /**
   * Main parsing method: Converts spoken transcript to structured command
   */
  public static parseCommand(
    transcript: string,
    currentLang: SupportedLanguage = 'en-US'
  ): ParsedVoiceCommand {
    const text = transcript.trim();
    const lower = text.toLowerCase();

    // 1. HELP COMMANDS
    if (
      lower.includes('help') ||
      lower.includes('what can i say') ||
      lower.includes('commands') ||
      lower.includes('ayuda') ||
      lower.includes('aide') ||
      lower.includes('hilfe') ||
      lower.includes('मदद') ||
      lower.includes('सहायता')
    ) {
      return {
        rawTranscript: text,
        intent: 'HELP',
        confidence: 0.98,
        entities: {},
        feedbackMessage: 'Opening voice command guide.',
        executionStatus: 'success',
      };
    }

    // 2. SWITCH MODE (Kitchen / Hands-Free)
    if (
      lower.includes('kitchen mode') ||
      lower.includes('hands free mode') ||
      lower.includes('voice mode') ||
      lower.includes('modo cocina') ||
      lower.includes('mode cuisine') ||
      lower.includes('küchenmodus')
    ) {
      return {
        rawTranscript: text,
        intent: 'SWITCH_MODE',
        confidence: 0.95,
        entities: { mode: 'kitchen' },
        feedbackMessage: 'Switched to hands-free Kitchen Mode.',
        executionStatus: 'success',
      };
    }
    if (
      lower.includes('standard mode') ||
      lower.includes('exit kitchen mode') ||
      lower.includes('dashboard mode') ||
      lower.includes('salir de cocina')
    ) {
      return {
        rawTranscript: text,
        intent: 'SWITCH_MODE',
        confidence: 0.95,
        entities: { mode: 'standard' },
        feedbackMessage: 'Returned to Standard Dashboard.',
        executionStatus: 'success',
      };
    }

    // 3. RECOMMENDATIONS / RUNNING LOW
    if (
      lower.includes('what am i low on') ||
      lower.includes('recommend') ||
      lower.includes('suggestions') ||
      lower.includes('smart suggestions') ||
      lower.includes('running low') ||
      lower.includes('what should i buy') ||
      lower.includes('sugerencias') ||
      lower.includes('recommandations') ||
      lower.includes('vorschläge') ||
      lower.includes('सुझाव')
    ) {
      return {
        rawTranscript: text,
        intent: 'ASK_RECOMMENDATIONS',
        confidence: 0.95,
        entities: {},
        feedbackMessage: 'Showing smart predictive recommendations based on your shopping habits.',
        executionStatus: 'success',
      };
    }

    // 4. CLEAR COMMANDS
    if (
      lower.includes('clear completed') ||
      lower.includes('remove completed') ||
      lower.includes('delete checked') ||
      lower.includes('clear checked') ||
      lower.includes('limpiar completados') ||
      lower.includes('effacer les éléments cochés') ||
      lower.includes('पूरे किए गए हटाएं')
    ) {
      return {
        rawTranscript: text,
        intent: 'CLEAR_COMPLETED',
        confidence: 0.95,
        entities: {},
        feedbackMessage: 'Cleared all completed items from your shopping list.',
        executionStatus: 'success',
      };
    }
    if (
      lower.includes('clear all items') ||
      lower.includes('clear shopping list') ||
      lower.includes('empty my cart') ||
      lower.includes('delete entire list') ||
      lower.includes('vaciar lista')
    ) {
      return {
        rawTranscript: text,
        intent: 'CLEAR_ALL',
        confidence: 0.95,
        entities: {},
        feedbackMessage: 'Cleared your entire shopping list.',
        executionStatus: 'success',
      };
    }

    // 5. SUBSTITUTE QUERIES
    // e.g. "What can I substitute for butter?", "Substitute for whole milk", "Alternatives to peanut butter"
    const substituteRegex = /(?:substitute for|alternative to|alternatives for|replace|substitutos para|remplacer|ersatz für|के बदले|के स्थान पर)\s+([^?.!,]+)/i;
    const subMatch = lower.match(substituteRegex);
    if (subMatch && subMatch[1]) {
      const target = subMatch[1].trim();
      return {
        rawTranscript: text,
        intent: 'ASK_SUBSTITUTES',
        confidence: 0.92,
        entities: { targetSubstitute: target },
        feedbackMessage: `Looking up healthy & dietary substitutes for ${target}.`,
        executionStatus: 'success',
      };
    }

    // 6. PRICE / PRODUCT SEARCH & FILTER
    // e.g. "Find toothpaste under $5", "Search for organic apples under 10 dollars", "Buscar café por menos de 5 dólares"
    const searchRegex = /(?:find|search for|look for|show me|buscar|chercher|suche|ढूंढें|दिखाएं)\s+(.+)/i;
    const priceUnderRegex = /(?:under|less than|below|por menos de|à moins de|unter|से कम)\s+\$?(\d+(?:\.\d{1,2})?)/i;

    const isExplicitSearch = lower.startsWith('find ') || lower.startsWith('search ') || lower.startsWith('buscar ') || lower.startsWith('suche ');
    const hasPriceConstraint = priceUnderRegex.test(lower);

    if (isExplicitSearch || (hasPriceConstraint && !lower.startsWith('add ') && !lower.startsWith('buy '))) {
      let searchQuery = lower;
      let maxPrice: number | undefined;

      const priceMatch = lower.match(priceUnderRegex);
      if (priceMatch && priceMatch[1]) {
        maxPrice = parseFloat(priceMatch[1]);
      }

      // Clean search query
      searchQuery = searchQuery
        .replace(/^(?:find|search for|look for|show me|buscar|chercher|suche|ढूंढें|दिखाएं)\s+/i, '')
        .replace(/(?:under|less than|below|por menos de|à moins de|unter|से कम)\s+\$?(\d+(?:\.\d{1,2})?).*/i, '')
        .trim();

      return {
        rawTranscript: text,
        intent: 'SEARCH_PRODUCTS',
        confidence: 0.92,
        entities: {
          itemName: searchQuery,
          maxPrice,
        },
        feedbackMessage: maxPrice
          ? `Searching for "${searchQuery}" under $${maxPrice.toFixed(2)}.`
          : `Searching products for "${searchQuery}".`,
        executionStatus: 'success',
      };
    }

    // 7. CHECK / UNCHECK ITEMS
    // e.g. "Check off bread", "Mark milk as bought", "Mark eggs as completed", "Uncheck apples"
    const checkRegex = /(?:check off|mark|cross off|bought|completed|marcar como comprado|cocher|हटाएं|चेक करें)\s+(.+)/i;
    const uncheckRegex = /(?:uncheck|mark unbought|desmarcar|décocher)\s+(.+)/i;

    if (uncheckRegex.test(lower)) {
      const match = lower.match(uncheckRegex);
      const item = match ? match[1].replace(/as\s+(?:bought|completed|done)/i, '').trim() : '';
      return {
        rawTranscript: text,
        intent: 'UNCHECK_ITEM',
        confidence: 0.9,
        entities: { itemName: item },
        feedbackMessage: `Marked "${item}" as active on your shopping list.`,
        executionStatus: 'success',
      };
    }

    if (checkRegex.test(lower) && !lower.startsWith('add ') && !lower.startsWith('remove ')) {
      const match = lower.match(checkRegex);
      let item = match ? match[1].replace(/(?:as\s+bought|as\s+completed|as\s+done|off|from list)/i, '').trim() : '';
      return {
        rawTranscript: text,
        intent: 'CHECK_ITEM',
        confidence: 0.9,
        entities: { itemName: item },
        feedbackMessage: `Checked off "${item}" as purchased!`,
        executionStatus: 'success',
      };
    }

    // 8. REMOVE / DELETE ITEM
    // e.g. "Remove milk from my list", "Delete apples", "I don't need bananas anymore", "Quitar leche", "Supprimer les pommes", "Entferne Milch"
    const removePrefixRegex = /^(?:remove|delete|eliminate|drop|quitar|eliminar|supprimer|entferne|हटाएं|हटाओ)\s+(?:from\s+(?:my\s+)?list\s+)?(.+)/i;
    const removeSuffixRegex = /(.+)\s+(?:from\s+(?:my\s+)?list|de\s+mi\s+lista|de\s+la\s+liste)$/i;
    const noLongerNeedRegex = /(?:i don't need|i do not need|no necesito|je n'ai plus besoin de|brauche kein)\s+(.+)/i;

    if (removePrefixRegex.test(lower) || noLongerNeedRegex.test(lower) || lower.includes('remove ') || lower.includes('quitar ')) {
      let rawItem = '';
      if (removePrefixRegex.test(lower)) {
        const m = lower.match(removePrefixRegex);
        rawItem = m ? m[1] : '';
      } else if (noLongerNeedRegex.test(lower)) {
        const m = lower.match(noLongerNeedRegex);
        rawItem = m ? m[1] : '';
      } else {
        rawItem = lower.replace(/^(?:remove|quitar|supprimer|entferne)\s+/i, '');
      }

      // Clean item name
      const cleanedItem = rawItem
        .replace(/(?:from\s+(?:my\s+)?list|from\s+the\s+cart|anymore|please|de\s+mi\s+lista)/gi, '')
        .trim();

      return {
        rawTranscript: text,
        intent: 'REMOVE_ITEM',
        confidence: 0.94,
        entities: { itemName: cleanedItem },
        feedbackMessage: `Removed "${cleanedItem}" from your shopping list.`,
        executionStatus: 'success',
      };
    }

    // 9. MODIFY QUANTITY
    // e.g. "Change bananas quantity to 6", "Set milk to 2 gallons", "Update apples to 5"
    const modifyQtyRegex = /(?:change|set|update|modify|cambiar|modifier|ändern)\s+(.+?)\s+(?:quantity\s+)?to\s+(\d+|[a-z]+)\s*(.*)/i;
    const modMatch = lower.match(modifyQtyRegex);
    if (modMatch) {
      const item = modMatch[1].trim();
      const qtyStr = modMatch[2].trim();
      const unit = modMatch[3].trim() || 'units';
      const qty = NUMBER_WORDS[qtyStr] || parseInt(qtyStr, 10) || 1;

      return {
        rawTranscript: text,
        intent: 'MODIFY_QUANTITY',
        confidence: 0.93,
        entities: {
          itemName: item,
          quantity: qty,
          unit,
        },
        feedbackMessage: `Updated "${item}" quantity to ${qty} ${unit}.`,
        executionStatus: 'success',
      };
    }

    // 10. ADD ITEM (Varied phrases & Natural language)
    // e.g. "Add 2 bottles of water", "I need 5 apples", "I want to buy sourdough bread", "Put some organic milk in my list", "Buy 1 kg chicken"
    // Spanish: "Agregar 2 botellas de agua", "Comprar 5 manzanas", "Necesito pan"
    // French: "Ajouter 2 bouteilles d'eau", "Acheter des pommes"
    // German: "Füge 2 Flaschen Wasser hinzu", "Ich brauche Äpfel"
    // Hindi: "2 बोतल पानी जोड़ें", "मुझे 5 सेब चाहिए", "दूध खरीदो"

    let itemPhrase = lower;

    // Remove trigger verbs/intents
    itemPhrase = itemPhrase
      .replace(/^(?:please\s+)?(?:add|put|i need|i want to buy|i want|buy|get|we need|let's buy|agregar|añadir|comprar|necesito|quiero comprar|ajouter|acheter|j'ai besoin de|füge|hinzufügen|ich brauche|kauf|जोड़ें|खरीदें|चाहिए)\s+/i, '')
      .replace(/(?:to\s+(?:my\s+)?(?:shopping\s+)?list|to\s+cart|in\s+my\s+cart|a\s+mi\s+lista|à\s+ma\s+liste|hinzufügen|में\s+जोड़ें)$/i, '')
      .trim();

    // Extract Quantity & Unit
    let quantity = 1;
    let unit = 'item';
    let isOrganic = lower.includes('organic') || lower.includes('orgánico') || lower.includes('bio');

    // Check for number digits: e.g. "2 bottles of milk", "5 apples"
    const digitQtyMatch = itemPhrase.match(/^(\d+(?:\.\d+)?)\s*(.*)/);
    if (digitQtyMatch) {
      quantity = parseFloat(digitQtyMatch[1]);
      itemPhrase = digitQtyMatch[2].trim();
    } else {
      // Check for word numbers: e.g. "two bottles of milk", "a loaf of bread"
      const words = itemPhrase.split(' ');
      if (words.length > 0 && NUMBER_WORDS[words[0]]) {
        quantity = NUMBER_WORDS[words[0]];
        words.shift();
        itemPhrase = words.join(' ').trim();
      }
    }

    // Check for Unit
    const unitRegex = new RegExp(`^(${UNIT_PATTERNS.join('|')})\\s+(?:of\\s+|de\\s+|d')?(.+)`, 'i');
    const unitMatch = itemPhrase.match(unitRegex);
    if (unitMatch) {
      unit = unitMatch[1].trim();
      itemPhrase = unitMatch[2].trim();
    } else {
      // Auto-assign smart default unit based on item
      if (itemPhrase.includes('milk') || itemPhrase.includes('water') || itemPhrase.includes('juice') || itemPhrase.includes('oil')) {
        unit = quantity > 1 ? 'bottles' : 'bottle';
      } else if (itemPhrase.includes('bread')) {
        unit = quantity > 1 ? 'loaves' : 'loaf';
      } else if (itemPhrase.includes('egg')) {
        unit = quantity > 1 ? 'dozen' : 'carton';
      } else if (itemPhrase.includes('apple') || itemPhrase.includes('banana') || itemPhrase.includes('orange')) {
        unit = quantity > 1 ? 'pieces' : 'piece';
      }
    }

    // Clean final item name
    const finalItemName = itemPhrase
      .replace(/^(?:some|a|an|the|of|de|des|du|ein|eine|थोड़ा|कुछ)\s+/i, '')
      .replace(/^(?:organic|orgánico|bio)\s+/i, '') // keep clean base name or flag
      .trim();

    if (!finalItemName) {
      return {
        rawTranscript: text,
        intent: 'UNKNOWN',
        confidence: 0.3,
        entities: {},
        feedbackMessage: 'Could not recognize the item to add. Try saying "Add 2 bottles of milk".',
        executionStatus: 'clarification_needed',
      };
    }

    // Capitalize item nicely
    const formattedName = (isOrganic ? 'Organic ' : '') +
      finalItemName.charAt(0).toUpperCase() + finalItemName.slice(1);

    const category = NLPEngine.categorizeItem(finalItemName);
    const estimatedPrice = NLPEngine.estimatePrice(finalItemName, category);

    return {
      rawTranscript: text,
      intent: 'ADD_ITEM',
      confidence: 0.95,
      entities: {
        itemName: formattedName,
        quantity,
        unit,
        category,
        isOrganic,
      },
      feedbackMessage: `Added ${quantity} ${unit} of ${formattedName} to ${category.toUpperCase()}!`,
      executionStatus: 'success',
    };
  }
}
