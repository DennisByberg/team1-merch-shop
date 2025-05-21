import React, { useState, useEffect, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, AuthContextType } from './AuthContext';

const ADMIN_USERNAME = import.meta.env.VITE_CLIENT_ID;
const ADMIN_PASSWORD = import.meta.env.VITE_CLIENT_SECRET;

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error parsing JWT:', e);
    return null;
  }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Checks for persisted admin login status on component mount.
  useEffect(() => {
    setIsLoading(true);
    const persistedAccessToken = localStorage.getItem('accessToken');
    const persistedIdToken = localStorage.getItem('idToken');
    const adminFlag = localStorage.getItem('isAdminLoggedIn');

    if (persistedIdToken && persistedAccessToken) {
      const decoded = parseJwt(persistedIdToken);
      if (decoded) {
        const userIsOidcAdmin = decoded.sub === 'service-worker';
        const oidcUserName =
          decoded.name || decoded.preferred_username || decoded.sub || 'OIDC User';

        setAccessToken(persistedAccessToken);
        setIdToken(persistedIdToken);
        setUserName(oidcUserName);

        if (userIsOidcAdmin) {
          setIsAdmin(true);
          localStorage.setItem('isAdminLoggedIn', 'true');
        } else {
          setIsAdmin(false);
          localStorage.removeItem('isAdminLoggedIn');
        }
      } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('idToken');
        localStorage.removeItem('isAdminLoggedIn');
        setIsAdmin(false);
        setUserName(null);
        setAccessToken(null);
        setIdToken(null);
      }
    } else if (adminFlag === 'true' && !persistedAccessToken && !persistedIdToken) {
      setIsAdmin(true);
      setUserName('Admin');
    } else {
      setIsAdmin(false);
      setUserName(null);
      setAccessToken(null);
      setIdToken(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('idToken');
      localStorage.removeItem('isAdminLoggedIn');
    }
    setIsLoading(false);
  }, []);

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
        localStorage.removeItem('accessToken');
        localStorage.removeItem('idToken');
        setAccessToken(null);
        setIdToken(null);
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
    setAccessToken(newAccessToken);
    localStorage.setItem('accessToken', newAccessToken);

    if (newIdToken) {
      setIdToken(newIdToken);
      localStorage.setItem('idToken', newIdToken);
      const decodedIdToken = parseJwt(newIdToken);

      if (decodedIdToken) {
        const userIsAdmin = decodedIdToken.sub === 'service-worker';

        const usersName =
          decodedIdToken.name ||
          decodedIdToken.preferred_username ||
          decodedIdToken.sub ||
          'OIDC User';

        setIsAdmin(!!userIsAdmin);
        setUserName(usersName);

        if (userIsAdmin) {
          localStorage.setItem('isAdminLoggedIn', 'true');
        } else {
          localStorage.removeItem('isAdminLoggedIn');
        }
        console.log(
          `OIDC tokens stored. User: ${usersName}, Admin status: ${!!userIsAdmin}`
        );
      } else {
        setIsAdmin(false);
        setUserName(null);
        setIdToken(null);
        localStorage.removeItem('idToken');
        localStorage.removeItem('isAdminLoggedIn');
        console.error('Failed to parse ID token. User not set as admin.');
      }
    } else {
      setIsAdmin(false);
      setUserName(null);
      setIdToken(null);
      localStorage.removeItem('idToken');
      localStorage.removeItem('isAdminLoggedIn');
      console.warn(
        'storeTokens called without ID token. Admin status cannot be determined via OIDC and is set to false.'
      );
    }
  };

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
