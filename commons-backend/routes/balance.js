const express = require('express');
const router = express.Router();
const getService = require('../services/getService');

/**
 * Get user's Cornell BRB balance from GET
 * Requires GET session ID
 */
router.post('/cornell-brb', async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ 
        error: 'Session ID required',
        message: 'Please provide your GET session ID from the GET Mobile app'
      });
    }

    // Fetch BRB balance from Cornell GET system
    const brbBalance = await getService.getBRBBalance(sessionId);

    res.json({
      success: true,
      balance: brbBalance,
      source: 'cornell-get',
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Error fetching Cornell BRB:', error);
    res.status(500).json({ 
      error: 'Failed to fetch Cornell BRB balance',
      message: error.message 
    });
  }
});


/**
 * Get combined balances (Cornell + Crypto)
 * TODO: Add crypto balance from Solana blockchain
 */
router.post('/combined', async (req, res) => {
  try {
    const { sessionId, walletAddress } = req.body;

    // Get Cornell BRB balance
    let cornellBRB = 0;
    if (sessionId) {
      try {
        cornellBRB = await getService.getBRBBalance(sessionId);
      } catch (error) {
        console.warn('Could not fetch Cornell BRB:', error.message);
      }
    }

    // TODO: Get crypto BRB from Solana blockchain
    const cryptoBRB = 0; // Placeholder

    res.json({
      success: true,
      cornellBRB,
      cryptoBRB,
      total: cornellBRB + cryptoBRB,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Error fetching combined balance:', error);
    res.status(500).json({ 
      error: 'Failed to fetch balances',
      message: error.message 
    });
  }
});

module.exports = router;

