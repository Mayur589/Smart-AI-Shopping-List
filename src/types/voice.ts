import { ItemCategory } from './shopping';

export type VoiceIntentType =
  | 'ADD_ITEM'
  | 'REMOVE_ITEM'
  | 'MODIFY_QUANTITY'
  | 'CHECK_ITEM'
  | 'UNCHECK_ITEM'
  | 'SEARCH_PRODUCTS'
  | 'ASK_SUBSTITUTES'
  | 'CLEAR_COMPLETED'
  | 'CLEAR_ALL'
  | 'ASK_RECOMMENDATIONS'
  | 'SWITCH_LANGUAGE'
  | 'SWITCH_MODE'
  | 'HELP'
  | 'UNKNOWN';

export interface ParsedVoiceCommand {
  rawTranscript: string;
  intent: VoiceIntentType;
  confidence: number;
  entities: {
    itemName?: string;
    quantity?: number;
    unit?: string;
    category?: ItemCategory;
    brand?: string;
    maxPrice?: number;
    targetSubstitute?: string;
    isOrganic?: boolean;
    languageCode?: string;
    mode?: 'kitchen' | 'standard';
  };
  feedbackMessage: string;
  executionStatus: 'success' | 'warning' | 'error' | 'clarification_needed';
}

export type SupportedLanguage = 'en-US' | 'es-ES' | 'fr-FR' | 'de-DE' | 'hi-IN';

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  localeSpeechCode: string;
  flagCode: string; // ISO 2-letter country code for display pill, NOT emoji
}

export type VoiceMode = 'standard' | 'kitchen';

export interface VoiceAssistantSettings {
  language: SupportedLanguage;
  speechRate: number; // 0.8 - 1.2
  speechPitch: number; // 0.8 - 1.2
  speechVolume: number; // 0 - 1
  voiceFeedbackEnabled: boolean;
  soundEffectsEnabled: boolean;
  continuousListening: boolean;
  aiEnhancementKey?: string;
}
