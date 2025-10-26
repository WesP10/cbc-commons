# BRB Treasury Deployment Guide

This guide walks you through deploying the BRB Treasury program to Solana devnet.

## Prerequisites

1. **Install Required Tools**:
   ```bash
   # Install Rust
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   
   # Install Solana CLI
   sh -c "$(curl -sSfL https://release.solana.com/v1.16.0/install)"
   
   # Install Anchor
   cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
   avm install latest
   avm use latest
   ```

2. **Configure Solana**:
   ```bash
   solana config set --url devnet
   solana-keygen new --outfile ~/.config/solana/id.json
   solana airdrop 2
   ```

## Deployment Steps

### 1. Build the Program

```bash
# Navigate to project directory
cd brb-stablecoin

# Install dependencies
npm install

# Build the program
anchor build
```

### 2. Deploy to Devnet

```bash
# Deploy the program
anchor deploy

# Initialize the treasury
npm run deploy:init
```

### 3. Verify Deployment

```bash
# Check program ID
solana program show <program-id>

# View treasury account
npm run cli info
```

## Program Addresses

After deployment, you'll get these important addresses:

- **Program ID**: `Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS`
- **Treasury Account**: Generated PDA from `[b"treasury"]`
- **BRB Mint**: Generated PDA from `[b"brb_mint", treasury]`
- **USDC Vault**: Generated PDA from `[b"usdc_vault", treasury]`

## Testing the Deployment

### 1. Run Tests

```bash
# Run comprehensive test suite
anchor test
```

### 2. Use CLI Tool

```bash
# Show treasury information
npm run cli info

# Show user balance
npm run cli balance <user-public-key>

# Deposit USDC and mint BRBs
npm run cli deposit ./user-keypair.json 100

# Burn BRBs and redeem USDC
npm run cli redeem ./user-keypair.json 50
```

### 3. Run Example

```bash
# Run basic usage example
npm run example
```

## Viewing on Blockchain Explorers

### Solana Explorer
- **Program**: https://explorer.solana.com/address/<program-id>
- **Treasury**: https://explorer.solana.com/address/<treasury-address>

### Solscan
- **Program**: https://solscan.io/account/<program-id>
- **Treasury**: https://solscan.io/account/<treasury-address>

## Adding BRB Token to Wallets

### Phantom Wallet
1. Open Phantom wallet
2. Click "+" to add token
3. Enter BRB mint address
4. Token will appear in wallet

### Solflare Wallet
1. Open Solflare wallet
2. Go to "Manage Tokens"
3. Add custom token with BRB mint address
4. Token will be available for sending/receiving

## Troubleshooting

### Common Issues

1. **"Program not found"**:
   - Ensure program is deployed: `solana program show <program-id>`
   - Check you're on correct cluster: `solana config get`

2. **"Insufficient funds"**:
   - Get devnet SOL: `solana airdrop 2`
   - Check wallet balance: `solana balance`

3. **"Account not found"**:
   - Ensure treasury is initialized: `npm run deploy:init`
   - Check account exists: `solana account <address>`

4. **"Invalid instruction"**:
   - Rebuild program: `anchor build`
   - Redeploy: `anchor deploy`

### Getting Help

- Check transaction logs: `solana logs <transaction-signature>`
- View account data: `solana account <account-address> --output json`
- Use Solana Explorer for detailed transaction analysis

## Security Notes

- **Devnet Only**: This deployment is for testing only
- **Test Tokens**: Use test USDC, not real USDC
- **Key Management**: Keep private keys secure
- **Admin Access**: Only authorized admin can pause/unpause

## Next Steps

1. **Test All Functions**: Deposit, mint, burn, redeem
2. **Verify Balances**: Check treasury collateral ratio
3. **Test Admin Functions**: Pause/unpause treasury
4. **Integration**: Connect to frontend applications
5. **Monitoring**: Set up alerts for treasury events

## Production Considerations

For mainnet deployment:

1. **Security Audit**: Professional security review
2. **Real USDC**: Use actual USDC mint address
3. **Admin Keys**: Secure key management
4. **Monitoring**: Real-time treasury monitoring
5. **Backup**: Disaster recovery procedures
6. **Compliance**: Regulatory considerations
