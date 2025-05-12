import { Box, Typography, Divider, Rating, SxProps, Theme } from '@mui/material';
import CustomSpinner from '../CustomSpinner';
import { Review, ReviewStats } from '../../types/globalTypes';
import { grey } from '@mui/material/colors';

type Props = {
  reviews: Review[];
  stats?: ReviewStats;
  loading: boolean;
};

export function ProductReviews(props: Props) {
  return (
    <Box mt={3}>
      <Typography variant={'h5'} gutterBottom>
        Reviews ({props.stats?.reviewCount ?? props.reviews.length})
      </Typography>
      <Box sx={RATING_ROW_SX}>
        <Rating value={props.stats?.averageRating || 0} precision={0.1} readOnly />
        <Typography variant={'body1'} sx={{ ml: 2 }}>
          {props.stats?.averageRating !== undefined
            ? props.stats.averageRating.toFixed(1)
            : 'No rating'}{' '}
          / 5
        </Typography>
      </Box>
      <Divider />
      {props.loading ? (
        <CustomSpinner text="Loading reviews..." />
      ) : props.reviews.length === 0 ? (
        <Typography sx={{ mt: 2 }}>No reviews yet.</Typography>
      ) : (
        props.reviews.map((review) => (
          <Box key={review.id} sx={REVIEW_CARD_SX}>
            <Typography variant={'subtitle1'} fontWeight={'bold'}>
              {review.title}
            </Typography>
            <Rating value={review.rating} readOnly size={'small'} />
            <Typography variant={'body2'} color={'text.secondary'}>
              {review.customerName} • {new Date(review.createdAt).toLocaleDateString()}
            </Typography>
            <Typography sx={{ mt: 1 }}>{review.content}</Typography>
          </Box>
        ))
      )}
    </Box>
  );
}

/*━━━━━━━━━━━━ Styling ━━━━━━━━━━━━*/
const RATING_ROW_SX: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  mb: 2,
};

const REVIEW_CARD_SX: SxProps<Theme> = {
  mt: 2,
  mb: 2,
  p: 2,
  border: 1,
  borderRadius: 1,
  borderColor: grey[800],
};
