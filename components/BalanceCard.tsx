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
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
        <p className="text-gray-500 text-sm">Connect wallet to view balances</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <h2 className="text-lg font-medium mb-6 text-white">Balances</h2>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="py-4 border-b border-gray-800">
            <p className="text-xs text-gray-500 mb-2">BRB</p>
            <p className="text-2xl font-light text-red-500">
              {brbBalance.toFixed(2)}
            </p>
          </div>

          <div className="py-4 border-b border-gray-800">
            <p className="text-xs text-gray-500 mb-2">USDC</p>
            <p className="text-2xl font-light text-gray-300">
              ${usdcBalance.toFixed(2)}
            </p>
          </div>

          <button
            onClick={refreshBalances}
            className="w-full mt-2 py-2 text-sm text-gray-400 hover:text-red-500 transition"
          >
            Refresh
          </button>
        </div>
      )}
    </div>
  );
}

