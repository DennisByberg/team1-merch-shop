import { Box, SxProps, Theme } from '@mui/material';
import { useCart } from '../../hooks/useCart';
import { useProducts } from '../../hooks/useProducts';
import CustomSpinner from '../CustomSpinner';
import { ProductCard } from './ProductCard';

export function ProductCatalog() {
  const { products, loading } = useProducts();
  const { addToCart } = useCart();

  return (
    <Box>
      {loading ? (
        <CustomSpinner text="Fetching products from the back of the store..." />
      ) : (
        <Box sx={CATALOG_CONTAINER_SX}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} />
          ))}
        </Box>
      )}
    </Box>
  );
}

/*━━━━━━━━━━━━ Styling ━━━━━━━━━━━━*/
const CATALOG_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 3,
  justifyContent: 'center',
};
