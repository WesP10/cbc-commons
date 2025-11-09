# Commons Backend - GET Integration Plan

## Overview

Integrate Cornell GET Mobile API to fetch real BRB balances and transaction history.

---

## API Integration

### Cornell AppDev Eatery API

**Base URL:** `http://eatery-backend.cornellappdev.com/graphQL`

**Query:**
```graphql
query GetBRBInfo($sessionId: String!) {
  accountInfo(id: $sessionId) {
    brb           # Cornell BRB balance
    history {     # BRB transaction history
      amount
      name
      timestamp
    }
  }
}
```

**Reference:** https://bible.cornellappdev.com/api/eatery#get-login

---

## Backend Service (Node.js/Express)

### 1. GET Service Module

```javascript
// backend/services/getService.js
const axios = require('axios');

class GETService {
  constructor() {
    this.apiUrl = 'http://eatery-backend.cornellappdev.com/graphQL';
  }

  async getBRBInfo(sessionId) {
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
      const response = await axios.post(this.apiUrl, {
        query: query
      });

      return response.data.data.accountInfo;
    } catch (error) {
      throw new Error('Failed to fetch GET account info');
    }
  }

  async getBRBBalance(sessionId) {
    const info = await this.getBRBInfo(sessionId);
    return parseFloat(info.brb) || 0;
  }

  async getTransactionHistory(sessionId) {
    const info = await this.getBRBInfo(sessionId);
    return info.history || [];
  }
}

module.exports = new GETService();
```

---

## User Authentication Flow

### Step 1: Cornell Login

**User logs in with Cornell credentials:**

```javascript
// backend/routes/auth.js
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  // TODO: Authenticate with Cornell SSO/GET system
  // This returns a GET session ID
  const sessionId = await cornellAuth.login(username, password);
  
  // Store session ID in database
  const user = await User.findOneAndUpdate(
    { netId: username },
    { 
      getSessionId: sessionId,
      lastLogin: new Date()
    },
    { upsert: true, new: true }
  );
  
  // Create JWT session
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  
  res.json({ token, user });
});
```

### Step 2: Link Wallet

```javascript
// backend/routes/wallet.js
router.post('/link', authenticate, async (req, res) => {
  const { walletAddress, signature, message } = req.body;
  
  // Verify wallet ownership
  const valid = verifySignature(walletAddress, signature, message);
  if (!valid) {
    return res.status(400).json({ error: 'Invalid signature' });
  }
  
  // Link wallet to user
  await User.findByIdAndUpdate(req.user._id, {
    walletAddress,
    walletLinkedAt: new Date()
  });
  
  res.json({ success: true });
});
```

### Step 3: Fetch Combined BRB Balances

```javascript
// backend/routes/balance.js
router.post('/combined', async (req, res) => {
  const { sessionId, walletAddress } = req.body;
  
  // Get Cornell BRB balance from GET
  let cornellBRB = 0;
  if (sessionId) {
    cornellBRB = await getService.getBRBBalance(sessionId);
  }
  
  // Get crypto BRB balance from Solana blockchain
  const cryptoBRB = 0; // TODO: Fetch from Solana
  
  res.json({
    cornellBRB,        // From Cornell GET system
    cryptoBRB,         // From Solana blockchain
    total: cornellBRB + cryptoBRB
  });
});
```

---

## Frontend Implementation

### Display Combined Balances

```typescript
// brb-frontend/hooks/useCornellBRB.ts
import { useState, useCallback } from 'react';

export function useCornellBRB() {
  const [cornellBalance, setCornellBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchBalance = useCallback(async (sessionId: string = 'mock') => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3002/api/balance/cornell-brb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });
      const data = await res.json();
      setCornellBalance(data.balance);
      return data.balance;
    } catch (error) {
      console.error('Error fetching Cornell BRB:', error);
      return 0;
    } finally {
      setLoading(false);
    }
  }, []);

  return { cornellBalance, loading, fetchBalance };
};
```

### Transaction History from GET

```typescript
// brb-frontend/app/transactions/page.tsx
const fetchTransactions = async () => {
  // Fetch from GET system via backend
  const res = await fetch('/api/transactions/get-history');
  const data = await res.json();
  
  // data.history = [{ amount, name, timestamp }, ...]
  setTransactions(data.history);
};
```

---

## 🔐 Session Management Challenge

**Problem:** How to get GET session ID?

### Options:

**Option 1: Mobile GET App Integration**
- User logs into GET Mobile app
- Extracts session ID
- Pastes into Commons
- Not ideal UX

