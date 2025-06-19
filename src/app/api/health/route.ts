import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: 'disabled', // Using file-based storage
        firebase: 'connected',
        ai: {
          gemini: !!process.env.GOOGLE_GEMINI_API_KEY,
          elevenlabs: !!process.env.ELEVENLABS_API_KEY,
          huggingface: !!process.env.HUGGINGFACE_API_KEY
        }
      },
      uptime: process.uptime(),
      memory: process.memoryUsage()
    }

    return NextResponse.json(healthCheck)
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: 'Health check failed',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    )
  }
} 