"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { authApi, refreshAccessToken } from "./api";
import { getToken, removeToken } from "./indexdb";

export const AuthContext = createContext({
  adminLogin: async () => {},
  researcherLogin: async () => {},
  logout: async () => {},
  isAuthenticated: false,
  isAdmin: false,
  isResearcher: false,
  user: null,
  loading: true,
  error: null,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  console.log("AuthProvider initialized");

  const checkAuth = useCallback(async () => {
    console.log("Checking authentication...");
    try {
      setLoading(true);
      setError(null);

      const token = await getToken();
      console.log(
        "Token in checkAuth:",
        token ? `${token.substring(0, 10)}...` : "No token"
      );

      if (!token) {
        console.log("No token found, user not authenticated");
        setUser(null);
        setLoading(false);
        return false;
      }

      try {
        // First check if the current token is valid
        console.log("Verifying token with server...");
        const response = await authApi.verifyToken();
        console.log("Token verification successful:", response);

        setUser({
          ...response.user,
          isAuthenticated: true,
        });
        return true;
      } catch (error) {
        console.error("Token verification failed:", error);

        // Try refreshing the token
        if (error.status === 401) {
          console.log("Attempting to refresh token after failed verification");
          const refreshSuccess = await refreshAccessToken();

          if (refreshSuccess) {
            console.log("Token refreshed successfully, verifying again");
            try {
              const response = await authApi.verifyToken();
              setUser({
                ...response.user,
                isAuthenticated: true,
              });
              return true;
            } catch (verifyError) {
              console.error("Verification after refresh failed:", verifyError);
              await removeToken();
              setUser(null);
              setError("Session expired. Please login again.");
              return false;
            }
          } else {
            console.log("Token refresh failed, clearing token");
            await removeToken();
          }
        }

        setUser(null);
        setError(error.message || "Authentication failed");
        return false;
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      setError("Authentication check failed");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Run auth check on initial load
  useEffect(() => {
    console.log("Running initial auth check");
    checkAuth();
  }, [checkAuth]);

  const adminLogin = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Attempting admin login for:", email);
      const data = await authApi.adminLogin(email, password);
      console.log("Admin login successful:", data);
      setUser({
        ...data.user,
        isAuthenticated: true,
        role: "admin",
      });
      return true;
    } catch (error) {
      console.error("Admin login failed:", error);
      setError(error.message || "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const researcherLogin = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Attempting researcher login for:", email);
      const data = await authApi.researcherLogin(email, password);
      console.log("Researcher login successful:", data);
      setUser({
        ...data.user,
        isAuthenticated: true,
        role: "researcher",
      });
      return true;
    } catch (error) {
      console.error("Researcher login failed:", error);
      setError(error.message || "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      console.log("Logging out...");
      await authApi.logout();
      console.log("Logout API call successful");
    } catch (error) {
      console.error("Logout API call failed:", error);
      setError(error.message || "Logout failed");
    } finally {
      console.log("Removing local token");
      await removeToken();
      setUser(null);
      setLoading(false);
      router.push("/");
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
        isAdmin: user?.role === "admin",
        isResearcher: user?.role === "researcher",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

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
          console.log("Retrying authentication...");
          setRetryCount((prev) => prev + 1);
          const success = await checkAuth();
          if (!success) {
            console.log("Auth retry failed, redirecting to login");
            router.push("/researcher-login");
          }
        };
        retryAuth();
      } else if (!loading && !user && retryCount >= MAX_RETRIES) {
        console.log("Max retries reached, redirecting to login");
        router.push("/researcher-login");
      }
    }, [user, loading, error, router, checkAuth, retryCount]);

    if (loading) return <div>Loading...</div>;
    if (!user) return null;

    return <Component {...props} />;
  };
}

export function withAdminAuth(Component) {
  return function AdminProtected(props) {
    const { user, loading, error, isAdmin, checkAuth } =
      useContext(AuthContext);
    const router = useRouter();
    const [retryCount, setRetryCount] = useState(0);
    const MAX_RETRIES = 1;

    useEffect(() => {
      if (!loading && !user && error && retryCount < MAX_RETRIES) {
        const retryAuth = async () => {
          setRetryCount((prev) => prev + 1);
          const success = await checkAuth();
          if (!success || !isAdmin) {
            router.push("/admin-login");
          }
        };
        retryAuth();
      } else if (!loading) {
        if (!user) {
          router.push("/admin-login");
        } else if (!isAdmin) {
          router.push("/");
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
    const { user, loading, error, isResearcher, checkAuth } =
      useContext(AuthContext);
    const router = useRouter();
    const [retryCount, setRetryCount] = useState(0);
    const MAX_RETRIES = 1;

    useEffect(() => {
      if (!loading && !user && error && retryCount < MAX_RETRIES) {
        const retryAuth = async () => {
          setRetryCount((prev) => prev + 1);
          const success = await checkAuth();
          if (!success || !isResearcher) {
            router.push("/researcher-login");
          }
        };
        retryAuth();
      } else if (!loading) {
        if (!user) {
          router.push("/researcher-login");
        } else if (!isResearcher) {
          router.push("/");
        }
      }
    }, [user, loading, isResearcher, error, router, checkAuth, retryCount]);

    if (loading) return <div>Loading...</div>;
    if (!user || !isResearcher) return null;

    return <Component {...props} />;
  };
}
