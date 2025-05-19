import { Container, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import { CartProvider } from './context/CartProvider';
import { ProductProvider } from './context/ProductProvider';
import { ReviewProvider } from './context/ReviewProvider';
import AdminPage from './pages/AdminPage';
import AdminPageProducts from './pages/AdminPageProducts';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import HomePage from './pages/HomePage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import StorePage from './pages/StorePage';

export default function App() {
  return (
    <ThemeProvider theme={createTheme({ palette: { mode: 'dark' } })}>
      <CssBaseline />
      <Toaster position="top-center" reverseOrder={false} /> {/* Lägg till denna rad */}
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
                  <Route path="/admin/products" element={<AdminPageProducts />} />
                </Routes>
              </Container>
            </BrowserRouter>
          </ProductProvider>
        </ReviewProvider>
      </CartProvider>
    </ThemeProvider>
  );
}
