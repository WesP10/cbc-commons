import Navbar from '@/components/Navbar';
import BalanceCard from '@/components/BalanceCard';
import MintBurnCard from '@/components/MintBurnCard';
import TreasuryStats from '@/components/TreasuryStats';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Welcome to <span className="text-red-600">BRBs</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Cornell&apos;s Digital Currency on Solana. Mint, transfer, and manage your Big Red Bucks seamlessly.
          </p>
          <div className="mt-6 flex justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔐</span>
              <span>Secure & Transparent</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">💵</span>
              <span>1:1 USDC Backed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <span>Fast Transactions</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1">
            <BalanceCard />
          </div>
          <div className="lg:col-span-2">
            <MintBurnCard />
          </div>
        </div>

        {/* Treasury Stats */}
        <div className="mb-8">
          <TreasuryStats />
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">For Students</h3>
            <p className="text-gray-600">
              Digital meal credits that you can trade, save, and use across campus.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">🏪</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">For Merchants</h3>
            <p className="text-gray-600">
              Accept BRBs as payment with instant settlement and low fees.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">💎</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">For Traders</h3>
            <p className="text-gray-600">
              Trade BRBs on decentralized exchanges with full liquidity.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">1</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Connect Wallet</h3>
              <p className="text-gray-600 text-sm">
                Connect your Phantom or Solflare wallet to get started
              </p>
            </div>

            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">2</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Mint BRBs</h3>
              <p className="text-gray-600 text-sm">
                Deposit USDC to mint BRBs at a 1:1 ratio
              </p>
            </div>

            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">3</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Use or Trade</h3>
              <p className="text-gray-600 text-sm">
                Spend on campus or trade on decentralized exchanges
              </p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg shadow-lg p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">Ready to Get Started?</h3>
          <p className="mb-4">Connect your wallet and start using BRBs today!</p>
          <p className="text-sm text-red-100">
            Built on Solana • 1:1 USDC Backed • Open Source
          </p>
        </div>
      </main>
    </div>
  );
}
