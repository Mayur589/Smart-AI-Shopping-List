import React, { useState } from 'react';
import { ShoppingProvider } from './context/ShoppingContext';
import { VoiceProvider } from './context/VoiceContext';
import { Header } from './components/Header';
import { VoiceControlBar } from './components/Voice/VoiceControlBar';
import { ShoppingList } from './components/ShoppingList/ShoppingList';
import { SmartSuggestionsPanel } from './components/Suggestions/SmartSuggestionsPanel';
import { SeasonalDealsSection } from './components/Suggestions/SeasonalDealsSection';
import { SubstituteModal } from './components/Suggestions/SubstituteModal';
import { VoiceSearchModal } from './components/Search/VoiceSearchModal';
import { KitchenModeOverlay } from './components/KitchenMode/KitchenModeOverlay';
import { ManualAddModal } from './components/Modals/ManualAddModal';
import { VoiceHelpModal } from './components/Modals/VoiceHelpModal';
import { SettingsModal } from './components/Modals/SettingsModal';
import { NotificationToasts } from './components/common/NotificationToasts';
import {
  Mic,
  Sparkles,
  ShoppingBag,
  Heart,
  Cpu,
  Layers,
} from 'lucide-react';

const MainDashboard: React.FC = () => {
  const [manualAddOpen, setManualAddOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Navbar */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Voice Control & Microphone Hero */}
        <VoiceControlBar />

        {/* Two-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Shopping List Column (8 cols on large screens) */}
          <div className="lg:col-span-8 w-full">
            <ShoppingList onOpenManualAdd={() => setManualAddOpen(true)} />
          </div>

          {/* Smart Suggestions & Seasonal Sidebar (4 cols) */}
          <aside className="lg:col-span-4 w-full space-y-6">
            <SmartSuggestionsPanel />
            <SeasonalDealsSection />

            {/* Feature Highlights Card */}
            <div className="glass-card rounded-2xl p-5 border border-slate-800/90 text-xs text-slate-400 space-y-3">
              <h4 className="font-bold text-slate-200 flex items-center gap-1.5 text-xs">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>Voice NLP Capabilities</span>
              </h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0" />
                  <span><strong>Zero-latency local NLP:</strong> Parses quantities, units, and price caps instantly.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1 shrink-0" />
                  <span><strong>Multilingual parsing:</strong> English, Spanish, French, German, & Hindi support.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1 shrink-0" />
                  <span><strong>Smart substitutes:</strong> Plant-based & allergy-friendly alternative detection.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 shrink-0" />
                  <span><strong>Kitchen Mode:</strong> Hands-free voice navigation for cooking.</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-900/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-emerald-500" />
            <span className="font-semibold text-slate-400">Voice Command Shopping Assistant</span>
          </div>
          <p>
            Offline-first • Web Speech API • Smart Suggestions • Multilingual NLP
          </p>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <KitchenModeOverlay />
      <VoiceSearchModal />
      <SubstituteModal />
      <ManualAddModal isOpen={manualAddOpen} onClose={() => setManualAddOpen(false)} />
      <VoiceHelpModal />
      <SettingsModal />
      <NotificationToasts />
    </div>
  );
};

export function App() {
  return (
    <ShoppingProvider>
      <VoiceProvider>
        <MainDashboard />
      </VoiceProvider>
    </ShoppingProvider>
  );
}

export default App;
