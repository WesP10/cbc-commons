const anchor = require("@coral-xyz/anchor");
const { PublicKey } = require("@solana/web3.js");

// This script deploys the BRB Treasury program and initializes it
async function main() {
  console.log("Starting BRB Treasury deployment");

  // Configure the client
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.BrbTreasury;
  const admin = provider.wallet;

  console.log("Program ID:", program.programId.toString());
  console.log("Admin:", admin.publicKey.toString());

  try {
    // Get treasury PDA
    const [treasury] = PublicKey.findProgramAddressSync(
      [Buffer.from("treasury")],
      program.programId
    );

    // Get BRB mint PDA
    const [brbMint] = PublicKey.findProgramAddressSync(
      [Buffer.from("brb_mint"), treasury.toBuffer()],
      program.programId
    );

    // Get USDC vault PDA
    const [usdcVault] = PublicKey.findProgramAddressSync(
      [Buffer.from("usdc_vault"), treasury.toBuffer()],
      program.programId
    );

    // USDC mint address (devnet)
    const usdcMint = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

    console.log("Treasury:", treasury.toString());
    console.log("BRB Mint:", brbMint.toString());
    console.log("USDC Vault:", usdcVault.toString());
    console.log("USDC Mint:", usdcMint.toString());

    // Check if treasury already exists
    try {
      const treasuryAccount = await program.account.treasury.fetch(treasury);
      console.log("Treasury already initialized!");
      console.log("   Admin:", treasuryAccount.admin.toString());
      console.log("   Total Collateral:", treasuryAccount.totalCollateral.toString());
      console.log("   Total BRB Supply:", treasuryAccount.totalBrbSupply.toString());
      console.log("   Is Paused:", treasuryAccount.isPaused);
      return;
    } catch (error) {
      console.log("Treasury not found, proceeding with initialization");
    }

    // Initialize treasury
    console.log("Initializing treasury");
    
    const tx = await program.methods
      .initializeTreasury(0) // bump will be calculated automatically
      .accounts({
        treasury: treasury,
        brbMint: brbMint,
        usdcVault: usdcVault,
        usdcMint: usdcMint,
        admin: admin.publicKey,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc();

    console.log("Treasury initialized successfully!");
    console.log("Transaction:", tx);

    // Verify initialization
    const treasuryAccount = await program.account.treasury.fetch(treasury);
    console.log("\n Treasury State:");
    console.log("   Admin:", treasuryAccount.admin.toString());
    console.log("   BRB Mint:", treasuryAccount.brbMint.toString());
    console.log("   USDC Vault:", treasuryAccount.usdcVault.toString());
    console.log("   Total Collateral:", treasuryAccount.totalCollateral.toString());
    console.log("   Total BRB Supply:", treasuryAccount.totalBrbSupply.toString());
    console.log("   Is Paused:", treasuryAccount.isPaused);

    console.log("\n Deployment completed successfully!");
    console.log("\n Important Addresses:");
    console.log("   Program ID:", program.programId.toString());
    console.log("   Treasury:", treasury.toString());
    console.log("   BRB Mint:", brbMint.toString());
    console.log("   USDC Vault:", usdcVault.toString());

    console.log("\n View on Solana Explorer:");
    console.log(`   https://explorer.solana.com/address/${program.programId.toString()}`);
    console.log(`   https://explorer.solana.com/address/${treasury.toString()}`);

  } catch (error) {
    console.error(" Deployment failed:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
