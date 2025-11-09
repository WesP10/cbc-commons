import Navbar from '@/components/Navbar';

export default function SwapPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-light text-white mb-4">Swap</h1>
          <p className="text-gray-400 mb-12">
            Liquidity pool coming soon. Trade USDC and BRBs using an automated market maker.
          </p>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
            <div className="space-y-8">
              <div>
                <p className="text-xs text-gray-500 mb-2">Planned features</p>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li>• USDC ↔ BRBs swaps</li>
                  <li>• Provide liquidity and earn fees</li>
                  <li>• Real-time price updates</li>
                  <li>• Integration with Solana DEX</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
