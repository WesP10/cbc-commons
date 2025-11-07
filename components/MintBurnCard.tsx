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
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <p className="text-gray-500 mb-4">Connect your wallet to mint or burn BRBs</p>
        <p className="text-sm text-gray-400">1 BRB = $1 USDC (1:1 peg)</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('mint')}
          className={`flex-1 py-3 px-4 font-semibold transition ${
            activeTab === 'mint'
              ? 'text-red-600 border-b-2 border-red-600'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Mint BRBs
        </button>
        <button
          onClick={() => setActiveTab('burn')}
          className={`flex-1 py-3 px-4 font-semibold transition ${
            activeTab === 'burn'
              ? 'text-red-600 border-b-2 border-red-600'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Burn BRBs
        </button>
      </div>

      {activeTab === 'mint' ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deposit USDC to Mint BRBs
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none text-lg"
                disabled={loading}
              />
              <span className="absolute right-4 top-3 text-gray-500">USDC</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              You will receive: {amount || '0'} BRBs
            </p>
          </div>

          <button
            onClick={handleMint}
            disabled={loading || !amount}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            {loading ? 'Processing...' : 'Mint BRBs'}
          </button>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              💡 Deposit USDC to mint BRBs at a 1:1 ratio. Your USDC is held as collateral in the treasury.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Burn BRBs to Redeem USDC
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none text-lg"
                disabled={loading}
              />
              <span className="absolute right-4 top-3 text-gray-500">BRBs</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              You will receive: ${amount || '0'} USDC
            </p>
          </div>

          <button
            onClick={handleBurn}
            disabled={loading || !amount}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            {loading ? 'Processing...' : 'Burn BRBs'}
          </button>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-800">
              ⚠️ Burning BRBs is permanent. You will receive USDC back from the treasury at a 1:1 ratio.
            </p>
          </div>
        </div>
      )}

      {txStatus.type && (
        <div
          className={`mt-4 p-4 rounded-lg ${
            txStatus.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          <p className="text-sm">{txStatus.message}</p>
        </div>
      )}
    </div>
  );
}

