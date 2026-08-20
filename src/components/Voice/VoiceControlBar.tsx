import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Volume2,
  Tag,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useVoice, SUPPORTED_LANGUAGES } from '../../context/VoiceContext';
import { useShopping } from '../../context/ShoppingContext';

export const VoiceControlBar: React.FC = () => {
  const {
    isListening,
    isSpeaking,
    interimTranscript,
    lastParsedCommand,
    volumeLevel,
    currentLanguage,
    toggleListening,
    processVoiceTranscript,
    openHelpModal,
  } = useVoice();

  const { showToast } = useShopping();
  const [manualText, setManualText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const activeLang = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText.trim() || isProcessing) return;

    setIsProcessing(true);
    const textToProcess = manualText.trim();
    setManualText('');
    await processVoiceTranscript(textToProcess);
    setIsProcessing(false);
  };

  const handleQuickChip = (command: string) => {
    processVoiceTranscript(command);
  };

  // Sample command chips localized or generic
  const sampleChips = [
    'Add 3 organic Honeycrisp apples',
    'Add 2 bottles of almond milk',
    'Find toothpaste under $5',
    'What can I substitute for butter?',
    'Remove whole milk',
    'Check off apples',
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      {/* Main Glass Voice Card */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 relative overflow-hidden border border-slate-700/80 shadow-2xl">
        {/* Glow ambient background when listening */}
        {isListening && (
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/15 to-emerald-500/10 animate-pulse-subtle pointer-events-none" />
        )}

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Main Microphone Button */}
          <div className="relative mb-5">
            {/* Ripple wave rings */}
            {isListening && (
              <>
                <div
                  className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping pointer-events-none"
                  style={{ animationDuration: '2s' }}
                />
                <div
                  className="absolute -inset-3 rounded-full border-2 border-emerald-400/40 animate-pulse pointer-events-none"
                  style={{ transform: `scale(${1 + volumeLevel * 0.4})` }}
                />
              </>
            )}

            <button
              onClick={() => toggleListening()}
              aria-label={isListening ? 'Stop listening' : 'Start voice command'}
              className={`relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full transition-all duration-300 transform active:scale-95 shadow-xl ${
                isListening
                  ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 glow-emerald scale-105'
                  : 'bg-gradient-to-tr from-slate-700 to-slate-800 hover:from-slate-650 hover:to-slate-750 text-emerald-400 hover:text-emerald-300 border border-slate-600/80 hover:border-emerald-500/50'
              }`}
            >
              {isListening ? (
                <Mic className="w-9 h-9 sm:w-10 sm:h-10 animate-bounce" />
              ) : (
                <Mic className="w-9 h-9 sm:w-10 sm:h-10" />
              )}
            </button>
          </div>

          {/* Voice Status & Visualizer Waveform */}
          <div className="flex flex-col items-center mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`inline-block w-2.5 h-2.5 rounded-full ${
                  isListening
                    ? 'bg-emerald-400 animate-ping'
                    : isSpeaking
                    ? 'bg-sky-400 animate-pulse'
                    : 'bg-slate-500'
                }`}
              />
              <span className="text-sm font-semibold tracking-wide text-slate-200">
                {isListening
                  ? `Listening (${activeLang.nativeName})... Speak naturally!`
                  : isSpeaking
                  ? 'Assistant Speaking...'
                  : 'Click microphone or speak anytime'}
              </span>
            </div>

            {/* Audio Waveform Bars when listening */}
            {isListening && (
              <div className="flex items-center justify-center gap-1.5 h-6 my-1">
                {[0.4, 0.8, 1.2, 0.6, 1.0, 1.4, 0.9, 0.5, 1.1, 0.7].map((heightMul, idx) => (
                  <span
                    key={idx}
                    className="w-1 bg-emerald-400 rounded-full transition-all duration-75"
                    style={{
                      height: `${Math.max(4, Math.min(24, (volumeLevel * 30 + 6) * heightMul))}px`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Live Real-Time Interim Transcript Pill */}
          {interimTranscript && (
            <div className="w-full max-w-xl mx-auto mb-4 px-4 py-2 rounded-xl bg-slate-900/90 border border-emerald-500/40 text-emerald-300 text-sm font-medium animate-in fade-in flex items-center justify-center gap-2 shadow-lg">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 animate-spin" />
              <span className="truncate italic">"{interimTranscript}"</span>
            </div>
          )}

          {/* Last Recognized Intent Feedback Badge */}
          {lastParsedCommand && !interimTranscript && (
            <div
              className={`w-full max-w-xl mx-auto mb-4 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium flex items-center justify-between gap-3 shadow-md transition-all ${
                lastParsedCommand.executionStatus === 'success'
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                  : lastParsedCommand.executionStatus === 'warning'
                  ? 'bg-amber-950/40 border-amber-500/30 text-amber-200'
                  : 'bg-slate-900/80 border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                {lastParsedCommand.executionStatus === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                <span className="truncate">{lastParsedCommand.feedbackMessage}</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-[10px] uppercase font-bold text-slate-400 shrink-0">
                {lastParsedCommand.intent}
              </span>
            </div>
          )}

          {/* Natural Language Fallback Input Bar */}
          <form onSubmit={handleManualSubmit} className="w-full max-w-xl flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder='Or type a command: "Add 2 bottles of olive oil", "Find apples under $5"...'
                className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-100 placeholder-slate-500 text-sm transition-all outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={!manualText.trim() || isProcessing}
              className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white font-medium text-sm transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
            >
              <span>Execute</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Voice Command Suggestion Chips */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 max-w-2xl">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
              <Tag className="w-3 h-3 text-slate-500" /> Try saying:
            </span>
            {sampleChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickChip(chip)}
                className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800/90 hover:bg-slate-700/90 text-slate-300 hover:text-emerald-300 border border-slate-700/60 hover:border-emerald-500/40 transition-all cursor-pointer"
              >
                "{chip}"
              </button>
            ))}
            <button
              onClick={openHelpModal}
              className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all flex items-center gap-1"
            >
              <HelpCircle className="w-3 h-3" /> More commands
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
