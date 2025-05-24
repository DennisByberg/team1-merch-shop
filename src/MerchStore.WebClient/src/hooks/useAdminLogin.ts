import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { redirectToLogin } from '../services/authService';
import { isValidCredentials, validateSSOCredentials } from '../utils/adminAuthUtils';

export const useAdminLogin = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handles SSO authentication by validating credentials and redirecting to login service
  function handleOidcLogin() {
    setError(null);
    setIsLoading(true);

    try {
      if (!validateSSOCredentials(setError)) {
        return;
      }

      if (isValidCredentials(username, password)) {
        redirectToLogin();
      } else {
        setError(
          'Invalid Client ID or Client Secret to initiate SSO. Please use the configured admin credentials.'
        );
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred during SSO initiation.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  // Handles form submission for traditional username/password login
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    try {
      const success = await login(username, password);
      if (success) {
        const from = (location.state as { from?: Location })?.from?.pathname || '/admin';
        navigate(from, { replace: true });
      } else {
        setError('Invalid Client ID or Client Secret.');
      }
    } catch (err: unknown) {
      console.error('Login error:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred during login.';
      setError(errorMessage);
    }
  }

  return {
    username,
    setUsername,
    password,
    setPassword,
    error,
    isLoading,
    handleOidcLogin,
    handleSubmit,
    navigate,
  };
};
