import { Breadcrumbs, Link, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useLocation, Link as RouterLink } from 'react-router-dom';

type Crumb = { label: string; to?: string };

function getCrumbs(pathname: string, productName?: string): Crumb[] {
  const parts = pathname.split('/').filter(Boolean);
  const crumbs: Crumb[] = [{ label: 'Home', to: '/' }];

  if (parts[0] === 'store' && parts.length === 1) {
    crumbs.push({ label: 'Store' });
  }

  if (parts[0] === 'store' && parts.length === 2) {
    crumbs.push({ label: 'Store', to: '/store' });
    crumbs.push({ label: productName || 'Product Details' });
  }

  if (parts[0] === 'cart') {
    crumbs.push({ label: 'Cart' });
  }

  if (parts[0] === 'checkout') {
    crumbs.push({ label: 'Checkout' });
  }

  return crumbs;
}

type PageBreadcrumbsProps = {
  productName?: string;
};

export default function PageBreadcrumbs({ productName }: PageBreadcrumbsProps) {
  const location = useLocation();
  const crumbs = getCrumbs(location.pathname, productName);

  return (
    <Breadcrumbs
      aria-label={'breadcrumb'}
      sx={{
        mb: 2,
        px: 2,
        py: 0.6,
        mt: 8,
        borderRadius: 1,
        background: grey[900],
      }}
    >
      {crumbs.map((crumb) =>
        crumb.to ? (
          <Link
            key={crumb.label}
            component={RouterLink}
            underline={'hover'}
            color={'inherit'}
            to={crumb.to}
            sx={{ fontWeight: 500 }}
          >
            {crumb.label}
          </Link>
        ) : (
          <Typography key={crumb.label} color="white" fontWeight={500}>
            {crumb.label}
          </Typography>
        )
      )}
    </Breadcrumbs>
  );
}
