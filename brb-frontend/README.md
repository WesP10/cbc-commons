# BRBs Frontend - Cornell Digital Currency

Modern Next.js frontend for the BRBs stablecoin platform on Solana.

## 🚀 Features

- ✅ **Wallet Integration** - Connect with Phantom, Solflare, and other Solana wallets
- ✅ **Mint & Burn** - Deposit USDC to mint BRBs or burn BRBs to redeem USDC
- ✅ **Balance Display** - View your BRB and USDC balances in real-time
- ✅ **Treasury Stats** - Monitor total collateral, supply, and collateral ratio
- 🚧 **Transaction History** - View all your past transactions (coming soon)
- 🚧 **Liquidity Pool** - Trade on DEX with USDC/BRBs pair (coming soon)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- A Solana wallet (Phantom or Solflare recommended)
- Devnet SOL for transactions

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🌐 Environment Setup

The app is currently configured for **Solana Devnet**. To change networks, edit `app/providers.tsx`:

```typescript
// Change network here
const network = WalletAdapterNetwork.Devnet; // or Mainnet, Testnet
```

## 📁 Project Structure

```
brb-frontend/
├── app/
│   ├── page.tsx              # Main dashboard
│   ├── layout.tsx            # Root layout with wallet provider
│   ├── providers.tsx         # Solana wallet provider setup
│   ├── transactions/         # Transaction history page
│   └── swap/                 # DEX swap page (coming soon)
├── components/
│   ├── Navbar.tsx            # Navigation bar with wallet button
│   ├── BalanceCard.tsx       # Display user balances
│   ├── MintBurnCard.tsx      # Mint/burn interface
│   └── TreasuryStats.tsx     # Treasury statistics
├── hooks/
│   └── useTreasury.ts        # Hook for treasury interactions
└── README.md
```

## 🔗 Integration with Smart Contract

### Step 1: Deploy Your Smart Contract

First, test and deploy your BRB treasury smart contract:

```bash
cd ../brb-stablecoin
anchor test
anchor deploy --provider.cluster devnet
```

### Step 2: Update Program ID

Update the program ID in `hooks/useTreasury.ts`:

```typescript
const PROGRAM_ID = new PublicKey('YOUR_DEPLOYED_PROGRAM_ID');
```

### Step 3: Add IDL

Copy your program's IDL from `brb-stablecoin/target/idl/brb_treasury.json` to this project and import it in `useTreasury.ts`.

### Step 4: Implement Transaction Functions

Uncomment and complete the transaction functions in `hooks/useTreasury.ts`:
- `depositAndMint()` - for minting BRBs
- `burnAndRedeem()` - for burning BRBs
- `refreshBalances()` - to fetch real balances

## 🎨 Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Solana Wallet Adapter** - Wallet connection
- **@solana/web3.js** - Solana blockchain interaction
- **@coral-xyz/anchor** - Solana program framework

## 🔧 Configuration

### Wallet Adapters

Currently configured wallets (in `app/providers.tsx`):
- Phantom
- Solflare

Add more wallets by importing additional adapters:

```typescript
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
```

### Network Configuration

Edit `app/providers.tsx` to change the Solana network:

```typescript
const network = WalletAdapterNetwork.Devnet; // Devnet, Testnet, or Mainnet
const endpoint = useMemo(() => clusterApiUrl(network), [network]);
```

### Custom RPC Endpoint

For better performance, use a custom RPC endpoint:

```typescript
const endpoint = 'https://your-rpc-endpoint.com';
```

## 🎯 Current Status

### ✅ Completed
- [x] Next.js project setup with TypeScript
- [x] Solana wallet integration
- [x] Wallet connect button
- [x] Balance display UI
- [x] Mint/burn interface
- [x] Treasury statistics display
- [x] Responsive design
- [x] Transaction pages

### 🚧 In Progress / TODO
- [ ] Connect to deployed smart contract
- [ ] Implement actual mint/burn transactions
- [ ] Fetch real-time balances from blockchain
- [ ] Fetch treasury stats from on-chain data
- [ ] Add transaction history
- [ ] Implement error handling & notifications
- [ ] Add loading states and animations
- [ ] Integrate liquidity pool (future)
- [ ] Add Cornell NetID authentication (future)
- [ ] Backend API integration (future)

## 📝 Next Steps

1. **Test Smart Contract**
   ```bash
   cd ../brb-stablecoin
   ./check-setup.sh
   ./run-tests.sh
   ```

2. **Deploy to Devnet**
   ```bash
   anchor deploy --provider.cluster devnet
   npm run deploy:init
   ```

3. **Update Frontend**
   - Copy program ID to `useTreasury.ts`
   - Add IDL file
   - Implement transaction functions

4. **Test Integration**
   ```bash
   npm run dev
   # Open http://localhost:3000
   # Connect wallet and test mint/burn
   ```

## 🐛 Troubleshooting

### Wallet Not Connecting
- Make sure you have a Solana wallet installed
- Check that you're on the correct network (Devnet)
- Try refreshing the page

### Transactions Failing
- Ensure you have SOL for gas fees: `solana airdrop 2`
- Check that the program ID is correct
- Verify you have USDC for minting

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

## 🔐 Security Notes

- This is a **devnet deployment** for testing
- Do not use real funds
- Always verify transactions before signing
- Keep your wallet seed phrase secure

## 📚 Resources

- [Solana Wallet Adapter Docs](https://github.com/solana-labs/wallet-adapter)
- [Next.js Documentation](https://nextjs.org/docs)
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)
- [Anchor Framework](https://www.anchor-lang.com/)

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms
- Netlify
- AWS Amplify
- Cloudflare Pages

## 📞 Support

Need help? Check:
1. Smart contract README: `../brb-stablecoin/README.md`
2. Testing guide: `../brb-stablecoin/START-HERE.md`
3. Solana documentation

---

Built with ❤️ for Cornell students • Powered by Solana
