import {
  Card,
  Box,
  CardMedia,
  Typography,
  Divider,
  Chip,
  Button,
  SxProps,
  Theme,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Product } from '../../types/globalTypes';

type ProductDetailsCardProps = {
  product: Product;
  quantityInCart: number;
  addToCart: (product: Product) => void;
};

export function ProductDetailsCard(props: ProductDetailsCardProps) {
  return (
    <Card sx={DETAILS_CARD_SX}>
      <Box sx={DETAILS_IMAGE_WRAPPER_SX}>
        <CardMedia
          component={'img'}
          image={props.product.imageUrl}
          alt={props.product.name}
          sx={DETAILS_IMAGE_SX}
        />
      </Box>
      <Box sx={DETAILS_CONTENT_SX}>
        <Typography variant={'h4'} fontWeight={'bold'} gutterBottom>
          {props.product.name}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant={'h5'} color={'primary'} fontWeight={'bold'} gutterBottom>
          {props.product.price} {props.product.currency}
        </Typography>
        <Typography variant={'body1'} sx={{ mb: 2 }}>
          {props.product.description}
        </Typography>
        <Chip
          label={props.product.inStock ? 'In Stock' : 'Out of Stock'}
          color={props.product.inStock ? 'success' : 'default'}
          size="small"
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <Typography sx={{ mr: 2 }}>Quantity:</Typography>
          <Typography sx={{ mr: 2, fontWeight: 'bold' }}>
            {props.quantityInCart}
          </Typography>
          <Button
            variant={'contained'}
            color={'success'}
            startIcon={<ShoppingCartIcon />}
            disabled={!props.product.inStock}
            onClick={() => props.addToCart(props.product)}
          >
            Add To Cart
          </Button>
        </Box>
      </Box>
    </Card>
  );
}

//━━━━━━━━━━━━ Styling ━━━━━━━━━━━━
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
