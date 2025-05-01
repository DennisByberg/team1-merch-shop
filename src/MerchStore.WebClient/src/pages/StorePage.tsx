import { Container, SxProps, Theme, Typography } from '@mui/material';
import { ProductCatalog } from '../components/Store/ProductCatalog';

const STORE_TITLE = 'Featured Products';

export default function StorePage() {
  return (
    <Container>
      <Typography variant="h5" fontWeight="bold" sx={STORE_TITLE_SX}>
        {STORE_TITLE}
      </Typography>
      <ProductCatalog />
    </Container>
  );
}

/*━━━━━━━━━━━━ Styling ━━━━━━━━━━━━*/
const STORE_TITLE_SX: SxProps<Theme> = {
  mt: 10,
  mb: 3,
  textAlign: 'center',
};
