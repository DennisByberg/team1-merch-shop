import { Box, Typography, SxProps, Theme } from '@mui/material';
import { Link } from 'react-router-dom';
import soundwavesPNG from '../assets/soundwaves.png';
import BrandRedButton from '../components/Buttons/BrandRedButton';
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
          <Typography
            variant={'h2'}
            component={'h1'}
            fontWeight={'bold'}
            mb={3}
            color={'text.primary'}
          >
            {HERO_TITLE}
          </Typography>
          <Typography variant={'h5'} mb={4} color={'text.secondary'}>
            {HERO_TAGLINE}
          </Typography>
          <BrandRedButton
            component={Link}
            to={'/product'}
            variant={'contained'}
            size={'large'}
          >
            Explore Now <ArrowForwardIcon style={{ marginLeft: 8 }} />
          </BrandRedButton>
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
  maxWidth: 1080,
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
};
