import Navbar from '@/components/Navbar';

export default function TransactionsPage() {
  // TODO: Implement transaction history from blockchain
  const mockTransactions = [
    // Placeholder data
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Transaction History</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          {mockTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Transactions Yet
              </h3>
              <p className="text-gray-500">
                Your transaction history will appear here once you start using BRBs
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Transaction list will go here */}
            </div>
          )}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-800 mb-2">Coming Soon</h3>
          <p className="text-blue-700 text-sm">
            Full transaction history with filtering, search, and export functionality.
            Connect your wallet to see your transactions once the smart contract is integrated.
          </p>
        </div>
      </main>
    </div>
  );
}

