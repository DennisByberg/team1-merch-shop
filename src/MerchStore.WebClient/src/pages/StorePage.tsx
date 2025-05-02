import { Box, SxProps, Theme, Typography } from '@mui/material';
import { ProductCatalog } from '../components/Store/ProductCatalog';

export default function StorePage() {
  const STORE_TITLE = 'Featured Products';

  return (
    <Box>
      <Typography variant={'h5'} fontWeight={'bold'} sx={STORE_TITLE_SX}>
        {STORE_TITLE}
      </Typography>
      <ProductCatalog />
    </Box>
  );
}

/*━━━━━━━━━━━━ Styling ━━━━━━━━━━━━*/
const STORE_TITLE_SX: SxProps<Theme> = {
  mt: 10,
  mb: 3,
  textAlign: 'center',
};
