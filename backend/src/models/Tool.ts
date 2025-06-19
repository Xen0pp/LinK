export interface Tool {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  category: 'visual' | 'auditory' | 'motor' | 'cognitive';
  tags: string[];
  demoType: 'image-caption' | 'speech-to-text' | 'text-simplify' | 'ocr' | 'text-to-speech' | 'none';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  popularity: number;
  rating: number;
  usageCount: number;
  githubUrl?: string;
  documentationUrl?: string;
  implementationGuide: string;
  accessibilityFeatures: string[];
  wcagCompliance: string[];
  supportedLanguages: string[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface ToolDemo {
  toolId: string;
  inputType: 'text' | 'image' | 'audio' | 'video';
  outputType: 'text' | 'image' | 'audio' | 'json';
  maxInputSize: number;
  supportedFormats: string[];
}

export interface ToolUsage {
  id: string;
  toolId: string;
  userId?: string;
  inputData: any;
  outputData: any;
  processingTime: number;
  success: boolean;
  error?: string;
  timestamp: Date;
}

// Sample tool data
export const sampleTools: Tool[] = [
  {
    id: 'image-captioning',
    name: 'AI Image Captioning',
    description: 'Generate descriptive alt text for images using advanced computer vision models. This tool helps create meaningful descriptions for visually impaired users by analyzing image content and generating natural language descriptions.',
    shortDescription: 'Generate descriptive alt text for images using AI',
    category: 'visual',
    tags: ['image', 'alt-text', 'computer-vision', 'accessibility', 'ai'],
    demoType: 'image-caption',
    difficulty: 'beginner',
    popularity: 95,
    rating: 4.8,
    usageCount: 15420,
    githubUrl: 'https://github.com/huggingface/transformers',
    documentationUrl: 'https://huggingface.co/docs/transformers/model_doc/blip',
    implementationGuide: 'Upload an image and our AI will analyze it to generate descriptive alt text. The model uses BLIP (Bootstrapped Language-Image Pre-training) to understand image content and generate natural language descriptions.',
    accessibilityFeatures: ['Screen reader compatible', 'Keyboard navigation', 'High contrast support'],
    wcagCompliance: ['WCAG 2.1 AA', 'Section 508'],
    supportedLanguages: ['English', 'Spanish', 'French', 'German'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
    isActive: true
  },
  {
    id: 'speech-to-text',
    name: 'Speech-to-Text Transcription',
    description: 'Convert audio recordings and live speech into accurate text transcriptions using OpenAI Whisper. Perfect for creating captions, transcripts, and making audio content accessible to deaf and hard-of-hearing users.',
    shortDescription: 'Convert speech and audio to accurate text transcriptions',
    category: 'auditory',
    tags: ['speech', 'transcription', 'whisper', 'captions', 'accessibility'],
    demoType: 'speech-to-text',
    difficulty: 'beginner',
    popularity: 92,
    rating: 4.7,
    usageCount: 12850,
    githubUrl: 'https://github.com/openai/whisper',
    documentationUrl: 'https://openai.com/research/whisper',
    implementationGuide: 'Upload an audio file or record directly in your browser. Whisper will transcribe the speech with high accuracy, including punctuation and speaker detection.',
    accessibilityFeatures: ['Live captions', 'Multiple audio formats', 'Real-time processing'],
    wcagCompliance: ['WCAG 2.1 AA', 'ADA Compliance'],
    supportedLanguages: ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Dutch'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-11-30'),
    isActive: true
  },
  {
    id: 'text-simplification',
    name: 'Text Simplification',
    description: 'Transform complex text into easy-to-understand language using advanced language models. This tool helps users with cognitive disabilities, learning difficulties, or non-native speakers better comprehend written content.',
    shortDescription: 'Transform complex text into easy-to-understand language',
    category: 'cognitive',
    tags: ['text', 'simplification', 'readability', 'cognitive', 'language'],
    demoType: 'text-simplify',
    difficulty: 'beginner',
    popularity: 88,
    rating: 4.6,
    usageCount: 9630,
    githubUrl: 'https://github.com/huggingface/transformers',
    documentationUrl: 'https://huggingface.co/docs/transformers/main/en/tasks/summarization',
    implementationGuide: 'Paste complex text and our AI will rewrite it using simpler vocabulary and shorter sentences while preserving the original meaning.',
    accessibilityFeatures: ['Reading level indicators', 'Vocabulary simplification', 'Sentence structure optimization'],
    wcagCompliance: ['WCAG 2.1 AAA', 'Plain Language Guidelines'],
    supportedLanguages: ['English', 'Spanish', 'French'],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-11-28'),
    isActive: true
  },
  {
    id: 'ocr-text-recognition',
    name: 'OCR Text Recognition',
    description: 'Extract text from images, documents, and screenshots using advanced Optical Character Recognition. This tool makes printed text accessible by converting it to selectable, searchable digital text.',
    shortDescription: 'Extract text from images using OCR technology',
    category: 'visual',
    tags: ['ocr', 'text-extraction', 'document', 'accessibility', 'tesseract'],
    demoType: 'ocr',
    difficulty: 'beginner',
    popularity: 85,
    rating: 4.5,
    usageCount: 8920,
    githubUrl: 'https://github.com/tesseract-ocr/tesseract',
    documentationUrl: 'https://tesseract-ocr.github.io/',
    implementationGuide: 'Upload an image containing text and our OCR engine will extract all readable text, making it accessible for screen readers and text processing.',
    accessibilityFeatures: ['Text extraction', 'Font recognition', 'Layout preservation'],
    wcagCompliance: ['WCAG 2.1 AA', 'PDF/UA'],
    supportedLanguages: ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'],
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-11-25'),
    isActive: true
  },
  {
    id: 'text-to-speech',
    name: 'Text-to-Speech Synthesis',
    description: 'Convert written text into natural-sounding speech using advanced text-to-speech technology. This tool helps users with visual impairments or reading difficulties access written content through audio.',
    shortDescription: 'Convert text into natural-sounding speech',
    category: 'auditory',
    tags: ['tts', 'speech-synthesis', 'audio', 'accessibility', 'voice'],
    demoType: 'text-to-speech',
    difficulty: 'beginner',
    popularity: 90,
    rating: 4.7,
    usageCount: 11250,
    githubUrl: 'https://github.com/mozilla/TTS',
    documentationUrl: 'https://tts.readthedocs.io/',
    implementationGuide: 'Enter text and our TTS engine will generate natural-sounding speech with customizable voice options and speaking rates.',
    accessibilityFeatures: ['Natural voices', 'Speed control', 'Voice selection'],
    wcagCompliance: ['WCAG 2.1 AA', 'Section 508'],
    supportedLanguages: ['English', 'Spanish', 'French', 'German', 'Italian'],
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-11-20'),
    isActive: true
  },
  {
    id: 'color-contrast-checker',
    name: 'Color Contrast Checker',
    description: 'Analyze color combinations to ensure they meet WCAG accessibility standards. This tool helps designers and developers create visually accessible content by checking contrast ratios between foreground and background colors.',
    shortDescription: 'Check color contrast ratios for WCAG compliance',
    category: 'visual',
    tags: ['color', 'contrast', 'wcag', 'design', 'accessibility'],
    demoType: 'none',
    difficulty: 'beginner',
    popularity: 82,
    rating: 4.4,
    usageCount: 7640,
    githubUrl: 'https://github.com/colour-science/colour',
    documentationUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html',
    implementationGuide: 'Select or enter foreground and background colors to check if their contrast ratio meets WCAG AA (4.5:1) or AAA (7:1) standards.',
    accessibilityFeatures: ['WCAG compliance checking', 'Color picker', 'Ratio calculator'],
    wcagCompliance: ['WCAG 2.1 AA', 'WCAG 2.1 AAA'],
    supportedLanguages: ['Universal (Color-based)'],
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-11-15'),
    isActive: true
  }
]; 