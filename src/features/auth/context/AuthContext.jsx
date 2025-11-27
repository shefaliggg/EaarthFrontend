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
  const [tempLoginData, setTempLoginData] = useState(null);
  const [loading, setLoading] = useState(false);

  // All public routes that don't require authentication
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
            console.log("✅ User authenticated:", loggedInUser.email);
          } else {
            // No user found, redirect to login
            navigate(ROUTES.AUTH.LOGIN, { replace: true });
          }
        } catch (err) {
          // Error fetching user - likely 401 (not authenticated)
          console.log("ℹ️ User not authenticated");
          setUser(null);
          
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
      setUser(null);
      setTempLoginData(null);
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
        tempLoginData,
        setTempLoginData,
        logout,
        updateUser,
        loading,
        initialLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};