import dotenv from 'dotenv';

dotenv.config();

export const config = {
  server: {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
  },
  database: {
    postgresUrl: process.env.DATABASE_URL || 'postgresql://localhost:5432/accessibility_hub',
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/accessibility_hub'
  },
  ai: {
    huggingfaceApiKey: process.env.HUGGINGFACE_API_KEY || '',
    googleGeminiApiKey: process.env.GOOGLE_GEMINI_API_KEY || '',
    elevenlabsApiKey: process.env.ELEVENLABS_API_KEY || ''
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default_jwt_secret_change_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
    uploadPath: process.env.UPLOAD_PATH || './uploads'
  }
}; 