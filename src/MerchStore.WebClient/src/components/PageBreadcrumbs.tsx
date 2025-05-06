import { Breadcrumbs, Link, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { getCrumbs } from '../utils/breadcrumbs';

type Props = {
  productName?: string;
};

export default function PageBreadcrumbs(props: Props) {
  const location = useLocation();
  const crumbs = getCrumbs(location.pathname, props.productName);

  return (
    <Breadcrumbs aria-label={'breadcrumb'} sx={BREADCRUMBS_SX}>
      {crumbs.map((crumb) =>
        crumb.to ? (
          <Link
            key={crumb.label}
            component={RouterLink}
            underline={'hover'}
            color={'inherit'}
            to={crumb.to}
            sx={LINK_SX}
          >
            {crumb.label}
          </Link>
        ) : (
          <Typography key={crumb.label} color={'white'} fontWeight={500}>
            {crumb.label}
          </Typography>
        )
      )}
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
