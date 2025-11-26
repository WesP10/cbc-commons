# Commons Backend API

Express backend for Cornell Commons - fetches BRB data from Cornell GET system.

## Features

- ✅ Cornell GET integration via GraphQL
- ✅ Fetch BRB balances from Cornell system
- ✅ BRB transaction history from GET
- ✅ Mock mode for testing without session ID
- ✅ Auto-fallback if GET API unavailable
- 🚧 Solana blockchain integration (coming soon)

## Quick Start

```bash
# Install dependencies
npm install

# Start server
npm start
```

Server runs on: `http://localhost:3002`

## API Endpoints

### Get Cornell BRB Balance
```
POST /api/balance/cornell-brb
```

### Get BRB Transaction History
```
POST /api/transactions/get-history
```

### Get Combined Balance (Cornell + Crypto)
```
POST /api/balance/combined
```

See [HOW-TO-USE.md](./HOW-TO-USE.md) for detailed API documentation.

## What We Fetch

**From Cornell GET System:**
- ✅ BRB balance
- ✅ BRB transaction history

**Focused on BRB only** - no city bucks, swipes, or laundry data.

## Tech Stack

- **Express** - Web framework
- **GraphQL Request** - Query Cornell API
- **Axios** - HTTP client
- **CORS** - Cross-origin requests
- **Mongoose** - MongoDB (future)

## Cornell GET API

Uses Cornell AppDev's Eatery backend to fetch BRB data:
- **Endpoint:** `http://eatery-backend.cornellappdev.com/graphQL`
- **Docs:** https://bible.cornellappdev.com/api/eatery#get-login

## Mock Mode

For testing without real GET session:
- Use sessionId: `"mock"` or `"test-session-id"`
- Returns realistic fake data
- Perfect for development

## Integration

Integrated with Commons frontend at `http://localhost:3001`

Frontend fetches:
1. Cornell BRB balance from backend
2. Crypto BRB balance from Solana
3. Combined total for display

## Testing

```bash
# Run test suite
node test-api.js

# Test individual endpoint
curl -X POST http://localhost:3002/api/balance/cornell-brb \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "mock"}'
```

## Next Steps

- [ ] Get real GET session ID for live data
- [ ] Add MongoDB for user storage
- [ ] Implement Solana blockchain queries
- [ ] Add authentication & session management
- [ ] Deploy to production

## License

MIT
