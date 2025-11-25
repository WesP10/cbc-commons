'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3002';
const GET_LOGIN_URL = 'https://get.cbord.com/cornell/full/login.php?mobileapp=1';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const storedSession = localStorage.getItem('get_session_id');
    if (storedSession) {
      // Validate session
      validateSession(storedSession);
    }
  }, []);

  const validateSession = async (sessionIdToValidate: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/validate-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sessionIdToValidate })
      });

      const data = await res.json();
      
      if (data.valid) {
        // Session is valid, redirect to home
        router.push('/');
      } else {
        // Session invalid, clear and show login
        localStorage.removeItem('get_session_id');
      }
    } catch (err) {
      console.error('Error validating session:', err);
      localStorage.removeItem('get_session_id');
    }
  };

  const handleIframeLoad = () => {
    // Note: Direct URL access will be blocked by CORS
    // Session ID detection happens via URL parameters on redirect
    // Alternative: Use popup window or redirect flow for better control
    console.log('Iframe loaded - monitoring for redirect');
  };

  // Poll iframe URL for session ID (works when iframe redirects to same-origin)
  useEffect(() => {
    if (!iframeRef.current) return;

    const checkSessionId = setInterval(() => {
      try {
        const iframe = iframeRef.current;
        if (!iframe) return;

        const iframeUrl = iframe.contentWindow?.location.href;
        if (iframeUrl && iframeUrl.includes('sessionId')) {
          try {
            const url = new URL(iframeUrl);
            const sessionIdParam = url.searchParams.get('sessionId');
            if (sessionIdParam) {
              clearInterval(checkSessionId);
              handleLoginSuccess(sessionIdParam);
            }
          } catch (e) {
            // URL parsing failed, continue polling
          }
        }
      } catch (e) {
        // Cross-origin access blocked (expected)
        // Session ID must be extracted via other means
      }
    }, 1000); // Check every second

    return () => clearInterval(checkSessionId);
  }, []);

  // Listen for messages from iframe (if we can modify GET's page)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security: Only accept messages from GET domain
      if (event.origin !== 'https://get.cbord.com') {
        return;
      }

      if (event.data && event.data.sessionId) {
        handleLoginSuccess(event.data.sessionId);
      }

      // Also check if URL contains sessionId
      if (event.data && event.data.url) {
        try {
          const url = new URL(event.data.url);
          const sessionIdParam = url.searchParams.get('sessionId');
          if (sessionIdParam) {
            handleLoginSuccess(sessionIdParam);
          }
        } catch (e) {
          console.error('Error parsing URL:', e);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleLoginSuccess = async (newSessionId: string) => {
    setLoading(true);
    setError(null);

    try {
      // Validate the session
      const res = await fetch(`${API_BASE}/api/auth/validate-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: newSessionId })
      });

      const data = await res.json();

      if (data.valid) {
        // Store session ID
        localStorage.setItem('get_session_id', newSessionId);
        setSessionId(newSessionId);

        // Redirect to home page
        setTimeout(() => {
          router.push('/');
        }, 500);
      } else {
        throw new Error('Session validation failed');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to validate session');
      setLoading(false);
    }
  };

  const handleMockLogin = () => {
    // For testing without real GET login
    const mockSessionId = 'mock';
    localStorage.setItem('get_session_id', mockSessionId);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-red-600 text-white p-6">
          <h1 className="text-2xl font-bold">Cornell BRB Login</h1>
          <p className="text-red-100 text-sm mt-1">
            Connect your Cornell GET account to view your BRB balance
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="p-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600">Validating session...</p>
          </div>
        )}

        {/* Login iframe */}
        {!loading && !sessionId && (
          <div className="p-6">
            <div className="mb-4">
              <p className="text-gray-600 text-sm mb-4">
                You will be redirected to Cornell&apos;s GET portal to log in with your NetID.
                After logging in, you&apos;ll be redirected back here automatically.
              </p>
              
              {/* iframe container */}
              <div className="border-2 border-gray-200 rounded-lg overflow-hidden" style={{ height: '500px' }}>
                <iframe
                  ref={iframeRef}
                  src={GET_LOGIN_URL}
                  className="w-full h-full"
                  title="Cornell GET Login"
                  onLoad={handleIframeLoad}
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
                />
              </div>
            </div>

            {/* Alternative: Direct link */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <a
                href={GET_LOGIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm transition-colors"
              >
                Open login in new window
              </a>
            </div>

            {/* Mock login for testing */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={handleMockLogin}
                  className="block w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm transition-colors"
                >
                  Use Mock Data (Development Only)
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 text-center text-xs text-gray-500">
          <p>Your credentials are handled securely by Cornell&apos;s GET system.</p>
          <p className="mt-1">We never store your NetID or password.</p>
        </div>
      </div>
    </div>
  );
}

