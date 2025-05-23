// Types
export interface ExternalProduct {
  productId: number;
  name: string;
  category: string;
  rating: number;
  reviews: ExternalReview[];
}

export interface ExternalReview {
  reviewerName: string;
  text: string;
  rating: number;
  reviewDate: string;
  reviewId: number;
}

export interface AllReviewsResponse {
  reviews: ExternalReview[];
  productInfo: {
    productId: number;
    name: string;
    category: string;
  };
}
