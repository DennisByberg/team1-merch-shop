import { createTheme } from '@mui/material';

export const getAppTheme = (darkMode: boolean) =>
  createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      brandRed: {
        main: '#D32F2F',
        dark: '#9A2323',
        contrastText: '#fff',
      },
    },
  });
