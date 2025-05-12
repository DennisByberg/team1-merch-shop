import { createContext } from 'react';
import { ReviewData } from '../types/globalTypes';

export type ReviewContextType = {
  getReviewData: (productId: string) => ReviewData | undefined;
  fetchReviews: (productId: string) => void;
};

export const ReviewContext = createContext<ReviewContextType | undefined>(undefined);
