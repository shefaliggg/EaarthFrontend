import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getCurrentUserThunk, logoutUserThunk } from "../store/user.thunks";
import { API_ROUTE } from "../../../constants/apiEndpoints";
import { setLogoutFunction } from "../config/globalLogoutConfig";
import { clearUserData, setCurrentUser } from "../store/user.slice";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser, isAuthenticated, isFetching } = useSelector(
    (state) => state.user
  );

  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (!currentUser) {
          await dispatch(getCurrentUserThunk()).unwrap();
        }
      } catch (error) {
        dispatch(clearUserData());
      } finally {
        setInitialLoading(false);
      }
    };

    initAuth();
  }, []);

  // LOGIN
  const login = useCallback((adminData) => {
    dispatch(setCurrentUser(adminData));
  }, []);


  const logout = useCallback(async () => {
    try {
      await dispatch(logoutUserThunk()).unwrap();
    } finally {
      dispatch(clearUserData());
      navigate(API_ROUTE.AUTH.LOGIN, { replace: true });
    }
  }, [dispatch, navigate]);


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
        login,
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