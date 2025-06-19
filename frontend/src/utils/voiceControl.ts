// @ts-ignore - annyang types may be incomplete
import annyang from 'annyang';

interface VoiceCommand {
  command: string;
  action: () => void;
  description: string;
}

interface VoiceControlOptions {
  onListening?: (listening: boolean) => void;
  onResult?: (result: string) => void;
  onError?: (error: string) => void;
  language?: string;
}

class VoiceController {
  private isListening: boolean = false;
  private commands: { [key: string]: () => void } = {};
  private options: VoiceControlOptions;
  private speechSynthesis: SpeechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor(options: VoiceControlOptions = {}) {
    this.options = options;
    this.speechSynthesis = window.speechSynthesis;
    this.initializeAnnyang();
  }

  private initializeAnnyang() {
    if (!annyang) {
      console.warn('Voice recognition not supported in this browser');
      return;
    }

    const annyangAny = annyang as any;

    // Configure annyang
    annyangAny.setLanguage(this.options.language || 'en-US');
    
    // Add debug and result callbacks
    annyangAny.addCallback('result', (phrases: string[]) => {
      if (phrases.length > 0 && this.options.onResult) {
        this.options.onResult(phrases[0]);
      }
    });

    annyangAny.addCallback('error', (error: any) => {
      console.error('Voice recognition error:', error);
      if (this.options.onError) {
        this.options.onError(error.error || 'Voice recognition error');
      }
    });

    annyangAny.addCallback('start', () => {
      this.isListening = true;
      if (this.options.onListening) {
        this.options.onListening(true);
      }
    });

    annyangAny.addCallback('end', () => {
      this.isListening = false;
      if (this.options.onListening) {
        this.options.onListening(false);
      }
    });
  }

  public addCommand(command: string, action: () => void, description: string = '') {
    this.commands[command] = action;
    
    if (annyang) {
      const commandObj = { [command]: action };
      (annyang as any).addCommands(commandObj);
    }
  }

  public addCommands(commands: VoiceCommand[]) {
    commands.forEach(cmd => {
      this.addCommand(cmd.command, cmd.action, cmd.description);
    });
  }

  public removeCommand(command: string) {
    delete this.commands[command];
    if (annyang) {
      (annyang as any).removeCommands(command);
    }
  }

  public startListening() {
    if (!annyang) {
      this.speak('Voice recognition is not supported in this browser');
      return false;
    }

    try {
      (annyang as any).start({ autoRestart: true, continuous: true });
      return true;
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      if (this.options.onError) {
        this.options.onError('Failed to start voice recognition');
      }
      return false;
    }
  }

  public stopListening() {
    if (annyang) {
      (annyang as any).abort();
    }
    this.isListening = false;
    if (this.options.onListening) {
      this.options.onListening(false);
    }
  }

  public speak(text: string, options: {
    rate?: number;
    pitch?: number;
    volume?: number;
    voice?: SpeechSynthesisVoice;
    onEnd?: () => void;
    onError?: (error: SpeechSynthesisErrorEvent) => void;
  } = {}) {
    // Stop any current speech
    this.stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set options
    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;
    
    if (options.voice) {
      utterance.voice = options.voice;
    }

    // Add event listeners
    if (options.onEnd) {
      utterance.onend = options.onEnd;
    }
    
    if (options.onError) {
      utterance.onerror = options.onError;
    }

    this.currentUtterance = utterance;
    this.speechSynthesis.speak(utterance);
  }

