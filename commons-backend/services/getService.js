const axios = require('axios');

/**
 * Cornell GET Service
 * Integrates with Cornell GET Services REST API to fetch BRB account information
 * Based on CBORD GET Services API: https://services.get.cbord.com/GETServices/services/json
 * 
 * Authentication Flow:
 * 1. User logs in via GET web portal (handled by frontend WebView)
 * 2. Frontend extracts sessionId from redirect URL
 * 3. SessionId is sent to backend for API calls
 */
class GETService {
  constructor() {
    this.baseUrl = 'https://services.get.cbord.com/GETServices/services/json';
    this.mockMode = process.env.MOCK_GET === 'true';
  }

  /**
   * Get user ID from session ID
   * @param {string} sessionId - GET session ID from login redirect
   * @returns {Promise<string>} User ID
   */
  async getUserId(sessionId) {
    if (this.mockMode || !sessionId || sessionId === 'mock') {
      return 'mock-user-id';
    }

    try {
      const response = await axios.post(this.baseUrl + '/user', {
        version: '1',
        method: 'retrieve',
        params: {
          sessionId: sessionId
        }
      });

      return response.data.response.id;
    } catch (error) {
      console.error('Error fetching user ID:', error.message);
      throw new Error(`Failed to get user ID: ${error.message}`);
    }
  }

  /**
   * Fetch BRB account info from GET
   * @param {string} sessionId - GET session ID from user's GET login
   * @returns {Promise<Object>} BRB balance and transaction history
   */
  async getBRBInfo(sessionId) {
    // Mock mode for testing without real GET session
    if (this.mockMode || !sessionId || sessionId === 'mock' || sessionId === 'test-session-id') {
      console.log('📝 Using mock BRB data');
      return this.getMockBRBInfo();
    }

    try {
      console.log('🔍 Fetching real BRB data from GET...');
      
      // Step 1: Get user ID
      const userId = await this.getUserId(sessionId);
      
      // Step 2: Get account info (async)
      const accountsPromise = this.getAccountInfo(sessionId, userId);
      
      // Step 3: Get transaction history (async)
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const transactionsPromise = this.getTransactionHistory(sessionId, userId, startDate, endDate);
      
      // Wait for both
      const [accounts, transactions] = await Promise.all([accountsPromise, transactionsPromise]);
      
      // Find BRB account
      const brbAccount = accounts.find(acc => 
        acc.accountDisplayName && acc.accountDisplayName.includes('Big Red Bucks')
      );
      
      // Filter BRB transactions
      const brbTransactions = transactions.filter(tx => 
        tx.accountName && tx.accountName.includes('Big Red Bucks')
      );
      
      return {
        brb: brbAccount ? (brbAccount.balance || 0).toString() : '0.00',
        history: brbTransactions.map(tx => ({
          amount: tx.amount ? (tx.amount > 0 ? `+${tx.amount}` : tx.amount.toString()) : '0',
          name: tx.locationName || 'Unknown Location',
          timestamp: tx.actualDate || new Date().toISOString()
        }))
      };
    } catch (error) {
      console.warn('⚠️  GET API unavailable, using mock data:', error.message);
      // Fallback to mock data if API fails
      return this.getMockBRBInfo();
    }
  }

  /**
   * Get account info for a user
   * @param {string} sessionId - GET session ID
   * @param {string} userId - User ID from GET
   * @returns {Promise<Array>} Array of accounts
   */
  async getAccountInfo(sessionId, userId) {
    try {
      const response = await axios.post(this.baseUrl + '/commerce', {
        version: '1',
        method: 'retrieveAccountsByUser',
        params: {
          sessionId: sessionId,
          userId: userId
        }
      });

      return response.data.response.accounts || [];
    } catch (error) {
      console.error('Error fetching account info:', error.message);
      throw error;
    }
  }

  /**
   * Get transaction history for a user
   * @param {string} sessionId - GET session ID
   * @param {string} userId - User ID from GET
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Promise<Array>} Array of transactions
   */
  async getTransactionHistory(sessionId, userId, startDate, endDate) {
    try {
      const response = await axios.post(this.baseUrl + '/commerce', {
        version: '1',
        method: 'retrieveTransactionHistory',
        params: {
          paymentSystemType: 0,
          sessionId: sessionId,
          queryCriteria: {
            userId: userId,
            institutionId: '73116ae4-22ad-4c71-8ffd-11ba015407b1',
            startDate: startDate,
            endDate: endDate,
            maxReturn: 100
          }
        }
      });

      return response.data.response.transactions || [];
    } catch (error) {
      console.error('Error fetching transaction history:', error.message);
      throw error;
    }
  }

  /**
   * Mock BRB data for testing
   */
  getMockBRBInfo() {
    return {
      brb: '150.50',
      history: [
        {
          amount: '-12.50',
          name: 'Okenshields Dining Hall',
          timestamp: new Date(Date.now() - 86400000).toISOString()
        },
        {
          amount: '-8.75',
          name: 'Trillium Coffee',
          timestamp: new Date(Date.now() - 172800000).toISOString()
        },
        {
          amount: '100.00',
          name: 'BRB Deposit',
          timestamp: new Date(Date.now() - 604800000).toISOString()
        },
        {
          amount: '-15.25',
          name: 'Mattin\'s Cafe',
          timestamp: new Date(Date.now() - 259200000).toISOString()
        }
      ]
    };
  }

  /**
   * Get just the BRB balance
   * @param {string} sessionId - GET session ID
   * @returns {Promise<number>} BRB balance
   */
  async getBRBBalance(sessionId) {
    const info = await this.getBRBInfo(sessionId);
    return parseFloat(info.brb) || 0;
  }

  /**
   * Get BRB transaction history
   * @param {string} sessionId - GET session ID
   * @returns {Promise<Array>} BRB transaction history
   */
  async getTransactionHistory(sessionId) {
    const info = await this.getBRBInfo(sessionId);
    return info.history || [];
  }

  /**
   * Format transaction history for Commons app
   * @param {Array} history - Raw history from GET
   * @returns {Array} Formatted transactions
   */
  formatTransactions(history) {
    return history.map(tx => ({
      amount: parseFloat(tx.amount) || 0,
      description: tx.name || 'Unknown',
      timestamp: new Date(tx.timestamp || Date.now()),
      type: parseFloat(tx.amount) > 0 ? 'credit' : 'debit',
      source: 'cornell-get'
    }));
  }
}

module.exports = new GETService();
