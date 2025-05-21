using MerchStore.Domain.Entities;
using MerchStore.Domain.Interfaces;

namespace MerchStore.Application.Common.Interfaces;

public interface IRepositoryManager
{
    IProductRepository ProductRepository { get; }
    IOrderRepository OrderRepository { get; }
    IUnitOfWork UnitOfWork { get; }
    Task SaveAsync();
    Task<Order?> GetByIdAsync(Guid orderId);
    Task UpdateAsync(Order order);
}