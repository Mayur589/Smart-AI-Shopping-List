import React, { useState } from 'react';
import {
  ShoppingBag,
  Volume2,
  VolumeX,
  Search,
  HelpCircle,
  Settings,
  ChefHat,
  Globe,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useVoice, SUPPORTED_LANGUAGES } from '../context/VoiceContext';
import { useShopping } from '../context/ShoppingContext';

export const Header: React.FC = () => {
  const {
    currentLanguage,
    setLanguage,
    voiceMode,
    setVoiceMode,
    settings,
    updateSettings,
    openSearchModal,
    openHelpModal,
    openSettingsModal,
  } = useVoice();

  const { items } = useShopping();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const activeLangConfig =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  const toggleSound = () => {
    updateSettings({ voiceFeedbackEnabled: !settings.voiceFeedbackEnabled });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-lg shadow-emerald-500/20">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight">VoiceCart</span>
              <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Smart NLP
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">AI Voice Shopping Assistant</p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Trigger */}
          <button
            onClick={() => openSearchModal()}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-850 border border-slate-700/60 text-slate-300 hover:text-white transition-all text-sm group"
            title="Search Products by Voice or Text"
          >
            <Search className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
            <span className="hidden md:inline text-xs text-slate-400">Search catalog...</span>
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-850 border border-slate-700/60 text-slate-200 text-sm font-medium transition-all"
              title="Change Voice & NLP Language"
            >
              <Globe className="w-4 h-4 text-emerald-400" />
              <span className="px-1.5 py-0.5 text-[11px] font-bold rounded bg-slate-700 text-slate-200">
                {activeLangConfig.flagCode}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {langDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setLangDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-800 border border-slate-700 shadow-2xl z-20 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700/60">
                    Voice Language
                  </div>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-slate-700/60 transition-colors ${
                        currentLanguage === lang.code
                          ? 'text-emerald-400 font-semibold bg-emerald-500/10'
                          : 'text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-slate-700 text-slate-300">
                          {lang.flagCode}
                        </span>
                        <span>{lang.nativeName}</span>
                      </div>
                      <span className="text-xs text-slate-400">{lang.code}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Mode Switcher (Kitchen / Hands-Free vs Standard) */}
          <button
            onClick={() => setVoiceMode(voiceMode === 'kitchen' ? 'standard' : 'kitchen')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
              voiceMode === 'kitchen'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-500/10'
                : 'bg-slate-800/80 hover:bg-slate-850 border-slate-700/60 text-slate-300 hover:text-white'
            }`}
            title="Toggle Hands-Free Kitchen Mode"
          >
            <ChefHat className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">
              {voiceMode === 'kitchen' ? 'Kitchen Mode' : 'Kitchen View'}
            </span>
          </button>

          {/* Voice Audio Feedback Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-lg border transition-all ${
              settings.voiceFeedbackEnabled
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-slate-200'
            }`}
            title={settings.voiceFeedbackEnabled ? 'Spoken Assistant Voice: ON' : 'Spoken Assistant Voice: MUTED'}
          >
            {settings.voiceFeedbackEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Voice Command Cheat Sheet Modal Trigger */}
          <button
            onClick={openHelpModal}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-850 border border-slate-700/60 text-slate-400 hover:text-slate-200 transition-all"
            title="Voice Commands Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Settings Trigger */}
          <button
            onClick={openSettingsModal}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-850 border border-slate-700/60 text-slate-400 hover:text-slate-200 transition-all"
            title="Settings & Preferences"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
