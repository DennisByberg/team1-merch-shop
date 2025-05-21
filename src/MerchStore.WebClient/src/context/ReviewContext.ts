import { createContext } from 'react';
import { Review, ReviewStats } from '../interfaces';

type ReviewData = {
  reviews: Review[];
  stats?: ReviewStats;
  loading: boolean;
};

export type ReviewContextType = {
  getReviewData: (productId: string) => ReviewData | undefined;
  fetchReviews: (productId: string) => void;
};

export const ReviewContext = createContext<ReviewContextType | undefined>(undefined);