  public stopSpeaking() {
    if (this.speechSynthesis.speaking || this.speechSynthesis.pending) {
      this.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
  }

  public pauseSpeaking() {
    if (this.speechSynthesis.speaking) {
      this.speechSynthesis.pause();
    }
  }

  public resumeSpeaking() {
    if (this.speechSynthesis.paused) {
      this.speechSynthesis.resume();
    }
  }

  public isSpeaking(): boolean {
    return this.speechSynthesis.speaking;
  }

  public isPaused(): boolean {
    return this.speechSynthesis.paused;
  }

  public getVoices(): SpeechSynthesisVoice[] {
    return this.speechSynthesis.getVoices();
  }

  public isListeningActive(): boolean {
    return this.isListening;
  }

  public getCommands(): { [key: string]: () => void } {
    return { ...this.commands };
  }

  public isSupported(): boolean {
    return !!(annyang && 'speechSynthesis' in window);
  }

  public destroy() {
    this.stopListening();
    this.stopSpeaking();
    if (annyang) {
      (annyang as any).removeCommands();
    }
  }
}

// Pre-defined command sets for different sections
export const getNavigationCommands = (navigate: (path: string) => void): VoiceCommand[] => [
  {
    command: 'go home',
    action: () => navigate('/'),
    description: 'Navigate to home page'
  },
  {
    command: 'go to tools',
    action: () => navigate('/tools'),
    description: 'Navigate to tools page'
  },
  {
    command: 'go to chat',
    action: () => navigate('/chat'),
    description: 'Navigate to chat assistant'
  },
  {
    command: 'go to deaf section',
    action: () => navigate('/deaf'),
    description: 'Navigate to deaf learning section'
  },
  {
    command: 'go to blind section',
    action: () => navigate('/blind'),
    description: 'Navigate to blind accessibility section'
  },
  {
    command: 'go to about',
    action: () => navigate('/about'),
    description: 'Navigate to about page'
  },
];

export const getDeafSectionCommands = (setTab: (tab: string) => void): VoiceCommand[] => [
  {
    command: 'show flash cards',
    action: () => setTab('flashcards'),
    description: 'Switch to flash cards tab'
  },
  {
    command: 'show alphabet',
    action: () => setTab('alphabet'),
    description: 'Switch to alphabet learning tab'
  },
  {
    command: 'show common signs',
    action: () => setTab('common-signs'),
    description: 'Switch to common signs tab'
  },
  {
    command: 'show dictionary',
    action: () => setTab('dictionary'),
    description: 'Switch to signs dictionary tab'
  },
];

export const getBlindSectionCommands = (actions: {
  uploadImage: () => void;
  readText: () => void;
  stopReading: () => void;
  showHelp: () => void;
  clearText: () => void;
}): VoiceCommand[] => [
  {
    command: 'upload image',
    action: actions.uploadImage,
    description: 'Trigger image upload for OCR'
  },
  {
    command: 'read text',
    action: actions.readText,
    description: 'Start reading extracted text aloud'
  },
  {
    command: 'stop reading',
    action: actions.stopReading,
    description: 'Stop text-to-speech'
  },
  {
    command: 'show help',
    action: actions.showHelp,
    description: 'Show available voice commands'
  },
  {
    command: 'clear text',
    action: actions.clearText,
    description: 'Clear the extracted text'
  },
];

// Speech synthesis helpers
export const getAvailableVoices = (): SpeechSynthesisVoice[] => {
  return speechSynthesis.getVoices();
};

export const getPreferredVoice = (language: string = 'en'): SpeechSynthesisVoice | null => {
  const voices = getAvailableVoices();
  
  // Try to find a voice that matches the language
  const matchingVoices = voices.filter(voice => 
    voice.lang.toLowerCase().startsWith(language.toLowerCase())
  );
  
  if (matchingVoices.length > 0) {
    // Prefer local voices over remote ones
    const localVoice = matchingVoices.find(voice => voice.localService);
    return localVoice || matchingVoices[0];
  }
  
  // Fallback to default voice
  return voices[0] || null;
};

// Utility function to check browser support
export const checkVoiceSupport = (): {
  speechRecognition: boolean;
  speechSynthesis: boolean;
  fullSupport: boolean;
} => {
  const speechRecognition = !!annyang;
  const speechSynthesis = 'speechSynthesis' in window;
  
  return {
    speechRecognition,
    speechSynthesis,
    fullSupport: speechRecognition && speechSynthesis,
  };
};

export default VoiceController; 