import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  LanguageConfig,
  ParsedVoiceCommand,
  SupportedLanguage,
  VoiceAssistantSettings,
  VoiceMode,
} from '../types/voice';
import { speechRecognitionService } from '../services/speechRecognition';
import { speechSynthesizer } from '../services/speechSynthesis';
import { soundEffects } from '../services/soundEffects';
import { NLPEngine } from '../services/nlpEngine';
import { useShopping } from './ShoppingContext';

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: 'en-US', name: 'English (US)', nativeName: 'English', localeSpeechCode: 'en-US', flagCode: 'US' },
  { code: 'es-ES', name: 'Spanish', nativeName: 'Español', localeSpeechCode: 'es-ES', flagCode: 'ES' },
  { code: 'fr-FR', name: 'French', nativeName: 'Français', localeSpeechCode: 'fr-FR', flagCode: 'FR' },
  { code: 'de-DE', name: 'German', nativeName: 'Deutsch', localeSpeechCode: 'de-DE', flagCode: 'DE' },
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', localeSpeechCode: 'hi-IN', flagCode: 'IN' },
];

interface VoiceContextType {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  interimTranscript: string;
  lastParsedCommand: ParsedVoiceCommand | null;
  volumeLevel: number;
  currentLanguage: SupportedLanguage;
  voiceMode: VoiceMode;
  settings: VoiceAssistantSettings;
  isVoiceSupported: boolean;
  activeSearchModal: { isOpen: boolean; initialQuery?: string; maxPrice?: number };
  activeHelpModal: boolean;
  activeSettingsModal: boolean;
  startListening: () => Promise<boolean>;
  stopListening: () => void;
  toggleListening: () => Promise<void>;
  setLanguage: (lang: SupportedLanguage) => void;
  setVoiceMode: (mode: VoiceMode) => void;
  updateSettings: (newSettings: Partial<VoiceAssistantSettings>) => void;
  processVoiceTranscript: (transcript: string) => Promise<ParsedVoiceCommand>;
  speakFeedback: (message: string) => Promise<void>;
  openSearchModal: (query?: string, maxPrice?: number) => void;
  closeSearchModal: () => void;
  openHelpModal: () => void;
  closeHelpModal: () => void;
  openSettingsModal: () => void;
  closeSettingsModal: () => void;
}

const VoiceContext = createContext<VoiceContextType | null>(null);

