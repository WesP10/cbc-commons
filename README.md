# BRBs Stablecoin & USDC/BRBs Liquidity Pool

## Project 1: BRBs Stablecoin (SPL Token on Solana)

### Overview
BRBs is a prototype stablecoin on Solana designed to represent Cornell’s “Big Red Bucks” (meal credits). The MVP allows minting, burning, and transferring BRBs as a digital token, with the long‑term vision of bridging to the official BRB system.

### Motivation
- Provide a digital representation of BRBs for peer‑to‑peer trading and staking.
- Enable future integrations with DeFi primitives (prediction markets, lending, etc.).
- Create a transparent, auditable system that could be formally adopted by Cornell.

### Implementation
- **Token Standard:** SPL token (Solana’s equivalent of ERC‑20).
- **Mint/Burn Authority:** Controlled by a treasury program. Initially, minting is admin‑gated (demo mode). Future: mint/burn tied to real BRB deposits/withdrawals.
- **Treasury Program:**
  - Accepts USDC deposits → mints BRBs 1:1.
  - Burns BRBs → releases USDC back to user.
- **Peg Mechanism:**
  - Arbitrage via mint/redeem at $1 worth of USDC.
  - Liquidity pool (see Project 2) reinforces peg in secondary markets.

### Smart Contract Modules
- `BRBsToken`: SPL token definition.
- `TreasuryProgram`: handles mint/burn and collateral accounting.

### Future Work
- Connect to Cornell’s official BRB system for real deposits/withdrawals.
- Explore hybrid collateral (USDC + real BRBs).
- Allow users to stake BRBs on Cornell based prediction markets

---

## Project 2: USDC/BRBs Liquidity Pool

### Overview
A decentralized liquidity pool enabling swaps between USDC and BRBs. This ensures Cornell students can trade BRBs freely and that the peg to $1 is reinforced by market forces.

### Motivation
- Allow students to swap BRBs ↔ USDC without relying solely on mint/redeem.
- Provide liquidity for secondary markets (e.g., betting platforms, peer trades).
- Incentivize liquidity providers to bootstrap adoption.

### Implementation
- **AMM Pool:** Deploy on a Solana DEX (e.g., Orca or Raydium).
- **Liquidity Provision:**
  - Users deposit equal values of USDC and BRBs.
  - Receive LP tokens representing pool share.
- **Swap Functionality:**
  - Constant product AMM \[xy = k\]
  - Fees distributed to LPs.
- **Peg Reinforcement:**
  - If BRBs < \$1, arbitrageurs buy BRBs cheaply and redeem for \$1 USDC.
  - If BRBs > \$1, arbitrageurs mint BRBs at \$1 and sell for profit.

### Smart Contract Modules
- `LiquidityPoolProgram`: manages deposits, withdrawals, swaps, and LP tokens.

### Future Work
- Add incentives (BRBs rewards) for LPs.
- Integrate with Cornell‑specific apps (e.g., student marketplaces).
- Explore concentrated liquidity pools for tighter peg stability.
