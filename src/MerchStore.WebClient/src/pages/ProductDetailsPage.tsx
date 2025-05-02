import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Product } from '../types/globalTypes';
import { Box, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fetchProduct } from '../api/productApi';
import { useCart } from '../hooks/useCart';
import { ProductDetailsCard } from '../components/Store/ProductDetailsCard';
import PageBreadcrumbs from '../components/PageBreadcrumbs';

export function ProductDetailsPage() {
  const [product, setProduct] = useState<Product | null>(null);

  const { id } = useParams();
  const { addToCart, items } = useCart();
  const navigate = useNavigate();

  const cartItem = items.find((item) => item.id === product?.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const CONTINUE_SHOPPING_TEXT = 'Continue shopping';

  useEffect(() => {
    if (!id) return;
    fetchProduct(id)
      .then(setProduct)
      .catch((err) => {
        setProduct(null);
        console.error('Failed to fetch product:', err);
      });
  }, [id]);

  if (!product) return <Box>Loading...</Box>;

  return (
    <Box>
      <PageBreadcrumbs productName={product?.name} />
      <ProductDetailsCard
        product={product}
        quantityInCart={quantityInCart}
        addToCart={addToCart}
      />
      <Button
        sx={{ mt: 2 }}
        color={'inherit'}
        variant={'outlined'}
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
      >
        {CONTINUE_SHOPPING_TEXT}
      </Button>
    </Box>
  );
}
