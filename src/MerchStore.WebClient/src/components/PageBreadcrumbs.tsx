import { Breadcrumbs, Link, Typography } from '@mui/material';
import { grey, yellow } from '@mui/material/colors';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { getCrumbs } from '../utils/breadcrumbs';

type Props = {
  productName?: string;
};

export default function PageBreadcrumbs(props: Props) {
  const location = useLocation();
  const crumbs = getCrumbs(location.pathname, props.productName);
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <Breadcrumbs
      aria-label={'breadcrumb'}
      sx={{
        ...BREADCRUMBS_SX,
      }}
    >
      {crumbs.map((crumb) => {
        let currentCrumbColor = 'inherit';
        let currentLastCrumbColor = 'white';

        if (isAdminPath) {
          if (crumb.label.toLowerCase() === 'home') {
            currentCrumbColor = 'inherit';
          } else {
            currentCrumbColor = yellow[400];
            currentLastCrumbColor = yellow[400];
          }
        }

        return crumb.to ? (
          <Link
            key={crumb.label}
            component={RouterLink}
            underline={'hover'}
            to={crumb.to}
            sx={{
              ...LINK_SX,
              color: currentCrumbColor,
            }}
          >
            {crumb.label}
          </Link>
        ) : (
          <Typography
            key={crumb.label}
            fontWeight={500}
            sx={{ color: currentLastCrumbColor }}
          >
            {crumb.label}
          </Typography>
        );
      })}
    </Breadcrumbs>
  );
}

/*━━━━━━━━━━━━ Styling ━━━━━━━━━━━━*/
const BREADCRUMBS_SX = {
  mb: 2,
  px: 2,
  py: 0.6,
  mt: 8,
  borderRadius: 1,
  background: grey[900],
};

const LINK_SX = {
  fontWeight: 500,
};
