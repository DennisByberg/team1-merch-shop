import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
  Chip,
  SxProps,
  Theme,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { ProductRating } from './ProductRating';
import { IProduct } from '../../interfaces';

interface ProductCardProps {
  product: IProduct;
  addToCart: (product: IProduct) => void;
}

export function ProductCard({ product, addToCart }: ProductCardProps) {
  return (
    <Card sx={PRODUCT_CARD_SX}>
      {product.imageUrl && (
        <CardMedia
          component={'img'}
          height={'180'}
          image={product.imageUrl}
          alt={product.name}
          sx={PRODUCT_IMAGE_SX}
        />
      )}
      <CardContent sx={PRODUCT_CONTENT_SX}>
        <Typography variant={'h6'} fontWeight={'bold'} gutterBottom>
          {product.name}
        </Typography>
        <ProductRating productId={product.id} />
        <Typography variant={'body2'} color={'text.secondary'} gutterBottom>
          {product.description}
        </Typography>

        <Typography
          variant={'subtitle1'}
          color={'primary'}
          fontWeight={'bold'}
          sx={{ mt: 1 }}
        >
          {Number(product.price).toFixed(2)} {product.currency}
        </Typography>
        <Chip
          label={product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
          color={product.stockQuantity > 0 ? 'success' : 'error'}
          size={'small'}
          sx={{ mt: 1 }}
        />
      </CardContent>
      <CardActions sx={PRODUCT_ACTIONS_SX}>
        <Button
          component={Link}
          to={`/store/${product.id}`}
          startIcon={<VisibilityIcon />}
          variant={'outlined'}
          color={'inherit'}
          size={'small'}
        >
          View Details
        </Button>
        <Button
          variant={'contained'}
          startIcon={<ShoppingCartIcon />}
          color={'success'}
          size={'small'}
          disabled={product.stockQuantity < 1}
          sx={{ ml: 1 }}
          onClick={() => addToCart(product)}
        >
          Add To Cart
        </Button>
      </CardActions>
    </Card>
  );
}

/*━━━━━━━━━━━━ Styling ━━━━━━━━━━━━*/
const PRODUCT_CARD_SX: SxProps<Theme> = {
  maxWidth: 320,
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 2,
  flexGrow: 1,
  height: 460,
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
