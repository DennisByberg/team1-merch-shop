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
      matcher: (products: ExternalProduct[]) =>
        products.find((p) => normalizeString(p.name) === normalizedInternalName) || null,
    },
    {
      name: 'Partial name match',
      matcher: (products: ExternalProduct[]) => {
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
  const strategies = createMatchingStrategies(internalProduct);

  // Testa varje matchningsstrategi
  for (const strategy of strategies) {
    const match = strategy.matcher(externalProducts, internalProduct);
    if (match) {
      console.log(`✅ ${strategy.name}: ${match.name} (ID: ${match.productId})`);
      return match;
    }
  }

  console.log(`⚠️ No match found for "${internalProduct.name}", will use mock data`);
  return null;
}
