import {
  Box,
  Typography,
  Divider,
  Rating,
  SxProps,
  Theme,
  // Button,
  Collapse,
} from '@mui/material';
import { useState } from 'react';
import CustomSpinner from '../CustomSpinner';
import { Review, ReviewStats } from '../../interfaces';
import { grey } from '@mui/material/colors';
// import EditIcon from '@mui/icons-material/Edit';
import { ReviewForm } from './ReviewForm';

type Props = {
  reviews: Review[];
  stats?: ReviewStats;
  loading: boolean;
  productId: string;
  onReviewsUpdated?: () => void;
};

export function ProductReviews(props: Props) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const shouldShowLoading = props.loading && props.reviews.length === 0;

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    if (props.onReviewsUpdated) {
      props.onReviewsUpdated();
    }
  };

  return (
    <Box mt={3}>
      <Box sx={HEADER_CONTAINER_SX}>
        <Typography variant={'h5'} gutterBottom>
          Reviews ({props.stats?.reviewCount ?? props.reviews.length})
        </Typography>
      </Box>

      <Box sx={RATING_ROW_SX}>
        <Box display={'flex'}>
          <Rating value={props.stats?.averageRating || 0} precision={0.1} readOnly />
          <Typography variant={'body1'} sx={{ ml: 1 }}>
            {props.stats?.averageRating !== undefined && !isNaN(props.stats.averageRating)
              ? props.stats.averageRating.toFixed(1)
              : 'No rating'}{' '}
            / 5
          </Typography>
        </Box>
        {/* <Button
          sx={{ mb: 2 }}
          variant={'outlined'}
          startIcon={<EditIcon />}
          onClick={() => setShowReviewForm(!showReviewForm)}
          color={'success'}
        >
          {showReviewForm ? 'Cancel' : 'Write Review'}
        </Button> */}
      </Box>

      <Collapse in={showReviewForm}>
        <Box sx={{ mb: 3 }}>
          <ReviewForm
            productId={props.productId}
            onReviewSubmitted={handleReviewSubmitted}
            onCancel={() => setShowReviewForm(false)}
          />
        </Box>
      </Collapse>

      <Divider />

      {shouldShowLoading ? (
        <CustomSpinner text={'Loading reviews...'} />
      ) : props.reviews.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant={'body1'} color={'text.secondary'}>
            No reviews yet.
          </Typography>
        </Box>
      ) : (
        props.reviews.map((review) => (
          <Box key={review.id} sx={REVIEW_CARD_SX}>
            <Typography variant={'subtitle1'} fontWeight={'bold'}>
              {review.customerName}
            </Typography>
            <Rating value={review.rating} readOnly size={'small'} />
            <Typography variant={'body2'} color={'text.secondary'}>
              {new Date(review.createdAt).toLocaleDateString()}
            </Typography>
            <Typography sx={{ mt: 1 }}>"{review.content}"</Typography>
          </Box>
        ))
      )}
    </Box>
  );
}

/*━━━━━━━━━━━━ Styling ━━━━━━━━━━━━*/
const HEADER_CONTAINER_SX: SxProps<Theme> = {
  justifyContent: 'space-between',
  alignItems: 'center',
};

const RATING_ROW_SX: SxProps<Theme> = {
  mb: 2,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const REVIEW_CARD_SX: SxProps<Theme> = {
  mt: 2,
  mb: 2,
  p: 2,
  border: 1,
  borderRadius: 1,
  borderColor: grey[800],
};
