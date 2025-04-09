'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from './api';
import { getToken, removeToken } from './indexdb';

export const AuthContext = createContext({
  adminLogin: async () => {},
  researcherLogin: async () => {},
  logout: async () => {},
  isAuthenticated: false,
  isAdmin: false,
  isResearcher: false,
  user: null,
  loading: true,
  error: null
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await getToken();
      if (!token) {
        setUser(null);
        setLoading(false);
        return false;
      }

      try {
        // Actually verify the token with the server
        const response = await authApi.verifyToken();
        setUser({
          ...response.user,
          isAuthenticated: true
        });
        return true;
      } catch (error) {
        console.error('Token verification failed:', error);
        
        // Handle specific error conditions
        if (error.status === 401) {
          await removeToken();
        }
        
        setUser(null);
        setError(error.message || 'Authentication failed');
        return false;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setError('Authentication check failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Run auth check on initial load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const adminLogin = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.adminLogin(email, password);
      setUser({
        ...data.user,
        isAuthenticated: true,
        role: 'admin',
      });
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const researcherLogin = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.researcherLogin(email, password);
      setUser({
        ...data.user,
        isAuthenticated: true,
        role: 'researcher',
      });
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout failed:', error);
      setError(error.message || 'Logout failed');
    } finally {
      await removeToken();
      setUser(null);
      setLoading(false);
      router.push('/');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        adminLogin,
        researcherLogin,
        logout,
        checkAuth,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isResearcher: user?.role === 'researcher',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Auth protection hooks with improved error handling
export function withAuth(Component) {
  return function AuthProtected(props) {
    const { user, loading, error, checkAuth } = useContext(AuthContext);
    const router = useRouter();
    const [retryCount, setRetryCount] = useState(0);
    const MAX_RETRIES = 1;

    useEffect(() => {
      // If initial auth check failed but we haven't retried yet, try again
      if (!loading && !user && error && retryCount < MAX_RETRIES) {
        const retryAuth = async () => {
          setRetryCount(prev => prev + 1);
          const success = await checkAuth();
          if (!success) {
            router.push('/researcher-login');
          }
        };
        retryAuth();
      } else if (!loading && !user && retryCount >= MAX_RETRIES) {
        router.push('/researcher-login');
      }
    }, [user, loading, error, router, checkAuth, retryCount]);

    if (loading) return <div>Loading...</div>;
    if (!user) return null;

    return <Component {...props} />;
  };
}

export function withAdminAuth(Component) {
  return function AdminProtected(props) {
    const { user, loading, error, isAdmin, checkAuth } = useContext(AuthContext);
    const router = useRouter();
    const [retryCount, setRetryCount] = useState(0);
    const MAX_RETRIES = 1;

    useEffect(() => {
      if (!loading && !user && error && retryCount < MAX_RETRIES) {
        const retryAuth = async () => {
          setRetryCount(prev => prev + 1);
          const success = await checkAuth();
          if (!success || !isAdmin) {
            router.push('/admin-login');
          }
        };
        retryAuth();
      } else if (!loading) {
        if (!user) {
          router.push('/admin-login');
        } else if (!isAdmin) {
          router.push('/');
        }
      }
    }, [user, loading, isAdmin, error, router, checkAuth, retryCount]);

    if (loading) return <div>Loading...</div>;
    if (!user || !isAdmin) return null;

    return <Component {...props} />;
  };
}

export function withResearcherAuth(Component) {
  return function ResearcherProtected(props) {
    const { user, loading, error, isResearcher, checkAuth } = useContext(AuthContext);
    const router = useRouter();
    const [retryCount, setRetryCount] = useState(0);
    const MAX_RETRIES = 1;

    useEffect(() => {
      if (!loading && !user && error && retryCount < MAX_RETRIES) {
        const retryAuth = async () => {
          setRetryCount(prev => prev + 1);
          const success = await checkAuth();
          if (!success || !isResearcher) {
            router.push('/researcher-login');
          }
        };
        retryAuth();
      } else if (!loading) {
        if (!user) {
          router.push('/researcher-login');
        } else if (!isResearcher) {
          router.push('/');
        }
      }
    }, [user, loading, isResearcher, error, router, checkAuth, retryCount]);

    if (loading) return <div>Loading...</div>;
    if (!user || !isResearcher) return null;

    return <Component {...props} />;
  };
}