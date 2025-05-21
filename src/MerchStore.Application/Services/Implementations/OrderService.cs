using MerchStore.Application.Common.Interfaces;
using MerchStore.Application.Services.Interfaces;
using MerchStore.Domain.Entities;

namespace MerchStore.Application.Services.Implementations;

public class OrderService : IOrderService
{
    private readonly IRepositoryManager _repositoryManager;
    private readonly ICatalogService _catalogService;
    public OrderService(IRepositoryManager repositoryManager, ICatalogService catalogService)
    {
        _catalogService = catalogService;
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
    
    // Skapar en ny order i systemet
    public async Task<Order> CreateOrderAsync(Order order)
    {
        await _repositoryManager.OrderRepository.AddAsync(order);
        await _repositoryManager.SaveAsync();
        return order;
    }
    
    // Uppdaterar en befintlig order i systemet
    public async Task<Order?> UpdateOrderAsync(Guid id, Order updatedOrder)
    {
        var existingOrder = await _repositoryManager.OrderRepository.GetByIdAsync(id);
        
        if (existingOrder == null)
        {
            return null;
        }

        // Handle the update by replacing the entire entity
        _repositoryManager.OrderRepository.Update(existingOrder, updatedOrder);
        await _repositoryManager.SaveAsync();
        
        return updatedOrder;
    }

    public async Task<Order?> AddProductToOrderAsync(Guid orderId, Guid productId, int quantity)
    {
        var order = await _repositoryManager.OrderRepository.GetByIdAsync(orderId);
        if (order == null) return null;

        var product = await _catalogService.GetProductByIdAsync(productId);
        if (product == null) return null;

        // Skydda mot null
        order.OrderProducts ??= new List<OrderProducts>();

        var existingItem = order.OrderProducts.FirstOrDefault(p => p.ProductId == productId);
        if (existingItem != null)
        {
            existingItem.Quantity += quantity;
        }
        else
        {
            order.OrderProducts.Add(new OrderProducts
            {
                ProductId = productId,
                Quantity = quantity,
                UnitPrice = product.Price
            });
        }

        // Rätt repository + spara
        _repositoryManager.OrderRepository.Update(order);
        await _repositoryManager.SaveAsync();

        return order;
    }
}
