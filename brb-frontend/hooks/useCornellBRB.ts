import { useState, useCallback, useEffect } from 'react';
import { sessionStorage } from '@/utils/sessionStorage';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3002';

export function useCornellBRB() {
  const [cornellBalance, setCornellBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Load session ID from storage on mount
  useEffect(() => {
    const storedSession = sessionStorage.getSessionId();
    if (storedSession) {
      setSessionId(storedSession);
    }
  }, []);

  /**
   * Fetch Cornell BRB balance from GET system
   * @param sessionIdOverride - Optional session ID override (defaults to stored session)
   */
  const fetchBalance = useCallback(async (sessionIdOverride?: string) => {
    setLoading(true);
    setError(null);
    
    const session = sessionIdOverride || sessionId || sessionStorage.getSessionId() || 'mock';
    
    try {
      const res = await fetch(`${API_BASE}/api/balance/cornell-brb`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session })
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
  }, [sessionId]);

  /**
   * Fetch Cornell BRB transaction history
   * @param sessionIdOverride - Optional session ID override (defaults to stored session)
   */
  const fetchTransactions = useCallback(async (sessionIdOverride?: string) => {
    setLoading(true);
    setError(null);
    
    const session = sessionIdOverride || sessionId || sessionStorage.getSessionId() || 'mock';
    
    try {
      const res = await fetch(`${API_BASE}/api/transactions/get-history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session })
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
  }, [sessionId]);

  /**
   * Fetch combined balances (Cornell + Crypto)
   */
  const fetchCombinedBalance = useCallback(async (
    sessionIdOverride?: string,
    walletAddress?: string
  ) => {
    setLoading(true);
    setError(null);
    
    const session = sessionIdOverride || sessionId || sessionStorage.getSessionId() || 'mock';
    
    try {
      const res = await fetch(`${API_BASE}/api/balance/combined`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session, walletAddress })
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
  }, [sessionId]);

  /**
   * Clear session and log out
   */
  const logout = useCallback(() => {
    sessionStorage.clearSessionId();
    setSessionId(null);
    setCornellBalance(0);
    setTransactions([]);
  }, []);

  return {
    cornellBalance,
    transactions,
    loading,
    error,
    sessionId,
    isAuthenticated: !!sessionId || sessionStorage.hasSession(),
    fetchBalance,
    fetchTransactions,
    fetchCombinedBalance,
    logout
  };
}

