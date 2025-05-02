import { Box, Typography, SxProps, Theme, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import soundwavesPNG from '../assets/soundwaves.png';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ProductSlider from '../components/Store/ProductSlider';

export default function HomePage() {
  const HERO_TITLE = 'ECHOCRAFT';
  const HERO_TAGLINE = 'Your Sound. Your Signature.';

  return (
    <>
      <Box sx={HERO_CONTAINER_SX}>
        <Box sx={HERO_BG_OVERLAY_SX} />
        <Box sx={HERO_CONTENT_SX}>
          <Typography variant={'h1'} fontSize={70} fontWeight={'bold'}>
            {HERO_TITLE}
          </Typography>
          <Typography variant={'h5'} color={'text.secondary'}>
            {HERO_TAGLINE}
          </Typography>
          <Button
            color={'error'}
            component={RouterLink}
            to={'/store'}
            variant={'contained'}
            size={'large'}
          >
            Explore Now <ArrowForwardIcon style={{ marginLeft: 8 }} />
          </Button>
        </Box>
      </Box>
      <ProductSlider />
    </>
  );
}

/*━━━━━━━━━━━━ Styling ━━━━━━━━━━━━*/
const HERO_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '60vh',
  textAlign: 'center',
  overflow: 'hidden',
  mx: 'auto',
};

const HERO_BG_OVERLAY_SX: SxProps<Theme> = {
  position: 'absolute',
  inset: 0,
  backgroundImage: `url(${soundwavesPNG})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  opacity: 0.3,
  zIndex: -1,
  overflow: 'hidden',
};

const HERO_CONTENT_SX: SxProps<Theme> = {
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  alignItems: 'center',
};
