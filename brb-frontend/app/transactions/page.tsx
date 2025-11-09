'use client';

import Navbar from '@/components/Navbar';
import { useWallet } from '@solana/wallet-adapter-react';

export default function TransactionsPage() {
  const { connected } = useWallet();

  // TODO: Fetch from MongoDB via backend API
  const transactions = [];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-2xl mx-auto px-4 py-8 sm:py-16">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Transactions</h1>

        {!connected ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">Connect wallet to view transactions</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx: any, i: number) => (
              <div key={i} className="border border-gray-100 rounded-2xl p-4 hover:border-gray-200 transition">
                {/* Transaction item */}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

