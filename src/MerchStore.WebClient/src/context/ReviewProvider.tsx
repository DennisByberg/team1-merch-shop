import React, { createContext, useState, useCallback } from 'react';
import { Review, ReviewStats } from '../interfaces';
import { fetchAllProductReviewsByGuid } from '../api/External/jinApi';

interface ReviewContextType {
  reviews: Review[];
  stats: ReviewStats | undefined;
  loading: boolean;
  fetchReviews: (productId: string) => Promise<void>;
}

export const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export function ReviewProvider({ children }: { children: React.ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  // Använd useCallback för att förhindra infinite loops
  const fetchReviews = useCallback(async (productId: string) => {
    setLoading(true);
    try {
      console.log('🔍 ReviewProvider fetching reviews for product:', productId);

      // Använd den nya funktionen som hanterar hela produkter med alla reviews
      const allReviewsData = await fetchAllProductReviewsByGuid(productId);

      console.log('✅ ReviewProvider received all reviews data:', allReviewsData);

      // Konvertera ALLA reviews till vårt format
      const formattedReviews: Review[] = allReviewsData.reviews.map((review, index) => ({
        id: review.reviewId.toString(),
        productId: productId,
        content: review.text,
        createdAt: review.reviewDate,
        customerName: review.reviewerName,
        rating: review.rating,
        status: 'approved',
        title: `Review ${index + 1}`, // Lägg till en titel eller använd något från API:et
      }));

      setReviews(formattedReviews);

      // Beräkna riktiga stats baserat på alla reviews
      const totalRating = allReviewsData.reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const averageRating = totalRating / allReviewsData.reviews.length;

      const reviewStats: ReviewStats = {
        productId: productId,
        averageRating: averageRating,
        reviewCount: allReviewsData.reviews.length,
      };

      setStats(reviewStats);
      console.log(
        `✅ ReviewProvider state updated successfully with ${formattedReviews.length} reviews`
      );
    } catch (error) {
      console.error('❌ ReviewProvider failed to fetch reviews:', error);
      setReviews([]);
      setStats(undefined);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ReviewContext.Provider value={{ reviews, stats, loading, fetchReviews }}>
      {children}
    </ReviewContext.Provider>
  );
}
