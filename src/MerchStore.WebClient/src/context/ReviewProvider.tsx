import { useState, useCallback } from 'react';
import { ReviewContext } from './ReviewContext';
import { fetchProductReviews } from '../api/reviewApi';
import { ReactNode } from 'react';
import { ReviewData } from '../types/globalTypes';

export function ReviewProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Record<string, ReviewData>>({});

  const fetchReviews = useCallback(async (productId: string) => {
    setData((prev) => ({
      ...prev,
      [productId]: { reviews: [], loading: true },
    }));
    try {
      const response = await fetchProductReviews(productId);
      setData((prev) => ({
        ...prev,
        [productId]: {
          reviews: response.reviews ?? [],
          stats: response.stats,
          loading: false,
        },
      }));
    } catch {
      setData((prev) => ({
        ...prev,
        [productId]: {
          reviews: [],
          loading: false,
        },
      }));
    }
  }, []);

  function getReviewData(productId: string): ReviewData | undefined {
    return data[productId];
  }

  return (
    <ReviewContext.Provider value={{ getReviewData, fetchReviews }}>
      {children}
    </ReviewContext.Provider>
  );
}
