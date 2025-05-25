import { Box, Rating, Typography, SxProps, Theme, Fade } from '@mui/material';
import { useState, useEffect } from 'react';
import { fetchAllProductReviewsByGuid } from '../../api/External/jinApi';
import { ReviewStats } from '../../interfaces';
import LinearProgress from '@mui/material/LinearProgress';

interface ProductRatingProps {
  productId: string;
}

export function ProductRating(props: ProductRatingProps) {
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const fetchRating = async () => {
      setLoading(true);
      try {
        const reviewsData = await fetchAllProductReviewsByGuid(props.productId);

        if (!isCancelled && reviewsData.reviews.length > 0) {
          const totalRating = reviewsData.reviews.reduce(
            (sum, review) => sum + review.rating,
            0
          );
          const averageRating = totalRating / reviewsData.reviews.length;

          setStats({
            productId: props.productId,
            averageRating,
            reviewCount: reviewsData.reviews.length,
          });
        } else if (!isCancelled) {
          setStats({
            productId: props.productId,
            averageRating: 0,
            reviewCount: 0,
          });
        }
      } catch {
        if (!isCancelled) {
          setStats({
            productId: props.productId,
            averageRating: 0,
            reviewCount: 0,
          });
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchRating();

    return () => {
      isCancelled = true;
    };
  }, [props.productId]);

  if (loading || !stats) {
    return (
      <Box sx={LOADING_CONTAINER_SX}>
        <LinearProgress
          color={'inherit'}
          sx={{
            height: 6,
            width: '50%',
            borderRadius: 2,
          }}
        />
      </Box>
    );
  }

  return (
    <Fade in={!loading} timeout={600}>
      <Box sx={RATING_CONTAINER_SX}>
        <Rating value={stats.averageRating} precision={0.1} readOnly size="small" />
        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
          {stats.reviewCount > 0
            ? `${stats.averageRating.toFixed(1)} (${stats.reviewCount})`
            : 'No reviews'}
        </Typography>
      </Box>
    </Fade>
  );
}

/*━━━━━━━━━━━━ Styling ━━━━━━━━━━━━*/
const LOADING_CONTAINER_SX: SxProps<Theme> = {
  mt: 1,
  mb: 1,
  minHeight: 24,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  opacity: 0.2,
};

const RATING_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  mt: 1,
  mb: 1,
  minHeight: 24,
};
