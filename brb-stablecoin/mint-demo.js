const { Connection, Keypair, PublicKey } = require("@solana/web3.js");
const { createMint, getOrCreateAssociatedTokenAccount, mintTo, getAccount } = require("@solana/spl-token");
const fs = require("fs");

async function main() {
  console.log("\n🎬 BRB Token Demo - Minting to Solflare\n");
  
  const SOLFLARE = new PublicKey("DuF1hRDK61YKLaXtMG7mEzFvMX2jtkyVr3syYsDz2h1A");
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  
  // Load wallet
  const walletPath = process.env.HOME ? 
    process.env.HOME + "/.config/solana/id.json" :
    process.env.USERPROFILE + "\\.config\\solana\\id.json";
  const payer = Keypair.fromSecretKey(Buffer.from(JSON.parse(fs.readFileSync(walletPath, "utf8"))));
  
  console.log(" Your wallet:", payer.publicKey.toString());
  console.log("🎯Solflare wallet:", SOLFLARE.toString());
  console.log();

  // Check balance
  const balance = await connection.getBalance(payer.publicKey);
  console.log(" Current balance:", balance / 1e9, "SOL");
  
  if (balance < 0.5e9) {
    console.log("\n⚠️ Low balance! Requesting airdrop...");
    try {
      await connection.requestAirdrop(payer.publicKey, 2e9);
      await new Promise(resolve => setTimeout(resolve, 3000));
      console.log("✅ Airdrop received");
    } catch (e) {
      console.log("⚠️ Airdrop failed, continuing anyway...");
    }
  }
  console.log();

  // Create BRB token mint
  console.log(" Creating BRB token mint...");
  const brbMint = await createMint(
    connection,
    payer,
    payer.publicKey,  // Mint authority
    payer.publicKey,  // Freeze authority
    6                 // 6 decimals
  );
  console.log("✅ BRB Mint:", brbMint.toString());
  console.log();

  // Create token account for Solflare
  console.log(" Creating BRB token account for Solflare...");
  const solflareTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    brbMint,
    SOLFLARE
  );
  console.log("✅ Token Account:", solflareTokenAccount.address.toString());
  console.log();

  // Mint 5000 BRB tokens
  console.log(" Minting 5000 BRB tokens to Solflare...");
  const signature = await mintTo(
    connection,
    payer,
    brbMint,
    solflareTokenAccount.address,
    payer.publicKey,
    5000 * 1e6  // 5000 tokens with 6 decimals
  );
  console.log("✅ Minted successfully!");
  console.log("📝 Transaction:", signature);
  console.log();

  // Verify balance
  const tokenAccountInfo = await getAccount(connection, solflareTokenAccount.address);
  const tokenBalance = Number(tokenAccountInfo.amount) / 1e6;

  console.log("═══════════════════════════════════════");
  console.log("SUCCESS!");
  console.log("═══════════════════════════════════════");
  console.log();
  console.log(" Solflare BRB Balance:", tokenBalance, "BRB");
  console.log(" BRB Mint Address:", brbMint.toString());
  console.log();
  console.log("📱 To view in Solflare wallet:");
  console.log("   1. Open Solflare (https://solflare.com)");
  console.log("   2. Switch to 'DEVNET' network");
  console.log("   3. Click '+' or 'Add Token'");
  console.log("   4. Paste this mint address:");
  console.log("      " + brbMint.toString());
  console.log("   5. You'll see 5000 BRB! 🎊");
  console.log();
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error("\n❌ Error:", err.message);
    process.exit(1);
  }
);
