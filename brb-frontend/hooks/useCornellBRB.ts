import { useState, useCallback } from 'react';

const API_BASE = 'http://localhost:3002';

export function useCornellBRB() {
  const [cornellBalance, setCornellBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch Cornell BRB balance from GET system
   * @param sessionId - GET session ID (use "mock" for testing)
   */
  const fetchBalance = useCallback(async (sessionId: string = 'mock') => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_BASE}/api/balance/cornell-brb`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });

      if (!res.ok) {
        throw new Error('Failed to fetch balance');
      }

      const data = await res.json();
      setCornellBalance(data.balance);
      return data.balance;
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching Cornell BRB:', err);
      return 0;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch Cornell BRB transaction history
   * @param sessionId - GET session ID (use "mock" for testing)
   */
  const fetchTransactions = useCallback(async (sessionId: string = 'mock') => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_BASE}/api/transactions/get-history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });

      if (!res.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data = await res.json();
      setTransactions(data.transactions);
      return data.transactions;
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching transactions:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch combined balances (Cornell + Crypto)
   */
  const fetchCombinedBalance = useCallback(async (
    sessionId: string = 'mock',
    walletAddress?: string
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_BASE}/api/balance/combined`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, walletAddress })
      });

      if (!res.ok) {
        throw new Error('Failed to fetch combined balance');
      }

      const data = await res.json();
      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching combined balance:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    cornellBalance,
    transactions,
    loading,
    error,
    fetchBalance,
    fetchTransactions,
    fetchCombinedBalance
  };
}

