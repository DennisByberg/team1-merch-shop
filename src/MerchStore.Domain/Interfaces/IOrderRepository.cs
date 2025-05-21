using MerchStore.Domain.Entities;

namespace MerchStore.Domain.Interfaces;

public interface IOrderRepository : IRepository<Order, Guid>
{
    // Lägg till produkt-specifika metoder här vid behov
    void Update(Order existingOrder, Order updatedOrder);
    void Update(Order existingOrder);
}