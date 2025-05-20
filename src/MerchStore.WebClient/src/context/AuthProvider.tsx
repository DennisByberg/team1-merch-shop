import React, { useState, useEffect, ReactNode, useCallback } from 'react'; // Lade till useContext
import { useNavigate } from 'react-router-dom';
import { AuthContext, AuthContextType } from './AuthContext';

const ADMIN_USERNAME = import.meta.env.VITE_CLIENT_ID;
const ADMIN_PASSWORD = import.meta.env.VITE_CLIENT_SECRET;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Checks for persisted admin login status on component mount.
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (adminLoggedIn === 'true') {
      setIsAdmin(true);
      setUserName('Admin');
    }
    setIsLoading(false);
  }, []);

  // Handles admin login by validating credentials and updating state.
  const loginAdmin = useCallback(
    async (usernameInput: string, passwordInput: string): Promise<boolean> => {
      if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
        console.error(
          'Admin credentials (VITE_CLIENT_ID or VITE_CLIENT_SECRET) are not configured.'
        );

        return false;
      }
      if (usernameInput === ADMIN_USERNAME && passwordInput === ADMIN_PASSWORD) {
        setIsAdmin(true);
        setUserName('Admin');
        localStorage.setItem('isAdminLoggedIn', 'true');

        return true;
      }
      setIsAdmin(false);
      setUserName(null);
      localStorage.removeItem('isAdminLoggedIn');

      return false;
    },
    []
  );

  // Stores authentication tokens and sets admin status (placeholder for OIDC).
  const storeTokens = (newAccessToken: string, newIdToken?: string) => {
    console.warn(
      'storeTokens called, but current setup is for direct admin login. This might indicate mixed auth logic.'
    );
    setAccessToken(newAccessToken);
    localStorage.setItem('accessToken', newAccessToken);
    if (newIdToken) {
      setIdToken(newIdToken);
      localStorage.setItem('idToken', newIdToken);
    }
    setIsAdmin(true);
    setUserName('Admin (via OIDC)');
  };

  // Clears authentication data and navigates to home on logout.
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');
    localStorage.removeItem('isAdminLoggedIn');

    setAccessToken(null);
    setIdToken(null);
    setUserName(null);
    setIsAdmin(false);
    navigate('/');
  };

  // Defines the authentication context value provided to children.
  const authContextValue: AuthContextType = {
    isAuthenticated: isAdmin,
    accessToken,
    idToken,
    userName,
    isAdmin,
    login: loginAdmin,
    storeTokens,
    logout,
    isLoading,
  };

  // Provides the authentication context to its children components.
  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};
