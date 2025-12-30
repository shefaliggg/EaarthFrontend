// src/features/auth/context/AuthContext.jsx
import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { getCurrentUserThunk, logoutUserThunk } from "../store/user.thunks";
import { API_ROUTE } from "../../../constants/apiEndpoints";
import { setLogoutFunction } from "../config/globalLogoutConfig";

const AuthContext = createContext(null);

const PUBLIC_ROUTES = [
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
  "/auth/verify-email",
  "/auth/result",
  "/invite/verify",
];

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { currentUser, isAuthenticated, isFetching } = useSelector(
    (state) => state.user
  );

  const [initialLoading, setInitialLoading] = useState(true);

  const isPublicRoute = useCallback(
    (pathname) => PUBLIC_ROUTES.some((route) => pathname.startsWith(route)),
    []
  );

  /* -------------------------------------------------------------------------- */
  /*                            INITIAL AUTH CHECK                              */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const initAuth = async () => {
      try {
        await dispatch(getCurrentUserThunk()).unwrap();
      } catch {
        // silent fail → handled by route guard
      } finally {
        setInitialLoading(false);
      }
    };

    initAuth();
  }, [dispatch]);

  /* -------------------------------------------------------------------------- */
  /*                              ROUTE GUARD                                   */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (initialLoading) return;

    const isPublic = isPublicRoute(location.pathname);

    if (!isAuthenticated && !isPublic) {
      navigate(API_ROUTE.AUTH.LOGIN, { replace: true });
    }

    if (isAuthenticated && isPublic) {
      navigate("/home", { replace: true });
    }
  }, [
    isAuthenticated,
    location.pathname,
    initialLoading,
    navigate,
    isPublicRoute,
  ]);

  /* -------------------------------------------------------------------------- */
  /*                                  LOGOUT                                    */
  /* -------------------------------------------------------------------------- */
  const logout = useCallback(async () => {
    try {
      await dispatch(logoutUserThunk()).unwrap();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      navigate(API_ROUTE.AUTH.LOGIN, { replace: true });
    }
  }, [dispatch, navigate]);

  /* ---------------------------- GLOBAL LOGOUT ---------------------------- */
  useEffect(() => {
    setLogoutFunction(logout);
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        isAuthenticated,
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