const SETTINGS_STORAGE_KEY = 'voice_shopping_settings_v1';

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const shopping = useShopping();

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [lastParsedCommand, setLastParsedCommand] = useState<ParsedVoiceCommand | null>(null);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [voiceMode, setVoiceMode] = useState<VoiceMode>('standard');
  const [isVoiceSupported] = useState<boolean>(() => speechRecognitionService.checkSupport());

  const [activeSearchModal, setActiveSearchModal] = useState<{
    isOpen: boolean;
    initialQuery?: string;
    maxPrice?: number;
  }>({
    isOpen: false,
  });
  const [activeHelpModal, setActiveHelpModal] = useState(false);
  const [activeSettingsModal, setActiveSettingsModal] = useState(false);

  const [settings, setSettings] = useState<VoiceAssistantSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return {
      language: 'en-US',
      speechRate: 1.0,
      speechPitch: 1.0,
      speechVolume: 1.0,
      voiceFeedbackEnabled: true,
      soundEffectsEnabled: true,
      continuousListening: false,
    };
  });

  const settingsRef = useRef(settings);
  useEffect(() => {
    settingsRef.current = settings;
    speechSynthesizer.setEnabled(settings.voiceFeedbackEnabled);
    speechSynthesizer.setRate(settings.speechRate);
    speechSynthesizer.setPitch(settings.speechPitch);
    speechSynthesizer.setVolume(settings.speechVolume);
    soundEffects.setEnabled(settings.soundEffectsEnabled);
    speechRecognitionService.setLanguage(settings.language);
    speechRecognitionService.setContinuous(settings.continuousListening);

    if (typeof window !== 'undefined') {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<VoiceAssistantSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const setLanguage = (lang: SupportedLanguage) => {
    updateSettings({ language: lang });
    shopping.showToast(`Language switched to ${SUPPORTED_LANGUAGES.find((l) => l.code === lang)?.name || lang}`, 'info');
  };

  const speakFeedback = async (message: string) => {
    if (!settings.voiceFeedbackEnabled) return;
    setIsSpeaking(true);
    await speechSynthesizer.speak(message, settings.language);
    setIsSpeaking(false);
  };

  const openSearchModal = (query?: string, maxPrice?: number) => {
    setActiveSearchModal({
      isOpen: true,
      initialQuery: query,
      maxPrice,
    });
  };

  const closeSearchModal = () => {
    setActiveSearchModal({ isOpen: false });
  };

  const openHelpModal = () => setActiveHelpModal(true);
  const closeHelpModal = () => setActiveHelpModal(false);
  const openSettingsModal = () => setActiveSettingsModal(true);
  const closeSettingsModal = () => setActiveSettingsModal(false);

  /**
   * Processes parsed voice command and maps to state updates
   */
  const executeCommand = async (command: ParsedVoiceCommand) => {
    setLastParsedCommand(command);

    switch (command.intent) {
      case 'ADD_ITEM': {
        if (command.entities.itemName) {
          shopping.addItem({
            name: command.entities.itemName,
            quantity: command.entities.quantity || 1,
            unit: command.entities.unit || 'unit',
            category: command.entities.category || 'pantry',
            isOrganic: command.entities.isOrganic || false,
            addedViaVoice: true,
          });
        }
        break;
      }
      case 'REMOVE_ITEM': {
        if (command.entities.itemName) {
          shopping.removeItem(command.entities.itemName);
        }
        break;
      }
      case 'MODIFY_QUANTITY': {
        if (command.entities.itemName && command.entities.quantity) {
          shopping.updateQuantity(
            command.entities.itemName,
            command.entities.quantity,
            command.entities.unit
          );
        }
        break;
      }
      case 'CHECK_ITEM': {
        if (command.entities.itemName) {
          shopping.toggleCompleted(command.entities.itemName);
        }
        break;
      }
      case 'UNCHECK_ITEM': {
        if (command.entities.itemName) {
          shopping.toggleCompleted(command.entities.itemName);
        }
        break;
      }
      case 'SEARCH_PRODUCTS': {
        openSearchModal(command.entities.itemName, command.entities.maxPrice);
        break;
      }
      case 'ASK_SUBSTITUTES': {
        if (command.entities.targetSubstitute) {
          const fakeItem = {
            id: 'temp',
            name: command.entities.targetSubstitute,
            quantity: 1,
            unit: 'unit',
            category: 'pantry' as const,
            estimatedPrice: 3.99,
            completed: false,
            createdAt: Date.now(),
            lastModifiedAt: Date.now(),
          };
          shopping.openSubstitutesModal(fakeItem);
        }
        break;
      }
      case 'CLEAR_COMPLETED': {
        shopping.clearCompleted();
        break;
      }
      case 'CLEAR_ALL': {
        shopping.clearAll();
        break;
      }
      case 'ASK_RECOMMENDATIONS': {
        shopping.showToast('Displaying smart suggestions in the sidebar.', 'info');
        break;
      }
      case 'SWITCH_MODE': {
        if (command.entities.mode) {
          setVoiceMode(command.entities.mode);
        }
        break;
      }
      case 'HELP': {
        openHelpModal();
        break;
      }
      default:
        break;
    }

    // Deliver spoken audio feedback
    if (command.feedbackMessage) {
      await speakFeedback(command.feedbackMessage);
    }
  };

  const processVoiceTranscript = async (rawText: string): Promise<ParsedVoiceCommand> => {
    setTranscript(rawText);
    setInterimTranscript('');

    const command = NLPEngine.parseCommand(rawText, settings.language);
    await executeCommand(command);
    return command;
  };

  const startListening = async (): Promise<boolean> => {
    soundEffects.playListeningStart();
    setInterimTranscript('');

    const success = await speechRecognitionService.start(
      (text, isFinal) => {
        if (isFinal) {
          setIsListening(false);
          soundEffects.playListeningStop();
          processVoiceTranscript(text);
        } else {
          setInterimTranscript(text);
        }
      },
      (error) => {
        setIsListening(false);
        shopping.showToast(error, 'error');
        soundEffects.playErrorBuzz();
      },
      (volume) => {
        setVolumeLevel(volume);
      }
    );

    if (success) {
      setIsListening(true);
    }
    return success;
  };

  const stopListening = () => {
    speechRecognitionService.stop();
    setIsListening(false);
    setVolumeLevel(0);
    soundEffects.playListeningStop();
  };

  const toggleListening = async () => {
    if (isListening) {
      stopListening();
    } else {
      await startListening();
    }
  };

  return (
    <VoiceContext.Provider
      value={{
        isListening,
        isSpeaking,
        transcript,
        interimTranscript,
        lastParsedCommand,
        volumeLevel,
        currentLanguage: settings.language,
        voiceMode,
        settings,
        isVoiceSupported,
        activeSearchModal,
        activeHelpModal,
        activeSettingsModal,
        startListening,
        stopListening,
        toggleListening,
        setLanguage,
        setVoiceMode,
        updateSettings,
        processVoiceTranscript,
        speakFeedback,
        openSearchModal,
        closeSearchModal,
        openHelpModal,
        closeHelpModal,
        openSettingsModal,
        closeSettingsModal,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = (): VoiceContextType => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};
