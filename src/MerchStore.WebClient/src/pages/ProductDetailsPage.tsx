import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Product } from '../types/globalTypes';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  Chip,
  Divider,
  Button,
  TextField,
  SxProps,
  Theme,
  IconButton,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fetchProduct } from '../api/productApi';

export function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

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
      <Card sx={DETAILS_CARD_SX}>
        <Box sx={DETAILS_IMAGE_WRAPPER_SX}>
          <CardMedia
            component="img"
            image={product.imageUrl}
            alt={product.name}
            sx={DETAILS_IMAGE_SX}
          />
        </Box>
        <Box sx={DETAILS_CONTENT_SX}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {product.name}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h5" color="primary" fontWeight="bold" gutterBottom>
            {product.price} {product.currency}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {product.description}
          </Typography>
          <Chip
            label={product.inStock ? 'In Stock' : 'Out of Stock'}
            color={product.inStock ? 'success' : 'default'}
            size="small"
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Typography sx={{ mr: 2 }}>Quantity:</Typography>
            <TextField type="number" size="small" defaultValue={1} sx={{ mr: 2 }} />
            <Button
              variant="contained"
              color="success"
              startIcon={<ShoppingCartIcon />}
              disabled={!product.inStock}
            >
              Add to Cart
            </Button>
          </Box>
        </Box>
      </Card>
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

const DETAILS_CARD_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  gap: { xs: 1, md: 4 },
  p: { xs: 2, md: 4 },
  borderRadius: 2,
  alignItems: { xs: 'center', md: 'flex-start' },
  boxShadow: '2px 2px 3px rgba(0, 0, 0, 0.7)',
  border: '2px solid black',
};

const DETAILS_IMAGE_WRAPPER_SX: SxProps<Theme> = {
  flex: { xs: 'none', md: '0 0 350px' },
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 2,
  minHeight: { xs: 150, md: 350 },
  minWidth: { xs: 0, md: 320 },
  maxWidth: { xs: '100%', md: 400 },
  width: { xs: '100%', md: 'auto' },
  mb: { xs: 2, md: 0 },
};

const DETAILS_IMAGE_SX: SxProps<Theme> = {
  width: { xs: '100%', md: '100%' },
  height: 'auto',
  maxHeight: { xs: 150, md: 350 },
  objectFit: 'contain',
  borderRadius: 2,
};

const DETAILS_CONTENT_SX: SxProps<Theme> = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  width: { xs: '100%', md: 'auto' },
  alignItems: { xs: 'start', md: 'flex-start' },
};
