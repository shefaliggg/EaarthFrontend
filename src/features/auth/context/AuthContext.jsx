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

  // Routes that don't require auth check
  const publicRoutes = [
    "/auth/login",
    "/auth/set-password",
    "/auth/reset",
    "/auth/forgot-password",
    "/auth/otp-verification",
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
            // No user found, redirect to login if not on public route
            if (!isPublicRoute(location.pathname)) {
              navigate(ROUTES.AUTH.LOGIN, { replace: true });
            }
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

  const temporaryLogin = async (credentials) => {
    setLoading(true);
    try {
      const res = await authService.temporaryLogin(credentials);
      if (!res?.success) throw new Error(res?.message || "Temporary login failed");

      const tempData = {
        userId: res.data.userId,
        email: credentials.email,
        isTemporary: true,
      };

      setTempLoginData(tempData);

      navigate(ROUTES.AUTH.SET_PASSWORD, {
        replace: true,
        state: tempData,
      });

      return res;
    } catch (err) {
      console.error("Temporary login failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (newUserData) => {
    setUser((prev) => ({ ...prev, ...newUserData }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tempLoginData,
        temporaryLogin,
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

export const useAuth = () => useContext(AuthContext);