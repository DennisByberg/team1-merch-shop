import { ExternalProduct } from '../jinApiInterfaces';
import { IProduct } from '../../../interfaces';

export function normalizeString(str: string): string {
  return str.toLowerCase().trim();
}

interface MatchingStrategy {
  name: string;
  matcher: (
    products: ExternalProduct[],
    internalProduct: IProduct
  ) => ExternalProduct | null;
}

export function createMatchingStrategies(internalProduct: IProduct): MatchingStrategy[] {
  const normalizedInternalName = normalizeString(internalProduct.name);

  return [
    {
      name: 'Exact name match',
      matcher: (products: ExternalProduct[]) => {
        // Säkerställ att products är en array
        if (!Array.isArray(products)) {
          console.warn('⚠️ Products is not an array in exact match:', typeof products);
          return null;
        }
        return (
          products.find((p) => normalizeString(p.name) === normalizedInternalName) || null
        );
      },
    },
    {
      name: 'Partial name match',
      matcher: (products: ExternalProduct[]) => {
        // Säkerställ att products är en array
        if (!Array.isArray(products)) {
          console.warn('⚠️ Products is not an array in partial match:', typeof products);
          return null;
        }

        const matches = products.filter((p) => {
          const extName = normalizeString(p.name);
          return (
            normalizedInternalName.includes(extName) ||
            extName.includes(normalizedInternalName)
          );
        });

        // Returnera den med flest reviews
        return (
          matches.sort(
            (a, b) => (b.reviews?.length || 0) - (a.reviews?.length || 0)
          )[0] || null
        );
      },
    },
  ];
}

export function findBestMatch(
  externalProducts: ExternalProduct[],
  internalProduct: IProduct
): ExternalProduct | null {
  // Validera att externalProducts är en array
  if (!Array.isArray(externalProducts)) {
    console.error(
      '❌ externalProducts is not an array:',
      typeof externalProducts,
      externalProducts
    );
    return null;
  }

  if (externalProducts.length === 0) {
    console.warn('⚠️ No external products available for matching');
    return null;
  }

  console.log(
    `🔍 Matching "${internalProduct.name}" against ${externalProducts.length} external products`
  );

  const strategies = createMatchingStrategies(internalProduct);

  // Testa varje matchningsstrategi
  for (const strategy of strategies) {
    try {
      const match = strategy.matcher(externalProducts, internalProduct);
      if (match) {
        console.log(`✅ ${strategy.name}: ${match.name} (ID: ${match.productId})`);
        return match;
      }
    } catch (error) {
      console.error(`❌ Error in ${strategy.name}:`, error);
    }
  }

  console.log(`⚠️ No match found for "${internalProduct.name}", will use mock data`);
  return null;
}
