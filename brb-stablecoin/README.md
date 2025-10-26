# BRBs Stablecoin Treasury Program

A Solana program implementing a stablecoin treasury system for Cornell's "Big Red Bucks" (BRBs) using Anchor Framework.

## Overview

The BRBs Treasury Program enables:
- **1:1 USDC-BRB Exchange**: Users can deposit USDC to mint BRBs and burn BRBs to redeem USDC
- **Collateral Management**: Tracks total USDC collateral and BRB supply with 1:1 backing
- **Admin Controls**: Pause/unpause functionality and parameter updates
- **Transparent Operations**: All transactions are recorded on-chain

## Architecture

### Core Components

1. **Treasury State Account**: Stores vault addresses, collateral balance, and admin settings
2. **BRB Token Mint**: SPL token representing Big Red Bucks (6 decimals)
3. **USDC Vault**: Token account holding USDC collateral
4. **Program Instructions**: Initialize, deposit/mint, burn/redeem, and admin functions

### Key Features

- **1:1 Peg**: Every BRB is backed by exactly $1 worth of USDC
- **Arbitrage Protection**: Mint/redeem mechanism maintains peg stability
- **Admin Controls**: Emergency pause and parameter management
- **Collateral Tracking**: Real-time monitoring of backing ratio

## Setup Instructions

### Prerequisites

1. **Install Rust**: https://rustup.rs/
2. **Install Solana CLI**: https://docs.solana.com/cli/install-solana-cli-tools
3. **Install Anchor**: https://www.anchor-lang.com/docs/installation
4. **Install Node.js**: https://nodejs.org/

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd brb-stablecoin

# Install dependencies
npm install

# Build the program
anchor build

# Run tests
anchor test
```

### Configuration

1. **Set Solana cluster**:
   ```bash
   solana config set --url devnet
   ```

2. **Create wallet** (if needed):
   ```bash
   solana-keygen new --outfile ~/.config/solana/id.json
   ```

3. **Get devnet SOL**:
   ```bash
   solana airdrop 2
   ```

## Program Instructions

### Initialize Treasury
Creates the treasury state and BRB token mint.

**Accounts:**
- `treasury`: Treasury state account (PDA)
- `brb_mint`: BRB token mint
- `usdc_vault`: USDC collateral vault
- `admin`: Treasury administrator

### Deposit USDC & Mint BRBs
Exchanges USDC for BRBs at 1:1 ratio.

**Parameters:**
- `amount`: Amount of USDC to deposit (in smallest units)

**Accounts:**
- `treasury`: Treasury state
- `brb_mint`: BRB token mint
- `usdc_vault`: USDC vault
- `user_brb_account`: User's BRB token account
- `user_usdc_account`: User's USDC token account
- `user`: User signing the transaction

### Burn BRBs & Redeem USDC
Exchanges BRBs for USDC at 1:1 ratio.

**Parameters:**
- `amount`: Amount of BRBs to burn (in smallest units)

**Accounts:**
- Same as deposit instruction

### Admin Functions

#### Set Pause Status
Pause or unpause the treasury.

**Parameters:**
- `is_paused`: Boolean pause status

#### Update Treasury Parameters
Update treasury configuration.

**Parameters:**
- `new_admin`: Optional new admin public key

## Deployment

### Deploy to Devnet

```bash
# Build and deploy
anchor build
anchor deploy

# Initialize treasury (replace with your admin keypair)
anchor run initialize-treasury
```

### Program IDs

After deployment, update the program ID in:
- `Anchor.toml`
- `programs/brb-treasury/src/lib.rs` (declare_id!)

## Interaction Tools

### Blockchain Explorers

- **Solana Explorer**: https://explorer.solana.com/
  - View transactions, accounts, and program data
  - Search by program ID or account address

- **Solscan**: https://solscan.io/
  - User-friendly interface with better token visualization
  - Real-time transaction monitoring

### Wallets

- **Phantom Wallet**: https://phantom.app/
  - Add custom BRB token using mint address
  - Send/receive BRBs and view balances

- **Solflare Wallet**: https://solflare.com/
  - Alternative wallet with token management
  - Support for custom SPL tokens

### Development Tools

- **Station (Solana Playground)**: https://beta.solpg.io/
  - Web IDE for interacting with Solana programs
  - Test instructions without local setup

- **Anchor Web UI**: https://www.anchor-lang.com/docs/anchor-by-example
  - Generate UI from program IDL
  - Interactive program testing

## Usage Examples

### Adding BRB Token to Wallet

1. Open Phantom or Solflare wallet
2. Go to "Add Custom Token"
3. Enter the BRB mint address (from deployment)
4. Token will appear in your wallet

### Viewing Treasury State

1. Go to Solana Explorer
2. Search for treasury account address
3. View collateral balance and BRB supply
4. Monitor transaction history

### Checking Token Balances

1. Open wallet
2. View BRB and USDC balances
3. Use "Token Accounts" tab for detailed view

## Program Architecture

```
Treasury State Account
├── Admin Authority
├── BRB Mint Address
├── USDC Vault Address
├── Total Collateral (USDC)
├── Total BRB Supply
├── Pause Status
└── Bump Seed
```

## Security Considerations

- **Admin Controls**: Only authorized admin can pause/unpause
- **Collateral Verification**: All operations verify sufficient collateral
- **Access Control**: User must own token accounts for operations
- **Pause Mechanism**: Emergency stop for all non-admin operations

## Testing

Run the comprehensive test suite:

```bash
# Run all tests
anchor test

# Run specific test
npm test -- --grep "Deposit USDC and mint BRBs"
```

Test coverage includes:
- Treasury initialization
- Deposit/mint operations
- Burn/redeem operations
- Pause functionality
- Access control
- Edge cases and error handling

## Future Enhancements

- **Real USDC Integration**: Connect to actual USDC mint
- **Multi-Collateral**: Support additional collateral types
- **Interest Rates**: Implement lending/borrowing features
- **Governance**: Community-driven parameter updates
- **Analytics**: Enhanced monitoring and reporting

## Support

For questions or issues:
- Check the test suite for usage examples
- Review Solana and Anchor documentation
- Use blockchain explorers to debug transactions

## License

MIT License - See LICENSE file for details.
