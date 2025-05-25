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

    // Uppdaterad URL med customer ID
    const response = await axios.get<ExternalProduct[]>(
      `${API_CONFIG.baseUrl}/product/customer/1?sortField=name&direction=asc`,
      createAxiosConfig()
    );

    // Enligt din cURL returnerar API:et en direkt array
    let products: ExternalProduct[] = response.data;

    // Säkerhetscheck - API:et ska returnera en direkt array enligt exemplet
    if (!Array.isArray(products)) {
      console.warn('⚠️ API returned non-array data:', typeof products);
      console.log('🔍 Raw response data:', JSON.stringify(products, null, 2));

      // Fallback-hantering om API:et ändrar format
      const responseData = products as unknown;
      if (responseData && typeof responseData === 'object') {
        const dataObj = responseData as Record<string, unknown>;

        if ('value' in dataObj && Array.isArray(dataObj.value)) {
          products = dataObj.value as ExternalProduct[];
          console.log('✅ Found products array in response.value');
        } else if ('products' in dataObj && Array.isArray(dataObj.products)) {
          products = dataObj.products as ExternalProduct[];
          console.log('✅ Found products array in response.products');
        } else if ('data' in dataObj && Array.isArray(dataObj.data)) {
          products = dataObj.data as ExternalProduct[];
          console.log('✅ Found products array in response.data');
        } else {
          console.error('❌ No valid products array found in response');
          console.log('🔍 Available properties:', Object.keys(dataObj));
          return [];
        }
      } else {
        console.error('❌ Invalid response format');
        return [];
      }
    }

    // Validera att products nu är en array
    if (!Array.isArray(products)) {
      console.error('❌ Still not an array after processing:', typeof products);
      return [];
    }

    setCachedProducts(products);
    console.log(`✅ Fetched ${products.length} external products`);

    // Debug: logga första produkten för att se strukturen
    if (products.length > 0) {
      console.log('🔍 First product sample:', products[0]);
    }

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

    // Extra validering och loggning
    console.log('🔍 External products type:', typeof externalProducts);
    console.log('🔍 Is array:', Array.isArray(externalProducts));
    console.log('🔍 Length:', externalProducts?.length);

    if (!Array.isArray(externalProducts)) {
      console.error('❌ externalProducts is not an array:', externalProducts);
      return null;
    }

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
