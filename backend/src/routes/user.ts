import express from 'express';

const router = express.Router();

// GET /api/user/preferences - Get user accessibility preferences
router.get('/preferences', (req, res) => {
  try {
    // In a real implementation, you would get this from the database based on user session
    const defaultPreferences = {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      preferredLanguage: 'en',
      screenReaderMode: false,
      keyboardNavigation: true
    };

    return res.json({
      success: true,
      preferences: defaultPreferences
    });

  } catch (error) {
    console.error('Get preferences error:', error);
    return res.status(500).json({ 
      error: 'Failed to get user preferences',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/user/preferences - Update user accessibility preferences
router.post('/preferences', (req, res) => {
  try {
    const preferences = req.body;

    // Validate preferences
    const validKeys = ['highContrast', 'largeText', 'reducedMotion', 'preferredLanguage', 'screenReaderMode', 'keyboardNavigation'];
    const isValid = Object.keys(preferences).every(key => validKeys.includes(key));

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid preference keys' });
    }

    // In a real implementation, you would save this to the database
    console.log('User preferences updated:', preferences);

    return res.json({
      success: true,
      message: 'Preferences updated successfully',
      preferences
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    return res.status(500).json({ 
      error: 'Failed to update user preferences',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/user/feedback - Submit general feedback
router.post('/feedback', (req, res) => {
  try {
    const { type, subject, message, rating, userAgent } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Feedback message is required' });
    }

    if (message.length > 2000) {
      return res.status(400).json({ error: 'Feedback message is too long (max 2000 characters)' });
    }

    // In a real implementation, you would save this to the database
    const feedback = {
      id: Date.now().toString(),
      type: type || 'general',
      subject: subject || 'User Feedback',
      message,
      rating: rating || null,
      userAgent: userAgent || req.get('User-Agent'),
      timestamp: new Date(),
      ip: req.ip
    };

    console.log('User feedback received:', feedback);

    return res.json({
      success: true,
      message: 'Feedback submitted successfully',
      feedbackId: feedback.id
    });

  } catch (error) {
    console.error('Submit feedback error:', error);
    return res.status(500).json({ 
      error: 'Failed to submit feedback',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/user/stats - Get user statistics (usage, etc.)
router.get('/stats', (req, res) => {
  try {
    // In a real implementation, you would get this from the database
    const stats = {
      toolsUsed: 0,
      favoriteTool: null,
      totalSessions: 0,
      lastVisit: null,
      joinedDate: new Date(),
      accessibilityScore: 95 // Based on their usage of accessible features
    };

    return res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Get stats error:', error);
    return res.status(500).json({ 
      error: 'Failed to get user statistics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 