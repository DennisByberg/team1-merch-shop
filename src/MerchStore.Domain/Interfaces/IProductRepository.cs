using MerchStore.Domain.Entities;

namespace MerchStore.Domain.Interfaces;

// Repository-interface specifikt för Product-entiteten.
// Här kan du lägga till metoder som bara gäller produkter.
public interface IProductRepository : IRepository<Product, Guid>
{
    // Lägg till produkt-specifika metoder här vid behov
}