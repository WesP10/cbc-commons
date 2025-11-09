'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { useCornellBRB } from '@/hooks/useCornellBRB';
import { useTreasury } from '@/hooks/useTreasury';

export default function BalanceCard() {
  const { connected } = useWallet();
  const { cornellBalance, fetchBalance } = useCornellBRB();
  const { brbBalance } = useTreasury();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBalances = async () => {
      setLoading(true);
      await fetchBalance('mock'); // Using mock data for now
      setLoading(false);
    };
    
    loadBalances();
  }, [fetchBalance]);

  if (!connected || loading) return null;

  const totalBRB = cornellBalance + brbBalance;

  return (
    <div className="space-y-1 mb-2">
      <div className="flex justify-between text-xs text-gray-500">
        <span>Cornell BRB</span>
        <span>{cornellBalance.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>Crypto BRB</span>
        <span>{brbBalance.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm font-medium text-gray-900 pt-1 border-t border-gray-100">
        <span>Total BRB</span>
        <span className="text-red-600">{totalBRB.toFixed(2)}</span>
      </div>
    </div>
  );
}

