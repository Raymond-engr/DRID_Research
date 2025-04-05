'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from './api';
import { getToken, removeToken } from './indexdb';

export const AuthContext = createContext({
  adminLogin: async () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getToken();
        console.log("Retrieved token:", token ? "Token exists" : "No token found");
        if (!token) {
          setLoading(false);
          return;
        }

        // We should have an endpoint to verify the token and get user data
        // For now, we'll just assume the token is valid
        // In a real app, we would verify the token and get user data
        
        const payload = JSON.parse(atob(token.split('.')[1]));

        setUser({
          isAuthenticated: true,
          id: payload.userId,    
          email: payload.email,  
          role: payload.role 
        });

        setLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const adminLogin = async (email, password) => {
    setLoading(true);
    try {
      const data = await authApi.adminLogin(email, password);
      setUser({
        ...data.user,
        isAuthenticated: true,
        role: 'admin',
      });
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setLoading(false);
      return false;
    }
  };

  const researcherLogin = async (email, password) => {
    setLoading(true);
    try {
      const data = await authApi.researcherLogin(email, password);
      setUser({
        ...data.user,
        isAuthenticated: true,
        role: 'researcher',
      });
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      await removeToken();
      setUser(null);
      router.push('/');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        adminLogin,
        researcherLogin,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isResearcher: user?.role === 'researcher',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Auth protection hooks
export function withAuth(Component) {
  return function AuthProtected(props) {
    const { user, loading } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push('/researcher-login');
      }
    }, [user, loading, router]);

    if (loading || !user) return null;

    return <Component {...props} />;
  };
}

export function withAdminAuth(Component) {
  return function AdminProtected(props) {
    const { user, loading, isAdmin } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!user) {
          router.push('/admin-login');
        } else if (!isAdmin) {
          router.push('/');
        }
      }
    }, [user, loading, isAdmin, router]);

    if (loading || !user || !isAdmin) return null;

    return <Component {...props} />;
  };
}

export function withResearcherAuth(Component) {
  return function ResearcherProtected(props) {
    const { user, loading, isResearcher } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!user) {
          router.push('/researcher-login');
        } else if (!isResearcher) {
          router.push('/');
        }
      }
    }, [user, loading, isResearcher, router]);

    if (loading || !user || !isResearcher) return null;

    return <Component {...props} />;
  };
}