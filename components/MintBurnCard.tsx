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
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-500 text-sm mb-2">Connect wallet to continue</p>
        <p className="text-xs text-gray-400">1 BRB = $1 USDC</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('mint')}
          className={`flex-1 py-3 text-sm font-medium transition ${
            activeTab === 'mint'
              ? 'text-gray-900 border-b-2 border-gray-900'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Mint
        </button>
        <button
          onClick={() => setActiveTab('burn')}
          className={`flex-1 py-3 text-sm font-medium transition ${
            activeTab === 'burn'
              ? 'text-gray-900 border-b-2 border-gray-900'
              : 'text-gray-400 hover:text-gray-600'
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
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-lg font-light"
                disabled={loading}
              />
              <span className="absolute right-4 top-3 text-gray-400 text-sm">USDC</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Receive {amount || '0'} BRBs
            </p>
          </div>

          <button
            onClick={handleMint}
            disabled={loading || !amount}
            className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white text-sm py-3 rounded-lg transition"
          >
            {loading ? 'Processing...' : 'Mint BRBs'}
          </button>

          <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
            <p className="text-xs text-gray-600">
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
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-lg font-light"
                disabled={loading}
              />
              <span className="absolute right-4 top-3 text-gray-400 text-sm">BRBs</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Receive ${amount || '0'} USDC
            </p>
          </div>

          <button
            onClick={handleBurn}
            disabled={loading || !amount}
            className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white text-sm py-3 rounded-lg transition"
          >
            {loading ? 'Processing...' : 'Burn BRBs'}
          </button>

          <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
            <p className="text-xs text-gray-600">
              Burning is permanent. Receive USDC back at 1:1 ratio.
            </p>
          </div>
        </div>
      )}

      {txStatus.type && (
        <div
          className={`mt-4 p-3 rounded-lg border ${
            txStatus.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          <p className="text-xs">{txStatus.message}</p>
        </div>
      )}
    </div>
  );
}

