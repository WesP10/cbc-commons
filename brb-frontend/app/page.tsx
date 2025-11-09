import Navbar from '@/components/Navbar';
import MintBurnCard from '@/components/MintBurnCard';
import BalanceCard from '@/components/BalanceCard';
import TreasuryStats from '@/components/TreasuryStats';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-md mx-auto px-4 py-8 sm:py-16">
        {/* Balances */}
        <BalanceCard />

        {/* Main Card */}
        <MintBurnCard />

        {/* Treasury Stats */}
        <TreasuryStats />
      </main>
    </div>
  );
}
