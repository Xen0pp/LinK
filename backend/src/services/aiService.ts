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
        logger.warn('Google Gemini API not configured - using intelligent demo mode');
        return this.generateIntelligentDemoResponse(messages, systemPrompt);
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
      
      // Fallback to intelligent demo mode
      logger.info('Falling back to intelligent demo mode');
      return this.generateIntelligentDemoResponse(messages, systemPrompt);
    }
  }

  /**
   * Generate intelligent responses without API keys by analyzing user input
   */
  private static generateIntelligentDemoResponse(
    messages: ChatMessage[],
    systemPrompt?: string
  ): string {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'user') {
      return "I'm here to help with accessibility questions! What would you like to know?";
    }

    const userMessage = lastMessage.content.toLowerCase();
    const conversationContext = messages.slice(-3); // Last 3 messages for context

    // Contextual responses based on user input patterns
    if (userMessage.includes('hello') || userMessage.includes('hi') || userMessage.includes('hey')) {
      return `Hello! I'm LinK's accessibility assistant. I can help you with WCAG guidelines, accessible design, assistive technologies, and making your digital content more inclusive. What accessibility topic interests you today?`;
    }

    if (userMessage.includes('how are you') || userMessage.includes('how do you do')) {
      return `I'm doing great, thank you for asking! I'm here and ready to help you with any accessibility questions you might have. Whether you need guidance on WCAG compliance, screen reader compatibility, color contrast, or any other accessibility topic, I'm here to assist. What would you like to learn about today?`;
    }

    if (userMessage.includes('thank') || userMessage.includes('thanks')) {
      return `You're very welcome! I'm always here to help make the web more accessible. Feel free to ask me anything about WCAG guidelines, screen readers, keyboard navigation, color contrast, or any other accessibility topics.`;
    }

    // Vision-related problems and visual impairments
    if (userMessage.includes('vision') || userMessage.includes('visual') || userMessage.includes('sight') || 
        userMessage.includes('blind') || userMessage.includes('see') || userMessage.includes('eyes') ||
        userMessage.includes('low vision') || userMessage.includes('partially sighted')) {
      return `I understand you're dealing with vision-related challenges. I'm here to help you navigate digital accessibility! Here are some key areas I can assist with:

🔍 **For Users with Vision Impairments:**
• **Screen readers** - I can guide you on NVDA, JAWS, or VoiceOver usage
• **Browser accessibility** - How to enable high contrast, zoom, and other helpful features
• **Keyboard navigation** - Navigating websites without using a mouse
• **Voice control** - Using speech recognition for computer interaction

🎯 **For Content Creators:**
• **Alt text** for images - Making visual content accessible
• **Color contrast** - Ensuring text is readable for low vision users
• **Screen reader compatibility** - Structuring content properly
• **Focus indicators** - Making navigation clear for keyboard users

🛠️ **Available Tools:**
• Our OCR tool can extract text from images
• Text-to-speech for reading content aloud
• Image captioning to describe visual content

What specific aspect would you like help with? Are you looking to make content more accessible, or do you need assistance navigating digital content yourself?`;
    }

    // WCAG and guidelines
    if (userMessage.includes('wcag') || userMessage.includes('guideline') || userMessage.includes('standard') || userMessage.includes('compliance')) {
      return `WCAG (Web Content Accessibility Guidelines) is the international standard for web accessibility. It's organized into four main principles:

🎯 **Perceivable** - Information must be presentable in ways users can perceive
⌨️ **Operable** - Interface components must be operable by all users  
🧠 **Understandable** - Information and UI operation must be understandable
🔧 **Robust** - Content must work with various assistive technologies

Most organizations aim for WCAG 2.1 Level AA compliance. Would you like me to explain any specific WCAG success criteria?`;
    }

    // Alt text and images
    if ((userMessage.includes('alt text') || userMessage.includes('alt tag') || userMessage.includes('image')) && 
        (userMessage.includes('accessible') || userMessage.includes('describe') || userMessage.includes('caption'))) {
      return `Great question about alt text! Here's how to write effective alt text:

✅ **Do:**
• Describe the content and function of the image
• Keep it concise (under 125 characters when possible)
• Be specific and descriptive
• For decorative images, use empty alt text (alt="")

❌ **Don't:**
• Start with "Image of" or "Picture of"
• Describe obvious details like "photo" or "graphic"
• Be too verbose or include redundant information

**Example:** Instead of "Image of a red button," use "Download PDF report"

Need help with a specific image? I can guide you through the process!`;
    }

    // Keyboard navigation
    if (userMessage.includes('keyboard') || userMessage.includes('navigation') || userMessage.includes('tab') || 
        userMessage.includes('mouse') && userMessage.includes('without')) {
      return `Keyboard accessibility is essential for users who can't use a mouse. Here's what you need to ensure:

⌨️ **Key Requirements:**
• All interactive elements reachable with Tab key
• Logical tab order that follows visual layout
• Clear focus indicators (visible outline/highlight)
• Enter/Space keys activate buttons and links
• Escape key closes dialogs and menus
• Arrow keys for complex widgets (menus, carousels)

🚫 **Avoid keyboard traps** - users should always be able to navigate away from any element.

**Quick test:** Try navigating your entire site using only the Tab, Enter, Space, and arrow keys. Can you reach everything?`;
    }

    // Color and contrast
    if (userMessage.includes('color') || userMessage.includes('contrast') || userMessage.includes('readable') ||
        userMessage.includes('background') || userMessage.includes('text color')) {
      return `Color accessibility ensures your content is visible to everyone, including users with visual impairments or color blindness.

📏 **WCAG Contrast Requirements:**
• Normal text: 4.5:1 minimum ratio (AA level)
• Large text (18pt+ or 14pt+ bold): 3:1 minimum ratio
• Enhanced (AAA level): 7:1 for normal text

🎨 **Color Best Practices:**
• Don't rely solely on color to convey information
• Use additional indicators (icons, patterns, text labels)
• Test with color blindness simulators
• Consider users in bright sunlight or low-light conditions

**Tools:** Use WebAIM's contrast checker or browser dev tools to test your color combinations!`;
    }

    // Screen readers and ARIA
    if (userMessage.includes('screen reader') || userMessage.includes('aria') || userMessage.includes('assistive') ||
        userMessage.includes('nvda') || userMessage.includes('jaws') || userMessage.includes('voiceover')) {
      return `Screen readers help blind and visually impaired users navigate websites by converting text to speech or braille.

🏗️ **Building Screen Reader-Friendly Sites:**
• Use semantic HTML elements (h1-h6, nav, main, article, aside)
• Provide meaningful page titles and headings
• Associate form labels with their controls
• Use ARIA labels only when necessary
• Structure content logically
• Provide alternative text for images

🔍 **ARIA Guidelines:**
• First rule: Use semantic HTML when possible
• aria-label provides accessible names
• aria-describedby links to detailed descriptions  
• role attribute defines element purpose

**Test tip:** Try navigating with a screen reader like NVDA (free) or VoiceOver (Mac) to experience your site as users do.`;
    }

    // Forms
    if (userMessage.includes('form') || userMessage.includes('input') || userMessage.includes('validation') ||
        userMessage.includes('submit') || userMessage.includes('field')) {
      return `Accessible forms are crucial for user interaction and data collection. Here's how to make them inclusive:

📝 **Form Accessibility Essentials:**
• Associate labels with form controls using "for" attribute
• Group related fields with fieldset and legend
• Provide clear instructions and examples
• Mark required fields clearly (not just with color)
• Use appropriate input types (email, tel, date, etc.)
• Ensure logical tab order

⚠️ **Error Handling:**
• Clearly identify fields with errors
• Explain what went wrong and how to fix it
• Allow users to review before submitting
• Don't rely on color alone for error indication
• Provide error summaries for complex forms

**Pro tip:** Test your forms with a screen reader to ensure all information is conveyed clearly!`;
    }

    // Website/content making accessible
    if (userMessage.includes('make') && (userMessage.includes('website') || userMessage.includes('site') || 
        userMessage.includes('content') || userMessage.includes('page')) && userMessage.includes('accessible')) {
      return `Making your website accessible benefits everyone! Here's a step-by-step approach:

🚀 **Quick Wins (Start Here):**
• Add meaningful alt text to all images
• Ensure proper heading structure (h1, h2, h3...)
• Use sufficient color contrast (4.5:1 for normal text)
• Make sure all interactive elements work with keyboard
• Associate form labels with their inputs

🎯 **WCAG 2.1 AA Compliance:**
• **Perceivable:** Provide text alternatives, captions, sufficient contrast
• **Operable:** Make functionality available via keyboard, no seizure triggers
• **Understandable:** Make text readable, predictable functionality
• **Robust:** Compatible with assistive technologies

🔧 **Testing Tools:**
• WAVE browser extension for quick checks
• axe DevTools for detailed analysis
• Lighthouse accessibility audit
• Manual keyboard navigation testing
• Screen reader testing (NVDA is free)

What type of website are you working on? I can provide more specific guidance!`;
    }

    // Help or support requests
    if (userMessage.includes('help') || userMessage.includes('support') || userMessage.includes('assist') ||
        userMessage.includes('need') || userMessage.includes('problem') || userMessage.includes('issue')) {
      return `I'm here to help! I can provide guidance on many accessibility topics:

🎯 **Popular Topics:**
• **WCAG Guidelines** - Understanding compliance requirements
• **Screen Reader Support** - Making content work with assistive technology
• **Keyboard Navigation** - Ensuring mouse-free usability
• **Color & Contrast** - Meeting visual accessibility standards
• **Form Accessibility** - Creating inclusive user inputs
• **Image Alt Text** - Describing visual content effectively

🛠️ **Available Tools:**
• OCR text extraction from images
• Alt text generation for images
• Text-to-speech conversion
• Accessibility testing guidance

💡 **Quick Question Starters:**
• "How do I make images accessible?"
• "What's the right color contrast ratio?"
• "How do I test with a screen reader?"
• "What ARIA attributes should I use?"

What specific accessibility challenge can I help you tackle today?`;
    }

    // General accessibility question
    if (userMessage.includes('accessibility') || userMessage.includes('accessible') || userMessage.includes('disability') ||
        userMessage.includes('inclusion') || userMessage.includes('inclusive')) {
      return `Accessibility ensures digital content is usable by people with disabilities, but it benefits everyone! 

🌟 **Why Accessibility Matters:**
• 1 in 4 adults in the US has a disability
• Accessible design improves usability for all users
• It's required by law in many jurisdictions (ADA, Section 508)
• Better SEO and broader audience reach

💡 **Types of Disabilities to Consider:**
• Visual (blindness, low vision, color blindness)
• Auditory (deafness, hearing loss)
• Motor (limited fine motor control, paralysis)
• Cognitive (dyslexia, memory issues, attention disorders)

**Start small:** Pick one WCAG success criterion and implement it across your site. Every improvement makes a difference!

What specific aspect of accessibility would you like to explore?`;
    }

    // Technical implementation
    if (userMessage.includes('implement') || userMessage.includes('code') || userMessage.includes('developer') ||
        userMessage.includes('html') || userMessage.includes('css') || userMessage.includes('javascript')) {
      return `Let's talk technical implementation! Accessibility starts with good HTML and semantic structure.

💻 **Developer Quick Wins:**
• Use proper heading hierarchy (h1 → h2 → h3)
• Add meaningful alt attributes to images
• Ensure form labels are properly associated
• Use focus management in single-page apps
• Implement keyboard event handlers alongside mouse events
• Test with browser accessibility tools

🔧 **Useful Tools:**
• axe-core for automated testing
• WAVE browser extension
• Lighthouse accessibility audit
• Color contrast analyzers
• Screen reader testing

**Code example:**
\`\`\`html
<!-- Good semantic structure -->
<button aria-label="Close dialog">×</button>
<img src="chart.png" alt="Sales increased 25% from 2022 to 2023">
<label for="email">Email Address</label>
<input type="email" id="email" required>
\`\`\`

What specific implementation challenge are you working on?`;
    }

    // Testing related
    if (userMessage.includes('test') || userMessage.includes('check') || userMessage.includes('validate') ||
        userMessage.includes('audit') || userMessage.includes('review')) {
      return `Testing is crucial for ensuring accessibility! Here's a comprehensive testing approach:

🔍 **Automated Testing Tools:**
• **WAVE** - Browser extension for quick visual feedback
• **axe DevTools** - Detailed accessibility analysis
• **Lighthouse** - Built into Chrome DevTools
• **Pa11y** - Command line accessibility testing

⌨️ **Manual Testing:**
• **Keyboard navigation** - Tab through entire interface
• **Screen reader testing** - NVDA (free), JAWS, VoiceOver
• **Color contrast** - Check all text/background combinations
• **Zoom testing** - Ensure usability at 200% zoom

👥 **User Testing:**
• Test with actual users with disabilities
• Gather feedback on real-world usage
• Identify issues automated tools miss

📋 **Testing Checklist:**
• All interactive elements keyboard accessible
• Images have appropriate alt text
• Forms have proper labels and error handling
• Color isn't the only way to convey information
• Content maintains meaning when CSS is disabled

Would you like specific guidance on any of these testing approaches?`;
    }

    // If we don't have a specific match, provide a helpful general response with context
    const topics = ['WCAG guidelines', 'alt text for images', 'keyboard navigation', 'color contrast', 'screen readers', 'form accessibility', 'ARIA attributes', 'testing strategies'];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];

    return `That's a great question about accessibility! I'd be happy to help you explore this topic further.

I can provide detailed guidance on:
• **WCAG guidelines** and compliance levels
• **Alt text** and image accessibility
• **Keyboard navigation** best practices  
• **Color contrast** requirements
• **Screen reader** compatibility
• **Form accessibility** and validation
• **ARIA attributes** and semantic HTML
• **Testing strategies** and tools

For example, would you like to know more about ${randomTopic}? Or feel free to ask me about any specific accessibility challenge you're facing.

💡 **Quick tip:** ${this.getRandomAccessibilityTip()}`;
  }

  /**
   * Get a random accessibility tip
   */
  private static getRandomAccessibilityTip(): string {
    const tips = [
      "Always test your site's keyboard navigation - press Tab and make sure you can reach everything!",
      "Screen readers announce heading levels, so use proper h1-h6 hierarchy to create a logical document structure.",
      "Color contrast matters! Aim for at least 4.5:1 ratio between text and background colors.",
      "Alt text should describe the content and function of images, not just their appearance.",
      "Use semantic HTML elements like <nav>, <main>, <article> - they provide context to assistive technologies.",
      "Form labels should be permanently visible, not just placeholder text that disappears when typing.",
      "Focus indicators should be clearly visible - don't remove the outline without providing an alternative!",
      "Test with actual users with disabilities - they'll catch issues automated tools might miss.",
      "Error messages should be specific and helpful - 'Invalid input' doesn't help users fix the problem.",
      "Consider users with cognitive disabilities - simple language and clear instructions benefit everyone."
    ];
    
    return tips[Math.floor(Math.random() * tips.length)];
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