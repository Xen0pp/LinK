import express from 'express';
import { body, validationResult } from 'express-validator';
import { AIService, ChatMessage } from '../services/aiService';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = express.Router();

// System prompt for accessibility-focused conversations
const ACCESSIBILITY_SYSTEM_PROMPT = `You are an expert accessibility consultant and assistant. Your role is to provide helpful, accurate, and practical advice about:

- Web Content Accessibility Guidelines (WCAG) 2.1 and 2.2
- Assistive technologies (screen readers, voice recognition, etc.)
- Inclusive design principles
- Accessibility testing and auditing
- Legal compliance (ADA, Section 508, etc.)
- Accessibility best practices for developers and designers

Guidelines for your responses:
1. Be clear, concise, and actionable
2. Provide specific examples when possible
3. Reference WCAG guidelines when relevant
4. Consider different types of disabilities (visual, auditory, motor, cognitive)
5. Suggest practical implementation steps
6. Be encouraging and supportive
7. If you're unsure about something, say so and suggest reliable resources

Always prioritize user experience and real-world accessibility over technical compliance alone.`;

/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Chat with accessibility AI assistant
 *     description: Get expert advice on accessibility topics from an AI assistant
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: User's question or message
 *               context:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       enum: [user, assistant, system]
 *                     content:
 *                       type: string
 *                 description: Previous conversation context (optional)
 *             required:
 *               - message
 *     responses:
 *       200:
 *         description: AI response generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 response:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
router.post('/', [
  body('message').notEmpty().withMessage('Message is required'),
  body('message').isLength({ max: 2000 }).withMessage('Message too long (max 2000 characters)'),
  body('context').optional().isArray().withMessage('Context must be an array'),
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { message, context = [] } = req.body;

  try {
    // Build conversation history
    const messages: ChatMessage[] = [
      ...context.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: 'user' as const,
      content: message,
      },
    ];

    // Generate response using AI service
    const response = await AIService.generateChatResponse(messages, ACCESSIBILITY_SYSTEM_PROMPT);

    logger.info(`Generated chat response for: ${message.substring(0, 50)}...`);

    res.json({
      success: true,
      response,
      timestamp: new Date().toISOString(),
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    });
  } catch (error) {
    logger.error('Chat error:', error);
    
    // Provide a helpful fallback response
    const fallbackResponse = getFallbackResponse(message);
    
    res.json({
      success: true,
      response: fallbackResponse,
      timestamp: new Date().toISOString(),
      fallback: true,
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    });
  }
}));

/**
 * @swagger
 * /api/chat/quick-help:
 *   get:
 *     summary: Get quick accessibility help topics
 *     description: Returns common accessibility questions and topics for quick reference
 *     tags: [Chat]
 *     responses:
 *       200:
 *         description: Quick help topics retrieved successfully
 */
router.get('/quick-help', asyncHandler(async (req, res) => {
  const quickHelpTopics = [
    {
      category: 'Images & Media',
      topics: [
        {
          question: 'How do I write good alt text?',
          shortAnswer: 'Describe the content and function of the image concisely. For decorative images, use empty alt text.',
          keywords: ['alt text', 'images', 'description'],
        },
        {
          question: 'What about videos and audio?',
          shortAnswer: 'Provide captions for videos and transcripts for audio content.',
          keywords: ['video', 'audio', 'captions', 'transcripts'],
        },
      ],
    },
    {
      category: 'Navigation & Interaction',
      topics: [
        {
          question: 'How do I make my site keyboard accessible?',
          shortAnswer: 'Ensure all interactive elements can be reached and used with Tab, Enter, Space, and arrow keys.',
          keywords: ['keyboard', 'navigation', 'focus'],
        },
        {
          question: 'What are ARIA labels?',
          shortAnswer: 'ARIA labels provide accessible names for elements that screen readers can announce.',
          keywords: ['aria', 'labels', 'screen readers'],
        },
      ],
    },
    {
      category: 'Visual Design',
      topics: [
        {
          question: 'What color contrast do I need?',
          shortAnswer: 'WCAG AA requires 4.5:1 for normal text and 3:1 for large text.',
          keywords: ['color', 'contrast', 'wcag'],
        },
        {
          question: 'Can I use color alone to convey information?',
          shortAnswer: 'No, always provide additional indicators like text, icons, or patterns.',
          keywords: ['color', 'information', 'indicators'],
        },
      ],
    },
    {
      category: 'Forms & Input',
      topics: [
        {
          question: 'How do I make forms accessible?',
          shortAnswer: 'Use proper labels, provide clear instructions, and indicate required fields.',
          keywords: ['forms', 'labels', 'validation'],
        },
        {
          question: 'How should I handle form errors?',
          shortAnswer: 'Clearly identify errors, explain what went wrong, and suggest how to fix them.',
          keywords: ['errors', 'validation', 'feedback'],
        },
      ],
    },
  ];

  res.json({
    success: true,
    topics: quickHelpTopics,
    timestamp: new Date().toISOString(),
    });
}));

/**
 * @swagger
 * /api/chat/wcag-lookup:
 *   get:
 *     summary: Look up WCAG guidelines
 *     description: Search for specific WCAG guidelines and success criteria
 *     tags: [Chat]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search term for WCAG guidelines
 *     responses:
 *       200:
 *         description: WCAG guidelines found
 */
