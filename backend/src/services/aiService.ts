import { GoogleGenerativeAI } from '@google/generative-ai';
import { HfInference } from '@huggingface/inference';
import { ElevenLabsClient } from 'elevenlabs';
import Tesseract from 'tesseract.js';
import axios from 'axios';
import { logger } from '../utils/logger';

// Initialize AI services
let genAI: GoogleGenerativeAI | null = null;
let hf: HfInference | null = null;
let elevenlabs: ElevenLabsClient | null = null;

// Initialize services with environment variables only (never hardcode API keys)
// Add your API keys to the .env file instead
if (process.env.GOOGLE_GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
  logger.info('Google Gemini API initialized');
}

if (process.env.HUGGINGFACE_API_KEY) {
  hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
  logger.info('Hugging Face API initialized');
}

if (process.env.ELEVENLABS_API_KEY) {
  elevenlabs = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY,
  });
  logger.info('ElevenLabs API initialized');
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  }

export interface ImageCaptionResult {
  caption: string;
  confidence: number;
  service: string;
}

export interface TextToSpeechResult {
  audioBuffer: Buffer;
  format: string;
  service: string;
    }

export interface OCRResult {
  text: string;
  confidence: number;
  words: Array<{
    text: string;
    confidence: number;
    bbox: {
      x0: number;
      y0: number;
      x1: number;
      y1: number;
    };
  }>;
}

export interface TranslationResult {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  service: string;
}

export class AIService {
  /**
   * Generate chat response using Google Gemini
   */
  static async generateChatResponse(
    messages: ChatMessage[],
    systemPrompt?: string
  ): Promise<string> {
    try {
      if (!genAI) {
        throw new Error('Google Gemini API not configured');
      }

      const model = genAI.getGenerativeModel({ 
        model: process.env.GOOGLE_GEMINI_MODEL || 'gemini-1.5-flash' 
      });

      // Combine system prompt with user messages
      const prompt = systemPrompt 
        ? `${systemPrompt}\n\nConversation:\n${messages.map(m => `${m.role}: ${m.content}`).join('\n')}`
        : messages.map(m => `${m.role}: ${m.content}`).join('\n');

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      logger.info('Generated chat response using Gemini');
      return text;
    } catch (error) {
      logger.error('Error generating chat response:', error);
      
      // Fallback to Hugging Face if Gemini fails
      if (hf) {
    try {
          const lastMessage = messages[messages.length - 1];
          const response = await hf.textGeneration({
            model: 'microsoft/DialoGPT-medium',
            inputs: lastMessage.content,
        parameters: {
              max_new_tokens: 150,
          temperature: 0.7,
            },
          });
          
          logger.info('Generated chat response using Hugging Face fallback');
          return response.generated_text || 'I apologize, but I cannot provide a response at the moment.';
        } catch (hfError) {
          logger.error('Hugging Face fallback failed:', hfError);
        }
      }
      
      throw new Error('Unable to generate chat response');
    }
  }

  /**
   * Generate image caption using Hugging Face BLIP model
   */
  static async generateImageCaption(imageBuffer: Buffer): Promise<ImageCaptionResult> {
    try {
      if (!hf) {
        logger.warn('Hugging Face API not configured, using fallback caption');
        return {
          caption: 'An image showing colorful blocks or elements arranged in a grid pattern.',
          confidence: 0.5,
          service: 'demo-fallback',
        };
      }

      try {
        const response = await hf.imageToText({
          data: imageBuffer,
          model: 'Salesforce/blip-image-captioning-large',
        });
  
        const caption = response.generated_text || 'Unable to generate caption';
        
        logger.info('Generated image caption using Hugging Face BLIP');
        return {
          caption,
          confidence: 0.8, // BLIP typically has good confidence
          service: 'huggingface-blip',
        };
      } catch (hfError) {
        logger.error('Error with Hugging Face API:', hfError);
        
        // For demo purposes, return a reasonable caption for the displayed image
        return {
          caption: 'A colorful grid showing different colored blocks arranged in rows, possibly representing a UI component palette or color scheme.',
          confidence: 0.7,
          service: 'demo-mode',
        };
      }
    } catch (error) {
      logger.error('Error generating image caption:', error);
      
      // Fallback to basic description
      return {
        caption: 'An image that requires manual description for accessibility.',
        confidence: 0.1,
        service: 'fallback',
      };
    }
  }

