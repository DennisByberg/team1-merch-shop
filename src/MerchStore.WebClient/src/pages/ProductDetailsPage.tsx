import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Product } from '../types/globalTypes';
import { Box, SxProps, Theme, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fetchProduct } from '../api/productApi';
import { useCart } from '../hooks/useCart';
import { ProductDetailsCard } from '../components/Store/ProductDetailsCard';

export function ProductDetailsPage() {
  const [product, setProduct] = useState<Product | null>(null);

  const { id } = useParams();
  const { addToCart, items } = useCart();
  const navigate = useNavigate();

  const cartItem = items.find((item) => item.id === product?.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

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
    <Box sx={DETAILS_PAGE_SX}>
      <IconButton sx={{ mb: 2 }} onClick={() => navigate(-1)} aria-label="Go back">
        <ArrowBackIcon />
      </IconButton>
      <ProductDetailsCard
        product={product}
        quantityInCart={quantityInCart}
        addToCart={addToCart}
      />
    </Box>
  );
}

//━━━━━━━━━━━━ Styling ━━━━━━━━━━━━
const DETAILS_PAGE_SX: SxProps<Theme> = {
  maxWidth: 900,
  mx: 'auto',
  mt: 10,
  mb: { xs: 3, md: 6 },
  px: { xs: 0.5, sm: 2 },
};
