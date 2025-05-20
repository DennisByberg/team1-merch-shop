import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { exchangeCodeForToken } from '../services/authService'; // Korrekt sökväg
import { useAuth } from '../hooks/useAuth';

export default function AuthCallbackPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { storeTokens } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const exchangeInitiatedRef = useRef(false);

  useEffect(() => {
    if (exchangeInitiatedRef.current) return;

    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const oauthError = params.get('error');
    const errorDescription = params.get('error_description');

    if (oauthError) {
      setError(
        `OAuth Error: ${oauthError} - ${errorDescription || 'No description provided.'}`
      );
      setLoading(false);

      return;
    }

    if (!code) {
      setError('Authorization code not found in URL. Cannot proceed with login.');
      setLoading(false);

      return;
    }

    exchangeInitiatedRef.current = true;

    const handleTokenExchange = async (authCode: string) => {
      try {
        const tokenData = await exchangeCodeForToken(authCode);
        storeTokens(tokenData.access_token, tokenData.id_token);
        navigate('/');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error('Token exchange error details:', err);
        setError(err.message || 'An unknown error occurred during token exchange.');
      } finally {
        setLoading(false);
      }
    };

    handleTokenExchange(code);
  }, [location, navigate, storeTokens]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
        }}
      >
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Processing login...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          textAlign: 'center',
          padding: 2,
        }}
      >
        <Typography color={'error'} variant={'h6'}>
          Login Failed
        </Typography>
        <Typography variant={'body2'} sx={{ mt: 1, maxWidth: '80%' }}>
          {error}
        </Typography>
        <Button onClick={() => navigate('/')} sx={{ mt: 2 }} variant={'outlined'}>
          Go to Home Page
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
      }}
    >
      <Typography>Login processed. Redirecting...</Typography>
    </Box>
  );
}
