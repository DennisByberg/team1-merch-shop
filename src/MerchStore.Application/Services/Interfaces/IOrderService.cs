using MerchStore.Domain.Entities;

namespace MerchStore.Application.Services.Interfaces;

public interface IOrderService
{
    /// <summary>
    /// Retrieves all orders in the system.
    /// /// </summary>
    /// <returns>A collection of all orders.</returns>
    Task<IEnumerable<Order>> GetAllOrdersAsync();

    /// <summary>
    /// Retrieves an order by its unique identifier.
    /// /// </summary>
    /// <param name="id">The order ID.</param>
    /// <returns>The order if found, null otherwise.</returns>
    Task<Order?> GetOrderByIdAsync(Guid id);
    
    /// <summary>
    /// Creates a new order in the system.
    /// </summary>
    /// <param name="order">The order to create.</param>
    /// <returns>The created order.</returns>
    Task<Order> CreateOrderAsync(Order order);
    
    /// <summary>
    /// Updates an existing order in the system.
    /// </summary>
    /// <param name="id">The order ID to update.</param>
    /// <param name="order">The order with updated information.</param>
    /// <returns>The updated order if found, null otherwise.</returns>
    Task<Order?> UpdateOrderAsync(Guid id, Order order);

    Task<Order> AddProductToOrderAsync(Guid id, Guid itemId, int quantity);
}
