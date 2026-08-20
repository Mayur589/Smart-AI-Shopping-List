# VoiceCart — Voice Command Shopping Assistant

An intelligent, voice-first grocery shopping list manager equipped with real-time speech recognition, multi-lingual Natural Language Processing (NLP), smart predictive reorders, seasonal deals, dietary substitute recommendations, and a dedicated hands-free Kitchen Mode.

---

## Key Features

### 1. Voice Input & Recognition
- **Cross-Browser Web Speech Recognition**: Continuous & push-to-talk microphone modes with animated audio waveform visualizer.
- **Real-Time Visual Feedback**: Live interim speech transcription pills, recognized intent badges, and instant spoken audio responses.
- **Multilingual Support**: Supports English (`en-US`), Spanish (`es-ES`), French (`fr-FR`), German (`de-DE`), and Hindi (`hi-IN`) with locale switching.

### 2. Natural Language Processing (NLP) Engine
- **Zero-Latency Client-Side NLP**: Fast rule-based and entity-extraction pipeline running 100% locally with zero external API costs.
- **Flexible Natural Phrasing**: Understands variations like *"I want to buy 3 apples"*, *"Put 2 bottles of almond milk in my cart"*, *"I don't need bananas anymore"*, *"Change apples quantity to 5"*.
- **Entity Extraction**: Parses quantities (numeric digits and word numbers like "two", "cinq", "drei", "दो"), units (bottles, kg, lbs, dozen, cans, packs, loaves), price ceilings (*"under $5"*), brands, and dietary tags (*"organic"*).

### 3. Smart Suggestions & Recommendations
- **Predictive Reorder Engine**: Analyzes simulated historical purchase cycles to proactively alert when essentials are running low (*"You haven't bought bread in 9 days"*).
- **Seasonal Produce & Deals**: Identifies peak-season fresh produce and calculates promotional discounts.
- **Contextual Substitutes**: Detects ingredients with healthy, plant-based, allergy-safe, or gluten-free alternatives (e.g., Almond/Oat milk for Whole milk, Sourdough/GF for regular bread, Plant butter for dairy butter).

### 4. Shopping List Management
- **Automatic Categorization**: Automatically classifies items into 9 categories (*Produce, Dairy & Plant Milk, Bakery & Grains, Meat & Protein, Pantry & Spices, Beverages, Snacks, Household, Personal Care*).
- **Quantity & Price Management**: Unit pricing calculations, total estimated cart budget, quantity steppers, and item check-offs with celebratory confetti.
- **Offline Persistence**: LocalStorage state management preserving lists and user settings across sessions.

### 5. Voice-Activated Search & Price Filtering
- **Catalog Search**: Search over 100+ grocery products with brand filters, price sliders, and dietary badges (Organic, Gluten-Free, Vegan).
- **Voice Queries**: E.g. *"Find toothpaste under $5"*, *"Search organic coffee under $10"*.

### 6. UI/UX & Hands-Free Kitchen Mode
- **Dual Display Modes**:
  - **Standard Dashboard**: Responsive categorized card layout with quick filter pills, search bar, and recommendation sidebars.
  - **Hands-Free Kitchen Mode**: Fullscreen high-contrast display with large typography, prominent visualizer, and large touch/voice toggles designed for cooking or mobile use.
- **Synthesized Sound Effects**: Custom Web Audio API chimes for listening start, stop, success, delete, and errors.
- **No Emojis Policy**: Crisp, modern SVG icons powered by Lucide React throughout the application.

---

## Technology Stack

- **Framework**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Glassmorphism design tokens
- **Icons**: Lucide React (Clean SVGs, no emojis)
- **Voice Recognition**: Web Speech API (`webkitSpeechRecognition` / `SpeechRecognition`)
- **Voice Synthesis (TTS)**: Web Speech Synthesis API (`SpeechSynthesisUtterance`)
- **Acoustic Feedback**: Web Audio API Synthesizer
- **Testing**: Vitest automated unit testing suite
- **Animations**: Canvas Confetti, Tailwind CSS keyframes

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Modern web browser with microphone permissions (Google Chrome, Microsoft Edge, Safari, or Brave)

### Installation

