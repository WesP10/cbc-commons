import Navbar from '@/components/Navbar';

export default function SwapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Swap</h1>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔄</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                Liquidity Pool Coming Soon
              </h3>
              <p className="text-gray-600 mb-6">
                Swap between USDC and BRBs using our automated market maker (AMM) pool.
              </p>
              
              <div className="bg-gradient-to-r from-red-50 to-blue-50 rounded-lg p-6 text-left">
                <h4 className="font-bold text-gray-800 mb-3">Planned Features:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>USDC ↔ BRBs swaps with low fees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Provide liquidity and earn rewards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>View real-time prices and liquidity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Integration with Orca or Raydium DEX</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="font-bold text-gray-800 mb-2">For Traders</h4>
              <p className="text-sm text-gray-600">
                Trade BRBs freely without needing to mint/burn through the treasury
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="font-bold text-gray-800 mb-2">For LPs</h4>
              <p className="text-sm text-gray-600">
                Earn trading fees by providing liquidity to the USDC/BRBs pool
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