**Option 2: Reverse Engineer GET Auth**
- Study GET Mobile app authentication
- Implement same auth flow
- Get session ID programmatically
- **Risky** - may violate ToS

**Option 3: Cornell IT Partnership**
- Request official API access
- Cornell provides OAuth/API key
- Official integration
- **Best long-term solution**

**Option 4: Manual Balance Entry (MVP)**
- User manually enters Cornell BRB balance
- Commons tracks crypto BRBs on blockchain
- Compare/sync manually
- Simple but not automated

---

## 🎯 Recommended MVP Approach

### Phase 1: Manual Integration (Quick Start)

```typescript
// User manually enters Cornell BRB balance
interface UserAccount {
  netId: string;
  email: string;
  walletAddress: string;
  
  // Manual entry
  declaredCornellBRB: number;  // User self-reports
  lastDeclaredAt: Date;
  
  // Blockchain (automatic)
  cryptoBRB: number;           // From Solana
}
```

**User Flow:**
1. Connect wallet
2. Enter Cornell NetID + email
3. **Manually enter Cornell BRB balance** (honor system)
4. Link wallet
5. Mint crypto BRBs up to declared amount

### Phase 2: GET API Integration (Future)

Once we figure out authentication:
1. User logs in with Cornell credentials
2. Backend fetches real BRB from GET API
3. Auto-sync balances
4. Enable deposits/withdrawals

---

## 🏗️ Database Schema (Updated)

```javascript
// MongoDB - users collection
{
  netId: "abc123",
  email: "abc123@cornell.edu",
  walletAddress: "7xKXtg...",
  
  // GET Integration
  getSessionId: "session_token_if_available",  // For API calls
  
  // Balances
  cornellBRB: 150.50,        // From GET API or manual
  cryptoBRB: 75.25,          // From Solana blockchain
  totalBRB: 225.75,
  
  // Manual entry (MVP)
  declaredCornellBRB: 150.50,
  lastManualUpdate: ISODate(),
  
  // Verification
  verified: true,
  linkedAt: ISODate(),
  
  // Sync status
  lastSyncedWithGET: ISODate() || null
}
```

---

## 🎨 Frontend Display

### Updated Balance Card:

```typescript
// Show both balances
┌─────────────────────────┐
│ Your BRB Balances       │
├─────────────────────────┤
│ Cornell Account: 150.50 │ ← From GET API
│ Crypto Wallet:    75.25 │ ← From Solana
│ ─────────────────────── │
│ Total:           225.75 │
└─────────────────────────┘
```

---

## 🚀 Implementation Steps

### Immediate (Can Do Now):

**1. Create Backend Structure**
```bash
mkdir -p commons-backend
cd commons-backend
npm init -y
npm install express mongoose cors dotenv axios graphql-request
```

**2. Add GET Service**
```javascript
// services/getService.js
// Use Cornell AppDev API
```

**3. Update Frontend**
```typescript
// Add CombinedBalance component
// Show Cornell + Crypto BRBs
```

### Future (Requires Cornell Partnership):

**1. Official API Access**
- Contact Cornell IT
- Request GET API access
- Get OAuth credentials

**2. Authentication Flow**
- Cornell SSO integration
- Auto-fetch session ID
- Real-time sync

---

## 💡 Quick Win Strategy

**For MVP (This Week):**

1. ✅ Build backend API structure
2. ✅ Create user authentication (email verification)
3. ✅ Manual BRB balance entry
4. ✅ Link wallet to NetID
5. ✅ Store in MongoDB
6. ✅ Display combined balances

**For v2 (After Cornell Partnership):**

1. 🔄 GET API integration
2. 🔄 Auto-sync balances
3. 🔄 Real transaction history
4. 🔄 Campus merchant payments

---

## 📋 Action Items

### Backend Tasks:
- [ ] Set up Express server
- [ ] MongoDB connection
- [ ] User model with GET session support
- [ ] GET service integration (try AppDev API)
- [ ] Authentication routes
- [ ] Balance aggregation endpoint

### Frontend Tasks:
- [ ] Combined balance display
- [ ] Manual balance entry (temporary)
- [ ] Transaction history page (fetch from MongoDB)
- [ ] Link account flow

---

## 🔗 Resources

- Cornell AppDev API: https://bible.cornellappdev.com/api/eatery
- GET info query available (need session ID)
- Payment methods data available
- Transaction history accessible

---

**Want me to start building the backend with GET API integration?** 

I can create:
1. Express server structure
2. GET service module
3. Combined balance endpoint
4. MongoDB models

Let me know! 🚀

