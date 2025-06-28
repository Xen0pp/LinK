import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()

    // For now, return a simple response since we don't have AI service keys configured
    const response = {
      id: `msg_${Date.now()}`,
      message: `I received your message: "${message}". I'm ready to help with accessibility questions! This is a demo response - connect your AI service keys to enable full functionality.`,
      timestamp: new Date().toISOString(),
      type: 'assistant'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Chat API is running',
    endpoints: {
      POST: 'Send a chat message',
    }
  })
} 