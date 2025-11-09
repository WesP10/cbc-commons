'use client';

import { useEffect, useState } from 'react';

export default function TreasuryStats() {
  const [stats, setStats] = useState({
    totalCollateral: 0,
    totalSupply: 0,
  });

  useEffect(() => {
    // TODO: Fetch from blockchain
    setStats({
      totalCollateral: 0,
      totalSupply: 0,
    });
  }, []);

  return (
    <div className="flex justify-center gap-8 text-xs text-gray-400 mt-6">
      <div>
        Collateral: <span className="text-gray-600">${stats.totalCollateral.toLocaleString()}</span>
      </div>
      <div>
        Supply: <span className="text-gray-600">{stats.totalSupply.toLocaleString()} BRB</span>
      </div>
    </div>
  );
}
