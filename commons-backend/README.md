# Commons Backend

Backend API service for the BRB Stablecoin platform. Handles Cornell GET authentication, BRB data fetching, and provides REST endpoints for the frontend.

## Overview

This backend integrates with Cornell's GET (CBORD) Services REST API to fetch real-time BRB (Big Red Bucks) balance and transaction data for authenticated users. It serves as the bridge between Cornell's dining system and the blockchain-based BRB token platform.

## Architecture

```
┌─────────────┐      ┌──────────────┐      ┌──────────────────┐
│   Frontend  │ ──── │    Backend   │ ──── │  Cornell GET API │
│  (Next.js)  │      │   (Express)  │      │  (CBORD Services)│
└─────────────┘      └──────────────┘      └──────────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │   Solana     │
                     │  Blockchain  │
                     └──────────────┘
```

## Authentication Flow

The backend uses a session-based authentication system with Cornell's GET portal:

1. **User Login**: Frontend embeds GET login portal in iframe/WebView
2. **Session Extraction**: After successful login, GET redirects with `sessionId` query parameter
3. **Session Validation**: Backend validates session by calling GET API
4. **Session Storage**: Valid session ID stored in frontend localStorage
5. **API Calls**: All subsequent BRB data requests include session ID

### Authentication Endpoints

#### `GET /api/auth/login-url`
Returns the GET login portal URL for embedding in frontend.

**Response:**
```json
{
  "success": true,
  "loginUrl": "https://get.cbord.com/cornell/full/login.php?mobileapp=1"
}
```

#### `POST /api/auth/validate-session`
Validates a GET session ID.

**Request:**
```json
{
  "sessionId": "abc123..."
}
```

**Response:**
```json
{
  "success": true,
  "valid": true,
  "userId": "user-id-from-get"
}
```

## API Endpoints

### Balance Endpoints

#### `POST /api/balance/cornell-brb`
Fetch Cornell BRB balance for authenticated user.

**Request:**
```json
{
  "sessionId": "abc123..."
}
```

**Response:**
```json
{
  "success": true,
  "balance": 150.50,
  "source": "cornell-get",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### `POST /api/balance/combined`
Get combined Cornell + Crypto BRB balances.

**Request:**
```json
{
  "sessionId": "abc123...",
  "walletAddress": "solana-wallet-address"
}
```

**Response:**
```json
{
  "success": true,
  "cornellBRB": 150.50,
  "cryptoBRB": 50.00,
  "total": 200.50
}
```

### Transaction Endpoints

#### `POST /api/transactions/get-history`
Fetch BRB transaction history from Cornell GET system.

**Request:**
```json
{
  "sessionId": "abc123..."
}
```

**Response:**
```json
{
  "success": true,
  "transactions": [
    {
      "amount": -12.50,
      "description": "Okenshields Dining Hall",
      "timestamp": "2024-01-14T12:30:00Z",
      "type": "debit",
      "source": "cornell-get"
    }
  ],
  "count": 10
}
```

#### `POST /api/transactions/combined`
Get combined transaction history from Cornell and blockchain.

**Request:**
```json
{
  "sessionId": "abc123...",
  "walletAddress": "solana-wallet-address"
}
```

**Response:**
```json
{
  "success": true,
  "transactions": [...],
  "counts": {
    "cornell": 10,
    "crypto": 5,
    "total": 15
  }
}
```

## GET API Integration

The backend integrates with Cornell's CBORD GET Services REST API:

**Base URL:** `https://services.get.cbord.com/GETServices/services/json`

### API Flow

1. **Get User ID**
   - Endpoint: `POST /user`
   - Purpose: Retrieve user ID from session ID
   - Returns: User ID string

2. **Get Account Info**
   - Endpoint: `POST /commerce`
   - Method: `retrieveAccountsByUser`
   - Purpose: Fetch all accounts (BRB, City Bucks, etc.)
   - Returns: Array of account objects with balances

3. **Get Transaction History**
   - Endpoint: `POST /commerce`
   - Method: `retrieveTransactionHistory`
   - Purpose: Fetch transaction history for date range
   - Returns: Array of transaction objects

### GET Service Implementation

See `services/getService.js` for full implementation details.

The service:
- Handles session validation
- Extracts BRB-specific account data
- Filters transactions by account type
- Provides mock data fallback for development
- Handles errors gracefully

## Project Structure

```
commons-backend/
├── server.js              # Express server setup
├── routes/
│   ├── auth.js           # Authentication routes
│   ├── balance.js        # Balance endpoints
│   └── transactions.js   # Transaction endpoints
├── services/
│   └── getService.js     # GET API integration service
├── test-api.js           # API testing script
├── package.json
└── README.md
```

## Setup & Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables (if needed)
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3002

# GET API Configuration
MOCK_GET=false  # Set to 'true' to use mock data instead of real GET API
```

### Running the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3002` (or the port specified in `.env`).

### Health Check

```bash
curl http://localhost:3002/health
```

## Development

### Mock Mode

For development without Cornell GET credentials, enable mock mode:

```env
MOCK_GET=true
```

This will return mock BRB data for any session ID.

### Testing API Endpoints

Use the included test script:

```bash
node test-api.js
```

Or use curl/Postman:

```bash
# Test health check
curl http://localhost:3002/health

# Test balance endpoint (with mock session)
curl -X POST http://localhost:3002/api/balance/cornell-brb \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "mock"}'
```

## Error Handling

The backend includes comprehensive error handling:

- **400 Bad Request**: Missing or invalid parameters
- **500 Internal Server Error**: Server-side errors
- **GET API Errors**: Gracefully fall back to mock data in development

## Security Considerations

1. **Session Validation**: Always validate session IDs before making GET API calls
2. **No Credential Storage**: Backend never stores NetID/password, only session IDs
3. **CORS**: Configure CORS appropriately for production
4. **Rate Limiting**: Consider adding rate limiting for production use
5. **HTTPS**: Always use HTTPS in production

## Future Enhancements

- [ ] Add session token refresh mechanism
- [ ] Implement rate limiting
- [ ] Add caching for frequently accessed data
- [ ] Integrate with Solana blockchain for crypto BRB data
- [ ] Add webhook support for real-time balance updates
- [ ] Implement user authentication middleware
- [ ] Add comprehensive logging and monitoring

## Troubleshooting

### GET API Returns Errors

- Verify network connectivity to `services.get.cbord.com`
- Check if session ID is valid and not expired
- Ensure you're using the correct API endpoints
- Try using mock mode for testing: `MOCK_GET=true`

### Session Validation Fails

- Session IDs expire after a period of inactivity
- User needs to re-login through GET portal
- Clear localStorage and try again

### CORS Errors

- Ensure backend CORS is configured to allow frontend origin
- Check that frontend is calling correct backend URL

## License

MIT

## Support

For issues or questions, please contact the Cornell Blockchain team.
