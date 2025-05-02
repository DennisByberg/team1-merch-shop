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
import { CartProvider } from './context/CartProvider';
import CartPage from './pages/CartPage';

export default function App() {
  const [darkMode, setDarkMode] = useSystemDarkMode();
  const theme = useMemo(() => getAppTheme(darkMode), [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <Container sx={APP_CONTAINER_SX}>
          <BrowserRouter>
            <Header darkMode={darkMode} onToggleDarkMode={() => setDarkMode((v) => !v)} />
            <Box sx={APP_CONTENT_SX}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/product" element={<StorePage />} />
                <Route path="/product/:id" element={<ProductDetailsPage />} />
                <Route path="/cart" element={<CartPage />} />
              </Routes>
            </Box>
            <Footer />
          </BrowserRouter>
        </Container>
      </CartProvider>
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
