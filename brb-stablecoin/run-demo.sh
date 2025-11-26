#!/bin/bash

echo "🎬 BRB Token Demo - Devnet Flow"
echo ""

# Configure Solana for devnet
echo "Configuring Solana for devnet..."
solana config set --url devnet

# Request airdrop
echo "Requesting SOL airdrop..."
solana airdrop 2 || echo "Airdrop failed, continuing with existing balance..."

# Check balance
echo ""
echo "Current balance:"
solana balance

# Run minting script
echo ""
echo "Running mint script..."
node mint-demo.js

echo ""
echo "Done! Check your Solflare wallet on DEVNET"
