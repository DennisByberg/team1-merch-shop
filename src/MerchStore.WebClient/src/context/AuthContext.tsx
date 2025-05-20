import { createContext } from 'react';

export interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  idToken: string | null;
  userName: string | null;
  isAdmin: boolean;
  login: (usernameInput: string, passwordInput: string) => Promise<boolean>;
  storeTokens: (accessToken: string, idToken?: string) => void;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
