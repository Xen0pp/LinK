import { NextRequest, NextResponse } from 'next/server'

const sampleTools = [
  {
    id: 'image-captioning',
    name: 'Image Captioning',
    description: 'AI-powered alt text generation for images to improve accessibility.',
    category: 'visual',
    difficulty: 'easy',
    tags: ['accessibility', 'images', 'alt-text', 'ai'],
    popularity: 95,
    isActive: true,
    usageCount: 1250
  },
  {
    id: 'text-to-speech',
    name: 'Text-to-Speech',
    description: 'Convert text to natural-sounding speech for audio accessibility.',
    category: 'auditory',
    difficulty: 'easy',
    tags: ['accessibility', 'audio', 'speech', 'tts'],
    popularity: 92,
    isActive: true,
    usageCount: 980
  },
  {
    id: 'ocr-extraction',
    name: 'OCR Text Extraction',
    description: 'Extract text from images for screen reader compatibility.',
    category: 'visual',
    difficulty: 'medium',
    tags: ['accessibility', 'ocr', 'text-extraction', 'images'],
    popularity: 88,
    isActive: true,
    usageCount: 756
  },
  {
    id: 'text-simplification',
    name: 'Text Simplification',
    description: 'Simplify complex text for better readability and comprehension.',
    category: 'cognitive',
    difficulty: 'medium',
    tags: ['accessibility', 'text', 'simplification', 'readability'],
    popularity: 85,
    isActive: true,
    usageCount: 643
  },
  {
    id: 'ai-assistant',
    name: 'AI Assistant',
    description: 'Get expert accessibility advice and WCAG guidance.',
    category: 'cognitive',
    difficulty: 'easy',
    tags: ['accessibility', 'ai', 'guidance', 'wcag'],
    popularity: 90,
    isActive: true,
    usageCount: 1120
  }
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    
    let filteredTools = sampleTools.filter(tool => tool.isActive)
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filteredTools = filteredTools.filter(tool =>
        tool.name.toLowerCase().includes(searchLower) ||
        tool.description.toLowerCase().includes(searchLower) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }
    
    // Apply category filter
    if (category) {
      filteredTools = filteredTools.filter(tool => tool.category === category)
    }
    
    // Apply difficulty filter
    if (difficulty) {
      filteredTools = filteredTools.filter(tool => tool.difficulty === difficulty)
    }
    
    // Sort by popularity by default
    filteredTools.sort((a, b) => b.popularity - a.popularity)
    
    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedTools = filteredTools.slice(startIndex, endIndex)
    
    // Get categories for filter options
    const categories = [...new Set(sampleTools.map(tool => tool.category))]
    const difficulties = [...new Set(sampleTools.map(tool => tool.difficulty))]
    
    return NextResponse.json({
      tools: paginatedTools,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredTools.length / limit),
        totalItems: filteredTools.length,
        itemsPerPage: limit
      },
      filters: {
        categories,
        difficulties
      }
    })
  } catch (error) {
    console.error('Error fetching tools:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tools' }, 
      { status: 500 }
    )
  }
} 