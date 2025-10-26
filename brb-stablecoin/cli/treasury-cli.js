#!/usr/bin/env node

const anchor = require("@coral-xyz/anchor");
const { PublicKey, Keypair } = require("@solana/web3.js");
const { 
  getAssociatedTokenAddress,
  createAssociatedTokenAccount,
  getAccount,
  getMint,
} = require("@solana/spl-token");

// CLI for interacting with BRB Treasury
class TreasuryCLI {
  constructor() {
    this.provider = anchor.AnchorProvider.env();
    anchor.setProvider(this.provider);
    this.program = anchor.workspace.BrbTreasury;
    this.connection = this.provider.connection;
  }

  async getTreasuryInfo() {
    try {
      const [treasury] = PublicKey.findProgramAddressSync(
        [Buffer.from("treasury")],
        this.program.programId
      );

      const treasuryAccount = await this.program.account.treasury.fetch(treasury);
      
      console.log("🏦 BRB Treasury Information");
      console.log(`Admin: ${treasuryAccount.admin.toString()}`);
      console.log(`BRB Mint: ${treasuryAccount.brbMint.toString()}`);
      console.log(`USDC Vault: ${treasuryAccount.usdcVault.toString()}`);
      console.log(`Total Collateral: ${treasuryAccount.totalCollateral.toString()} USDC`);
      console.log(`Total BRB Supply: ${treasuryAccount.totalBrbSupply.toString()} BRBs`);
      console.log(`Is Paused: ${treasuryAccount.isPaused}`);
      console.log(`Collateral Ratio: ${treasuryAccount.totalCollateral.toNumber() / treasuryAccount.totalBrbSupply.toNumber() || 0}`);

      return treasuryAccount;
    } catch (error) {
      console.error("Error fetching treasury info:", error.message);
      throw error;
    }
  }

  async getUserBalance(userPublicKey) {
    try {
      const [treasury] = PublicKey.findProgramAddressSync(
        [Buffer.from("treasury")],
        this.program.programId
      );

      const treasuryAccount = await this.program.account.treasury.fetch(treasury);
      
      // Get user's BRB token account
      const userBrbAccount = await getAssociatedTokenAddress(
        treasuryAccount.brbMint,
        userPublicKey
      );

      // Get user's USDC token account (using devnet USDC)
      const usdcMint = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
      const userUsdcAccount = await getAssociatedTokenAddress(
        usdcMint,
        userPublicKey
      );

      let brbBalance = 0;
      let usdcBalance = 0;

      try {
        const brbAccount = await getAccount(this.connection, userBrbAccount);
        brbBalance = Number(brbAccount.amount);
      } catch (error) {
        console.log("  User doesn't have BRB token account yet");
      }

      try {
        const usdcAccount = await getAccount(this.connection, userUsdcAccount);
        usdcBalance = Number(usdcAccount.amount);
      } catch (error) {
        console.log(" User doesn't have USDC token account yet");
      }

      console.log(" User Balance");
      console.log(`User: ${userPublicKey.toString()}`);
      console.log(`BRB Balance: ${brbBalance / 1e6} BRBs`);
      console.log(`USDC Balance: ${usdcBalance / 1e6} USDC`);

      return { brbBalance, usdcBalance };
    } catch (error) {
      console.error(" Error fetching user balance:", error.message);
      throw error;
    }
  }

  async depositAndMint(userKeypair, amount) {
    try {
      const [treasury] = PublicKey.findProgramAddressSync(
        [Buffer.from("treasury")],
        this.program.programId
      );

      const treasuryAccount = await this.program.account.treasury.fetch(treasury);
      
      // Get user's token accounts
      const userBrbAccount = await getAssociatedTokenAddress(
        treasuryAccount.brbMint,
        userKeypair.publicKey
      );

      const usdcMint = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
      const userUsdcAccount = await getAssociatedTokenAddress(
        usdcMint,
        userKeypair.publicKey
      );

      console.log(` Depositing ${amount / 1e6} USDC and minting ${amount / 1e6} BRBs...`);

      const tx = await this.program.methods
        .depositAndMint(new anchor.BN(amount))
        .accounts({
          treasury: treasury,
          brbMint: treasuryAccount.brbMint,
          usdcVault: treasuryAccount.usdcVault,
          userBrbAccount: userBrbAccount,
          userUsdcAccount: userUsdcAccount,
          user: userKeypair.publicKey,
          tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        })
        .signers([userKeypair])
        .rpc();

      console.log(" Deposit and mint successful!");
      console.log(` Transaction: ${tx}`);
      console.log(` Explorer: https://explorer.solana.com/tx/${tx}`);

      return tx;
    } catch (error) {
      console.error(" Error depositing and minting:", error.message);
      throw error;
    }
  }

