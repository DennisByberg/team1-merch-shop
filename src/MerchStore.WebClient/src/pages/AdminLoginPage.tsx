import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Paper, TextField, Button, Typography, Alert } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import LoginIcon from '@mui/icons-material/Login';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { yellow } from '@mui/material/colors';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
            type={'submit'}
            fullWidth
            variant={'contained'}
            color={'primary'}
            endIcon={<LoginIcon />}
            sx={{ mt: 3 }}
          >
            Sign In
          </Button>

          <Button
            fullWidth
            variant={'contained'}
            color={'inherit'}
            sx={{ mt: 2 }}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
