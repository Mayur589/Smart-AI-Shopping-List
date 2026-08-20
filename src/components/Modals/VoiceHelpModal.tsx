import React from 'react';
import {
  X,
  HelpCircle,
  Mic,
  Plus,
  Trash2,
  Sliders,
  Search,
  ArrowRightLeft,
  CheckCircle2,
  ChefHat,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { useVoice, SUPPORTED_LANGUAGES } from '../../context/VoiceContext';

export const VoiceHelpModal: React.FC = () => {
  const {
    activeHelpModal,
    closeHelpModal,
    currentLanguage,
    setLanguage,
    processVoiceTranscript,
  } = useVoice();

  if (!activeHelpModal) return null;

  const handleTryCommand = (phrase: string) => {
    closeHelpModal();
    processVoiceTranscript(phrase);
  };

  // Commands categorized by intent with localized examples
  const commandSections = [
    {
      title: 'Adding Items & Specifying Quantities',
      icon: Plus,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      examples: [
        'Add 2 bottles of almond milk',
        'I need 3 organic Honeycrisp apples',
        'Buy 1 loaf of sourdough bread',
        'Put 2 packs of tofu in my cart',
      ],
      description: 'Understands counts, units (bottles, kg, lbs, dozen, bags), and dietary tags.',
    },
    {
      title: 'Voice Search & Price Filtering',
      icon: Search,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
      examples: [
        'Find toothpaste under $5',
        'Search for olive oil under 10 dollars',
        'Find organic coffee',
        'Show me gluten-free snacks',
      ],
      description: 'Filters catalog instantly by maximum price, brands, and dietary preferences.',
    },
    {
      title: 'Dietary Substitutes & Alternatives',
      icon: ArrowRightLeft,
      color: 'text-teal-400',
      bg: 'bg-teal-500/10',
      examples: [
        'What can I substitute for butter?',
        'Alternative to whole milk',
        'Substitute for ground beef',
        'Replace peanut butter',
      ],
      description: 'Offers plant-based, allergy-safe, and gut-friendly product alternatives.',
    },
    {
      title: 'Removing & Modifying Items',
      icon: Trash2,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      examples: [
        'Remove whole milk from my list',
        'Change apples quantity to 6',
        "I don't need bananas anymore",
        'Update eggs to 2 dozen',
      ],
      description: 'Flexibly updates quantities or deletes items without typing.',
    },
    {
      title: 'Checking Off & Clearing',
      icon: CheckCircle2,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      examples: [
        'Check off bread',
        'Mark eggs as bought',
        'Clear completed items',
        'Clear entire shopping list',
      ],
      description: 'Keeps track of bought items and cleans up your shopping list.',
    },
    {
      title: 'Smart Suggestions & Modes',
      icon: ChefHat,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      examples: [
        'What am I running low on?',
        'Show smart suggestions',
        'Switch to kitchen mode',
        'Help',
      ],
      description: 'Hands-free navigation and predictive pantry replenishment insights.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="glass-panel w-full max-w-3xl rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-850/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">
                Voice Assistant Command Guide
              </h3>
              <p className="text-xs text-slate-400">
                Natural speech patterns, multilingual syntax, and hands-free controls
              </p>
            </div>
          </div>

          <button
            onClick={closeHelpModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Language Switch Banner */}
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Mic className="w-4 h-4 text-emerald-400" />
              <span>Assistant currently listening in:</span>
            </div>
            <div className="flex items-center gap-1.5">
              {SUPPORTED_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    currentLanguage === l.code
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-750 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {l.flagCode} {l.name}
                </button>
              ))}
            </div>
          </div>

          {/* Command Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {commandSections.map((sec, idx) => {
              const Icon = sec.icon;

              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-850/80 border border-slate-750 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className={`p-1.5 rounded-lg ${sec.bg} ${sec.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-200">
                        {sec.title}
                      </h4>
                    </div>

                    <p className="text-[11px] text-slate-400 mb-3">{sec.description}</p>

                    <div className="space-y-1.5">
                      {sec.examples.map((example, eIdx) => (
                        <button
                          key={eIdx}
                          onClick={() => handleTryCommand(example)}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700/60 hover:border-emerald-500/40 text-xs text-slate-300 hover:text-emerald-300 transition-all flex items-center justify-between group"
                          title="Click to execute this voice command"
                        >
                          <span className="truncate">"{example}"</span>
                          <span className="text-[10px] font-bold text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            Try
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Click any phrase above to test immediate execution.
          </span>
          <button
            onClick={closeHelpModal}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
