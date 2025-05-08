using MerchStore.Domain.Entities;

namespace MerchStore.Domain.Interfaces;

public interface IOrderRepository : IRepository<Order, Guid>
{
    // Lägg till produkt-specifika metoder här vid behov
}