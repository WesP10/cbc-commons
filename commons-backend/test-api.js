/**
 * Test script for Commons Backend API
 * Tests GET integration with Cornell AppDev API
 */

const axios = require('axios');

const API_BASE = 'http://localhost:3002';

// Test data - replace with real GET session ID
const TEST_SESSION_ID = 'test-session-id';

async function testHealthCheck() {
  console.log('\n🏥 Testing Health Check...');
  try {
    const res = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health:', res.data);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
  }
}

async function testCornellBRBBalance() {
  console.log('\n💰 Testing Cornell BRB Balance...');
  try {
    const res = await axios.post(`${API_BASE}/api/balance/cornell-brb`, {
      sessionId: TEST_SESSION_ID
    });
    console.log('✅ Cornell BRB Balance:', res.data);
  } catch (error) {
    console.error('❌ Failed:', error.response?.data || error.message);
  }
}


async function testTransactionHistory() {
  console.log('\n📜 Testing Transaction History...');
  try {
    const res = await axios.post(`${API_BASE}/api/transactions/get-history`, {
      sessionId: TEST_SESSION_ID
    });
    console.log('✅ Transactions:', res.data);
  } catch (error) {
    console.error('❌ Failed:', error.response?.data || error.message);
  }
}

async function testCombinedBalance() {
  console.log('\n🔄 Testing Combined Balance...');
  try {
    const res = await axios.post(`${API_BASE}/api/balance/combined`, {
      sessionId: TEST_SESSION_ID,
      walletAddress: 'test-wallet-address'
    });
    console.log('✅ Combined:', res.data);
  } catch (error) {
    console.error('❌ Failed:', error.response?.data || error.message);
  }
}

async function runTests() {
  console.log('🧪 Commons Backend API Tests');
  console.log('════════════════════════════════════');
  
  await testHealthCheck();
  await testCornellBRBBalance();
  await testTransactionHistory();
  await testCombinedBalance();
  
  console.log('\n════════════════════════════════════');
  console.log('✅ Tests complete!');
  console.log('\nℹ️  Note: Some tests may fail without a valid GET session ID');
  console.log('   To test with real data, replace TEST_SESSION_ID with your actual session');
}

// Run tests
runTests();

