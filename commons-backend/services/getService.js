const { request, gql } = require('graphql-request');

/**
 * Cornell GET Service
 * Integrates with Cornell AppDev Eatery API to fetch GET account information
 * API Docs: https://bible.cornellappdev.com/api/eatery#get-login
 */
class GETService {
  constructor() {
    this.endpoint = 'http://eatery-backend.cornellappdev.com/graphQL';
    this.mockMode = process.env.MOCK_GET === 'true';
  }

  /**
   * Fetch BRB info from GET
   * @param {string} sessionId - GET session ID from user's GET Mobile app
   * @returns {Promise<Object>} BRB balance and transaction history
   */
  async getBRBInfo(sessionId) {
    // Mock mode for testing without real GET session
    if (this.mockMode || !sessionId || sessionId === 'mock' || sessionId === 'test-session-id') {
      console.log('📝 Using mock BRB data');
      return this.getMockBRBInfo();
    }

    const query = `
      query {
        accountInfo(id: "${sessionId}") {
          brb
          history {
            amount
            name
            timestamp
          }
        }
      }
    `;

    try {
      console.log('🔍 Fetching real BRB data from GET...');
      const data = await request(this.endpoint, query);
      return {
        brb: data.accountInfo.brb,
        history: data.accountInfo.history
      };
    } catch (error) {
      console.warn('⚠️  GET API unavailable, using mock data:', error.message);
      // Fallback to mock data if API fails
      return this.getMockBRBInfo();
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
      amount: parseFloat(tx.amount),
      description: tx.name,
      timestamp: new Date(tx.timestamp),
      type: parseFloat(tx.amount) > 0 ? 'credit' : 'debit',
      source: 'cornell-get'
    }));
  }
}

module.exports = new GETService();
