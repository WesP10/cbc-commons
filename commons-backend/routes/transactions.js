const express = require('express');
const router = express.Router();
const getService = require('../services/getService');

/**
 * Get transaction history from Cornell GET system
 */
router.post('/get-history', async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ 
        error: 'Session ID required',
        message: 'Please provide your GET session ID'
      });
    }

    // Fetch transaction history from GET
    const rawHistory = await getService.getTransactionHistory(sessionId);
    
    // Format for Commons app
    const transactions = getService.formatTransactions(rawHistory);

    res.json({
      success: true,
      transactions,
      count: transactions.length,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Error fetching GET history:', error);
    res.status(500).json({ 
      error: 'Failed to fetch transaction history',
      message: error.message 
    });
  }
});

/**
 * Get combined transaction history (Cornell GET + Blockchain)
 * TODO: Add blockchain transactions
 */
router.post('/combined', async (req, res) => {
  try {
    const { sessionId, walletAddress } = req.body;

    let cornellTransactions = [];
    let cryptoTransactions = [];

    // Get Cornell GET transactions
    if (sessionId) {
      try {
        const rawHistory = await getService.getTransactionHistory(sessionId);
        cornellTransactions = getService.formatTransactions(rawHistory);
      } catch (error) {
        console.warn('Could not fetch GET history:', error.message);
      }
    }

    // TODO: Get blockchain transactions from Solana
    // cryptoTransactions = await solanaService.getTransactions(walletAddress);

    // Combine and sort by timestamp
    const allTransactions = [...cornellTransactions, ...cryptoTransactions]
      .sort((a, b) => b.timestamp - a.timestamp);

    res.json({
      success: true,
      transactions: allTransactions,
      counts: {
        cornell: cornellTransactions.length,
        crypto: cryptoTransactions.length,
        total: allTransactions.length
      },
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Error fetching combined history:', error);
    res.status(500).json({ 
      error: 'Failed to fetch transactions',
      message: error.message 
    });
  }
});

module.exports = router;

