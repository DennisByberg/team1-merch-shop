import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Snackbar,
  SxProps,
  Theme,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import { IOrder } from '../../interfaces';

type Props = {
  order: IOrder;
};

export default function OrderConfirmationDetails(props: Props) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <Box sx={CONFIRMATION_CONTAINER_SX}>
      <CheckCircleOutlineIcon sx={CONFIRMATION_ICON_SX} />
      <Typography variant={'h4'} gutterBottom>
        Thank you for your order!
      </Typography>
      <Box sx={ORDER_ID_ROW_SX}>
        <Typography variant={'body1'} sx={{ mr: 1 }}>
          Order ID: {props.order.id}
        </Typography>
        <Tooltip title={'Copy Order ID'}>
          <IconButton size={'small'} onClick={() => copy(props.order.id)}>
            <ContentCopyIcon fontSize={'small'} />
          </IconButton>
        </Tooltip>
      </Box>
      <Typography variant={'body2'} color={'text.secondary'}>
        A confirmation email has been sent to{' '}
        <Box component={'span'} fontWeight={'bold'} display={'inline'}>
          {props.order.email}
        </Box>
        .
      </Typography>
      <Snackbar
        open={copied}
        autoHideDuration={1500}
        onClose={() => {}}
        message={'Order ID copied!'}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </Box>
  );
}

/*━━━━━━━━━━━━ Styling ━━━━━━━━━━━━*/
const CONFIRMATION_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  mt: 6,
};

const CONFIRMATION_ICON_SX: SxProps<Theme> = {
  fontSize: 80,
  color: 'success.main',
  mb: 2,
};

const ORDER_ID_ROW_SX: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  mb: 2,
};
