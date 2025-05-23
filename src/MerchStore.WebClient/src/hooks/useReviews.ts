import { useContext, useEffect } from 'react';
import { ReviewContext } from '../context/ReviewProvider';

export function useReviews(productId?: string) {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }

  useEffect(() => {
    if (productId) {
      console.log('🔄 useReviews hook triggered for product:', productId);
      context.fetchReviews(productId);
    }
  }, [productId, context.fetchReviews]);

  return context;
}
