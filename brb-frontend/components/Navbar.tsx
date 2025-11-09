'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-lg font-semibold text-gray-900 hover:text-red-600 transition">
              BRBs
            </Link>
            <Link href="/transactions" className="text-sm text-gray-600 hover:text-gray-900 transition">
              Transactions
            </Link>
          </div>
          <WalletMultiButton className="!bg-red-600 !text-white hover:!bg-red-500 !text-sm !py-2 !px-4 !rounded-full" />
        </div>
      </div>
    </nav>
  );
}

