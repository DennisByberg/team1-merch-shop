import axios from 'axios';
import { fetchProductReviews as mockFetchProductReviews } from '../reviewApi';
import { fetchProduct } from '../productApi';
import {
  AllReviewsResponse,
  ExternalProduct,
  JinProductRequest,
  JinProductResponse,
} from './jinApiInterfaces';
import { ExternalReviewResponse } from '../../interfaces';
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
    return cachedProducts;
  }

  try {
    // Uppdaterad URL med customer ID
    const response = await axios.get<ExternalProduct[]>(
      `${API_CONFIG.baseUrl}/product/customer/1?sortField=name&direction=asc`,
      createAxiosConfig()
    );

    // Enligt din cURL returnerar API:et en direkt array
    let products: ExternalProduct[] = response.data;

    // Säkerhetscheck - API:et ska returnera en direkt array enligt exemplet
    if (!Array.isArray(products)) {
      // Fallback-hantering om API:et ändrar format
      const responseData = products as unknown;
      if (responseData && typeof responseData === 'object') {
        const dataObj = responseData as Record<string, unknown>;

        if ('value' in dataObj && Array.isArray(dataObj.value)) {
          products = dataObj.value as ExternalProduct[];
        } else if ('products' in dataObj && Array.isArray(dataObj.products)) {
          products = dataObj.products as ExternalProduct[];
        } else if ('data' in dataObj && Array.isArray(dataObj.data)) {
          products = dataObj.data as ExternalProduct[];
        } else {
          return [];
        }
      } else {
        return [];
      }
    }

    // Validates that products is an array
    if (!Array.isArray(products)) return [];

    setCachedProducts(products);

    return products;
  } catch {
    return [];
  }
}

async function findMatchingExternalProduct(
  productGuid: string
): Promise<ExternalProduct | null> {
  try {
    const internalProduct = await fetchProduct(productGuid);

    // Return null if internal product is not found
    if (!internalProduct) return null;

    const externalProducts = await fetchExternalProducts();

    // Check if externalProducts is an array
    if (!Array.isArray(externalProducts)) return null;

    // Return null if no external products found
    if (externalProducts.length === 0) return null;

    return findBestMatch(externalProducts, internalProduct);
  } catch {
    return null;
  }
}

async function fetchExternalProductReviews(productId: number): Promise<ExternalProduct> {
  // Korrekt URL enligt API-dokumentationen
  const response = await axios.get<ExternalProduct>(
    `${API_CONFIG.baseUrl}/product/customer/1/${productId}`,
    createAxiosConfig()
  );

  return response.data;
}

// Main Export Functions
export async function fetchAllProductReviewsByGuid(
  productGuid: string
): Promise<AllReviewsResponse> {
  try {
    const matchingProduct = await findMatchingExternalProduct(productGuid);

    if (!matchingProduct) {
      throw new Error('No matching external product found');
    }

    // Använd cached reviews om de finns
    if (matchingProduct.reviews?.length > 0) {
      return createAllReviewsResponse(matchingProduct);
    }

    // Annars hämta från API
    const productData = await fetchExternalProductReviews(matchingProduct.productId);

    if (!productData.reviews?.length) {
      throw new Error('Product has no reviews');
    }

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
  const allReviews = await fetchAllProductReviewsByGuid(productGuid);

  if (allReviews.reviews.length === 0) {
    throw new Error('No reviews available');
  }

  // Returnera slumpmässig review
  const randomIndex = Math.floor(Math.random() * allReviews.reviews.length);
  const selectedReview = allReviews.reviews[randomIndex];

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
    const mockData = await mockFetchProductReviews(productGuid);

    return convertMockReviewsToExternal(mockData.reviews);
  } catch (mockError) {
    console.error('❌ Mock API also failed:', mockError);
    throw new Error('Both external and mock APIs failed');
  }
}

// Adds a new product to Jin-API external service
export async function addProductToJinApi(
  productName: string
): Promise<JinProductResponse | null> {
  const jinProductData: JinProductRequest = {
    name: productName,
    category: '',
    tags: [],
    customerId: 1,
  };

  try {
    // Send product creation request to Jin-API
    const response = await axios.post<JinProductResponse>(
      `${API_CONFIG.baseUrl}/product/save`,
      jinProductData,
      createAxiosConfig()
    );

    // Clear cache to ensure newly created product is fetched in subsequent requests
    clearCache();

    return response.data;
  } catch (error) {
    console.error('Failed to add product to Jin-API:', error);

    return null;
  }
}

export { clearCache, getCacheInfo, getApiConfig };
