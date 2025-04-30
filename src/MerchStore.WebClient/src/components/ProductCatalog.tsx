import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types/globalTypes';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
  Chip,
  Container,
  Box,
  SxProps,
  Theme,
} from '@mui/material';
import { fetchProducts } from '../api/productApi';
import { useCart } from '../hooks/useCart';

export function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((error) => {
        console.error('Failed to fetch products:', error);
      });
  }, []);

  if (!products) return <Box>Loading...</Box>;

  return (
    <Container>
      <Box sx={CATALOG_CONTAINER_SX}>
        {products.map((product) => (
          <Card key={product.id} sx={PRODUCT_CARD_SX}>
            {product.imageUrl && (
              <CardMedia
                component={'img'}
                height="180"
                image={product.imageUrl}
                alt={product.name}
                sx={PRODUCT_IMAGE_SX}
              />
            )}
            <CardContent sx={PRODUCT_CONTENT_SX}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {product.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {product.description}
              </Typography>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 1 }}>
                {product.price} {product.currency}
              </Typography>
              <Chip
                label={product.inStock ? 'In Stock' : 'Out of Stock'}
                color={product.inStock ? 'success' : 'default'}
                size={'small'}
                sx={{ mt: 1 }}
              />
            </CardContent>
            <CardActions sx={PRODUCT_ACTIONS_SX}>
              <Button
                component={Link}
                to={`/product/${product.id}`}
                variant={'outlined'}
                color={'primary'}
                size={'small'}
              >
                View Details
              </Button>
              <Button
                variant={'contained'}
                color={'primary'}
                size={'small'}
                disabled={!product.inStock}
                sx={{ ml: 1 }}
                onClick={() => addToCart(product)}
              >
                Add To Cart
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Container>
  );
}

/*━━━━━━━━━━━━ Styling ━━━━━━━━━━━━*/
const CATALOG_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 3,
  justifyContent: 'center',
};

const PRODUCT_CARD_SX: SxProps<Theme> = {
  maxWidth: 320,
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 2,
  flexGrow: 1,
  height: 420,
  boxShadow: '2px 2px 3px rgba(0, 0, 0, 0.7)',
  border: '2px solid black',
};

const PRODUCT_IMAGE_SX: SxProps<Theme> = {
  objectFit: 'contain',
  p: 3,
};

const PRODUCT_CONTENT_SX: SxProps<Theme> = {
  flexGrow: 1,
};

const PRODUCT_ACTIONS_SX: SxProps<Theme> = {
  mt: 'auto',
  px: 2,
  pb: 2,
};
