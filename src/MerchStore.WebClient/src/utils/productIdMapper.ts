// Enkel mappning mellan Guid och nummer för externa API:et
const productIdMap = new Map<string, number>();
let nextId = 1;

// Funktion för att hämta ID från Guid
export function getExternalApiId(productGuid: string): number {
  console.log('🔍 getExternalApiId called with productGuid:', productGuid);

  if (!productIdMap.has(productGuid)) {
    console.log('📝 Guid not found in map, creating new mapping...');
    productIdMap.set(productGuid, nextId);
    console.log(`✅ Mapped Guid "${productGuid}" to number ${nextId}`);
    nextId++;
  } else {
    console.log('🎯 Found existing mapping in cache');
  }

  const mappedId = productIdMap.get(productGuid)!;
  console.log(`🔄 Returning mapped ID: ${mappedId} for Guid: ${productGuid}`);
  console.log('📊 Current mapping table:', Array.from(productIdMap.entries()));

  return mappedId;
}

// Funktion för att hämta Guid från ID
export function getProductGuid(externalId: number): string | undefined {
  console.log('🔍 getProductGuid called with externalId:', externalId);

  for (const [guid, id] of productIdMap.entries()) {
    if (id === externalId) {
      console.log(`✅ Found Guid "${guid}" for external ID ${externalId}`);
      return guid;
    }
  }

  console.log(`❌ No Guid found for external ID ${externalId}`);
  return undefined;
}

// Debug-funktion för att se hela mappningen
export function debugProductIdMap() {
  console.log('🗺️ Complete Product ID Mapping:');
  console.table(
    Array.from(productIdMap.entries()).map(([guid, id]) => ({
      Guid: guid,
      ExternalId: id,
    }))
  );
}
