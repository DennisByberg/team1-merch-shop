import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  darken,
  Paper,
  SxProps,
  TextField,
  Theme,
  Typography,
} from '@mui/material';
import { grey, yellow } from '@mui/material/colors';
import { useAdminLogin } from '../hooks/useAdminLogin';

export default function AdminLoginPage() {
  const {
    username,
    setUsername,
    password,
    setPassword,
    error,
    handleOidcLogin,
    handleSubmit,
    navigate,
    isLoading,
  } = useAdminLogin();

  return (
    <Box sx={CONTAINER_SX}>
      <Paper elevation={3} sx={PAPER_SX}>
        <Typography variant={'h5'} component={'h1'} gutterBottom textAlign={'center'}>
          Admin Login{' '}
          <AdminPanelSettingsIcon fontSize={'large'} sx={{ color: yellow[400] }} />
        </Typography>

        {error && (
          <Alert severity={'error'} sx={ALERT_SX}>
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
            disabled={isLoading}
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
            disabled={isLoading}
          />

          <Button
            fullWidth
            variant={'contained'}
            color={'primary'}
            endIcon={
              isLoading ? (
                <CircularProgress size={16} color={'inherit'} />
              ) : (
                <VpnKeyIcon />
              )
            }
            sx={SSO_BUTTON_SX}
            onClick={handleOidcLogin}
            disabled={isLoading}
          >
            {isLoading ? 'Initiating SSO...' : 'Sign In with Single Sign On (SSO)'}
          </Button>

          <Button
            fullWidth
            variant={'contained'}
            color={'inherit'}
            sx={BACK_BUTTON_SX}
            disabled={isLoading}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

/*━━━━━━━━━━━━ Styling ━━━━━━━━━━━━*/
const CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  mt: 8,
};

const PAPER_SX: SxProps<Theme> = {
  padding: 4,
  width: '100%',
  maxWidth: 400,
  bgcolor: darken(grey[900], 0.7),
};

const ALERT_SX: SxProps<Theme> = {
  mb: 2,
};

const SSO_BUTTON_SX: SxProps<Theme> = {
  mt: 8,
  mb: 1,
};

const BACK_BUTTON_SX: SxProps<Theme> = {
  mt: 1,
};
