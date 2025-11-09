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
   * Fetch complete account info from GET
   * @param {string} sessionId - GET session ID from user's GET Mobile app
   * @returns {Promise<Object>} Account information including BRB balance and history
   */
  async getAccountInfo(sessionId) {
    // Mock mode for testing without real GET session
    if (this.mockMode || sessionId === 'mock' || sessionId === 'test-session-id') {
      return this.getMockAccountInfo();
    }

    const query = gql`
      query GetAccountInfo($sessionId: String!) {
        accountInfo(id: $sessionId) {
          brb
          cityBucks
          history {
            amount
            name
            timestamp
          }
          laundry
          swipes
        }
      }
    `;

    try {
      const data = await request(this.endpoint, query, { sessionId });
      return data.accountInfo;
    } catch (error) {
      console.error('Error fetching GET account info:', error);
      throw new Error('Failed to fetch GET account information');
    }
  }

  /**
   * Mock data for testing
   */
  getMockAccountInfo() {
    return {
      brb: '150.50',
      cityBucks: '25.00',
      swipes: '5',
      laundry: '10.00',
      history: [
        {
          amount: '-12.50',
          name: 'Okenshields Dining Hall',
          timestamp: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        },
        {
          amount: '-8.75',
          name: 'Trillium Coffee',
          timestamp: new Date(Date.now() - 172800000).toISOString() // 2 days ago
        },
        {
          amount: '100.00',
          name: 'BRB Deposit',
          timestamp: new Date(Date.now() - 604800000).toISOString() // 1 week ago
        },
        {
          amount: '-15.25',
          name: 'Mattin\'s Cafe',
          timestamp: new Date(Date.now() - 259200000).toISOString() // 3 days ago
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
    const accountInfo = await this.getAccountInfo(sessionId);
    return parseFloat(accountInfo.brb) || 0;
  }

  /**
   * Get transaction history from GET
   * @param {string} sessionId - GET session ID
   * @returns {Promise<Array>} Transaction history
   */
  async getTransactionHistory(sessionId) {
    const accountInfo = await this.getAccountInfo(sessionId);
    return accountInfo.history || [];
  }

  /**
   * Get all balances (BRB, City Bucks, Swipes, Laundry)
   * @param {string} sessionId - GET session ID
   * @returns {Promise<Object>} All balances
   */
  async getAllBalances(sessionId) {
    const accountInfo = await this.getAccountInfo(sessionId);
    return {
      brb: parseFloat(accountInfo.brb) || 0,
      cityBucks: parseFloat(accountInfo.cityBucks) || 0,
      swipes: parseInt(accountInfo.swipes) || 0,
      laundry: parseFloat(accountInfo.laundry) || 0
    };
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
