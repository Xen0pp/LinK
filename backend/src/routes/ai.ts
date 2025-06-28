import express from 'express';
import multer from 'multer';
import { body, validationResult } from 'express-validator';
import { AIService } from '../services/aiService';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'audio/wav',
      'audio/mp3',
      'audio/ogg',
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
      cb(new Error('File type not allowed'));
    }
  },
});

/**
 * @swagger
 * /api/ai/image-caption:
 *   post:
 *     summary: Generate image caption for accessibility
 *     description: Upload an image and get an AI-generated caption for alt text
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to caption
 *     responses:
 *       200:
 *         description: Image caption generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 caption:
 *                   type: string
 *                 confidence:
 *                   type: number
 *                 service:
 *                   type: string
 *       400:
 *         description: No image provided or invalid file
 *       500:
 *         description: Server error
 */
router.post('/image-caption', upload.single('image'), asyncHandler(async (req, res) => {
    if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'No image file provided',
    });
    }

  try {
    const result = await AIService.generateImageCaption(req.file.buffer);
    
    logger.info(`Generated image caption: ${result.caption.substring(0, 50)}...`);

    res.json({
      success: true,
      caption: result.caption,
      confidence: result.confidence,
      service: result.service,
      filename: req.file.originalname,
    });
  } catch (error) {
    logger.error('Image caption error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate image caption',
    });
  }
}));

/**
 * @swagger
 * /api/ai/text-to-speech:
 *   post:
 *     summary: Convert text to speech
 *     description: Generate audio from text using AI voice synthesis
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: Text to convert to speech
 *               voiceId:
 *                 type: string
 *                 description: Optional voice ID for ElevenLabs
 *             required:
 *               - text
 *     responses:
 *       200:
 *         description: Audio generated successfully
 *         content:
 *           audio/mpeg:
 *             schema:
 *               type: string
 *               format: binary
 */
router.post('/text-to-speech', [
  body('text').notEmpty().withMessage('Text is required'),
  body('text').isLength({ max: 5000 }).withMessage('Text too long (max 5000 characters)'),
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { text, voiceId } = req.body;

  try {
    const result = await AIService.textToSpeech(text, voiceId);
    
    logger.info(`Generated speech for text: ${text.substring(0, 50)}...`);
    
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': result.audioBuffer.length.toString(),
      'Content-Disposition': 'attachment; filename="speech.mp3"',
    });
    
    res.send(result.audioBuffer);
  } catch (error) {
    logger.error('Text-to-speech error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate speech',
    });
  }
}));

/**
 * @swagger
 * /api/ai/ocr:
 *   post:
 *     summary: Extract text from image using OCR
 *     description: Upload an image and extract text content for accessibility
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to extract text from
 *     responses:
 *       200:
 *         description: Text extracted successfully
 */
router.post('/ocr', upload.single('image'), asyncHandler(async (req, res) => {
    if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'No image file provided',
    });
    }

  try {
    const result = await AIService.extractTextFromImage(req.file.buffer);
    
    logger.info(`Extracted text from image: ${result.text.substring(0, 50)}...`);

    res.json({
      success: true,
      text: result.text,
      confidence: result.confidence,
      words: result.words,
      filename: req.file.originalname,
    });
  } catch (error) {
    logger.error('OCR error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to extract text from image',
    });
  }
}));

/**
 * @swagger
 * /api/ai/translate:
 *   post:
 *     summary: Translate text to another language
 *     description: Translate text using free translation services
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: Text to translate
 *               targetLanguage:
 *                 type: string
 *                 description: Target language code (e.g., 'es', 'fr', 'de')
 *               sourceLanguage:
 *                 type: string
 *                 description: Source language code (optional, defaults to auto-detect)
 *             required:
 *               - text
 *               - targetLanguage
 */
router.post('/translate', [
  body('text').notEmpty().withMessage('Text is required'),
  body('targetLanguage').notEmpty().withMessage('Target language is required'),
  body('text').isLength({ max: 10000 }).withMessage('Text too long (max 10000 characters)'),
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
    }

  const { text, targetLanguage, sourceLanguage = 'auto' } = req.body;

  try {
    const result = await AIService.translateText(text, targetLanguage, sourceLanguage);
    
    logger.info(`Translated text from ${result.sourceLanguage} to ${result.targetLanguage}`);

    res.json({
      success: true,
      translatedText: result.translatedText,
      sourceLanguage: result.sourceLanguage,
      targetLanguage: result.targetLanguage,
      service: result.service,
    });
  } catch (error) {
    logger.error('Translation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to translate text',
    });
  }
}));

/**
 * @swagger
 * /api/ai/simplify:
 *   post:
 *     summary: Simplify text for better accessibility
 *     description: Rewrite text in simpler language for better comprehension
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: Text to simplify
 *               level:
 *                 type: string
 *                 enum: [basic, intermediate, advanced]
 *                 description: Simplification level
 *             required:
 *               - text
 */
router.post('/simplify', [
  body('text').notEmpty().withMessage('Text is required'),
  body('text').isLength({ max: 5000 }).withMessage('Text too long (max 5000 characters)'),
  body('level').optional().isIn(['basic', 'intermediate', 'advanced']).withMessage('Invalid level'),
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
    }

  const { text, level = 'basic' } = req.body;

  try {
    const simplifiedText = await AIService.simplifyText(text, level);
    
    logger.info(`Simplified text at ${level} level`);

    res.json({
      success: true,
      originalText: text,
      simplifiedText,
      level,
    });
  } catch (error) {
    logger.error('Text simplification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to simplify text',
    });
  }
}));

/**
 * @swagger
 * /api/ai/accessibility-description:
 *   post:
 *     summary: Generate accessibility description for UI elements
 *     description: Create WCAG-compliant descriptions for UI components
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               elementType:
 *                 type: string
 *                 description: Type of UI element (button, input, etc.)
 *               context:
 *                 type: string
 *                 description: Context where the element appears
 *               purpose:
 *                 type: string
 *                 description: Purpose or function of the element
 *             required:
 *               - elementType
 *               - context
 *               - purpose
 */
router.post('/accessibility-description', [
  body('elementType').notEmpty().withMessage('Element type is required'),
  body('context').notEmpty().withMessage('Context is required'),
  body('purpose').notEmpty().withMessage('Purpose is required'),
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { elementType, context, purpose } = req.body;

  try {
    const description = await AIService.generateAccessibilityDescription(
      elementType,
      context,
      purpose
    );
    
    logger.info(`Generated accessibility description for ${elementType}`);
    
    res.json({
      success: true,
      description,
      elementType,
      context,
      purpose,
    });
  } catch (error) {
    logger.error('Accessibility description error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate accessibility description',
    });
  }
}));

/**
 * @swagger
 * /api/ai/status:
 *   get:
 *     summary: Get AI services status
 *     description: Check which AI services are available and configured
 *     tags: [AI]
 *     responses:
 *       200:
 *         description: AI services status
 */
router.get('/status', asyncHandler(async (req, res) => {
  const status = AIService.getServiceStatus();
  
  res.json({
    success: true,
    services: status,
    timestamp: new Date().toISOString(),
    });
}));

export default router; 