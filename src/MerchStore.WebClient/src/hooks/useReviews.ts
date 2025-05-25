import { useContext, useEffect } from 'react';
import { ReviewContext } from '../context/ReviewProvider';

export function useReviews(productId?: string) {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }

  const { fetchReviews } = context;

  useEffect(() => {
    if (productId) {
      fetchReviews(productId);
    }
  }, [productId, fetchReviews]);

  return context;
}