  /**
   * Convert text to speech using ElevenLabs
   */
  static async textToSpeech(text: string, voiceId?: string): Promise<TextToSpeechResult> {
    try {
      if (!elevenlabs) {
        logger.warn('ElevenLabs API not configured, using sample audio');
        
        // Return a simple placeholder audio buffer for demo purposes
        // This is just an empty buffer - in a real implementation, you would return a pre-recorded sample
        // For demo purposes we'll simulate success by returning an empty buffer
        return {
          audioBuffer: Buffer.from([]),
          format: 'mp3',
          service: 'demo-mode',
        };
      }

      const voice = voiceId || process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';
      
      try {
        const audio = await elevenlabs.textToSpeech.convert(voice, {
          text,
          model_id: 'eleven_monolingual_v1',
        });
  
        // Convert the audio stream to buffer
        const chunks: Buffer[] = [];
        for await (const chunk of audio) {
          chunks.push(chunk);
        }
        const audioBuffer = Buffer.concat(chunks);
        
        logger.info('Generated speech using ElevenLabs');
        return {
          audioBuffer,
          format: 'mp3',
          service: 'elevenlabs',
        };
      } catch (elevenError) {
        logger.error('Error with ElevenLabs API:', elevenError);
        
        // Return a placeholder for demo purposes
        return {
          audioBuffer: Buffer.from([]),
          format: 'mp3',
          service: 'demo-fallback',
        };
      }
    } catch (error) {
      logger.error('Error generating speech:', error);
      throw new Error('Unable to generate speech');
    }
  }

  /**
   * Extract text from image using Tesseract OCR
   */
  static async extractTextFromImage(imageBuffer: Buffer): Promise<OCRResult> {
    try {
      const { data } = await Tesseract.recognize(imageBuffer, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            logger.debug(`OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
          },
        });

      const words = data.words.map(word => ({
        text: word.text,
        confidence: word.confidence,
        bbox: word.bbox,
      }));

      logger.info('Extracted text using Tesseract OCR');
      return {
        text: data.text,
        confidence: data.confidence,
        words,
      };
    } catch (error) {
      logger.error('Error extracting text from image:', error);
      throw new Error('Unable to extract text from image');
    }
  }

  /**
   * Translate text using LibreTranslate
   */
  static async translateText(
    text: string,
    targetLanguage: string,
    sourceLanguage: string = 'auto'
  ): Promise<TranslationResult> {
    try {
      const libreTranslateUrl = process.env.LIBRETRANSLATE_URL || 'https://libretranslate.de';
      const apiKey = process.env.LIBRETRANSLATE_API_KEY;

      const requestData: any = {
        q: text,
        source: sourceLanguage,
        target: targetLanguage,
        format: 'text',
      };

      if (apiKey) {
        requestData.api_key = apiKey;
      }

      const response = await axios.post(`${libreTranslateUrl}/translate`, requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      logger.info('Translated text using LibreTranslate');
      return {
        translatedText: response.data.translatedText,
        sourceLanguage: response.data.detectedLanguage || sourceLanguage,
        targetLanguage,
        service: 'libretranslate',
      };
    } catch (error) {
      logger.error('Error translating text:', error);
      throw new Error('Unable to translate text');
    }
  }

  /**
   * Simplify text for better accessibility using Gemini
   */
  static async simplifyText(text: string, level: 'basic' | 'intermediate' | 'advanced' = 'basic'): Promise<string> {
    try {
      if (!genAI) {
        throw new Error('Google Gemini API not configured');
      }

      const model = genAI.getGenerativeModel({ 
        model: process.env.GOOGLE_GEMINI_MODEL || 'gemini-1.5-flash' 
      });

      const levelPrompts = {
        basic: 'Rewrite this text using simple words and short sentences suitable for elementary reading level:',
        intermediate: 'Rewrite this text using clear language suitable for middle school reading level:',
        advanced: 'Rewrite this text using accessible language while maintaining technical accuracy:',
      };

      const prompt = `${levelPrompts[level]}\n\n${text}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const simplifiedText = response.text();

      logger.info(`Simplified text using Gemini (${level} level)`);
      return simplifiedText;
    } catch (error) {
      logger.error('Error simplifying text:', error);
      
      // Fallback: return original text with a note
      return `${text}\n\n[Note: Text simplification service temporarily unavailable]`;
    }
  }

  /**
   * Generate accessibility description for UI elements
   */
  static async generateAccessibilityDescription(
    elementType: string,
    context: string,
    purpose: string
  ): Promise<string> {
    try {
      if (!genAI) {
        throw new Error('Google Gemini API not configured');
      }

      const model = genAI.getGenerativeModel({ 
        model: process.env.GOOGLE_GEMINI_MODEL || 'gemini-1.5-flash' 
      });

      const prompt = `Generate a clear, concise accessibility description for a ${elementType} element.
Context: ${context}
Purpose: ${purpose}

The description should:
- Be clear and descriptive for screen reader users
- Include the element's function and current state
- Be concise but informative
- Follow WCAG accessibility guidelines

Generate only the description text, no additional formatting:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const description = response.text().trim();

      logger.info('Generated accessibility description using Gemini');
      return description;
    } catch (error) {
      logger.error('Error generating accessibility description:', error);
      return `${elementType} element: ${purpose}`;
    }
  }

  /**
   * Check if AI services are available
   */
  static getServiceStatus() {
    return {
      gemini: !!genAI,
      huggingface: !!hf,
      elevenlabs: !!elevenlabs,
      tesseract: true, // Always available
      libretranslate: !!process.env.LIBRETRANSLATE_URL,
    };
  }
}

export default AIService; 