'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect } from 'react';
import { useTreasury } from '@/hooks/useTreasury';

export default function BalanceCard() {
  const { connected } = useWallet();
  const { brbBalance, usdcBalance, loading, refreshBalances } = useTreasury();

  useEffect(() => {
    if (connected) {
      refreshBalances();
    }
  }, [connected]);

  if (!connected || loading) return null;

  return (
    <div className="flex justify-between text-sm text-gray-600 mb-2">
      <div>BRB: <span className="font-medium text-gray-900">{brbBalance.toFixed(2)}</span></div>
      <div>USDC: <span className="font-medium text-gray-900">${usdcBalance.toFixed(2)}</span></div>
    </div>
  );
}

