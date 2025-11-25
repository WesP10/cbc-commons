const express = require('express');
const router = express.Router();
const getService = require('../services/getService');

/**
 * Validate a GET session ID
 * Used to verify if a sessionId is still valid
 */
router.post('/validate-session', async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ 
        error: 'Session ID required',
        message: 'Please provide a session ID'
      });
    }

    // Try to get user ID with the session
    try {
      const userId = await getService.getUserId(sessionId);
      
      res.json({
        success: true,
        valid: true,
        userId: userId,
        message: 'Session is valid'
      });
    } catch (error) {
      res.json({
        success: false,
        valid: false,
        message: 'Session is invalid or expired'
      });
    }

  } catch (error) {
    console.error('Error validating session:', error);
    res.status(500).json({ 
      error: 'Failed to validate session',
      message: error.message 
    });
  }
});

/**
 * Get login URL for frontend WebView
 * Returns the GET login portal URL
 */
router.get('/login-url', (req, res) => {
  res.json({
    success: true,
    loginUrl: 'https://get.cbord.com/cornell/full/login.php?mobileapp=1',
    message: 'Use this URL in a WebView/iframe for user login. The redirect URL will contain the sessionId query parameter.'
  });
});

module.exports = router;

