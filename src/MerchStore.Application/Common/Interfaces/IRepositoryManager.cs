using MerchStore.Domain.Interfaces;

namespace MerchStore.Application.Common.Interfaces;

public interface IRepositoryManager
{
    IProductRepository ProductRepository { get; }
    IOrderRepository OrderRepository { get; }
    IUnitOfWork UnitOfWork { get; }
}