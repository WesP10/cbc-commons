'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { useTreasury } from '@/hooks/useTreasury';

export default function BalanceCard() {
  const { connected } = useWallet();
  const { brbBalance, usdcBalance, loading, refreshBalances } = useTreasury();

  useEffect(() => {
    if (connected) {
      refreshBalances();
    }
  }, [connected]);

  if (!connected) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <p className="text-gray-500">Connect your wallet to view balances</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-red-50 rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Balances</h2>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-6 border-2 border-red-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 mb-1">BRB Balance</p>
                <p className="text-3xl font-bold text-red-600">
                  {brbBalance.toFixed(2)} BRBs
                </p>
              </div>
              <div className="text-4xl">🐻</div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border-2 border-blue-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 mb-1">USDC Balance</p>
                <p className="text-3xl font-bold text-blue-600">
                  ${usdcBalance.toFixed(2)}
                </p>
              </div>
              <div className="text-4xl">💵</div>
            </div>
          </div>

          <button
            onClick={refreshBalances}
            className="w-full mt-4 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-gray-700 font-medium"
          >
            🔄 Refresh Balances
          </button>
        </div>
      )}
    </div>
  );
}

