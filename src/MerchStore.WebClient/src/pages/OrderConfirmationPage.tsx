import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import PageBreadcrumbs from '../components/PageBreadcrumbs';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';
import OrderConfirmationDetails from '../components/OrderConfirmation/OrderConfirmationDetails';

export default function OrderConfirmationPage() {
  const location = useLocation();
  const [width, height] = useWindowSize();
  const order = location.state?.order;

  return (
    <Box>
      <Confetti width={width} height={height} numberOfPieces={250} recycle={false} />
      <PageBreadcrumbs />
      <OrderConfirmationDetails order={order} />
    </Box>
  );
}
