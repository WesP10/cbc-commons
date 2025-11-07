'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-red-700 to-red-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold hover:text-red-100 transition">
              🐻 BRBs
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link href="/" className="hover:text-red-100 transition">
                Dashboard
              </Link>
              <Link href="/swap" className="hover:text-red-100 transition">
                Swap
              </Link>
              <Link href="/transactions" className="hover:text-red-100 transition">
                Transactions
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <WalletMultiButton className="!bg-white !text-red-700 hover:!bg-red-50 !transition" />
          </div>
        </div>
      </div>
    </nav>
  );
}

