import React from 'react';
import {
  ChefHat,
  Mic,
  MicOff,
  CheckCircle2,
  Circle,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  ShoppingBag,
  Plus,
  Trash2,
} from 'lucide-react';
import { useVoice } from '../../context/VoiceContext';
import { useShopping } from '../../context/ShoppingContext';
import { CategoryIcon } from '../common/CategoryIcon';

export const KitchenModeOverlay: React.FC = () => {
  const {
    voiceMode,
    setVoiceMode,
    isListening,
    isSpeaking,
    interimTranscript,
    lastParsedCommand,
    volumeLevel,
    toggleListening,
    settings,
    updateSettings,
  } = useVoice();

  const {
    items,
    toggleCompleted,
    clearCompleted,
    completedCount,
    pendingCount,
    totalEstimatedCost,
  } = useShopping();

  if (voiceMode !== 'kitchen') return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col overflow-hidden animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Kitchen & Voice-Only Mode</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Hands-Free
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {pendingCount} items remaining • ${totalEstimatedCost.toFixed(2)} total
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Audio voice toggle */}
          <button
            onClick={() => updateSettings({ voiceFeedbackEnabled: !settings.voiceFeedbackEnabled })}
            className={`p-3 rounded-xl border transition-all ${
              settings.voiceFeedbackEnabled
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="Toggle Assistant Speech"
          >
            {settings.voiceFeedbackEnabled ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </button>

          {/* Exit Kitchen Mode */}
          <button
            onClick={() => setVoiceMode('standard')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all flex items-center gap-2"
          >
            <X className="w-5 h-5" />
            <span className="hidden sm:inline">Exit Mode</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left Column: Huge Microphone Visualizer & Voice State (5 cols) */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-900/50 text-center relative">
          {/* Animated Glow Backdrop */}
          {isListening && (
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none animate-pulse-subtle" />
          )}

          {/* Giant Microphone Button */}
          <div className="relative mb-6">
            {isListening && (
              <>
                <div className="absolute -inset-4 rounded-full bg-emerald-500/20 animate-ping" />
                <div
                  className="absolute -inset-8 rounded-full border-2 border-emerald-400/30 animate-pulse"
                  style={{ transform: `scale(${1 + volumeLevel * 0.5})` }}
                />
              </>
            )}

            <button
              onClick={() => toggleListening()}
              className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform active:scale-95 ${
                isListening
                  ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 glow-emerald scale-105'
                  : 'bg-gradient-to-tr from-slate-800 to-slate-700 text-emerald-400 border-2 border-slate-600 hover:border-emerald-400'
              }`}
            >
              {isListening ? (
                <Mic className="w-14 h-14 sm:w-16 sm:h-16 animate-bounce" />
              ) : (
                <Mic className="w-14 h-14 sm:w-16 sm:h-16" />
              )}
            </button>
          </div>

          {/* Status Text */}
          <h3 className="text-xl sm:text-2xl font-black text-white mb-2 tracking-tight">
            {isListening
              ? 'Listening to you...'
              : isSpeaking
              ? 'Assistant Answering...'
              : 'Tap to Speak'}
          </h3>

          {/* Live Waveform */}
          {isListening && (
            <div className="flex items-center justify-center gap-1.5 h-8 my-2">
              {[0.4, 0.9, 1.4, 0.7, 1.2, 1.8, 1.1, 0.6, 1.3, 0.8].map((h, i) => (
                <span
                  key={i}
                  className="w-1.5 bg-emerald-400 rounded-full transition-all duration-75"
                  style={{
                    height: `${Math.max(6, Math.min(32, (volumeLevel * 40 + 8) * h))}px`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Interim transcript pill */}
          {interimTranscript && (
            <div className="mt-4 px-4 py-3 rounded-2xl bg-slate-950/80 border border-emerald-500/50 text-emerald-300 text-base sm:text-lg font-medium shadow-xl max-w-md animate-in fade-in">
              "{interimTranscript}"
            </div>
          )}

          {/* Last command feedback */}
          {lastParsedCommand && !interimTranscript && (
            <div className="mt-4 px-4 py-3 rounded-2xl bg-slate-800/90 border border-slate-700 text-slate-200 text-sm max-w-md">
              <span className="font-semibold text-emerald-400 block mb-0.5">
                {lastParsedCommand.intent}
              </span>
              {lastParsedCommand.feedbackMessage}
            </div>
          )}

          {/* Voice Prompt Suggestions */}
          <div className="mt-6 text-xs text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300">Try hands-free commands:</p>
            <p>• "Add 2 bottles of olive oil"</p>
            <p>• "Check off whole milk"</p>
            <p>• "Remove bananas"</p>
          </div>
        </div>

        {/* Right Column: High-Legibility Giant Shopping List (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col overflow-hidden bg-slate-950">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
              <span>Current List ({items.length})</span>
            </h3>

            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Clear Completed ({completedCount})</span>
              </button>
            )}
          </div>

          {/* Items Container */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-2">
            {items.length > 0 ? (
              items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleCompleted(item.id)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    item.completed
                      ? 'bg-slate-900/40 border-slate-800/60 opacity-50'
                      : 'bg-slate-850 hover:bg-slate-800 border-slate-700/80 shadow-lg hover:border-emerald-500/50'
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <button
                      className="text-slate-400 hover:text-emerald-400 transition-colors shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCompleted(item.id);
                      }}
                    >
                      {item.completed ? (
                        <CheckCircle2 className="w-7 h-7 text-emerald-400 fill-emerald-500/20" />
                      ) : (
                        <Circle className="w-7 h-7 hover:text-emerald-400" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <span
                        className={`text-lg sm:text-xl font-bold tracking-tight block truncate ${
                          item.completed ? 'line-through text-slate-500' : 'text-white'
                        }`}
                      >
                        {item.name}
                      </span>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                        <span className="capitalize">{item.category}</span>
                        <span>•</span>
                        <span>
                          {item.quantity} {item.unit} (${(item.estimatedPrice * item.quantity).toFixed(2)})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 font-extrabold text-sm border border-slate-700 shrink-0">
                    {item.quantity} {item.unit}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center text-slate-500">
                <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-40" />
                <p className="text-base font-semibold">Your shopping list is empty.</p>
                <p className="text-xs mt-1">Tap the microphone on the left and say "Add milk"!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
