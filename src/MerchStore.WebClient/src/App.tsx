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
import AuthCallbackPage from './pages/AuthCallbackPage';
import { AuthProvider } from './context/AuthProvider';
import AdminLoginPage from './pages/AdminLoginPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <ThemeProvider theme={createTheme({ palette: { mode: 'dark' } })}>
      <CssBaseline />
      <Toaster position="top-center" reverseOrder={false} />
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <ReviewProvider>
              <ProductProvider>
                <Container maxWidth={'lg'} sx={{ pb: 2 }}>
                  <Header />
                  <Routes>
                    {/* Publika Routes */}
                    <Route path={'/'} element={<HomePage />} />
                    <Route path={'/store'} element={<StorePage />} />
                    <Route path={'/store/:id'} element={<ProductDetailsPage />} />
                    <Route path={'/cart'} element={<CartPage />} />
                    <Route path={'/checkout'} element={<CheckoutPage />} />
                    <Route
                      path={'/order-confirmation'}
                      element={<OrderConfirmationPage />}
                    />

                    {/* Inloggningsroute för Admin */}
                    <Route path={'/admin-login'} element={<AdminLoginPage />} />

                    {/* OIDC Callback */}
                    <Route path={'/auth/callback'} element={<AuthCallbackPage />} />

                    {/* Admin Routes */}
                    <Route element={<ProtectedRoute adminRequired={true} />}>
                      <Route path={'/admin'} element={<AdminPage />} />
                      <Route path={'/admin/products'} element={<AdminPageProducts />} />
                    </Route>
                  </Routes>
                </Container>
              </ProductProvider>
            </ReviewProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
