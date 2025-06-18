import axios from 'axios';

const apiUrl = import.meta.env.VITE_REVIEW_API_URL;
const apiKey = import.meta.env.VITE_REVIEW_API_KEY;

// Cache för mock reviews per produkt
const mockReviewsCache = new Map<string, unknown>();

export async function fetchProductReviews(productId: string) {
  // Kolla om vi redan har cached mock reviews för denna produkt
  if (mockReviewsCache.has(productId)) {
    console.log('🎭 Using cached mock reviews for product:', productId);
    return mockReviewsCache.get(productId);
  }

  try {
    console.log('🎭 Fetching new mock reviews for product:', productId);
    const res = await axios.get(`${apiUrl}/api/products/${productId}/reviews`, {
      headers: { 'x-functions-key': apiKey },
    });

    // Spara i cache
    mockReviewsCache.set(productId, res.data);

    return res.data;
  } catch (error) {
    console.error('Failed to fetch mock reviews:', error);

    // Om API:et failar, skapa fallback mock data
    const fallbackData = {
      reviews: [],
      stats: {
        productId: productId,
        averageRating: 0,
        reviewCount: 0,
      },
    };

    mockReviewsCache.set(productId, fallbackData);
    return fallbackData;
  }
}
