import { Box } from '@mui/material';
import { ProductCatalog } from '../components/Store/ProductCatalog';
import PageBreadcrumbs from '../components/PageBreadcrumbs';

export default function StorePage() {
  return (
    <Box>
      <PageBreadcrumbs />
      <ProductCatalog />
    </Box>
  );
}
