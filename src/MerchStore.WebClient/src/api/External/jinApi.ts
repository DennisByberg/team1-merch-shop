import axios from 'axios';
import { fetchProductReviews as mockFetchProductReviews } from '../reviewApi';
import { fetchProduct } from '../productApi';
import { AllReviewsResponse, ExternalProduct } from './jinApiInterfaces';
import { ExternalReviewResponse } from '../../interfaces';

// Import utilities
import {
  getCachedProducts,
  setCachedProducts,
  updateProductInCache,
  clearCache,
  getCacheInfo,
} from './Utils/cacheUtils';
import { findBestMatch } from './Utils/productMatching';
import {
  API_CONFIG,
  createAxiosConfig,
  createAllReviewsResponse,
  convertMockReviewsToExternal,
  getApiConfig,
} from './Utils/apiHelpers';

// Core API Functions
async function fetchExternalProducts(): Promise<ExternalProduct[]> {
  const cachedProducts = getCachedProducts();
  if (cachedProducts) {
    console.log('🎯 Using cached external products');
    return cachedProducts;
  }

  try {
    console.log('🔄 Fetching external products...');

    const response = await axios.get<ExternalProduct[]>(
      `${API_CONFIG.baseUrl}/product`,
      createAxiosConfig()
    );

    const products = response.data || [];
    setCachedProducts(products);
    console.log(`✅ Fetched ${products.length} external products`);
    return products;
  } catch (error) {
    console.error('❌ Failed to fetch external products:', error);
    return [];
  }
}

async function findMatchingExternalProduct(
  productGuid: string
): Promise<ExternalProduct | null> {
  try {
    // Hämta intern produkt
    const internalProduct = await fetchProduct(productGuid);
    if (!internalProduct) {
      console.warn(`❌ Internal product not found: ${productGuid}`);
      return null;
    }

    console.log(`✅ Found internal product: ${internalProduct.name}`);

    // Hämta externa produkter
    const externalProducts = await fetchExternalProducts();
    if (externalProducts.length === 0) {
      console.warn('⚠️ No external products available');
      return null;
    }

    // Använd utility-funktionen för matchning
    return findBestMatch(externalProducts, internalProduct);
  } catch (error) {
    console.error('❌ Error finding matching product:', error);
    return null;
  }
}

async function fetchExternalProductReviews(productId: number): Promise<ExternalProduct> {
  console.log(`📡 Fetching reviews for product ID: ${productId}`);

  const response = await axios.get<ExternalProduct>(
    `${API_CONFIG.baseUrl}/product/${productId}`,
    createAxiosConfig()
  );

  return response.data;
}

// Main Export Functions
export async function fetchAllProductReviewsByGuid(
  productGuid: string
): Promise<AllReviewsResponse> {
  console.log('🚀 Fetching all reviews for:', productGuid);

  try {
    const matchingProduct = await findMatchingExternalProduct(productGuid);

    if (!matchingProduct) {
      throw new Error('No matching external product found');
    }

    console.log(
      `🎯 Using external product: ${matchingProduct.name} (ID: ${matchingProduct.productId})`
    );

    // Använd cached reviews om de finns
    if (matchingProduct.reviews?.length > 0) {
      console.log(`✅ Using cached reviews (${matchingProduct.reviews.length})`);
      return createAllReviewsResponse(matchingProduct);
    }

    // Annars hämta från API
    console.log('📡 Fetching fresh reviews from API...');
    const productData = await fetchExternalProductReviews(matchingProduct.productId);

    if (!productData.reviews?.length) {
      throw new Error('Product has no reviews');
    }

    console.log(`✅ Fetched ${productData.reviews.length} reviews`);

    // Uppdatera cache
    updateProductInCache(productData);

    return createAllReviewsResponse(productData);
  } catch (error) {
    console.warn('⚠️ External API failed, using mock data:', error);
    return await fetchMockReviews(productGuid);
  }
}

export async function fetchProductReviewsByGuid(
  productGuid: string
): Promise<ExternalReviewResponse> {
  console.log('🚀 Fetching single review for:', productGuid);

  const allReviews = await fetchAllProductReviewsByGuid(productGuid);

  if (allReviews.reviews.length === 0) {
    throw new Error('No reviews available');
  }

  // Returnera slumpmässig review
  const randomIndex = Math.floor(Math.random() * allReviews.reviews.length);
  const selectedReview = allReviews.reviews[randomIndex];

  console.log(`✅ Selected review ${randomIndex + 1} of ${allReviews.reviews.length}`);

  return {
    reviewerName: selectedReview.reviewerName,
    text: selectedReview.text,
    rating: selectedReview.rating,
    reviewDate: selectedReview.reviewDate,
    reviewId: selectedReview.reviewId,
  };
}

async function fetchMockReviews(productGuid: string): Promise<AllReviewsResponse> {
  try {
    console.log('🔄 Using mock API as fallback...');

    const mockData = await mockFetchProductReviews(productGuid);
    console.log('✅ Mock API successful');

    return convertMockReviewsToExternal(mockData.reviews);
  } catch (mockError) {
    console.error('❌ Mock API also failed:', mockError);
    throw new Error('Both external and mock APIs failed');
  }
}

// Re-export utility functions for debugging
export { clearCache, getCacheInfo, getApiConfig };
