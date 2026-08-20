import { SupportedLanguage } from '../types/voice';

class TextToSpeechService {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private enabled: boolean = true;
  private rate: number = 1.0;
  private pitch: number = 1.0;
  private volume: number = 1.0;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled && this.synth) {
      this.synth.cancel();
    }
  }

  public setRate(rate: number) {
    this.rate = Math.max(0.5, Math.min(2.0, rate));
  }

  public setPitch(pitch: number) {
    this.pitch = Math.max(0.5, Math.min(2.0, pitch));
  }

  public setVolume(volume: number) {
    this.volume = Math.max(0.0, Math.min(1.0, volume));
  }

  public speak(text: string, language: SupportedLanguage = 'en-US'): Promise<void> {
    return new Promise((resolve) => {
      if (!this.enabled || !this.synth || !text.trim()) {
        resolve();
        return;
      }

      // Cancel ongoing speech to avoid overlapping
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = this.rate;
      utterance.pitch = this.pitch;
      utterance.volume = this.volume;
      utterance.lang = language;

      // Select best matching voice for language
      const langPrefix = language.split('-')[0];
      const matchedVoice =
        this.voices.find((v) => v.lang === language) ||
        this.voices.find((v) => v.lang.startsWith(langPrefix)) ||
        null;

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      this.synth.speak(utterance);
    });
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  public isSpeaking(): boolean {
    return !!this.synth && this.synth.speaking;
  }
}

export const speechSynthesizer = new TextToSpeechService();
