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
  // Validate that externalProducts is an array
  if (!Array.isArray(externalProducts)) return null;

  // Validate that externalProducts is not empty
  if (externalProducts.length === 0) return null;

  const strategies = createMatchingStrategies(internalProduct);

  // Testa varje matchningsstrategi
  for (const strategy of strategies) {
    try {
      const match = strategy.matcher(externalProducts, internalProduct);
      if (match) {
        return match;
      }
    } catch (error) {
      console.error(`❌ Error in ${strategy.name}:`, error);
    }
  }

  return null;
}
