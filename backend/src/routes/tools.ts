import express from 'express';
import { Tool, sampleTools } from '../models/Tool';

const router = express.Router();

// GET /api/tools - Get all tools with optional filtering
router.get('/', (req, res) => {
  try {
    const { search, category, difficulty, page = '1', limit = '12' } = req.query;
    
    let filteredTools = sampleTools.filter(tool => tool.isActive);
    
    // Apply search filter
    if (search && typeof search === 'string') {
      const searchLower = search.toLowerCase();
      filteredTools = filteredTools.filter(tool =>
        tool.name.toLowerCase().includes(searchLower) ||
        tool.description.toLowerCase().includes(searchLower) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply category filter
    if (category && typeof category === 'string') {
      filteredTools = filteredTools.filter(tool => tool.category === category);
    }
    
    // Apply difficulty filter
    if (difficulty && typeof difficulty === 'string') {
      filteredTools = filteredTools.filter(tool => tool.difficulty === difficulty);
    }
    
    // Sort by popularity by default
    filteredTools.sort((a, b) => b.popularity - a.popularity);
    
    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    
    const paginatedTools = filteredTools.slice(startIndex, endIndex);
    
    // Get categories for filter options
    const categories = [...new Set(sampleTools.map(tool => tool.category))];
    const difficulties = [...new Set(sampleTools.map(tool => tool.difficulty))];
    
    return res.json({
      tools: paginatedTools,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(filteredTools.length / limitNum),
        totalItems: filteredTools.length,
        itemsPerPage: limitNum
      },
      filters: {
        categories,
        difficulties
      }
    });
  } catch (error) {
    console.error('Error fetching tools:', error);
    return res.status(500).json({ error: 'Failed to fetch tools' });
  }
});

// GET /api/tools/:id - Get specific tool by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const tool = sampleTools.find(t => t.id === id && t.isActive);
    
    if (!tool) {
      return res.status(404).json({ error: 'Tool not found' });
    }
    
    // Increment usage count (in a real app, this would update the database)
    tool.usageCount += 1;
    
    return res.json({ tool });
  } catch (error) {
    console.error('Error fetching tool:', error);
    return res.status(500).json({ error: 'Failed to fetch tool' });
  }
});

// GET /api/tools/category/:category - Get tools by category
router.get('/category/:category', (req, res) => {
  try {
    const { category } = req.params;
    const validCategories = ['visual', 'auditory', 'motor', 'cognitive'];
    
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }
    
    const categoryTools = sampleTools.filter(tool => 
      tool.category === category && tool.isActive
    );
    
    // Sort by popularity
    categoryTools.sort((a, b) => b.popularity - a.popularity);
    
    return res.json({
      category,
      tools: categoryTools,
      count: categoryTools.length
    });
  } catch (error) {
    console.error('Error fetching category tools:', error);
    return res.status(500).json({ error: 'Failed to fetch category tools' });
  }
});

// GET /api/tools/popular/featured - Get featured tools
router.get('/popular/featured', (req, res) => {
  try {
    const featuredTools = sampleTools
      .filter(tool => tool.isActive && tool.popularity > 90)
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 6);
    
    return res.json({
      featured: featuredTools,
      count: featuredTools.length
    });
  } catch (error) {
    console.error('Error fetching featured tools:', error);
    return res.status(500).json({ error: 'Failed to fetch featured tools' });
  }
});

// POST /api/tools/:id/rate - Rate a tool
router.post('/:id/rate', (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    const tool = sampleTools.find(t => t.id === id && t.isActive);
    
    if (!tool) {
      return res.status(404).json({ error: 'Tool not found' });
    }
    
    // In a real implementation, you would store individual ratings and calculate average
    // For now, we'll just acknowledge the rating
    
    return res.json({
      message: 'Rating submitted successfully',
      toolId: id,
      rating: rating
    });
  } catch (error) {
    console.error('Error rating tool:', error);
    return res.status(500).json({ error: 'Failed to submit rating' });
  }
});

export default router; 