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
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <h2 className="text-lg font-medium mb-6 text-white">Treasury</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <p className="text-xs text-gray-500 mb-2">Collateral</p>
          <p className="text-xl font-light text-gray-300">
            ${stats.totalCollateral.toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-2">Supply</p>
          <p className="text-xl font-light text-gray-300">
            {stats.totalSupply.toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-2">Ratio</p>
          <p className="text-xl font-light text-gray-300">{stats.collateralRatio}%</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-2">Status</p>
          <p className="text-xl font-light text-gray-300">
            {stats.isPaused ? 'Paused' : 'Active'}
          </p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-800">
        <p className="text-xs text-gray-600">
          Connect smart contract to view live data
        </p>
      </div>
    </div>
  );
}

