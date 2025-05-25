import {
  Box,
  Button,
  TextField,
  Rating,
  Typography,
  Alert,
  CircularProgress,
  SxProps,
  Theme,
} from '@mui/material';
import { useState } from 'react';
import { createProductReview } from '../../api/External/jinApi';

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted: () => void;
  onCancel: () => void;
}

export function ReviewForm({ productId, onReviewSubmitted, onCancel }: ReviewFormProps) {
  const [reviewerName, setReviewerName] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating || !reviewerName.trim() || !text.trim()) {
      setError('Please fill in all fields and provide a rating');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createProductReview(productId, {
        reviewerName: reviewerName.trim(),
        text: text.trim(),
        rating,
      });

      setSuccess(true);
      setTimeout(() => {
        onReviewSubmitted();
      }, 1500);
    } catch {
      setError('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box sx={FORM_CONTAINER_SX}>
        <Alert severity={'success'} sx={{ mb: 2 }}>
          Review submitted successfully! 🎉
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={FORM_CONTAINER_SX}>
      <Typography variant={'h6'} gutterBottom>
        Write a Review
      </Typography>

      {error && (
        <Alert severity={'error'} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 2 }}>
          <Rating
            name={'rating'}
            value={rating}
            onChange={(_, newValue) => setRating(newValue)}
            size={'large'}
            precision={1}
          />
        </Box>

        <TextField
          fullWidth
          label={'Your Name'}
          value={reviewerName}
          onChange={(e) => setReviewerName(e.target.value)}
          required
          sx={{ mb: 2 }}
          disabled={loading}
        />

        <TextField
          fullWidth
          label={'Your Review'}
          multiline
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          sx={{ mb: 3 }}
          disabled={loading}
        />

        <Box sx={BUTTON_CONTAINER_SX}>
          <Button variant={'outlined'} onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            type={'submit'}
            variant={'contained'}
            color={'primary'}
            disabled={loading || !rating || !reviewerName.trim() || !text.trim()}
            startIcon={loading ? <CircularProgress size={20} /> : undefined}
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </Button>
        </Box>
      </form>
    </Box>
  );
}

/*━━━━━━━━━━━━ Styling ━━━━━━━━━━━━*/
const FORM_CONTAINER_SX: SxProps<Theme> = {
  p: 3,
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 2,
  bgcolor: 'background.paper',
};

const BUTTON_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  gap: 2,
  justifyContent: 'flex-end',
};
