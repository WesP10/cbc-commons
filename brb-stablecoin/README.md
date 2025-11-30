# BRB Stablecoin Treasury

A Solana program implementing a fully-collateralized stablecoin treasury system for Cornell's "Big Red Bucks" (BRBs).

> **🐳 NEW: Docker Setup Available!** For the most reliable, consistent development experience across all platforms, see **[DOCKER.md](./DOCKER.md)** for Docker-based setup. Recommended for Windows users!

## What is BRB Treasury?

The BRB Treasury Program enables 1:1 USDC-backed stablecoin functionality:
- **Deposit USDC → Mint BRBs** at 1:1 ratio
- **Burn BRBs → Redeem USDC** at 1:1 ratio
- **Full Collateralization**: Every BRB is backed by exactly 1 USDC
- **Admin Controls**: Pause/unpause functionality for emergency situations

---

## 🎯 Stable Versions (Battle-Tested)

| Tool | Version | Why? |
|------|---------|------|
| Anchor CLI | **0.30.1** | Most stable Anchor release |
| Solana CLI | **1.18.26** | Proven compatibility with Anchor 0.30.1 |
| Rust | **1.79.0** | Perfect compatibility (matches Anchor) |
| Node.js | **20.x LTS** | Latest LTS release |

**These versions are known to work perfectly together.** Used by thousands of production Solana projects.

## 🐳 Setup Options

### Option 1: Docker (Recommended for Windows)
**Best for:** Consistent environment, no version conflicts, easy setup

```powershell
# See DOCKER.md for full guide
docker-compose build
docker-compose up -d
.\docker-build.ps1
```

✅ All dependencies pre-installed  
✅ Works identically on Windows/Mac/Linux  
✅ No WSL2 required  
✅ Isolated from host system  

**[→ Full Docker Guide](./DOCKER.md)**

### Option 2: WSL2 (Traditional Method)

---

## 🚀 Quick Setup (Recommended: WSL2 on Windows)

### Step 1: Get WSL2 (Windows Users Only)
```powershell
# Run in PowerShell as Administrator
wsl --install
# Restart computer, then open "Ubuntu" from Start menu
```

### Step 2: Automated Installation (Linux/Mac/WSL)
```bash
# Navigate to project
cd "/mnt/c/Users/YOUR_USERNAME/Saved Games/cbc-commons/brb-stablecoin"

# Run the installer
chmod +x install.sh
./install.sh

# Reload your shell
source ~/.bashrc
```

### Step 3: Verify & Build
```bash
# Check versions
./check-versions.sh

# Configure Solana
solana config set --url devnet
solana-keygen new
solana airdrop 2

# Build
anchor build

# Test
anchor test
```

**That's it!** You're ready to develop.

---

## 📖 Detailed Setup Guide

See **[SETUP.md](./SETUP.md)** for:
- Step-by-step manual installation
- Troubleshooting common issues
- Windows native setup (not recommended)
- VS Code + WSL integration

---

## 🔨 Building & Testing

```bash
# Clean build (recommended)
anchor clean && anchor build

# Run tests
anchor test

# Deploy to devnet
solana config set --url devnet
solana airdrop 2
anchor deploy
```

---

## 📚 Program Architecture

### Treasury State Account
```rust
Treasury {
    admin: Pubkey,           // Administrator
    brb_mint: Pubkey,        // BRB token mint
    usdc_vault: Pubkey,      // USDC collateral vault
    total_collateral: u64,   // Total USDC deposited
    total_brb_supply: u64,   // Total BRBs minted
    is_paused: bool,         // Emergency pause
    bump: u8                 // PDA bump seed
}
```

### Main Instructions

1. **initialize_treasury** - Create treasury, BRB mint, USDC vault
2. **deposit_and_mint** - Deposit USDC, mint BRBs (1:1)
3. **burn_and_redeem** - Burn BRBs, redeem USDC (1:1)
4. **set_pause_status** - Pause/unpause (admin only)
5. **update_treasury_params** - Update settings (admin only)

See full code in `programs/brb-treasury/src/lib.rs`

---

## 🛠️ CLI Usage

```bash
# Show treasury info
npm run cli info

# Check balance
npm run cli balance <user-pubkey>

# Deposit USDC and mint BRBs
npm run cli deposit <keypair-path> <amount>

# Burn BRBs and redeem USDC
npm run cli redeem <keypair-path> <amount>

# Pause treasury (admin only)
npm run cli pause <admin-keypair-path>
```

---

## 🐛 Troubleshooting

### "anchor: command not found"
```bash
export PATH="$HOME/.cargo/bin:$PATH"
source ~/.bashrc
```

### "Insufficient SOL"
```bash
solana airdrop 2
# Or use: https://solfaucet.com
```

### Version mismatch errors
```bash
# Nuclear reset
anchor clean
rm -rf target node_modules package-lock.json
npm install
anchor build
```

### Build fails
```bash
# Check versions match exactly
./check-versions.sh

# Reinstall if needed
./install.sh
```

---

## 📖 Additional Resources

- **Docker Setup Guide**: [DOCKER.md](./DOCKER.md) - Recommended for Windows
- **WSL2 Setup Guide**: [SETUP.md](./SETUP.md) - Traditional method
- **Anchor Docs**: https://www.anchor-lang.com/
- **Solana Docs**: https://docs.solana.com/
- **Solana Cookbook**: https://solanacookbook.com/

---

## 🔒 Security Notes

### Development (Devnet)
- ✅ Use test tokens only
- ✅ Keep devnet keypairs separate from mainnet
- ✅ Test thoroughly before mainnet

### Production (Mainnet)
Before deploying to mainnet:
1. **Security audit** - Get professional review
2. **Real USDC mint** - Use actual USDC: `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`
3. **Hardware wallet** - For admin keys
4. **Monitoring** - Set up real-time alerts
5. **Testing** - Extensive devnet testing first

---

## 📁 Project Structure

```
brb-stablecoin/
├── programs/brb-treasury/src/lib.rs  # Main program
├── tests/brb-treasury.ts             # Test suite
├── cli/treasury-cli.js               # CLI tool
├── Dockerfile                        # Docker image definition
├── docker-compose.yml                # Docker orchestration
├── docker-dev.ps1                    # Docker helper functions
├── docker-build.ps1                  # Quick Docker build
├── docker-test.ps1                   # Quick Docker test
├── Anchor.toml                       # Config (Anchor 0.30.1)
├── rust-toolchain.toml               # Rust 1.79.0
├── DOCKER.md                         # Docker setup guide
├── SETUP.md                          # WSL2 setup guide
└── README.md                         # This file
```

---

## License

MIT License

---

**Built with ❤️ by Cornell Blockchain Club**
