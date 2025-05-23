import { ExternalProduct } from '../jinApiInterfaces';

// Cache management
let externalProductsCache: ExternalProduct[] | null = null;

export function getCachedProducts(): ExternalProduct[] | null {
  return externalProductsCache;
}

export function setCachedProducts(products: ExternalProduct[]): void {
  externalProductsCache = products;
  console.log(`🔄 Cache updated with ${products.length} products`);
}

export function updateProductInCache(productData: ExternalProduct): void {
  if (!externalProductsCache) return;

  const cacheIndex = externalProductsCache.findIndex(
    (p) => p.productId === productData.productId
  );

  if (cacheIndex >= 0) {
    externalProductsCache[cacheIndex] = productData;
    console.log('🔄 Cache updated with fresh data');
  }
}

export function clearCache(): void {
  externalProductsCache = null;
  console.log('🗑️ External products cache cleared');
}

export function getCacheInfo() {
  return {
    cacheSize: externalProductsCache?.length || 0,
    hasCachedData: !!externalProductsCache,
    cachedProducts:
      externalProductsCache?.map((p) => ({
        id: p.productId,
        name: p.name,
      })) || [],
  };
}
