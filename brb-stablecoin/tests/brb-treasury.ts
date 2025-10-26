import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BrbTreasury } from "../target/types/brb_treasury";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { 
  TOKEN_PROGRAM_ID, 
  createMint, 
  createAccount, 
  mintTo, 
  getAccount,
  getMint,
  createAssociatedTokenAccount,
  getAssociatedTokenAddress,
  createInitializeMintInstruction,
  createInitializeAccountInstruction,
  createMintToInstruction,
  createTransferInstruction,
  MINT_SIZE,
  ACCOUNT_SIZE,
} from "@solana/spl-token";
import { expect } from "chai";

describe("brb-treasury", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.BrbTreasury as Program<BrbTreasury>;
  const provider = anchor.getProvider();

  // Test accounts
  let admin: Keypair;
  let user: Keypair;
  let treasury: PublicKey;
  let brbMint: PublicKey;
  let usdcMint: PublicKey;
  let usdcVault: PublicKey;
  let userBrbAccount: PublicKey;
  let userUsdcAccount: PublicKey;
  let treasuryBump: number;

  // Constants
  const USDC_MINT_ADDRESS = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"); // Devnet USDC
  const INITIAL_USDC_AMOUNT = 1000 * 10**6; // 1000 USDC
  const DEPOSIT_AMOUNT = 100 * 10**6; // 100 USDC/BRBs

  before(async () => {
    // Create test keypairs
    admin = Keypair.generate();
    user = Keypair.generate();

    // Airdrop SOL to test accounts
    await provider.connection.requestAirdrop(admin.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);
    await provider.connection.requestAirdrop(user.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);

    // Wait for airdrops to confirm
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create USDC mint for testing (since we can't use real USDC on devnet easily)
    usdcMint = await createMint(
      provider.connection,
      admin,
      admin.publicKey,
      null,
      6
    );

    // Get treasury PDA
    [treasury] = PublicKey.findProgramAddressSync(
      [Buffer.from("treasury")],
      program.programId
    );
    treasuryBump = PublicKey.findProgramAddressSync(
      [Buffer.from("treasury")],
      program.programId
    )[1];

    // Create user token accounts
    userBrbAccount = await createAssociatedTokenAccount(
      provider.connection,
      user,
      brbMint, // Will be set after treasury initialization
      user.publicKey
    );

    userUsdcAccount = await createAssociatedTokenAccount(
      provider.connection,
      user,
      usdcMint,
      user.publicKey
    );
  });

  it("Initialize treasury", async () => {
    // Get BRB mint PDA (will be created during initialization)
    const [brbMintPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("brb_mint"), treasury.toBuffer()],
      program.programId
    );
    brbMint = brbMintPDA;

    // Get USDC vault PDA
    const [usdcVaultPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("usdc_vault"), treasury.toBuffer()],
      program.programId
    );
    usdcVault = usdcVaultPDA;

    const tx = await program.methods
      .initializeTreasury(treasuryBump)
      .accounts({
        treasury: treasury,
        brbMint: brbMint,
        usdcVault: usdcVault,
        usdcMint: usdcMint,
        admin: admin.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([admin])
      .rpc();

    console.log("Treasury initialization transaction:", tx);

    // Verify treasury state
    const treasuryAccount = await program.account.treasury.fetch(treasury);
    expect(treasuryAccount.admin.toString()).to.equal(admin.publicKey.toString());
    expect(treasuryAccount.brbMint.toString()).to.equal(brbMint.toString());
    expect(treasuryAccount.usdcVault.toString()).to.equal(usdcVault.toString());
    expect(treasuryAccount.totalCollateral.toNumber()).to.equal(0);
    expect(treasuryAccount.totalBrbSupply.toNumber()).to.equal(0);
    expect(treasuryAccount.isPaused).to.be.false;
  });

  it("Mint USDC to user for testing", async () => {
    // Mint USDC to user account for testing
    await mintTo(
      provider.connection,
      admin,
      usdcMint,
      userUsdcAccount,
      admin,
      INITIAL_USDC_AMOUNT
    );

    // Verify USDC balance
    const usdcBalance = await getAccount(provider.connection, userUsdcAccount);
    expect(Number(usdcBalance.amount)).to.equal(INITIAL_USDC_AMOUNT);
  });

  it("Deposit USDC and mint BRBs", async () => {
    const initialBrbBalance = await getAccount(provider.connection, userBrbAccount).catch(() => ({ amount: BigInt(0) }));
    const initialUsdcBalance = await getAccount(provider.connection, userUsdcAccount);

    const tx = await program.methods
      .depositAndMint(new anchor.BN(DEPOSIT_AMOUNT))
      .accounts({
        treasury: treasury,
        brbMint: brbMint,
        usdcVault: usdcVault,
        userBrbAccount: userBrbAccount,
        userUsdcAccount: userUsdcAccount,
        user: user.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([user])
      .rpc();

    console.log("Deposit and mint transaction:", tx);

    // Verify BRB balance increased
    const finalBrbBalance = await getAccount(provider.connection, userBrbAccount);
    expect(Number(finalBrbBalance.amount) - Number(initialBrbBalance.amount)).to.equal(DEPOSIT_AMOUNT);

    // Verify USDC balance decreased
    const finalUsdcBalance = await getAccount(provider.connection, userUsdcAccount);
    expect(Number(initialUsdcBalance.amount) - Number(finalUsdcBalance.amount)).to.equal(DEPOSIT_AMOUNT);

    // Verify treasury state
    const treasuryAccount = await program.account.treasury.fetch(treasury);
    expect(treasuryAccount.totalCollateral.toNumber()).to.equal(DEPOSIT_AMOUNT);
    expect(treasuryAccount.totalBrbSupply.toNumber()).to.equal(DEPOSIT_AMOUNT);
  });

  it("Burn BRBs and redeem USDC", async () => {
    const initialBrbBalance = await getAccount(provider.connection, userBrbAccount);
    const initialUsdcBalance = await getAccount(provider.connection, userUsdcAccount);

    const tx = await program.methods
      .burnAndRedeem(new anchor.BN(DEPOSIT_AMOUNT))
      .accounts({
        treasury: treasury,
        brbMint: brbMint,
        usdcVault: usdcVault,
        userBrbAccount: userBrbAccount,
        userUsdcAccount: userUsdcAccount,
        user: user.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([user])
      .rpc();

    console.log("Burn and redeem transaction:", tx);

    // Verify BRB balance decreased
    const finalBrbBalance = await getAccount(provider.connection, userBrbAccount);
    expect(Number(initialBrbBalance.amount) - Number(finalBrbBalance.amount)).to.equal(DEPOSIT_AMOUNT);

    // Verify USDC balance increased
    const finalUsdcBalance = await getAccount(provider.connection, userUsdcAccount);
    expect(Number(finalUsdcBalance.amount) - Number(initialUsdcBalance.amount)).to.equal(DEPOSIT_AMOUNT);

    // Verify treasury state
    const treasuryAccount = await program.account.treasury.fetch(treasury);
    expect(treasuryAccount.totalCollateral.toNumber()).to.equal(0);
    expect(treasuryAccount.totalBrbSupply.toNumber()).to.equal(0);
  });

  it("Test pause functionality", async () => {
    // Pause treasury
    const pauseTx = await program.methods
      .setPauseStatus(true)
      .accounts({
        treasury: treasury,
        admin: admin.publicKey,
      })
      .signers([admin])
      .rpc();

    console.log("Pause treasury transaction:", pauseTx);

    // Verify treasury is paused
    let treasuryAccount = await program.account.treasury.fetch(treasury);
    expect(treasuryAccount.isPaused).to.be.true;

    // Try to deposit while paused (should fail)
    try {
      await program.methods
        .depositAndMint(new anchor.BN(DEPOSIT_AMOUNT))
        .accounts({
          treasury: treasury,
          brbMint: brbMint,
          usdcVault: usdcVault,
          userBrbAccount: userBrbAccount,
          userUsdcAccount: userUsdcAccount,
          user: user.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([user])
        .rpc();
      
      expect.fail("Deposit should have failed while treasury is paused");
    } catch (error) {
      expect(error.message).to.include("TreasuryPaused");
    }

    // Unpause treasury
    const unpauseTx = await program.methods
      .setPauseStatus(false)
      .accounts({
        treasury: treasury,
        admin: admin.publicKey,
      })
      .signers([admin])
      .rpc();

    console.log("Unpause treasury transaction:", unpauseTx);

    // Verify treasury is unpaused
    treasuryAccount = await program.account.treasury.fetch(treasury);
    expect(treasuryAccount.isPaused).to.be.false;
  });

  it("Test unauthorized access", async () => {
    // Try to pause treasury with non-admin (should fail)
    try {
      await program.methods
        .setPauseStatus(true)
        .accounts({
          treasury: treasury,
          admin: user.publicKey, // user is not admin
        })
        .signers([user])
        .rpc();
      
      expect.fail("Pause should have failed with unauthorized user");
    } catch (error) {
      expect(error.message).to.include("Unauthorized");
    }
  });

  it("Test edge cases", async () => {
    // Test zero amount deposit (should fail)
    try {
      await program.methods
        .depositAndMint(new anchor.BN(0))
        .accounts({
          treasury: treasury,
          brbMint: brbMint,
          usdcVault: usdcVault,
          userBrbAccount: userBrbAccount,
          userUsdcAccount: userUsdcAccount,
          user: user.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([user])
        .rpc();
      
      expect.fail("Zero amount deposit should have failed");
    } catch (error) {
      expect(error.message).to.include("InvalidAmount");
    }

    // Test insufficient USDC balance (should fail)
    const largeAmount = 10000 * 10**6; // 10000 USDC (more than user has)
    try {
      await program.methods
        .depositAndMint(new anchor.BN(largeAmount))
        .accounts({
          treasury: treasury,
          brbMint: brbMint,
          usdcVault: usdcVault,
          userBrbAccount: userBrbAccount,
          userUsdcAccount: userUsdcAccount,
          user: user.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([user])
        .rpc();
      
      expect.fail("Insufficient balance deposit should have failed");
    } catch (error) {
      // This should fail at the token level, not our program
      expect(error.message).to.include("insufficient funds");
    }
  });

  it("Test collateral ratio tracking", async () => {
    // Deposit some USDC to test collateral tracking
    const testAmount = 50 * 10**6; // 50 USDC
    
    await program.methods
      .depositAndMint(new anchor.BN(testAmount))
      .accounts({
        treasury: treasury,
        brbMint: brbMint,
        usdcVault: usdcVault,
        userBrbAccount: userBrbAccount,
        userUsdcAccount: userUsdcAccount,
        user: user.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([user])
      .rpc();

    // Verify collateral ratio is 1:1
    const treasuryAccount = await program.account.treasury.fetch(treasury);
    expect(treasuryAccount.totalCollateral.toNumber()).to.equal(testAmount);
    expect(treasuryAccount.totalBrbSupply.toNumber()).to.equal(testAmount);
    expect(treasuryAccount.totalCollateral.toNumber()).to.equal(treasuryAccount.totalBrbSupply.toNumber());
  });
});
