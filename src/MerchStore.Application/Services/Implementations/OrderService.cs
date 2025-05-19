using MerchStore.Application.Common.Interfaces;
using MerchStore.Application.Services.Interfaces;
using MerchStore.Domain.Entities;

namespace MerchStore.Application.Services.Implementations;

public class OrderService : IOrderService
{
    private readonly IRepositoryManager _repositoryManager;

    public OrderService(IRepositoryManager repositoryManager)
    {
        _repositoryManager = repositoryManager;
    }

    // Hämtar en order baserat på dess unika identifierare
    public async Task<Order?> GetOrderByIdAsync(Guid id)
    {
        return await _repositoryManager.OrderRepository.GetByIdAsync(id);
    }

    // Hämtar alla ordrar i systemet
    public async Task<IEnumerable<Order>> GetAllOrdersAsync()
    {
        return await _repositoryManager.OrderRepository.GetAllAsync();
    }
}