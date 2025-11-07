import Navbar from '@/components/Navbar';

export default function TransactionsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-light text-gray-900 mb-4">History</h1>
          <p className="text-gray-600 mb-12">
            View your transaction history once the smart contract is connected.
          </p>

          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <p className="text-sm text-gray-400">No transactions yet</p>
          </div>
        </div>
      </main>
    </div>
  );
}