1. Clone or navigate to the repository:
   ```bash
   cd unthinkable_assignment
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. Run the automated test suite:
   ```bash
   npm test
   ```

5. Build for production:
   ```bash
   npm run build
   ```

---

## Example Voice Commands

| Action | Example Spoken Phrases |
| :--- | :--- |
| **Add Item** | *"Add 2 bottles of almond milk"*, *"I need 3 organic Honeycrisp apples"*, *"Buy 1 loaf sourdough bread"* |
| **Remove Item** | *"Remove whole milk from my list"*, *"Delete apples"*, *"I don't need bananas anymore"* |
| **Modify Quantity**| *"Change bananas quantity to 6"*, *"Update eggs to 2 dozen"* |
| **Voice Search** | *"Find toothpaste under $5"*, *"Search olive oil under 10 dollars"* |
| **Substitutes** | *"What can I substitute for butter?"*, *"Alternative to whole milk"*, *"Replace peanut butter"* |
| **Check Off** | *"Check off bread"*, *"Mark eggs as bought"*, *"Uncheck apples"* |
| **Clear List** | *"Clear completed items"*, *"Clear entire shopping list"* |
| **Kitchen Mode** | *"Switch to kitchen mode"*, *"Exit kitchen mode"* |
| **Multilingual** | Spanish: *"Agregar 2 manzanas"*, French: *"Ajouter du pain"*, German: *"Milch hinzufügen"*, Hindi: *"दूध जोड़ें"* |

---

## Project Structure

```
unthinkable_assignment/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── APPROACH_WRITEUP.md          # 176-word technical approach summary
├── README.md                    # Project documentation
├── src/
│   ├── main.tsx
│   ├── App.tsx                  # Main application orchestrator
│   ├── index.css                # Tailwind directives & glassmorphism utilities
│   ├── types/
│   │   ├── shopping.ts          # Shopping item, category, catalog, suggestion types
│   │   └── voice.ts             # Voice recognition, NLP intents, language types
│   ├── data/
│   │   ├── categories.ts        # Category definitions & multilingual keywords
│   │   ├── productCatalog.ts    # 100+ grocery catalog items with prices & tags
│   │   ├── initialHistory.ts    # Simulated purchase cycles for smart predictions
│   │   ├── seasonalDeals.ts     # Seasonal produce & promotional discounts
│   │   └── substitutesData.ts   # Healthy/dietary substitute rules & mappings
│   ├── services/
│   │   ├── soundEffects.ts      # Web Audio API sound synthesizer
│   │   ├── speechRecognition.ts # Web Speech API wrapper with audio volume analyzer
│   │   ├── speechSynthesis.ts   # Natural voice TTS engine with locale selection
│   │   ├── nlpEngine.ts         # Multilingual NLP intent & entity parser
│   │   ├── nlpEngine.test.ts    # Automated NLP unit tests
│   │   ├── suggestionEngine.ts  # Predictive reorder & seasonal algorithms
│   │   └── suggestionEngine.test.ts # Suggestion engine unit tests
│   ├── context/
│   │   ├── ShoppingContext.tsx  # Global shopping list state & persistence
│   │   └── VoiceContext.tsx     # Voice assistant state & command dispatcher
│   └── components/
│       ├── Header.tsx           # Navbar, language switcher, mode switcher, audio toggle
│       ├── common/
│       │   ├── CategoryIcon.tsx # Clean Lucide icon category resolver (no emojis)
│       │   └── NotificationToasts.tsx # Floating animated toast alerts
│       ├── Voice/
│       │   └── VoiceControlBar.tsx # Animated mic, live transcript, NLP chips
│       ├── ShoppingList/
│       │   ├── ShoppingList.tsx # Categorized grouped list & category filter pills
│       │   ├── CategorySection.tsx # Accordion category card with subtotal
│       │   ├── ShoppingItemCard.tsx # Item row with qty stepper & swap triggers
│       │   └── ListSummaryCard.tsx # Progress bar, total budget, quick actions
│       ├── Suggestions/
│       │   ├── SmartSuggestionsPanel.tsx # Predictive "running low" cards
│       │   ├── SeasonalDealsSection.tsx # Seasonal produce discounts
│       │   └── SubstituteModal.tsx # Dietary substitute modal with 1-click swap
│       ├── Search/
│       │   └── VoiceSearchModal.tsx # Voice product search & price ceiling filter
│       ├── KitchenMode/
│       │   └── KitchenModeOverlay.tsx # Fullscreen hands-free voice kitchen mode
│       └── Modals/
│           ├── ManualAddModal.tsx # Quick manual item entry modal
│           ├── VoiceHelpModal.tsx # Interactive voice command cheat-sheet
│           └── SettingsModal.tsx # Audio toggles, speech rate/pitch sliders
```

---

## Deliverables Summary

1. **Working Application**: Interactive React + TypeScript Vite application running on `http://localhost:5173/`.
2. **GitHub Repository**: Structured, typed code with complete Git history and modular architecture.
3. **Approach Write-Up**: Concise 176-word write-up in [APPROACH_WRITEUP.md](APPROACH_WRITEUP.md).
