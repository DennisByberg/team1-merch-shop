import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { ThemeProvider, CssBaseline, Container, createTheme } from '@mui/material';
import Header from './components/Header';
import StorePage from './pages/StorePage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CartProvider } from './context/CartProvider';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import { ProductProvider } from './context/ProductProvider';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import { ReviewProvider } from './context/ReviewProvider';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <ThemeProvider theme={createTheme({ palette: { mode: 'dark' } })}>
      <CssBaseline />
      <CartProvider>
        <ReviewProvider>
          <ProductProvider>
            <BrowserRouter>
              <Container maxWidth={'lg'} sx={{ pb: 2 }}>
                <Header />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/store" element={<StorePage />} />
                  <Route path="/store/:id" element={<ProductDetailsPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                </Routes>
              </Container>
            </BrowserRouter>
          </ProductProvider>
        </ReviewProvider>
      </CartProvider>
    </ThemeProvider>
  );
}
