import { SupportedLanguage } from '../types/voice';

// Global types for webkitSpeechRecognition
interface IWindow extends Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
}

export type SpeechCallback = (transcript: string, isFinal: boolean) => void;
export type ErrorCallback = (error: string) => void;
export type VolumeCallback = (volume: number) => void;

export class SpeechRecognitionService {
  private recognition: any = null;
  private isListening: boolean = false;
  private currentLanguage: SupportedLanguage = 'en-US';
  private continuous: boolean = false;
  private onTranscript: SpeechCallback | null = null;
  private onError: ErrorCallback | null = null;
  private onVolume: VolumeCallback | null = null;
  private isSupported: boolean = false;
  
  // Audio analyzer for live waveform visualization
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private analyserNode: AnalyserNode | null = null;
  private animationFrameId: number | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const win = window as unknown as IWindow;
      const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;
      if (SpeechRecognitionClass) {
        this.recognition = new SpeechRecognitionClass();
        this.isSupported = true;
        this.setupRecognition();
      }
    }
  }

  public checkSupport(): boolean {
    return this.isSupported;
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = this.continuous;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;
    this.recognition.lang = this.currentLanguage;

    this.recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          final += item[0].transcript;
        } else {
          interim += item[0].transcript;
        }
      }

      if (final.trim() && this.onTranscript) {
        this.onTranscript(final.trim(), true);
      } else if (interim.trim() && this.onTranscript) {
        this.onTranscript(interim.trim(), false);
      }
    };

    this.recognition.onerror = (event: any) => {
      const errorType = event.error;
      // 'no-speech' is a normal timeout if user paused
      if (errorType === 'no-speech') {
        return;
      }
      
      let message = `Voice recognition error: ${errorType}`;
      if (errorType === 'not-allowed') {
        message = 'Microphone permission was denied. Please allow microphone access in your browser settings.';
      } else if (errorType === 'network') {
        message = 'Network error occurred during speech recognition. Please check your internet connection.';
      }
      
      if (this.onError) {
        this.onError(message);
      }
      this.stop();
    };

    this.recognition.onend = () => {
      if (this.isListening && this.continuous) {
        try {
          this.recognition.start();
        } catch {
          this.stop();
        }
      } else {
        this.stop();
      }
    };
  }

  public setLanguage(lang: SupportedLanguage) {
    this.currentLanguage = lang;
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  public setContinuous(continuous: boolean) {
    this.continuous = continuous;
    if (this.recognition) {
      this.recognition.continuous = continuous;
    }
  }

  private async startAudioAnalyzer() {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      this.audioContext = new AudioCtx();
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 64;
      source.connect(this.analyserNode);

      const bufferLength = this.analyserNode.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateVolume = () => {
        if (!this.isListening || !this.analyserNode) return;
        this.analyserNode.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        const normalized = Math.min(1, average / 128); // 0 to 1

        if (this.onVolume) {
          this.onVolume(normalized);
        }

        this.animationFrameId = requestAnimationFrame(updateVolume);
      };

      updateVolume();
    } catch {
      // Audio stream error handled silently
    }
  }

  private stopAudioAnalyzer() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
    if (this.onVolume) {
      this.onVolume(0);
    }
  }

  public async start(
    onTranscript: SpeechCallback,
    onError?: ErrorCallback,
    onVolume?: VolumeCallback
  ): Promise<boolean> {
    if (!this.recognition) {
      if (onError) {
        onError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      }
      return false;
    }

    this.onTranscript = onTranscript;
    this.onError = onError || null;
    this.onVolume = onVolume || null;

    try {
      this.recognition.start();
      this.isListening = true;
      await this.startAudioAnalyzer();
      return true;
    } catch (err: any) {
      if (err.name === 'InvalidStateError') {
        // Already started
        return true;
      }
      if (this.onError) {
        this.onError('Could not start microphone.');
      }
      return false;
    }
  }

  public stop() {
    this.isListening = false;
    this.stopAudioAnalyzer();
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // Ignore
      }
    }
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

export const speechRecognitionService = new SpeechRecognitionService();
