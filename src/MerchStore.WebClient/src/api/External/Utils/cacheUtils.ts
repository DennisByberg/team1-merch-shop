import { ExternalProduct } from '../jinApiInterfaces';

// Cache management
let externalProductsCache: ExternalProduct[] | null = null;

export function getCachedProducts(): ExternalProduct[] | null {
  return externalProductsCache;
}

export function setCachedProducts(products: ExternalProduct[]): void {
  externalProductsCache = products;
}

export function updateProductInCache(productData: ExternalProduct): void {
  if (!externalProductsCache) return;

  const cacheIndex = externalProductsCache.findIndex(
    (p) => p.productId === productData.productId
  );

  if (cacheIndex >= 0) {
    externalProductsCache[cacheIndex] = productData;
  }
}

export function clearCache(): void {
  externalProductsCache = null;
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
