import { useContext, useEffect } from 'react';
import { ReviewContext } from '../context/ReviewContext';

export function useReviews(productId: string | undefined) {
  const ctx = useContext(ReviewContext);
  if (!ctx) throw new Error('useReviews must be used within ReviewProvider');

  const data = productId ? ctx.getReviewData(productId) : undefined;

  useEffect(() => {
    if (!productId) return;
    if (!data) {
      ctx.fetchReviews(productId);
    }
    // eslint-disable-next-line
  }, [productId, data]);

  return data ?? { reviews: [], loading: !!productId };
}
