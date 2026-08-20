import { CategoryInfo, ItemCategory } from '../types/shopping';

export const CATEGORIES: Record<ItemCategory, CategoryInfo> = {
  produce: {
    id: 'produce',
    name: 'Fresh Produce',
    description: 'Fresh fruits, vegetables, and leafy greens',
    iconName: 'Apple',
    colorClass: 'text-emerald-600 dark:text-emerald-400',
    bgClass: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderClass: 'border-emerald-200 dark:border-emerald-800/50',
  },
  dairy: {
    id: 'dairy',
    name: 'Dairy & Plant Milk',
    description: 'Milk, cheese, yogurt, butter, and plant-based alternatives',
    iconName: 'Milk',
    colorClass: 'text-sky-600 dark:text-sky-400',
    bgClass: 'bg-sky-50 dark:bg-sky-950/40',
    borderClass: 'border-sky-200 dark:border-sky-800/50',
  },
  bakery: {
    id: 'bakery',
    name: 'Bakery & Grains',
    description: 'Breads, bagels, pastries, pasta, rice, and oats',
    iconName: 'Wheat',
    colorClass: 'text-amber-600 dark:text-amber-400',
    bgClass: 'bg-amber-50 dark:bg-amber-950/40',
    borderClass: 'border-amber-200 dark:border-amber-800/50',
  },
  meat: {
    id: 'meat',
    name: 'Meat & Seafood',
    description: 'Poultry, beef, fish, shrimp, tofu, and protein',
    iconName: 'Beef',
    colorClass: 'text-rose-600 dark:text-rose-400',
    bgClass: 'bg-rose-50 dark:bg-rose-950/40',
    borderClass: 'border-rose-200 dark:border-rose-800/50',
  },
  pantry: {
    id: 'pantry',
    name: 'Pantry & Spices',
    description: 'Oils, sauces, spices, canned goods, and cooking essentials',
    iconName: 'Soup',
    colorClass: 'text-orange-600 dark:text-orange-400',
    bgClass: 'bg-orange-50 dark:bg-orange-950/40',
    borderClass: 'border-orange-200 dark:border-orange-800/50',
  },
  beverages: {
    id: 'beverages',
    name: 'Beverages',
    description: 'Coffee, tea, water, natural juices, and sparkling drinks',
    iconName: 'Coffee',
    colorClass: 'text-teal-600 dark:text-teal-400',
    bgClass: 'bg-teal-50 dark:bg-teal-950/40',
    borderClass: 'border-teal-200 dark:border-teal-800/50',
  },
  snacks: {
    id: 'snacks',
    name: 'Snacks & Nuts',
    description: 'Nuts, dried fruits, chips, cookies, and dark chocolate',
    iconName: 'Cookie',
    colorClass: 'text-yellow-600 dark:text-yellow-400',
    bgClass: 'bg-yellow-50 dark:bg-yellow-950/40',
    borderClass: 'border-yellow-200 dark:border-yellow-800/50',
  },
  household: {
    id: 'household',
    name: 'Household & Cleaning',
    description: 'Detergents, paper towels, trash bags, and cleaning supplies',
    iconName: 'Sparkles',
    colorClass: 'text-indigo-600 dark:text-indigo-400',
    bgClass: 'bg-indigo-50 dark:bg-indigo-950/40',
    borderClass: 'border-indigo-200 dark:border-indigo-800/50',
  },
  personal_care: {
    id: 'personal_care',
    name: 'Personal Care',
    description: 'Toothpaste, shampoo, body wash, soap, and hygiene',
    iconName: 'Smile',
    colorClass: 'text-purple-600 dark:text-purple-400',
    bgClass: 'bg-purple-50 dark:bg-purple-950/40',
    borderClass: 'border-purple-200 dark:border-purple-800/50',
  },
};

export const CATEGORY_LIST = Object.values(CATEGORIES);

