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
        message: `Successfully minted ${amount} BRBs!` 
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
        message: `Successfully redeemed ${amount} USDC!` 
      });
      setAmount('');
    } catch (error: any) {
      setTxStatus({ 
        type: 'error', 
        message: error.message || 'Transaction failed' 
      });
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-4">
      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('mint')}
          className={`flex-1 py-2 px-4 rounded-2xl text-sm font-medium transition ${
            activeTab === 'mint'
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Mint
        </button>
        <button
          onClick={() => setActiveTab('burn')}
          className={`flex-1 py-2 px-4 rounded-2xl text-sm font-medium transition ${
            activeTab === 'burn'
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Burn
        </button>
      </div>

      {activeTab === 'mint' ? (
        <div className="space-y-3">
          {/* Input */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="flex justify-between mb-2">
              <span className="text-xs text-gray-500">You pay</span>
            </div>
            <div className="flex items-center">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="flex-1 bg-transparent text-2xl font-light outline-none"
                disabled={loading || !connected}
              />
              <span className="text-sm font-medium text-gray-900">USDC</span>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="text-gray-400">↓</div>
          </div>

          {/* Output */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="flex justify-between mb-2">
              <span className="text-xs text-gray-500">You receive</span>
            </div>
            <div className="flex items-center">
              <span className="flex-1 text-2xl font-light text-gray-400">
                {amount || '0'}
              </span>
              <span className="text-sm font-medium text-red-600">BRB</span>
            </div>
          </div>

          {/* Button */}
          {connected ? (
            <button
              onClick={handleMint}
              disabled={loading || !amount}
              className="w-full bg-red-600 hover:bg-red-500 disabled:bg-gray-200 text-white disabled:text-gray-400 font-medium py-4 rounded-2xl transition"
            >
              {loading ? 'Processing...' : 'Mint BRBs'}
            </button>
          ) : (
            <div className="w-full bg-gray-100 text-gray-500 text-center font-medium py-4 rounded-2xl">
              Connect wallet
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {/* Input */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="flex justify-between mb-2">
              <span className="text-xs text-gray-500">You burn</span>
            </div>
            <div className="flex items-center">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="flex-1 bg-transparent text-2xl font-light outline-none"
                disabled={loading || !connected}
              />
              <span className="text-sm font-medium text-red-600">BRB</span>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="text-gray-400">↓</div>
          </div>

          {/* Output */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="flex justify-between mb-2">
              <span className="text-xs text-gray-500">You receive</span>
            </div>
            <div className="flex items-center">
              <span className="flex-1 text-2xl font-light text-gray-400">
                {amount || '0'}
              </span>
              <span className="text-sm font-medium text-gray-900">USDC</span>
            </div>
          </div>

          {/* Button */}
          {connected ? (
            <button
              onClick={handleBurn}
              disabled={loading || !amount}
              className="w-full bg-red-600 hover:bg-red-500 disabled:bg-gray-200 text-white disabled:text-gray-400 font-medium py-4 rounded-2xl transition"
            >
              {loading ? 'Processing...' : 'Burn BRBs'}
            </button>
          ) : (
            <div className="w-full bg-gray-100 text-gray-500 text-center font-medium py-4 rounded-2xl">
              Connect wallet
            </div>
          )}
        </div>
      )}

      {/* Status Message */}
      {txStatus.type && (
        <div
          className={`mt-3 p-3 rounded-2xl text-xs ${
            txStatus.type === 'success'
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {txStatus.message}
        </div>
      )}

      {/* Rate Info */}
      <div className="mt-4 text-xs text-gray-400 text-center">
        1 BRB = 1 USDC
      </div>
    </div>
  );
}
