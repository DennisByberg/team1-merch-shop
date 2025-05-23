import { AllReviewsResponse, ExternalProduct, ExternalReview } from '../jinApiInterfaces';

// API Configuration
export const API_CONFIG = {
  baseUrl: import.meta.env.DEV ? '/api-proxy' : import.meta.env.VITE_JIN_API_URL,
  apiKey: import.meta.env.VITE_JIN_API_KEY,
  timeout: 5000,
} as const;

export function createAxiosConfig() {
  return {
    headers: {
      'X-API-KEY': API_CONFIG.apiKey,
    },
    timeout: API_CONFIG.timeout,
  };
}

export function createAllReviewsResponse(product: ExternalProduct): AllReviewsResponse {
  return {
    reviews: product.reviews,
    productInfo: {
      productId: product.productId,
      name: product.name,
      category: product.category,
    },
  };
}

export function convertMockReviewsToExternal(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mockReviews: any[]
): AllReviewsResponse {
  const convertedReviews: ExternalReview[] =
    mockReviews?.map((review, index) => ({
      reviewerName: review.customerName || 'Anonymous',
      text: review.content || 'No review available',
      rating: review.rating || 0,
      reviewDate: review.createdAt || new Date().toISOString(),
      reviewId: parseInt(review.id || index.toString()),
    })) || [];

  return {
    reviews: convertedReviews,
    productInfo: {
      productId: 0,
      name: 'Mock Product',
      category: 'Mock Category',
    },
  };
}

export function getApiConfig() {
  return {
    baseUrl: API_CONFIG.baseUrl,
    hasApiKey: !!API_CONFIG.apiKey,
    timeout: API_CONFIG.timeout,
  };
}
