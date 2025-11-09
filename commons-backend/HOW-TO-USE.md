# Commons Backend - How to Use

## 🚀 Quick Start

```bash
# 1. Install dependencies (already done)
npm install

# 2. Start server
npm start
```

Server runs on: **http://localhost:3002**

---

## 📡 API Endpoints

### 1. Get Cornell BRB Balance

**Request:**
```bash
curl -X POST http://localhost:3002/api/balance/cornell-brb \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "mock"}'
```

**Response:**
```json
{
  "success": true,
  "balance": 150.50,
  "source": "cornell-get",
  "timestamp": "2024-11-09T..."
}
```

### 2. Get BRB Transaction History

**Request:**
```bash
curl -X POST http://localhost:3002/api/transactions/get-history \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "mock"}'
```

**Response:**
```json
{
  "success": true,
  "transactions": [
    {
      "amount": -12.50,
      "description": "Okenshields Dining Hall",
      "timestamp": "2024-11-08T...",
      "type": "debit",
      "source": "cornell-get"
    }
  ],
  "count": 4
}
```

### 3. Get Combined Balance (Cornell + Crypto)

**Request:**
```bash
curl -X POST http://localhost:3002/api/balance/combined \
  -H "Content-Type": "application/json" \
  -d '{"sessionId": "mock", "walletAddress": "optional"}'
```

**Response:**
```json
{
  "success": true,
  "cornellBRB": 150.50,
  "cryptoBRB": 0,
  "total": 150.50
}
```

---

## 🧪 Testing with Mock Data

**Use session ID:** `"mock"` or `"test-session-id"`

```bash
# Run test script
node test-api.js
```

This returns fake Cornell BRB data for testing your frontend without needing real GET access.

---

## 🔑 Using Real GET Session ID

### Step 1: Get Session ID from GET Mobile

1. **Install GET app** - "CBORD GET" from App Store/Play Store
2. **Login** - Cornell NetID + DUO two-factor
3. **Extract session** - Use network inspector or app debugging
4. **Copy session ID**

### Step 2: Test with Real Data

```bash
curl -X POST http://localhost:3002/api/balance/cornell-brb \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "YOUR_REAL_SESSION_ID"}'
```

---

## 🔗 Frontend Integration

Update your Next.js frontend to call backend:

```typescript
// brb-frontend/hooks/useCornellBRB.ts
const fetchCornellBalance = async (sessionId: string) => {
  const res = await fetch('http://localhost:3002/api/balance/cornell-brb', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId })
  });
  
  const data = await res.json();
  return data.balance; // Returns Cornell BRB balance
};
```

---

## 📊 What the Backend Fetches

**From Cornell GET System:**
- ✅ BRB balance only
- ✅ BRB transaction history only

**Does NOT fetch:**
- ❌ City Bucks
- ❌ Meal swipes
- ❌ Laundry credits

Focused solely on BRB data for the Commons platform.

---

## 🎯 API Summary

| Endpoint | Purpose | Input | Output |
|----------|---------|-------|--------|
| POST /api/balance/cornell-brb | Get Cornell BRB | sessionId | BRB balance |
| POST /api/transactions/get-history | Get BRB history | sessionId | Transactions |
| POST /api/balance/combined | Combined balances | sessionId, wallet | Cornell + Crypto |

---

## 🔧 Testing

```bash
# Health check
curl http://localhost:3002/health

# Get BRB balance (mock)
curl -X POST http://localhost:3002/api/balance/cornell-brb \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "mock"}'

# Run all tests
node test-api.js
```

---

## 🚀 Production Deployment

Deploy backend to:
- Railway
- Render
- Heroku
- AWS/GCP

Update frontend API_BASE to your deployed URL.

---

**Backend is ready and integrated with frontend!** 🎉
