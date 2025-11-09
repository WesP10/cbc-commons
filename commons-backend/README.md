# Commons Backend API

Express backend for Cornell Commons - integrates with GET system and Solana blockchain.

## Features

- ✅ Cornell GET account integration via GraphQL
- ✅ Fetch real BRB balances from Cornell system
- ✅ Transaction history from GET
- 🚧 Solana blockchain integration (coming soon)
- 🚧 MongoDB for user data (coming soon)

## Quick Start

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start server
npm start
```

Server runs on: `http://localhost:3002`

## API Endpoints

### Balance APIs

**Get Cornell BRB Balance**
```bash
POST /api/balance/cornell-brb
Content-Type: application/json

{
  "sessionId": "your-get-session-id"
}
```

**Get All GET Account Balances**
```bash
POST /api/balance/get-account
Content-Type: application/json

{
  "sessionId": "your-get-session-id"
}
```

Response:
```json
{
  "success": true,
  "balances": {
    "brb": 150.50,
    "cityBucks": 25.00,
    "swipes": 5,
    "laundry": 10.00
  }
}
```

**Get Combined Balances (Cornell + Crypto)**
```bash
POST /api/balance/combined
Content-Type: application/json

{
  "sessionId": "your-get-session-id",
  "walletAddress": "solana-wallet-address"
}
```

### Transaction APIs

**Get Cornell Transaction History**
```bash
POST /api/transactions/get-history
Content-Type: application/json

{
  "sessionId": "your-get-session-id"
}
```

Response:
```json
{
  "success": true,
  "transactions": [
    {
      "amount": -12.50,
      "description": "Okenshields Dining",
      "timestamp": "2024-11-09T12:30:00Z",
      "type": "debit",
      "source": "cornell-get"
    }
  ],
  "count": 50
}
```

## Testing the API

### Using curl

```bash
# Test health check
curl http://localhost:3002/health

# Test GET balance (requires valid session ID)
curl -X POST http://localhost:3002/api/balance/cornell-brb \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "your-session-id"}'
```

### Using Postman

1. Import as collection
2. Set base URL: `http://localhost:3002`
3. Test endpoints with your GET session ID

## How to Get Session ID

**From GET Mobile App:**
1. Download "CBORD GET" app
2. Login with Cornell NetID + DUO
3. Extract session ID (developer mode/network inspection)

**Note:** Session IDs expire - users need to re-login periodically.

## Integration with Frontend

Update your Next.js frontend to call these APIs:

```typescript
// brb-frontend/hooks/useCornellBalance.ts
const fetchCornellBalance = async (sessionId: string) => {
  const res = await fetch('http://localhost:3002/api/balance/cornell-brb', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId })
  });
  
  const data = await res.json();
  return data.balance;
};
```

## Future Enhancements

- [ ] User authentication (JWT)
- [ ] MongoDB integration
- [ ] Solana blockchain queries
- [ ] Wallet linking
- [ ] Session management
- [ ] Rate limiting
- [ ] Error logging

## Dependencies

- **express** - Web framework
- **cors** - Cross-origin requests
- **axios** - HTTP client
- **graphql-request** - GraphQL client
- **mongoose** - MongoDB ODM
- **dotenv** - Environment variables

## Cornell GET API

Uses Cornell AppDev's Eatery backend:
- Endpoint: `http://eatery-backend.cornellappdev.com/graphQL`
- Documentation: https://bible.cornellappdev.com/api/eatery#get-login

## License

MIT

