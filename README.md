# BRBs Stablecoin Platform

A full-stack decentralized platform for tokenizing Cornell's "Big Red Bucks" (BRBs) on Solana blockchain. This project enables Cornell students to bridge their traditional meal credits to the blockchain, enabling peer-to-peer trading, DeFi integrations, and transparent financial operations.

## Project Overview

The BRBs Stablecoin Platform consists of three main components:

1. **Solana Smart Contract** (`brb-stablecoin/`) - Treasury program for minting/burning BRB tokens
2. **Backend API** (`commons-backend-local/`) - REST API integrating with Cornell GET system
3. **Web Frontend** (`brb-frontend/`) - Next.js application for user interactions

Together, these components create a seamless bridge between Cornell's traditional BRB system and the Solana blockchain ecosystem.

## Key Features
- **1:1 USDC-BRB Exchange**: Mint BRBs with USDC, redeem BRBs for USDC at a 1:1 ratio
- **Cornell Authentication**: Secure WebView-based login using Cornell GET portal
- **Unified Balance View**: See both Cornell BRB and crypto BRB balances in one place
- **Mint & Burn**: Convert between USDC and BRB tokens on Solana
- **Transaction History**: Combined view of Cornell and blockchain transactions
- **Wallet Integration**: Connect with Phantom, Solflare, and other Solana wallets

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interface                          │
│              (Next.js Web Application)                      │
└──────────────┬──────────────────────────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
       ▼                ▼
┌──────────────┐  ┌──────────────────┐
│   Backend    │  │   Solana         │
│   API        │  │   Blockchain     │
│              │  │                  │
│ - GET Auth   │  │ - Treasury       │
│ - BRB Data   │  │   Program        │
│ - Balance    │  │ - BRB Token      │
│ - History    │  │ - USDC Vault     │
└──────┬───────┘  └──────────────────┘
       │
       ▼
┌──────────────────┐
│  Cornell GET API │
│  (CBORD Services)│
└──────────────────┘
```

## Project Structure

```
cbc-commons/
├── brb-stablecoin/          # Solana smart contract (Anchor)
│   ├── programs/
│   │   └── brb-treasury/   # Treasury program source code
│   ├── tests/              # Anchor tests
│   ├── cli/                # CLI tools
│   └── README.md           # Stablecoin-specific docs
│
├── commons-backend-local/   # Backend API (Express)
│   ├── routes/             # API endpoints
│   ├── services/           # GET API integration
│   ├── server.js           # Express server
│   └── README.md           # Backend-specific docs
│
└── brb-frontend/           # Web frontend (Next.js)
    ├── app/                # Next.js pages
    ├── components/         # React components
    ├── hooks/              # React hooks
    ├── utils/              # Utilities
    └── README.md           # Frontend-specific docs
```

## Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Rust** and **Cargo**
- **Solana CLI** tools
- **Anchor Framework**
- Cornell NetID (for authentication)

### Installation

Each component has its own setup instructions. See the respective README files:

- [Stablecoin README](./brb-stablecoin/README.md) - Solana program setup
- [Backend README](./commons-backend-local/README.md) - API server setup
- [Frontend README](./brb-frontend/README.md) - Web app setup

### Running the Full Stack

1. **Start Backend** (Terminal 1):
   ```bash
   cd commons-backend-local
   npm install
   npm run dev  # Runs on http://localhost:3002
   ```

2. **Start Frontend** (Terminal 2):
   ```bash
   cd brb-frontend
   npm install
   npm run dev  # Runs on http://localhost:3000
   ```

3. **Deploy Smart Contract** (one-time setup):
   ```bash
   cd brb-stablecoin
   anchor build
   anchor deploy --provider.cluster devnet
   ```

4. **Access Application**:
   - Open http://localhost:3000 in your browser
   - Click "Login" to authenticate with Cornell GET
   - Connect your Solana wallet
   - Start minting/burning BRBs!

## Authentication Flow

The platform uses a WebView-based authentication system:

1. User navigates to login page
2. Cornell GET portal loads in iframe
3. User logs in with NetID and password
4. GET redirects with `sessionId` in URL
5. Frontend extracts and validates session ID
6. Session stored in localStorage
7. Backend uses session ID to fetch BRB data

**Important**: The backend never stores NetID or passwords - only session IDs for API calls.

## How It Works

### Minting BRBs

1. User connects Solana wallet
2. User deposits USDC into treasury
3. Smart contract mints equivalent BRBs (1:1 ratio)
4. BRBs appear in user's wallet
5. Balance updates in frontend

### Burning BRBs

1. User selects amount of BRBs to burn
2. Smart contract burns BRB tokens
3. USDC released from treasury vault
4. USDC returned to user's wallet
5. Balance updates accordingly

### Viewing Cornell BRB Balance

1. User authenticates with Cornell GET
2. Backend fetches BRB data from GET API
3. Balance displayed alongside crypto BRB balance
4. Combined total shown in dashboard

## Technology Stack

### Smart Contract
- **Language**: Rust
- **Framework**: Anchor
- **Blockchain**: Solana
- **Token Standard**: SPL Token

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Integration**: Cornell GET REST API (CBORD Services)

### Frontend
- **Framework**: Next.js 16
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Wallet**: @solana/wallet-adapter-react
- **Language**: TypeScript

## Documentation

Each component has comprehensive documentation:

- **[Stablecoin README](./brb-stablecoin/README.md)** - Smart contract details, deployment, testing
- **[Backend README](./commons-backend-local/README.md)** - API endpoints, authentication, GET integration
- **[Frontend README](./brb-frontend/README.md)** - UI components, hooks, wallet integration

## Security Considerations

- **Smart Contract**: Audited treasury program with pause mechanisms
- **Authentication**: Session-based, no credential storage
- **HTTPS**: Required for production deployments
- **Wallet Security**: Private keys never leave user's wallet
- **CORS**: Properly configured for API access

## Use Cases

1. **Peer-to-Peer Trading**: Trade BRBs directly with other students
2. **DeFi Integration**: Use BRBs in lending, staking, or liquidity pools
3. **Transparency**: On-chain transaction history for all BRB operations
4. **Cross-Platform**: Access BRBs from any Solana-compatible wallet
5. **Future**: Integration with prediction markets, betting platforms, etc.

## Current Status

### Implemented
- Solana treasury program (mint/burn)
- Backend GET API integration
- Frontend WebView authentication
- Wallet connection and mint/burn UI
- Balance display (Cornell + Crypto)
- Transaction history

### In Progress
- Production deployment
- Additional wallet support
- Enhanced error handling

### Future Work
- Direct Cornell BRB system integration
- USDC/BRB liquidity pool
- Mobile app (React Native)
- Governance mechanisms
- Analytics dashboard

## Contributing

This is a Cornell Blockchain project. For contributions or questions:

1. Review the component-specific READMEs
2. Follow existing code patterns
3. Test thoroughly before submitting
4. Update documentation as needed

## License

MIT License - See individual component directories for license details.

## Acknowledgments

- Cornell Blockchain Club
- Cornell AppDev (for Eatery app reference implementation)
- Anchor Framework team
- Solana Foundation

## Support

For issues, questions, or contributions:
- Check component-specific READMEs for detailed documentation
- Review error messages and console logs
- Verify environment setup and prerequisites
- Contact Cornell Blockchain team

---

**Note**: This is a prototype/MVP implementation. Production deployment requires additional security audits, testing, and Cornell administrative approval for official BRB system integration.
