import { AllReviewsResponse, ExternalProduct, ExternalReview } from '../jinApiInterfaces';

export const API_CONFIG = {
  baseUrl: '/api-proxy',
  apiKey: import.meta.env.VITE_JIN_API_KEY,
  timeout: 1, // 60 seconds
} as const;

// Validate API configuration
function validateApiConfig() {
  if (!API_CONFIG.baseUrl) {
    throw new Error('VITE_JIN_API_URL is not configured');
  }
  if (!API_CONFIG.apiKey) {
    throw new Error('VITE_JIN_API_KEY is not configured');
  }
}

export function createAxiosConfig() {
  try {
    validateApiConfig();

    return {
      headers: {
        'X-API-KEY': API_CONFIG.apiKey,
      },
      timeout: API_CONFIG.timeout,
    };
  } catch (error) {
    console.error('❌ API Configuration Error:', error);
    throw error;
  }
}

export function createAllReviewsResponse(product: ExternalProduct): AllReviewsResponse {
  if (!product) {
    throw new Error('Product is required to create reviews response');
  }

  return {
    reviews: product.reviews || [],
    productInfo: {
      productId: product.productId || 0,
      name: product.name || 'Unknown Product',
      category: product.category || 'Unknown Category',
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function convertMockReviewsToExternal(mockReviews: any[]): AllReviewsResponse {
  // Add safety check for array
  if (!Array.isArray(mockReviews)) {
    console.warn('⚠️ mockReviews is not an array, using empty array');
    mockReviews = [];
  }

  const convertedReviews: ExternalReview[] =
    mockReviews?.map((review, index) => ({
      reviewerName: review?.customerName || 'Anonymous',
      text: review?.content || 'No review available',
      rating: review?.rating || 0,
      reviewDate: review?.createdAt || new Date().toISOString(),
      reviewId: parseInt(review?.id || index.toString()),
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
    baseUrl: API_CONFIG.baseUrl || 'Not configured',
    hasApiKey: !!API_CONFIG.apiKey,
    timeout: API_CONFIG.timeout,
    isValid: !!API_CONFIG.baseUrl && !!API_CONFIG.apiKey,
  };
}
