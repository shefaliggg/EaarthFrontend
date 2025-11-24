import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authUtils } from "../config/authUtilis"; 
import { authService } from "../../auth/services/auth.service"; 
import { ROUTES } from "../../../../src/constants/apiEndpoints";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [tempLoginData, setTempLoginData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const loggedInUser = await authUtils.getCurrentUser();
      setUser(loggedInUser);
      setLoading(false);
    };
    init();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const { email, password } = credentials;
      const userData = await authUtils.login(email, password);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const temporaryLogin = async (credentials) => {
    setLoading(true);
    try {
      const res = await authService.temporaryLogin(credentials);

      if (!res?.success) {
        throw new Error(res?.message || "Temporary login failed");
      }

      const tempData = {
        userId: res.data?.userId,
        email: credentials.email,
        isTemporary: true,
      };

      setTempLoginData(tempData);

      navigate(ROUTES.AUTH.SET_PASSWORD, {
        replace: true,
        state: tempData,
      });

      return res;
    } catch (error) {
      console.error("Temporary login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authUtils.logout();
    setUser(null);
    setTempLoginData(null);
    navigate(ROUTES.AUTH.LOGIN, { replace: true });
  };

  const updateUser = async (newUserData) => {
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
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);




