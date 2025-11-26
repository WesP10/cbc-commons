'use client';

import Navbar from '@/components/Navbar';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect } from 'react';
import { useCornellBRB } from '@/hooks/useCornellBRB';

export default function TransactionsPage() {
  const { connected } = useWallet();
  const { transactions, fetchTransactions, loading } = useCornellBRB();

  useEffect(() => {
    if (connected) {
      fetchTransactions('mock'); // Using mock data for now
    }
  }, [connected, fetchTransactions]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-2xl mx-auto px-4 py-8 sm:py-16">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Transactions</h1>

        {!connected ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">Connect wallet to view transactions</p>
          </div>
        ) : loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx: any, i: number) => (
              <div 
                key={i} 
                className="border border-gray-100 rounded-2xl p-4 hover:border-gray-200 transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{tx.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(tx.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      tx.type === 'credit' ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {tx.type === 'credit' ? '+' : ''}{tx.amount.toFixed(2)} BRB
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{tx.source}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {connected && transactions.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              Showing {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
