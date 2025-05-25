// External product and review data structures from Jin-API
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

// Response format for aggregated review data
export interface AllReviewsResponse {
  reviews: ExternalReview[];
  productInfo: {
    productId: number;
    name: string;
    category: string;
  };
}

// Jin-API product creation and response interfaces
export interface JinTag {
  id: number;
  name: string;
}

export interface JinProductRequest {
  name: string;
  category: string;
  tags: string[];
  customerId: number;
}

export interface JinProductResponse {
  productId: number;
  name: string;
  category: string;
  rating: number;
  tags: JinTag[];
  createdDate: string;
  reviews: ExternalReview[];
}
