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
  const [loading, setLoading] = useState(true);

  const noInitialLoadRoutes = [
    "/auth/login",
    "/auth/set-password",
    "/auth/reset",
    "/auth/forgot-password",
  ];

  useEffect(() => {
    const init = async () => {
      if (noInitialLoadRoutes.includes(location.pathname)) {
        setInitialLoading(false);
        return;
      }

      try {
        const loggedInUser = await authService.getCurrentUser();
        if (loggedInUser) setUser(loggedInUser);
      } catch (err) {
        setUser(null);
      } finally {
        setInitialLoading(false);
      }
    };
    init();
  }, [location.pathname]);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setTempLoginData(null);
    navigate(ROUTES.AUTH.LOGIN, { replace: true });
  }, [navigate]);

  useEffect(() => {
    setLogoutFunction(logout);
  }, [logout]);


  const login = async (credentials) => {
    setLoading(true);
    try {
      const { email, password } = credentials;
      const userData = await authService.login(email, password);
      setUser(userData);
      return userData;
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

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
        login,
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