router.get('/wcag-lookup', asyncHandler(async (req, res) => {
  const { query } = req.query;
  
  // Basic WCAG guideline lookup
  const wcagGuidelines = [
    {
      number: '1.1.1',
      title: 'Non-text Content',
      level: 'A',
      description: 'All non-text content has a text alternative that serves the equivalent purpose.',
      keywords: ['images', 'alt text', 'media', 'content'],
    },
    {
      number: '1.4.3',
      title: 'Contrast (Minimum)',
      level: 'AA',
      description: 'Text has a contrast ratio of at least 4.5:1 (or 3:1 for large text).',
      keywords: ['color', 'contrast', 'text', 'visual'],
    },
    {
      number: '2.1.1',
      title: 'Keyboard',
      level: 'A',
      description: 'All functionality is available from a keyboard.',
      keywords: ['keyboard', 'navigation', 'interaction'],
    },
    {
      number: '2.4.6',
      title: 'Headings and Labels',
      level: 'AA',
      description: 'Headings and labels describe topic or purpose.',
      keywords: ['headings', 'labels', 'structure', 'navigation'],
    },
    {
      number: '3.2.2',
      title: 'On Input',
      level: 'A',
      description: 'Changing the setting of any user interface component does not automatically cause a change of context.',
      keywords: ['forms', 'input', 'context', 'predictable'],
    },
    {
      number: '4.1.2',
      title: 'Name, Role, Value',
      level: 'A',
      description: 'For all user interface components, the name and role can be programmatically determined.',
      keywords: ['aria', 'semantic', 'assistive technology'],
    },
  ];

  let results = wcagGuidelines;
  
  if (query && typeof query === 'string') {
    const searchTerm = query.toLowerCase();
    results = wcagGuidelines.filter(guideline => 
      guideline.title.toLowerCase().includes(searchTerm) ||
      guideline.description.toLowerCase().includes(searchTerm) ||
      guideline.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm)) ||
      guideline.number.includes(searchTerm)
    );
  }

  res.json({
        success: true,
    query: query || 'all',
    results,
    total: results.length,
    timestamp: new Date().toISOString(),
  });
}));

// Fallback responses for when AI services are unavailable
function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('alt text') || lowerMessage.includes('image')) {
    return `Alt text should be descriptive and concise, explaining the content and function of images. For decorative images, use empty alt text (alt=""). 

Key tips:
• Describe what's important about the image
• Keep it under 125 characters when possible
• Don't start with "Image of" or "Picture of"
• For complex images, consider a longer description

You can use our image captioning tool to help generate alt text automatically!`;
  }
  
  if (lowerMessage.includes('keyboard') || lowerMessage.includes('navigation')) {
    return `Keyboard accessibility ensures all users can navigate your site without a mouse.

Essential requirements:
• All interactive elements must be reachable with Tab
• Use Enter/Space to activate buttons and links
• Provide clear focus indicators
• Ensure logical tab order
• Avoid keyboard traps
• Support arrow keys for complex widgets

Test by navigating your entire site using only the keyboard!`;
  }
  
  if (lowerMessage.includes('color') || lowerMessage.includes('contrast')) {
    return `Color contrast is crucial for users with visual impairments.

WCAG requirements:
• Normal text: 4.5:1 contrast ratio (AA level)
• Large text (18pt+ or 14pt+ bold): 3:1 ratio
• Enhanced (AAA level): 7:1 for normal, 4.5:1 for large

Additional tips:
• Don't rely solely on color to convey information
• Use patterns, icons, or text labels as well
• Test with color blindness simulators
• Consider users in bright sunlight or low-light conditions`;
  }
  
  if (lowerMessage.includes('screen reader') || lowerMessage.includes('aria')) {
    return `Screen readers help blind and visually impaired users navigate websites.

Best practices:
• Use semantic HTML elements (headings, lists, buttons)
• Provide descriptive ARIA labels when needed
• Structure content with proper headings (h1-h6)
• Use landmarks (main, nav, aside, footer)
• Ensure form labels are properly associated
• Test with actual screen readers (NVDA, JAWS, VoiceOver)

Remember: Good semantic HTML often eliminates the need for complex ARIA!`;
  }
  
  if (lowerMessage.includes('wcag') || lowerMessage.includes('guidelines')) {
    return `WCAG (Web Content Accessibility Guidelines) provides the foundation for web accessibility.

Key levels:
• Level A: Basic accessibility (minimum level)
• Level AA: Standard compliance (recommended target)
• Level AAA: Enhanced accessibility (not required for entire sites)

Four principles (POUR):
• Perceivable: Information must be presentable to users
• Operable: Interface components must be operable
• Understandable: Information and UI operation must be understandable
• Robust: Content must be robust enough for various assistive technologies

Most organizations aim for WCAG 2.1 AA compliance.`;
  }
  
  if (lowerMessage.includes('form') || lowerMessage.includes('input')) {
    return `Accessible forms are essential for user interaction.

Key requirements:
• Associate labels with form controls using 'for' attribute
• Provide clear instructions and examples
• Mark required fields clearly
• Group related fields with fieldset/legend
• Provide helpful error messages
• Don't rely on placeholder text alone
• Ensure logical tab order

Error handling:
• Clearly identify which fields have errors
• Explain what went wrong
• Suggest how to fix the problem
• Allow users to review and correct before submitting`;
    }

  return `Hi there! I'm here to help with your accessibility questions. I can guide you with:

🎯 WCAG Guidelines - I can explain how to implement accessibility standards
🖼️ Images & Media - Let me help with alt text, captions, and audio descriptions  
⌨️ Keyboard Navigation - I'll show you how to make sites usable without a mouse
🎨 Visual Design - We can discuss color contrast, focus indicators, and clarity
📝 Forms & Input - I can guide you on accessible form design and error handling
🔧 Assistive Technology - Let's talk about screen readers and voice recognition
⚖️ Legal Compliance - I can explain ADA, Section 508, and accessibility laws

You can also try our helpful tools:
• Image captioning to generate alt text
• Text simplification for better readability
• OCR to extract text from images
• Text-to-speech conversion

What accessibility topic would you like to talk about today?`;
  }

export default router; 