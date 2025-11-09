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

### 2. Get All GET Account Info

**Request:**
```bash
curl -X POST http://localhost:3002/api/balance/get-account \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "mock"}'
```

**Response:**
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

### 3. Get Transaction History

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

---

## 🧪 Testing with Mock Data

**Use session ID:** `"mock"` or `"test-session-id"`

```bash
# Run test script
node test-api.js
```

This returns fake Cornell data for testing your frontend without needing real GET access.

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

### Update Frontend to Call Backend

```typescript
// brb-frontend/hooks/useCornellBalance.ts
export const useCornellBalance = () => {
  const [cornellBRB, setCornellBRB] = useState(0);

  const fetchCornellBalance = async (sessionId: string) => {
    const res = await fetch('http://localhost:3002/api/balance/cornell-brb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    });
    
    const data = await res.json();
    setCornellBRB(data.balance);
  };

  return { cornellBRB, fetchCornellBalance };
};
```

### Display in Frontend

```typescript
// Show Cornell + Crypto balances
const { cornellBRB } = useCornellBalance();
const { cryptoBRB } = useTreasury();

return (
  <div>
    <div>Cornell BRB: ${cornellBRB}</div>
    <div>Crypto BRB: {cryptoBRB}</div>
    <div>Total: ${cornellBRB + cryptoBRB}</div>
  </div>
);
```

---

## 📊 What You Can Do Now

### With Mock Mode (Testing):
- ✅ Test API endpoints
- ✅ Build frontend integration
- ✅ Develop UI for balances
- ✅ Test transaction history display

### With Real Session ID:
- ✅ Fetch actual Cornell BRB balance
- ✅ See real transaction history
- ✅ Monitor Cornell account from Commons app
- ✅ Compare Cornell vs Crypto BRBs

---

## 🎯 Current Limitations

**Session ID Challenge:**
- Users need to manually get session ID from GET app
- Session expires periodically
- Not ideal UX

**Solution (Future):**
- Partner with Cornell IT
- Get official OAuth/API access
- Auto-authenticate users
- Persistent sessions

---

## 📁 Backend Structure

```
commons-backend/
├── server.js                 ✅ Express server
├── routes/
│   ├── balance.js           ✅ Balance endpoints
│   └── transactions.js      ✅ Transaction endpoints
├── services/
│   └── getService.js        ✅ GET GraphQL integration
├── test-api.js              ✅ Test script
├── .env.example             ✅ Config template
├── README.md                ✅ Documentation
└── package.json             ✅ Dependencies
```

---

## 🚀 Next Steps

1. **Test with mock data** ✅ (Working now!)
2. **Integrate frontend** - Connect to backend API
3. **Get real session ID** - Test with actual GET account
4. **Add MongoDB** - Store user accounts
5. **Add authentication** - Session management

---

**Your backend is running and ready to fetch Cornell BRB balances!** 

To test with real data, you just need a GET session ID. Want me to update the frontend to connect to this backend? 🔗
