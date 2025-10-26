const anchor = require("@coral-xyz/anchor");
const { PublicKey, Keypair } = require("@solana/web3.js");
const { 
  getAssociatedTokenAddress,
  createAssociatedTokenAccount,
  getAccount,
  mintTo,
} = require("@solana/spl-token");

// Example usage of BRB Treasury Program
async function basicUsageExample() {
  console.log("BRB Treasury Basic Usage Example");

  // Setup
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.BrbTreasury;
  const connection = provider.connection;

  // Create a test user
  const user = Keypair.generate();
  console.log("Test User:", user.publicKey.toString());

  // Airdrop SOL to user
  console.log("Airdropping SOL to user...");
  const signature = await connection.requestAirdrop(user.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);
  await connection.confirmTransaction(signature);
  console.log("SOL airdropped");

  try {
    // Get treasury info
    const [treasury] = PublicKey.findProgramAddressSync(
      [Buffer.from("treasury")],
      program.programId
    );

    const treasuryAccount = await program.account.treasury.fetch(treasury);
    console.log("\n Treasury Info:");
    console.log("   BRB Mint:", treasuryAccount.brbMint.toString());
    console.log("   USDC Vault:", treasuryAccount.usdcVault.toString());
    console.log("   Total Collateral:", treasuryAccount.totalCollateral.toString());
    console.log("   Total BRB Supply:", treasuryAccount.totalBrbSupply.toString());

    // Create USDC mint for testing (since we can't use real USDC easily)
    console.log("\n Creating test USDC mint...");
    const usdcMint = await createMint(
      connection,
      user,
      user.publicKey,
      null,
      6
    );
    console.log(" Test USDC mint created:", usdcMint.toString());

    // Create user's USDC token account
    const userUsdcAccount = await createAssociatedTokenAccount(
      connection,
      user,
      usdcMint,
      user.publicKey
    );

    // Mint some test USDC to user
    const testUsdcAmount = 1000 * 10**6; // 1000 USDC
    await mintTo(
      connection,
      user,
      usdcMint,
      userUsdcAccount,
      user,
      testUsdcAmount
    );
    console.log(" Minted test USDC to user");

    // Get user's BRB token account
    const userBrbAccount = await getAssociatedTokenAddress(
      treasuryAccount.brbMint,
      user.publicKey
    );

    // Deposit USDC and mint BRBs
    const depositAmount = 100 * 10**6; // 100 USDC
    console.log(`\n Depositing ${depositAmount / 1e6} USDC and minting BRBs...`);

    const depositTx = await program.methods
      .depositAndMint(new anchor.BN(depositAmount))
      .accounts({
        treasury: treasury,
        brbMint: treasuryAccount.brbMint,
        usdcVault: treasuryAccount.usdcVault,
        userBrbAccount: userBrbAccount,
        userUsdcAccount: userUsdcAccount,
        user: user.publicKey,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
      })
      .signers([user])
      .rpc();

    console.log(" Deposit and mint successful!");
    console.log(" Transaction:", depositTx);

    // Check balances
    const brbAccount = await getAccount(connection, userBrbAccount);
    const usdcAccount = await getAccount(connection, userUsdcAccount);
    
    console.log("\n User Balances:");
    console.log("   BRB Balance:", Number(brbAccount.amount) / 1e6, "BRBs");
    console.log("   USDC Balance:", Number(usdcAccount.amount) / 1e6, "USDC");

    // Burn BRBs and redeem USDC
    const redeemAmount = 50 * 10**6; // 50 BRBs
    console.log(`\n Burning ${redeemAmount / 1e6} BRBs and redeeming USDC`);

    const redeemTx = await program.methods
      .burnAndRedeem(new anchor.BN(redeemAmount))
      .accounts({
        treasury: treasury,
        brbMint: treasuryAccount.brbMint,
        usdcVault: treasuryAccount.usdcVault,
        userBrbAccount: userBrbAccount,
        userUsdcAccount: userUsdcAccount,
        user: user.publicKey,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
      })
      .signers([user])
      .rpc();

    console.log(" Burn and redeem successful!");
    console.log(" Transaction:", redeemTx);

    // Check final balances
    const finalBrbAccount = await getAccount(connection, userBrbAccount);
    const finalUsdcAccount = await getAccount(connection, userUsdcAccount);
    
    console.log("\n Final User Balances:");
    console.log("   BRB Balance:", Number(finalBrbAccount.amount) / 1e6, "BRBs");
    console.log("   USDC Balance:", Number(finalUsdcAccount.amount) / 1e6, "USDC");

    // Check treasury state
    const finalTreasuryAccount = await program.account.treasury.fetch(treasury);
    console.log("\n🏦 Final Treasury State:");
    console.log("   Total Collateral:", finalTreasuryAccount.totalCollateral.toString());
    console.log("   Total BRB Supply:", finalTreasuryAccount.totalBrbSupply.toString());

    console.log("\n Example completed successfully!");
    console.log("\n View transactions on Solana Explorer:");
    console.log(`   Deposit: https://explorer.solana.com/tx/${depositTx}`);
    console.log(`   Redeem: https://explorer.solana.com/tx/${redeemTx}`);

  } catch (error) {
    console.error(" Error in example:", error);
    throw error;
  }
}

// Run the example
if (require.main === module) {
  basicUsageExample()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = basicUsageExample;
