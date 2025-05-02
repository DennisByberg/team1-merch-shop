import { Box, Button, SxProps, Theme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { Product } from '../../types/globalTypes';
import { useNavigate } from 'react-router-dom';

type CartActionsProps = {
  items: Product[];
  removeItem: (id: string) => void;
};

export function CartActions(props: CartActionsProps) {
  const CONTINUE_SHOPPING_TEXT = 'Continue shopping';
  const CLEAR_CART_TEXT = 'Clear cart';
  const PROCEED_TO_CHECKOUT_TEXT = 'Proceed to checkout';
  const navigate = useNavigate();

  // Empty the cart
  const handleClear = () => {
    props.items.forEach((item) => {
      props.removeItem(item.id);
    });
  };

  return (
    <Box sx={CART_ACTIONS_STYLE}>
      <Box sx={CART_ACTIONS_LEFT_STYLE}>
        <Button
          variant={'outlined'}
          color={'inherit'}
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/store')}
        >
          {CONTINUE_SHOPPING_TEXT}
        </Button>
        <Button
          variant={'outlined'}
          color={'error'}
          startIcon={<DeleteIcon />}
          onClick={handleClear}
          disabled={props.items.length === 0}
        >
          {CLEAR_CART_TEXT}
        </Button>
      </Box>
      <Button
        variant={'contained'}
        color={'success'}
        startIcon={<CreditCardIcon />}
        onClick={() => navigate('/checkout')}
        disabled={props.items.length === 0}
        sx={CART_CHECKOUT_BUTTON_STYLE}
      >
        {PROCEED_TO_CHECKOUT_TEXT}
      </Button>
    </Box>
  );
}

/*━━━━━━━━━━━━ Styling ━━━━━━━━━━━━*/
const CART_ACTIONS_STYLE: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mt: 2,
  width: '100%',
  flexWrap: 'wrap',
  gap: 2,
};

const CART_ACTIONS_LEFT_STYLE: SxProps<Theme> = {
  display: 'flex',
  gap: 2,
  width: { xs: '100%', sm: 'auto' }, // Full bredd på mobil
  flexDirection: { xs: 'column', sm: 'row' }, // Stacka på mobil
};

const CART_CHECKOUT_BUTTON_STYLE: SxProps<Theme> = {
  minWidth: 240,
  width: { xs: '100%', sm: 'auto' },
};
