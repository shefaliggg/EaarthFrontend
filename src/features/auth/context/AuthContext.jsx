// src/features/auth/context/AuthContext.jsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { getCurrentUserThunk, logoutUserThunk } from "../store/user.thunks";
import { clearUserData } from "../store/user.slice";
import { setLogoutFunction } from "../config/globalLogoutConfig";

const AuthContext = createContext(null);

const PUBLIC_ROUTES = [
  "/auth/login",
  "/auth/temp-login",
  "/auth/set-password",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/otp-verification",
  "/auth/verify-email",
  "/invite/verify",
];

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { currentUser, isFetching } = useSelector((state) => state.user);
  const [initialLoading, setInitialLoading] = useState(true);

  const isPublicRoute = useCallback(
    (pathname) => PUBLIC_ROUTES.some((route) => pathname.startsWith(route)),
    []
  );

  // ✅ INITIAL AUTH CHECK - Same pattern as admin
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log("🔄 Checking user authentication...");
        
        // Only fetch if we don't have currentUser
        if (!currentUser) {
          await dispatch(getCurrentUserThunk()).unwrap();
          console.log("✅ User authenticated");
        }
      } catch (error) {
        console.log("ℹ️  No valid user session");
        // Clear user data on error
        dispatch(clearUserData());
      } finally {
        setInitialLoading(false);
      }
    };

    initAuth();
  }, []); // Only run once on mount

  // ✅ ROUTE GUARD - Only after initial loading is done
  useEffect(() => {
    if (initialLoading) return;

    const isPublic = isPublicRoute(location.pathname);

    // Redirect to login if not authenticated and trying to access protected route
    if (!currentUser && !isPublic) {
      console.log("⚠️  Not authenticated, redirecting to login");
      navigate("/auth/login", { replace: true });
    }

    // Redirect to home if authenticated and trying to access public route
    if (currentUser && isPublic) {
      console.log("✅ Already authenticated, redirecting to home");
      navigate("/home", { replace: true });
    }
  }, [currentUser, location.pathname, initialLoading, navigate, isPublicRoute]);

  // ✅ LOGOUT
  const logout = useCallback(async () => {
    try {
      console.log("🚪 Logging out user...");
      await dispatch(logoutUserThunk()).unwrap();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch(clearUserData());
      navigate("/auth/login", { replace: true });
    }
  }, [dispatch, navigate]);

  // ✅ GLOBAL LOGOUT HANDLER
  useEffect(() => {
    setLogoutFunction(logout);
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        isAuthenticated: !!currentUser,
        loading: isFetching,
        initialLoading,
        logout,
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

export default AuthContext;