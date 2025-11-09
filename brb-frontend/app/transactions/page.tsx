import Navbar from '@/components/Navbar';

export default function TransactionsPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-light text-white mb-4">History</h1>
          <p className="text-gray-400 mb-12">
            View your transaction history once the smart contract is connected.
          </p>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
            <p className="text-sm text-gray-600">No transactions yet</p>
          </div>
        </div>
      </main>
    </div>
  );
}
