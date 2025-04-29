import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { useMemo } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Box,
  SxProps,
  Theme,
} from '@mui/material';
import Header from './components/Header';
import StorePage from './pages/StorePage';
import Footer from './components/Footer';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { useSystemDarkMode } from './hooks/useSystemDarkMode';
import { getAppTheme } from './theme/theme';

export default function App() {
  const [darkMode, setDarkMode] = useSystemDarkMode();
  const theme = useMemo(() => getAppTheme(darkMode), [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container sx={APP_CONTAINER_SX}>
        <BrowserRouter>
          <Header darkMode={darkMode} onToggleDarkMode={() => setDarkMode((v) => !v)} />
          <Box sx={APP_CONTENT_SX}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product" element={<StorePage />} />
              <Route path="/product/:id" element={<ProductDetailsPage />} />
            </Routes>
          </Box>
          <Footer />
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  );
}

/*━━━━━━━━━━━━ Styling ━━━━━━━━━━━━*/
const APP_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
};

const APP_CONTENT_SX: SxProps<Theme> = {
  flex: 1,
};
