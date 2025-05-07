using MerchStore.Domain.Entities;

namespace MerchStore.Application.Services.Interfaces;

public interface IOrderService
{
    Task<Order> ProcessOrderAsync(Order order);
    Task<Order?> GetOrderByIdAsync(Guid id);
    Task<IEnumerable<Order>> GetAllOrdersAsync();
    
}