  async burnAndRedeem(userKeypair, amount) {
    try {
      const [treasury] = PublicKey.findProgramAddressSync(
        [Buffer.from("treasury")],
        this.program.programId
      );

      const treasuryAccount = await this.program.account.treasury.fetch(treasury);
      
      // Get user's token accounts
      const userBrbAccount = await getAssociatedTokenAddress(
        treasuryAccount.brbMint,
        userKeypair.publicKey
      );

      const usdcMint = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
      const userUsdcAccount = await getAssociatedTokenAddress(
        usdcMint,
        userKeypair.publicKey
      );

      console.log(` Burning ${amount / 1e6} BRBs and redeeming ${amount / 1e6} USDC...`);

      const tx = await this.program.methods
        .burnAndRedeem(new anchor.BN(amount))
        .accounts({
          treasury: treasury,
          brbMint: treasuryAccount.brbMint,
          usdcVault: treasuryAccount.usdcVault,
          userBrbAccount: userBrbAccount,
          userUsdcAccount: userUsdcAccount,
          user: userKeypair.publicKey,
          tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        })
        .signers([userKeypair])
        .rpc();

      console.log(" Burn and redeem successful!");
      console.log(` Transaction: ${tx}`);
      console.log(` Explorer: https://explorer.solana.com/tx/${tx}`);

      return tx;
    } catch (error) {
      console.error(" Error burning and redeeming:", error.message);
      throw error;
    }
  }

  async pauseTreasury(adminKeypair, isPaused) {
    try {
      const [treasury] = PublicKey.findProgramAddressSync(
        [Buffer.from("treasury")],
        this.program.programId
      );

      console.log(`${isPaused ? 'Pausing' : 'Unpausing'} treasury...`);

      const tx = await this.program.methods
        .setPauseStatus(isPaused)
        .accounts({
          treasury: treasury,
          admin: adminKeypair.publicKey,
        })
        .signers([adminKeypair])
        .rpc();

      console.log(` Treasury ${isPaused ? 'paused' : 'unpaused'} successfully!`);
      console.log(` Transaction: ${tx}`);
      console.log(`🔗 Explorer: https://explorer.solana.com/tx/${tx}`);

      return tx;
    } catch (error) {
      console.error(" Error updating pause status:", error.message);
      throw error;
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  const cli = new TreasuryCLI();

  try {
    switch (command) {
      case 'info':
        await cli.getTreasuryInfo();
        break;

      case 'balance':
        if (args.length < 2) {
          console.error(" Usage: node treasury-cli.js balance <user-public-key>");
          process.exit(1);
        }
        const userPublicKey = new PublicKey(args[1]);
        await cli.getUserBalance(userPublicKey);
        break;

      case 'deposit':
        if (args.length < 3) {
          console.error(" Usage: node treasury-cli.js deposit <user-keypair-path> <amount-in-usdc>");
          process.exit(1);
        }
        const userKeypair = Keypair.fromSecretKey(
          require('fs').readFileSync(args[1])
        );
        const depositAmount = parseFloat(args[2]) * 1e6; // Convert to smallest units
        await cli.depositAndMint(userKeypair, depositAmount);
        break;

      case 'redeem':
        if (args.length < 3) {
          console.error(" Usage: node treasury-cli.js redeem <user-keypair-path> <amount-in-brbs>");
          process.exit(1);
        }
        const redeemKeypair = Keypair.fromSecretKey(
          require('fs').readFileSync(args[1])
        );
        const redeemAmount = parseFloat(args[2]) * 1e6; // Convert to smallest units
        await cli.burnAndRedeem(redeemKeypair, redeemAmount);
        break;

      case 'pause':
        if (args.length < 2) {
          console.error(" Usage: node treasury-cli.js pause <admin-keypair-path>");
          process.exit(1);
        }
        const adminKeypair = Keypair.fromSecretKey(
          require('fs').readFileSync(args[1])
        );
        await cli.pauseTreasury(adminKeypair, true);
        break;

      case 'unpause':
        if (args.length < 2) {
          console.error(" Usage: node treasury-cli.js unpause <admin-keypair-path>");
          process.exit(1);
        }
        const unpauseKeypair = Keypair.fromSecretKey(
          require('fs').readFileSync(args[1])
        );
        await cli.pauseTreasury(unpauseKeypair, false);
        break;

      default:
        console.log("BRB Treasury CLI");
        console.log("Commands:");
        console.log("  info                                    - Show treasury information");
        console.log("  balance <user-public-key>              - Show user balance");
        console.log("  deposit <keypair-path> <amount>        - Deposit USDC and mint BRBs");
        console.log("  redeem <keypair-path> <amount>         - Burn BRBs and redeem USDC");
        console.log("  pause <admin-keypair-path>             - Pause treasury");
        console.log("  unpause <admin-keypair-path>            - Unpause treasury");
        console.log("");
        console.log("Examples:");
        console.log("  node treasury-cli.js info");
        console.log("  node treasury-cli.js balance 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU");
        console.log("  node treasury-cli.js deposit ./user-keypair.json 100");
        console.log("  node treasury-cli.js redeem ./user-keypair.json 50");
        break;
    }
  } catch (error) {
    console.error("CLI Error:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = TreasuryCLI;
