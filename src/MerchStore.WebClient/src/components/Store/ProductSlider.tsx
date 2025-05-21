import Slider from 'react-slick';
import { useEffect, useState } from 'react';
import {
  Box,
  CardMedia,
  SxProps,
  Theme,
  CircularProgress,
  Typography,
} from '@mui/material';
import { IProduct } from '../../interfaces';
import { fetchProducts } from '../../api/productApi';

export default function ProductSlider() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const LOADING_TEXT = 'Fetching products from the back of the store...';

  useEffect(() => {
    (async () => {
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    })();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 8000,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 0,
    pauseOnHover: false,
    cssEase: 'linear',
  };

  return (
    <Box sx={SLIDER_WRAPPER_SX}>
      {loading ? (
        <Box sx={LOADING_BOX_SX}>
          <CircularProgress color={'inherit'} />
          <Typography variant={'body2'} color={'text.secondary'}>
            {LOADING_TEXT}
          </Typography>
        </Box>
      ) : (
        <Slider {...settings}>
          {products.map((product) => (
            <Box key={product.id} sx={SLIDE_ITEM_SX}>
              <Box>
                {product.imageUrl && (
                  <CardMedia
                    component={'img'}
                    image={product.imageUrl}
                    alt={product.name}
                    sx={IMAGE_SX}
                  />
                )}
              </Box>
            </Box>
          ))}
        </Slider>
      )}
    </Box>
  );
}

/*━━━━━━━━━━━━ Styling ━━━━━━━━━━━━*/
const SLIDER_WRAPPER_SX: SxProps<Theme> = {
  width: '100vw',
  position: 'relative',
  left: '50%',
  right: '50%',
  ml: '-50vw',
  mr: '-50vw',
};

const SLIDE_ITEM_SX: SxProps<Theme> = {
  background: 'rgba(0,0,0,0.13)',
};

const IMAGE_SX: SxProps<Theme> = {
  maxHeight: 180,
  objectFit: 'contain',
};

const LOADING_BOX_SX: SxProps<Theme> = {
  textAlign: 'center',
};
