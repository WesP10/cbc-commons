'use client';

import { useEffect, useState } from 'react';

export default function TreasuryStats() {
  const [stats, setStats] = useState({
    totalCollateral: 0,
    totalSupply: 0,
    collateralRatio: 100,
    isPaused: false,
  });

  useEffect(() => {
    // TODO: Fetch actual treasury stats from blockchain
    // For now, using placeholder data
    setStats({
      totalCollateral: 0,
      totalSupply: 0,
      collateralRatio: 100,
      isPaused: false,
    });
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Treasury Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
          <p className="text-sm text-blue-600 font-medium mb-1">Total Collateral</p>
          <p className="text-3xl font-bold text-blue-700">
            ${stats.totalCollateral.toLocaleString()}
          </p>
          <p className="text-xs text-blue-500 mt-1">USDC locked in treasury</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6">
          <p className="text-sm text-red-600 font-medium mb-1">Total BRB Supply</p>
          <p className="text-3xl font-bold text-red-700">
            {stats.totalSupply.toLocaleString()} BRBs
          </p>
          <p className="text-xs text-red-500 mt-1">Circulating supply</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
          <p className="text-sm text-green-600 font-medium mb-1">Collateral Ratio</p>
          <p className="text-3xl font-bold text-green-700">{stats.collateralRatio}%</p>
          <p className="text-xs text-green-500 mt-1">Always 1:1 backed</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
          <p className="text-sm text-purple-600 font-medium mb-1">Status</p>
          <p className="text-3xl font-bold text-purple-700">
            {stats.isPaused ? '⏸️ Paused' : '✅ Active'}
          </p>
          <p className="text-xs text-purple-500 mt-1">Treasury operations</p>
        </div>
      </div>

      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-600">
          <strong>Note:</strong> Connect your smart contract to see live treasury data
        </p>
      </div>
    </div>
  );
}

