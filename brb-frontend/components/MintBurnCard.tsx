'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useTreasury } from '@/hooks/useTreasury';

export default function MintBurnCard() {
  const { connected } = useWallet();
  const { depositAndMint, burnAndRedeem, loading } = useTreasury();
  
  const [activeTab, setActiveTab] = useState<'mint' | 'burn'>('mint');
  const [amount, setAmount] = useState('');
  const [txStatus, setTxStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleMint = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setTxStatus({ type: 'error', message: 'Please enter a valid amount' });
      return;
    }

    setTxStatus({ type: null, message: '' });
    try {
      const tx = await depositAndMint(parseFloat(amount));
      setTxStatus({ 
        type: 'success', 
        message: `Successfully minted ${amount} BRBs! TX: ${tx.slice(0, 8)}...` 
      });
      setAmount('');
    } catch (error: any) {
      setTxStatus({ 
        type: 'error', 
        message: error.message || 'Transaction failed' 
      });
    }
  };

  const handleBurn = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setTxStatus({ type: 'error', message: 'Please enter a valid amount' });
      return;
    }

    setTxStatus({ type: null, message: '' });
    try {
      const tx = await burnAndRedeem(parseFloat(amount));
      setTxStatus({ 
        type: 'success', 
        message: `Successfully redeemed ${amount} USDC! TX: ${tx.slice(0, 8)}...` 
      });
      setAmount('');
    } catch (error: any) {
      setTxStatus({ 
        type: 'error', 
        message: error.message || 'Transaction failed' 
      });
    }
  };

  if (!connected) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
        <p className="text-gray-500 text-sm mb-2">Connect wallet to continue</p>
        <p className="text-xs text-gray-600">1 BRB = $1 USDC</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <div className="flex border-b border-gray-800 mb-6">
        <button
          onClick={() => setActiveTab('mint')}
          className={`flex-1 py-3 text-sm font-medium transition ${
            activeTab === 'mint'
              ? 'text-red-500 border-b-2 border-red-500'
              : 'text-gray-500 hover:text-gray-400'
          }`}
        >
          Mint
        </button>
        <button
          onClick={() => setActiveTab('burn')}
          className={`flex-1 py-3 text-sm font-medium transition ${
            activeTab === 'burn'
              ? 'text-red-500 border-b-2 border-red-500'
              : 'text-gray-500 hover:text-gray-400'
          }`}
        >
          Burn
        </button>
      </div>

      {activeTab === 'mint' ? (
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-3">
              Amount
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:border-red-500 focus:outline-none text-lg font-light text-white"
                disabled={loading}
              />
              <span className="absolute right-4 top-3 text-gray-500 text-sm">USDC</span>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Receive {amount || '0'} BRBs
            </p>
          </div>

          <button
            onClick={handleMint}
            disabled={loading || !amount}
            className="w-full bg-red-600 hover:bg-red-500 disabled:bg-gray-800 text-white text-sm py-3 rounded-lg transition"
          >
            {loading ? 'Processing...' : 'Mint BRBs'}
          </button>

          <div className="bg-black border border-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-500">
              Deposit USDC to mint BRBs at 1:1. Your USDC is held as collateral.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-3">
              Amount
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:border-red-500 focus:outline-none text-lg font-light text-white"
                disabled={loading}
              />
              <span className="absolute right-4 top-3 text-gray-500 text-sm">BRBs</span>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Receive ${amount || '0'} USDC
            </p>
          </div>

          <button
            onClick={handleBurn}
            disabled={loading || !amount}
            className="w-full bg-red-600 hover:bg-red-500 disabled:bg-gray-800 text-white text-sm py-3 rounded-lg transition"
          >
            {loading ? 'Processing...' : 'Burn BRBs'}
          </button>

          <div className="bg-black border border-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-500">
              Burning is permanent. Receive USDC back at 1:1 ratio.
            </p>
          </div>
        </div>
      )}

      {txStatus.type && (
        <div
          className={`mt-4 p-3 rounded-lg border ${
            txStatus.type === 'success'
              ? 'bg-green-950 border-green-800 text-green-400'
              : 'bg-red-950 border-red-800 text-red-400'
          }`}
        >
          <p className="text-xs">{txStatus.message}</p>
        </div>
      )}
    </div>
  );
}

