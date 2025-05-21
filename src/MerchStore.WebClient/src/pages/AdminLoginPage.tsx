import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Paper, TextField, Button, Typography, Alert } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { yellow } from '@mui/material/colors';
import { redirectToLogin } from '../services/authService';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

const SSO_INIT_CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const SSO_INIT_CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleOidcLogin = () => {
    setError(null);

    if (!SSO_INIT_CLIENT_ID || !SSO_INIT_CLIENT_SECRET) {
      setError(
        'SSO initiation credentials are not configured in the application environment.'
      );
      return;
    }

    if (username === SSO_INIT_CLIENT_ID && password === SSO_INIT_CLIENT_SECRET) {
      redirectToLogin();
    } else {
      setError(
        'Invalid Client ID or Client Secret to initiate SSO. Please use the configured admin credentials.'
      );
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'An unexpected error occurred during login.');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
      <Paper elevation={3} sx={{ padding: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant={'h5'} component={'h1'} gutterBottom textAlign={'center'}>
          Admin Login{' '}
          <AdminPanelSettingsIcon fontSize={'large'} sx={{ color: yellow[400] }} />
        </Typography>

        {error && (
          <Alert severity={'error'} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component={'form'} onSubmit={handleSubmit} noValidate>
          <TextField
            margin={'normal'}
            required
            fullWidth
            id={'username'}
            label={'Client ID'}
            name={'username'}
            autoComplete={'username'}
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin={'normal'}
            required
            fullWidth
            name={'password'}
            label={'Client Secret'}
            type={'password'}
            id={'password'}
            autoComplete={'current-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            fullWidth
            variant={'contained'}
            color={'primary'}
            endIcon={<VpnKeyIcon />}
            sx={{ mt: 8, mb: 1 }}
            onClick={handleOidcLogin}
          >
            Sign In with Single Sign On (SSO)
          </Button>

          <Button
            fullWidth
            variant={'contained'}
            color={'inherit'}
            sx={{ mt: 1 }}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
