import express from 'express';
import mongoose from 'mongoose';
import { logger } from '../utils/logger';
import { AIService } from '../services/aiService';

const router = express.Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the health status of the API and its dependencies
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 message:
 *                   type: string
 *                   example: Accessibility Hub API is running
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 *                 uptime:
 *                   type: number
 *                   example: 3600
 *                 database:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: connected
 *                     name:
 *                       type: string
 *                       example: accessibility-hub
 *       503:
 *         description: API is unhealthy
 */
router.get('/', async (req, res) => {
  try {
    const healthCheck = {
      status: 'OK',
      message: 'Accessibility Hub API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: 'file-based',
        name: 'file-storage',
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
      },
      services: {
        ai: AIService.getServiceStatus(),
        ocr: {
          tesseract: true, // Always available as it's local
        },
        translation: {
          libretranslate: !!process.env.LIBRETRANSLATE_URL,
        },
      },
    };

    // Check if database is connected - Skip for file-based storage
    // if (mongoose.connection.readyState !== 1) {
    //   return res.status(503).json({
    //     ...healthCheck,
    //     status: 'ERROR',
    //     message: 'Database connection failed',
    //   });
    // }

    logger.info('Health check requested');
    res.status(200).json(healthCheck);
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'ERROR',
      message: 'Health check failed',
      timestamp: new Date().toISOString(),
      error: process.env.NODE_ENV === 'development' ? error : 'Internal server error',
    });
  }
});

/**
 * @swagger
 * /api/health/detailed:
 *   get:
 *     summary: Detailed health check
 *     description: Returns detailed health information including all service statuses
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Detailed health information
 */
router.get('/detailed', async (req, res) => {
  try {
    const detailedHealth = {
      api: {
        status: 'OK',
        version: '1.0.0',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      },
      database: {
        mongodb: {
          status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
          name: mongoose.connection.name,
          host: mongoose.connection.host,
          port: mongoose.connection.port,
        },
      },
      system: {
        platform: process.platform,
        nodeVersion: process.version,
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        port: process.env.PORT,
        corsOrigins: process.env.CORS_ORIGINS,
      },
      features: {
        swagger: process.env.SWAGGER_ENABLED === 'true',
        rateLimit: true,
        helmet: true,
        cors: true,
      },
    };

    res.status(200).json(detailedHealth);
  } catch (error) {
    logger.error('Detailed health check failed:', error);
    res.status(503).json({
      status: 'ERROR',
      message: 'Detailed health check failed',
      error: process.env.NODE_ENV === 'development' ? error : 'Internal server error',
    });
  }
});

export default router; 