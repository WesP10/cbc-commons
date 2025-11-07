'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-12">
            <Link href="/" className="text-xl font-medium text-gray-900 hover:text-red-600 transition">
              BRBs
            </Link>
            <div className="hidden md:flex space-x-8 text-sm">
              <Link href="/" className="text-gray-600 hover:text-red-600 transition">
                Dashboard
              </Link>
              <Link href="/swap" className="text-gray-600 hover:text-red-600 transition">
                Swap
              </Link>
              <Link href="/transactions" className="text-gray-600 hover:text-red-600 transition">
                History
              </Link>
            </div>
          </div>
          <div>
            <WalletMultiButton className="!bg-red-600 !text-white hover:!bg-red-700 !text-sm !py-2 !px-4 !rounded" />
          </div>
        </div>
      </div>
    </nav>
  );
}

