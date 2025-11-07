import Navbar from '@/components/Navbar';
import BalanceCard from '@/components/BalanceCard';
import MintBurnCard from '@/components/MintBurnCard';
import TreasuryStats from '@/components/TreasuryStats';

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <main className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="max-w-3xl mb-16">
          <h1 className="text-4xl font-light text-white mb-4">
            <span className="text-red-500">Cornell</span> Digital Currency
          </h1>
          <p className="text-gray-400 leading-relaxed">
            BRBs is a stablecoin on Solana representing Cornell&apos;s Big Red Bucks. 
            Mint, transfer, and manage your tokens with complete transparency.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          <div className="lg:col-span-1">
            <BalanceCard />
          </div>
          <div className="lg:col-span-2">
            <MintBurnCard />
          </div>
        </div>

        {/* Treasury Stats */}
        <div className="mb-16">
          <TreasuryStats />
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 pt-8">
          <p className="text-xs text-gray-600 text-center">
            Built on Solana • 1:1 USDC backed • <span className="text-red-500">Cornell Blockchain</span>
          </p>
        </div>
      </main>
    </div>
  );
}
