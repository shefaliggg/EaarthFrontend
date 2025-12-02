import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants/apiEndpoints";
import { authService } from "../services/auth.service";
import { setLogoutFunction } from "../config/globalLogoutConfig";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  // Routes that don't require auth check
  const publicRoutes = [
    "/auth/login",
    "/auth/temp-login",
    "/auth/set-password",
    "/auth/upload-id",
    "/auth/live-photo",
    "/auth/identity-verification",
    "/auth/terms",
    "/auth/otp-verification",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/invite/verify",
    "/auth/result",
  ];

  const isPublicRoute = useCallback((pathname) => {
    return publicRoutes.some(route => pathname.startsWith(route));
  }, []);

  useEffect(() => {
    const init = async () => {
      // Skip auth check for public routes
      if (isPublicRoute(location.pathname)) {
        setInitialLoading(false);
        setLoading(false);
        return;
      }

      // Only fetch user if not already loaded
      if (!user) {
        try {
          const loggedInUser = await authService.getCurrentUser();
          if (loggedInUser) {
            setUser(loggedInUser);
            setIsAuthenticated(true);
            console.log("✅ User authenticated:", loggedInUser.email);
            if (isPublicRoute(location.pathname)) {
              navigate("/home", { replace: true });
            }
          } else {
            // No user found, redirect to login if not on public route
            if (!isPublicRoute(location.pathname)) {
              navigate(ROUTES.AUTH.LOGIN, { replace: true });
              setIsAuthenticated(false);
            }
          }
        } catch (err) {
          // Error fetching user - likely 401 (not authenticated)
          console.log("ℹ️ User not authenticated");
          setUser(null);
          setIsAuthenticated(false);
          // Only redirect if not already on a public route
          if (!isPublicRoute(location.pathname)) {
            navigate(ROUTES.AUTH.LOGIN, { replace: true });
          }
        } finally {
          setInitialLoading(false);
          setLoading(false);
        }
      } else {
        setInitialLoading(false);
        setLoading(false);
      }
    };

    init();
  }, [location.pathname, user, navigate, isPublicRoute]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      navigate(ROUTES.AUTH.LOGIN, { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    setLogoutFunction(logout);
  }, [logout]);

  const updateUser = (newUserData) => {
    setUser((prev) => ({ ...prev, ...newUserData }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        logout,
        updateUser,
        loading,
        isAuthenticated,
        initialLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);