export const CATEGORY_KEYWORD_MAP: Record<ItemCategory, string[]> = {
  produce: [
    'apple', 'apples', 'banana', 'bananas', 'orange', 'oranges', 'lemon', 'lemons', 'lime', 'limes',
    'strawberry', 'strawberries', 'blueberry', 'blueberries', 'avocado', 'avocados', 'spinach', 'kale',
    'lettuce', 'tomato', 'tomatoes', 'potato', 'potatoes', 'onion', 'onions', 'garlic', 'carrot', 'carrots',
    'cucumber', 'cucumbers', 'broccoli', 'pepper', 'peppers', 'bell pepper', 'ginger', 'cilantro',
    'parsley', 'celery', 'zucchini', 'mushroom', 'mushrooms', 'watermelon', 'grape', 'grapes', 'mango', 'peach',
    'manzana', 'manzanas', 'plátano', 'plátanos', 'naranja', 'naranjas', 'fresas', 'aguacate', 'tomate', 'zanahorias',
    'pomme', 'pommes', 'banane', 'bananes', 'fraise', 'fraises', 'avocat',
    'apfel', 'äpfel', 'banane', 'bananen', 'erdbeere', 'erdbeeren', 'avocado',
    'सेब', 'केला', 'संतरा', 'टमाटर', 'आलू', 'प्याज'
  ],
  dairy: [
    'milk', 'whole milk', 'almond milk', 'oat milk', 'soy milk', 'skim milk', 'greek yogurt', 'yogurt',
    'cheese', 'cheddar', 'mozzarella', 'parmesan', 'butter', 'ghee', 'cream', 'sour cream',
    'heavy cream', 'cottage cheese', 'paneer', 'cream cheese', 'tofu',
    'leche', 'queso', 'mantequilla', 'yogur',
    'lait', 'fromage', 'beurre', 'yaourt',
    'milch', 'käse', 'butter', 'joghurt',
    'दूध', 'दही', 'पनीर', 'मक्खन'
  ],
  bakery: [
    'bread', 'whole wheat bread', 'sourdough', 'white bread', 'bagel', 'bagels', 'croissant', 'croissants',
    'pita', 'tortilla', 'tortillas', 'pasta', 'spaghetti', 'penne', 'rice', 'brown rice', 'basmati rice',
    'jasmine rice', 'quinoa', 'oats', 'rolled oats', 'flour', 'naan', 'buns', 'muffin', 'muffins',
    'pan', 'arroz', 'avena', 'harina',
    'pain', 'baguette', 'riz', 'avoine', 'farine', 'pâtes',
    'brot', 'brötchen', 'reis', 'haferflocken', 'mehl', 'nudeln',
    'रोटी', 'चावल', 'आटा', 'ब्रेड'
  ],
  meat: [
    'chicken', 'chicken breast', 'chicken thighs', 'ground beef', 'beef', 'steak', 'pork', 'bacon',
    'salmon', 'tuna', 'cod', 'shrimp', 'turkey', 'sausage', 'lamb', 'tilapia', 'eggs', 'egg',
    'pollo', 'carne', 'pescado', 'salmón', 'huevos', 'huevo',
    'poulet', 'viande', 'poisson', 'saumon', 'oeufs', 'oeuf',
    'hähnchen', 'fleisch', 'fisch', 'lachs', 'eier', 'ei',
    'मुर्गा', 'अंडा', 'अंडे', 'मछली'
  ],
  pantry: [
    'olive oil', 'extra virgin olive oil', 'avocado oil', 'canola oil', 'coconut oil', 'salt', 'black pepper',
    'sugar', 'honey', 'maple syrup', 'soy sauce', 'vinegar', 'balsamic vinegar', 'apple cider vinegar',
    'pasta sauce', 'marinara', 'peanut butter', 'almond butter', 'canned beans', 'chickpeas', 'black beans',
    'lentils', 'tomato paste', 'mustard', 'ketchup', 'mayonnaise', 'spices', 'cumin', 'paprika', 'oregano',
    'aceite', 'aceite de oliva', 'sal', 'azúcar', 'miel', 'frijoles',
    'huile', 'huile d\'olive', 'sel', 'sucre', 'miel', 'haricots',
    'öl', 'olivenöl', 'salz', 'zucker', 'honig', 'bohnen',
    'तेल', 'नमक', 'चीनी', 'शहद'
  ],
  beverages: [
    'coffee', 'ground coffee', 'coffee beans', 'tea', 'green tea', 'black tea', 'water', 'sparkling water',
    'orange juice', 'apple juice', 'lemonade', 'kombucha', 'coconut water', 'soda', 'cold brew',
    'agua', 'café', 'té', 'jugo',
    'eau', 'café', 'thé', 'jus',
    'wasser', 'kaffee', 'tee', 'saft',
    'पानी', 'कॉफ़ी', 'चाय', 'जूस'
  ],
  snacks: [
    'chips', 'potato chips', 'tortilla chips', 'popcorn', 'pretzels', 'nuts', 'almonds', 'walnuts',
    'cashews', 'trail mix', 'dark chocolate', 'chocolate', 'cookies', 'crackers', 'granola bars', 'protein bars',
    'almendras', 'chocolate', 'galletas',
    'chocolat', 'biscuits', 'noix',
    'schokolade', 'kekse', 'nüsse',
    'चॉकलेट', 'बिस्कुट', 'काजू', 'बादाम'
  ],
  household: [
    'detergent', 'laundry detergent', 'dish soap', 'dishwasher pods', 'paper towels', 'toilet paper',
    'trash bags', 'sponges', 'disinfectant wipes', 'aluminum foil', 'parchment paper', 'ziploc bags',
    'detergente', 'jabón', 'toallas de papel',
    'lessive', 'savon', 'papier essuie-tout',
    'waschmittel', 'seife', 'küchenpapier',
    'साबुन', 'सर्फ'
  ],
  personal_care: [
    'toothpaste', 'toothbrush', 'shampoo', 'conditioner', 'body wash', 'soap', 'bar soap',
    'deodorant', 'lotion', 'sunscreen', 'hand sanitizer', 'dental floss', 'face wash',
    'dentífrico', 'pasta dental', 'champú', 'desodorante',
    'dentifrice', 'shampooing', 'déodorant',
    'zahnpasta', 'shampoo', 'deo',
    'टूथपेस्ट', 'शैम्पू'
  ]
};
