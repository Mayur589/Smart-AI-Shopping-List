import React, { useState } from 'react';
import {
  X,
  Settings,
  Volume2,
  VolumeX,
  Sliders,
  Sparkles,
  Key,
  RotateCcw,
  Check,
} from 'lucide-react';
import { useVoice } from '../../context/VoiceContext';
import { useShopping } from '../../context/ShoppingContext';

export const SettingsModal: React.FC = () => {
  const {
    activeSettingsModal,
    closeSettingsModal,
    settings,
    updateSettings,
  } = useVoice();

  const { showToast } = useShopping();

  const [aiKey, setAiKey] = useState(settings.aiEnhancementKey || '');
  const [savedKey, setSavedKey] = useState(false);

  if (!activeSettingsModal) return null;

  const handleSaveAiKey = () => {
    updateSettings({ aiEnhancementKey: aiKey.trim() });
    setSavedKey(true);
    showToast('AI Settings updated successfully.', 'success');
    setTimeout(() => setSavedKey(false), 2000);
  };

  const handleResetData = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="glass-panel w-full max-w-lg rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-850/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">Preferences & Audio Settings</h3>
              <p className="text-xs text-slate-400">Configure assistant voice, speech pitch, & sound effects</p>
            </div>
          </div>

          <button
            onClick={closeSettingsModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Voice Feedback Toggles */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Audio & Speech
            </h4>

            {/* Assistant Spoken Response Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700">
              <div>
                <span className="text-xs font-semibold text-slate-200 block">
                  Assistant Spoken Voice (TTS)
                </span>
                <span className="text-[11px] text-slate-400">
                  Assistant speaks aloud confirmations and answers
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.voiceFeedbackEnabled}
                onChange={(e) => updateSettings({ voiceFeedbackEnabled: e.target.checked })}
                className="w-5 h-5 rounded accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Synthesized Sound Effects Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700">
              <div>
                <span className="text-xs font-semibold text-slate-200 block">
                  Synthesized Sound Chimes
                </span>
                <span className="text-[11px] text-slate-400">
                  Play Web Audio chimes on start, add, check, and delete
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.soundEffectsEnabled}
                onChange={(e) => updateSettings({ soundEffectsEnabled: e.target.checked })}
                className="w-5 h-5 rounded accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Speech Rate & Pitch Controls */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Speech Synthesis Tuning
            </h4>

            {/* Speech Rate */}
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-200">Speech Rate</span>
                <span className="text-xs font-bold text-emerald-400">{settings.speechRate}x</span>
              </div>
              <input
                type="range"
                min={0.7}
                max={1.4}
                step={0.1}
                value={settings.speechRate}
                onChange={(e) => updateSettings({ speechRate: parseFloat(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Speech Pitch */}
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-200">Voice Pitch</span>
                <span className="text-xs font-bold text-emerald-400">{settings.speechPitch}x</span>
              </div>
              <input
                type="range"
                min={0.8}
                max={1.3}
                step={0.1}
                value={settings.speechPitch}
                onChange={(e) => updateSettings({ speechPitch: parseFloat(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Optional Cloud LLM API Key */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-emerald-400" />
              <span>Optional Cloud AI Key</span>
            </h4>
            <p className="text-[11px] text-slate-400">
              The built-in offline NLP engine runs 100% locally with zero latency. You can optionally test external Gemini/OpenAI API keys here.
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                value={aiKey}
                onChange={(e) => setAiKey(e.target.value)}
                placeholder="Optional Gemini / OpenAI API Key..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleSaveAiKey}
                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all flex items-center gap-1"
              >
                {savedKey ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{savedKey ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>

          {/* Reset App Data */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-300 block">Reset Application Data</span>
              <span className="text-[11px] text-slate-500">Restore demo shopping items & history</span>
            </div>
            <button
              onClick={handleResetData}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/80 text-right">
          <button
            onClick={closeSettingsModal}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
