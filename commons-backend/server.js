const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const balanceRoutes = require('./routes/balance');
const transactionRoutes = require('./routes/transactions');

app.use('/api/auth', authRoutes);
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
    description: 'Fetches Cornell BRB data via GET REST API using WebView-based authentication',
    endpoints: {
      auth: {
        'GET /api/auth/login-url': 'Get GET login portal URL for WebView',
        'POST /api/auth/validate-session': 'Validate a GET session ID'
      },
      balance: {
        'POST /api/balance/cornell-brb': 'Get Cornell BRB balance',
        'POST /api/balance/combined': 'Get Cornell + Crypto BRB balances'
      },
      transactions: {
        'POST /api/transactions/get-history': 'Get BRB transaction history',
        'POST /api/transactions/combined': 'Get Cornell + Crypto transactions'
      }
    },
    note: 'Focused on BRB data only - no city bucks, swipes, or laundry'
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
  console.log(`Commons Backend running on http://localhost:${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}`);
});

