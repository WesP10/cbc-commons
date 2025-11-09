const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const balanceRoutes = require('./routes/balance');
const transactionRoutes = require('./routes/transactions');

app.use('/api/balance', balanceRoutes);
app.use('/api/transactions', transactionRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'Commons Backend',
    timestamp: new Date() 
  });
});

// Root
app.get('/', (req, res) => {
  res.json({
    name: 'Commons Backend API',
    version: '1.0.0',
    endpoints: {
      balance: {
        'POST /api/balance/cornell-brb': 'Get Cornell BRB balance from GET',
        'POST /api/balance/get-account': 'Get all GET account balances',
        'POST /api/balance/combined': 'Get Cornell + Crypto balances'
      },
      transactions: {
        'POST /api/transactions/get-history': 'Get Cornell transaction history',
        'POST /api/transactions/combined': 'Get Cornell + Crypto transactions'
      }
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Commons Backend running on http://localhost:${PORT}`);
  console.log(`📊 API Documentation: http://localhost:${PORT}`);
});

