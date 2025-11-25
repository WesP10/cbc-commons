/**
 * Session Storage Utilities
 * Handles storing and retrieving GET session ID from localStorage
 */

const SESSION_KEY = 'get_session_id';

export const sessionStorage = {
  /**
   * Get stored session ID
   */
  getSessionId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(SESSION_KEY);
  },

  /**
   * Store session ID
   */
  setSessionId(sessionId: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SESSION_KEY, sessionId);
  },

  /**
   * Clear stored session ID
   */
  clearSessionId(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(SESSION_KEY);
  },

  /**
   * Check if session exists
   */
  hasSession(): boolean {
    return this.getSessionId() !== null;
  }
};

